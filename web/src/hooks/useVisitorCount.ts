import { useEffect, useState } from 'react'

const COUNTER_NAMESPACE = 'nidnasser-abdelmajid.github.io'
const COUNTER_KEY = 'site-visitors'
const ABACUS_BASE = 'https://abacus.jasoncameron.dev'
const CACHE_KEY = 'site-visitors-cache-v1'
const SESSION_KEY = 'site-visitor-counted-v1'

let visitorRequestPromise: Promise<number | null> | null = null

function loadCachedCount(): number | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = Number(raw)
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : null
  } catch {
    return null
  }
}

function persistCachedCount(value: number) {
  try {
    window.localStorage.setItem(CACHE_KEY, String(value))
  } catch {
    // ignore storage errors
  }
}

async function resolveVisitorCount(): Promise<number | null> {
  let alreadyCounted = false
  try {
    alreadyCounted = Boolean(window.sessionStorage.getItem(SESSION_KEY))
  } catch {
    alreadyCounted = false
  }

  const endpoint = alreadyCounted ? 'get' : 'hit'

  try {
    const res = await fetch(`${ABACUS_BASE}/${endpoint}/${COUNTER_NAMESPACE}/${COUNTER_KEY}`)
    if (res.status === 404) return 0
    if (!res.ok) return null
    const data = (await res.json()) as { value?: unknown }
    if (typeof data.value === 'number' && data.value >= 0) {
      if (!alreadyCounted) {
        try {
          window.sessionStorage.setItem(SESSION_KEY, '1')
        } catch {
          // ignore storage errors
        }
      }
      persistCachedCount(data.value)
      return data.value
    }
    return null
  } catch {
    return null
  }
}

function getVisitorCountOnce(): Promise<number | null> {
  if (!visitorRequestPromise) {
    visitorRequestPromise = resolveVisitorCount()
  }
  return visitorRequestPromise
}

/**
 * Aggregates and returns the global count of all visitors across sessions.
 * Uses a single network request per page load and deduplicates per browser session.
 */
export function useVisitorCount(): number | null {
  const [count, setCount] = useState<number | null>(() => loadCachedCount())

  useEffect(() => {
    let active = true
    getVisitorCountOnce().then((value) => {
      if (active && value !== null) {
        setCount(value)
      }
    })
    return () => {
      active = false
    }
  }, [])

  return count
}
