import { useEffect, useState } from 'react'

const COUNTER_NAMESPACE = 'nidnasser-abdelmajid.github.io'
const ABACUS_BASE = `https://abacus.jasoncameron.dev`
const READ_CACHE_KEY = 'blog-real-reads-cache-v1'
const MIN_ENGAGED_READ_MS = 3500

function loadCachedReads(slugs: string[]): Record<string, number | null> {
  const initial: Record<string, number | null> = Object.fromEntries(slugs.map((s) => [s, null]))
  if (typeof window === 'undefined') return initial
  try {
    const raw = window.localStorage.getItem(READ_CACHE_KEY)
    if (!raw) return initial
    const parsed = JSON.parse(raw) as Record<string, number>
    for (const slug of slugs) {
      if (typeof parsed[slug] === 'number' && parsed[slug] >= 0) {
        initial[slug] = parsed[slug]
      }
    }
  } catch {
    // ignore storage errors
  }
  return initial
}

function persistCachedReads(map: Record<string, number | null>) {
  try {
    const clean: Record<string, number> = {}
    for (const [key, val] of Object.entries(map)) {
      if (typeof val === 'number' && val >= 0) clean[key] = val
    }
    window.localStorage.setItem(READ_CACHE_KEY, JSON.stringify(clean))
  } catch {
    // ignore storage errors
  }
}

async function fetchCounterValue(slug: string, signal?: AbortSignal): Promise<number | null> {
  try {
    const res = await fetch(`${ABACUS_BASE}/get/${COUNTER_NAMESPACE}/blog-${encodeURIComponent(slug)}`, {
      signal,
    })
    if (res.status === 404) return 0
    if (!res.ok) return null
    const data = (await res.json()) as { value?: unknown }
    return typeof data.value === 'number' ? data.value : null
  } catch {
    return null
  }
}

async function incrementCounterValue(slug: string): Promise<number | null> {
  try {
    const res = await fetch(`${ABACUS_BASE}/hit/${COUNTER_NAMESPACE}/blog-${encodeURIComponent(slug)}`)
    if (!res.ok) return null
    const data = (await res.json()) as { value?: unknown }
    return typeof data.value === 'number' ? data.value : null
  } catch {
    return null
  }
}

/**
 * Fetches live global article read counts from Abacus and records an actual read
 * once the reader stays engaged (>= 3.5s or >= 30% scroll) once per browser session.
 */
export function useBlogReads(slugs: string[], activeSlug: string | null) {
  const [readsMap, setReadsMap] = useState<Record<string, number | null>>(() =>
    loadCachedReads(slugs)
  )

  const slugsKey = slugs.join('|')

  // Sync current global counts for all listed articles
  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false

    Promise.all(
      slugs.map(async (slug) => {
        const value = await fetchCounterValue(slug, controller.signal)
        return [slug, value] as const
      })
    ).then((results) => {
      if (cancelled) return
      setReadsMap((prev) => {
        const next = { ...prev }
        for (const [slug, val] of results) {
          if (val !== null) {
            next[slug] = val
          } else if (next[slug] === null) {
            next[slug] = 0
          }
        }
        persistCachedReads(next)
        return next
      })
    })

    return () => {
      cancelled = true
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugsKey])

  // Record an actual engaged read when visiting an article page
  useEffect(() => {
    if (!activeSlug || !slugs.includes(activeSlug)) return

    const sessionKey = `blog-engaged-read-v1:${activeSlug}`
    try {
      if (window.sessionStorage.getItem(sessionKey)) return
    } catch {
      // continue if sessionStorage unavailable
    }

    let fired = false
    let timerId: number | undefined

    const triggerRead = async () => {
      if (fired) return
      fired = true
      window.removeEventListener('scroll', onScroll)
      if (timerId !== undefined) window.clearTimeout(timerId)

      try {
        window.sessionStorage.setItem(sessionKey, '1')
      } catch {
        // ignore storage errors
      }

      const liveVal = await incrementCounterValue(activeSlug)
      setReadsMap((prev) => {
        const current = prev[activeSlug] ?? 0
        const next = {
          ...prev,
          [activeSlug]: liveVal !== null ? liveVal : current + 1,
        }
        persistCachedReads(next)
        return next
      })
    }

    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      if (scrollable <= 120) return
      const ratio = window.scrollY / scrollable
      if (ratio >= 0.3) {
        void triggerRead()
      }
    }

    timerId = window.setTimeout(() => {
      void triggerRead()
    }, MIN_ENGAGED_READ_MS)

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      if (timerId !== undefined) window.clearTimeout(timerId)
      window.removeEventListener('scroll', onScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSlug, slugsKey])

  return readsMap
}
