import { useEffect, useState } from 'react'
import { getCookie, setCookie } from '../utils/cookies'

const COUNTER_API_BASE = 'https://countapi.mileshilliard.com/api/v1'
const BLOG_KEY_PREFIX = 'nidnasser_blog_read_v2_'
const BLOG_COOKIE_PREFIX = 'nidnasser_blog_read_1h_'
const ONE_HOUR_SECONDS = 3600
const MIN_ARTICLE_DWELL_MS = 30_000

function toCounterKey(slug: string): string {
  const safe = slug.replace(/[^a-zA-Z0-9_-]/g, '_')
  return `${BLOG_KEY_PREFIX}${safe}`
}

function toCookieName(slug: string): string {
  const safe = slug.replace(/[^a-zA-Z0-9_-]/g, '_')
  return `${BLOG_COOKIE_PREFIX}${safe}`
}

async function queryArticleCounter(
  action: 'get' | 'hit',
  slug: string,
  signal?: AbortSignal
): Promise<number | null> {
  try {
    const key = toCounterKey(slug)
    const res = await fetch(`${COUNTER_API_BASE}/${action}/${encodeURIComponent(key)}`, {
      cache: 'no-store',
      signal,
    })
    if (res.status === 404) return 0
    if (!res.ok) return null
    const data = (await res.json()) as { value?: unknown }
    const num = typeof data.value === 'number' ? data.value : Number(data.value)
    return Number.isFinite(num) && num >= 0 ? num : null
  } catch {
    return null
  }
}

/**
 * Fetches live global article read counts and records a qualified read only when
 * the user opens an article and stays actively visible on it for at least 30 seconds
 * (deduplicated with a 1-hour per-article cookie).
 */
export function useBlogReads(slugs: string[], activeSlug: string | null) {
  const [readsMap, setReadsMap] = useState<Record<string, number | null>>(() =>
    Object.fromEntries(slugs.map((s) => [s, null]))
  )

  const slugsKey = slugs.join('|')

  // Sync authoritative global read counts for all listed articles
  useEffect(() => {
    let cancelled = false
    let controller = new AbortController()

    const syncAll = async () => {
      controller.abort()
      controller = new AbortController()
      const results = await Promise.all(
        slugs.map(async (slug) => {
          const value = await queryArticleCounter('get', slug, controller.signal)
          return [slug, value] as const
        })
      )
      if (cancelled) return
      setReadsMap((prev) => {
        const next = { ...prev }
        for (const [slug, val] of results) {
          if (val !== null) {
            next[slug] = val
          }
        }
        return next
      })
    }

    void syncAll()

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        void syncAll()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelled = true
      controller.abort()
      document.removeEventListener('visibilitychange', onVisibility)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugsKey])

  // Record an engaged read ONLY after 30s of active visible time on the opened article
  useEffect(() => {
    if (!activeSlug || !slugs.includes(activeSlug)) return

    const cookieName = toCookieName(activeSlug)
    if (getCookie(cookieName)) return

    let cancelled = false
    let fired = false
    let accumulatedVisibleMs = 0
    let visibleSince: number | null =
      document.visibilityState === 'visible' ? performance.now() : null
    let timerId: number | undefined

    const clearTimer = () => {
      if (timerId !== undefined) {
        window.clearTimeout(timerId)
        timerId = undefined
      }
    }

    const triggerRead = async () => {
      if (fired || cancelled) return
      if (getCookie(cookieName)) return
      fired = true
      clearTimer()

      setCookie(cookieName, '1', ONE_HOUR_SECONDS)

      const liveVal = await queryArticleCounter('hit', activeSlug)
      if (!cancelled && liveVal !== null) {
        setReadsMap((prev) => ({
          ...prev,
          [activeSlug]: liveVal,
        }))
      }
    }

    const armTimer = () => {
      clearTimer()
      if (fired || cancelled || getCookie(cookieName)) return
      if (document.visibilityState !== 'visible') return

      const remaining = Math.max(0, MIN_ARTICLE_DWELL_MS - accumulatedVisibleMs)
      if (remaining === 0) {
        void triggerRead()
        return
      }

      visibleSince = performance.now()
      timerId = window.setTimeout(() => {
        accumulatedVisibleMs = MIN_ARTICLE_DWELL_MS
        visibleSince = null
        void triggerRead()
      }, remaining)
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        armTimer()
      } else {
        clearTimer()
        if (visibleSince !== null) {
          accumulatedVisibleMs += performance.now() - visibleSince
          visibleSince = null
        }
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    armTimer()

    return () => {
      cancelled = true
      clearTimer()
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSlug, slugsKey])

  return readsMap
}
