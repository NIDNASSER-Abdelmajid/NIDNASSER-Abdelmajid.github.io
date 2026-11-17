import { useEffect, useState } from 'react'
import {
  formatUtcHourLabel,
  getCookie,
  getUtcHourBucket,
  msUntilNextUtcHour,
  setCookie,
} from '../utils/cookies'

const COUNTER_API_BASE = 'https://countapi.mileshilliard.com/api/v1'
const TOTAL_COUNTER_KEY = 'nidnasser_portfolio_visitors_total_v2'
const HOUR_KEY_PREFIX = 'nidnasser_portfolio_visitors_h_'
const VISIT_COOKIE_NAME = 'nidnasser_site_visit_1h'
const ONE_HOUR_SECONDS = 3600
const MIN_SITE_DWELL_MS = 10_000

export interface VisitorStats {
  total: number | null
  currentHourCount: number | null
  hourLabel: string
}

let sharedState: VisitorStats = {
  total: null,
  currentHourCount: null,
  hourLabel: formatUtcHourLabel(),
}

const listeners = new Set<(state: VisitorStats) => void>()
let initialized = false
let recordingInFlight = false
let hourSyncTimer: number | undefined

function emit(patch: Partial<VisitorStats>) {
  sharedState = { ...sharedState, ...patch }
  for (const listener of listeners) {
    listener(sharedState)
  }
}

async function queryCounter(action: 'get' | 'hit', key: string): Promise<number | null> {
  try {
    const res = await fetch(`${COUNTER_API_BASE}/${action}/${encodeURIComponent(key)}`, {
      cache: 'no-store',
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

async function syncAggregatedCounts(): Promise<void> {
  const now = new Date()
  const bucket = getUtcHourBucket(now)
  const hourLabel = formatUtcHourLabel(now)

  const [totalVal, hourVal] = await Promise.all([
    queryCounter('get', TOTAL_COUNTER_KEY),
    queryCounter('get', `${HOUR_KEY_PREFIX}${bucket}`),
  ])

  const patch: Partial<VisitorStats> = { hourLabel }
  if (totalVal !== null) {
    patch.total = hourVal !== null ? Math.max(totalVal, hourVal) : totalVal
  }
  if (hourVal !== null) {
    patch.currentHourCount = hourVal
  }
  emit(patch)
}

async function recordQualifiedSiteVisit(): Promise<void> {
  if (recordingInFlight) return
  if (getCookie(VISIT_COOKIE_NAME)) return

  recordingInFlight = true
  const now = new Date()
  const bucket = getUtcHourBucket(now)
  const hourLabel = formatUtcHourLabel(now)

  // Set 1-hour session cookie immediately to prevent duplicate hits across tabs/reloads
  setCookie(VISIT_COOKIE_NAME, bucket, ONE_HOUR_SECONDS)

  try {
    const [hourVal, totalVal] = await Promise.all([
      queryCounter('hit', `${HOUR_KEY_PREFIX}${bucket}`),
      queryCounter('hit', TOTAL_COUNTER_KEY),
    ])

    const patch: Partial<VisitorStats> = { hourLabel }
    if (totalVal !== null) {
      patch.total = hourVal !== null ? Math.max(totalVal, hourVal) : totalVal
    }
    if (hourVal !== null) {
      patch.currentHourCount = hourVal
    }
    emit(patch)
  } finally {
    recordingInFlight = false
  }
}

function scheduleHourlyRollupSync() {
  if (hourSyncTimer !== undefined) {
    window.clearTimeout(hourSyncTimer)
  }
  const waitMs = msUntilNextUtcHour()
  hourSyncTimer = window.setTimeout(() => {
    void syncAggregatedCounts()
    scheduleHourlyRollupSync()
  }, waitMs)
}

function startSiteVisitorTracker() {
  if (initialized || typeof window === 'undefined') return
  initialized = true

  // Fetch authoritative global count immediately on load (no stale device cache)
  void syncAggregatedCounts()
  scheduleHourlyRollupSync()

  // Keep devices synchronized whenever the tab becomes visible again
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      void syncAggregatedCounts()
    }
  })

  // Track active visible dwell time on the site (>= 10s required to count a visit)
  let accumulatedVisibleMs = 0
  let visibleSince: number | null =
    document.visibilityState === 'visible' ? performance.now() : null
  let dwellTimer: number | undefined

  const clearDwellTimer = () => {
    if (dwellTimer !== undefined) {
      window.clearTimeout(dwellTimer)
      dwellTimer = undefined
    }
  }

  const armDwellTimer = () => {
    clearDwellTimer()
    if (getCookie(VISIT_COOKIE_NAME)) return
    if (document.visibilityState !== 'visible') return

    const remaining = Math.max(0, MIN_SITE_DWELL_MS - accumulatedVisibleMs)
    if (remaining === 0) {
      void recordQualifiedSiteVisit()
      return
    }

    visibleSince = performance.now()
    dwellTimer = window.setTimeout(() => {
      accumulatedVisibleMs = MIN_SITE_DWELL_MS
      visibleSince = null
      void recordQualifiedSiteVisit()
    }, remaining)
  }

  const onVisibilityForDwell = () => {
    if (document.visibilityState === 'visible') {
      armDwellTimer()
    } else {
      clearDwellTimer()
      if (visibleSince !== null) {
        accumulatedVisibleMs += performance.now() - visibleSince
        visibleSince = null
      }
    }
  }

  document.addEventListener('visibilitychange', onVisibilityForDwell)
  armDwellTimer()
}

/**
 * Tracks website visitors using a 1-hour session cookie, a 10-second minimum visible
 * dwell requirement, and UTC hourly bucket aggregation synchronized across all devices.
 */
export function useVisitorCount(): VisitorStats {
  const [stats, setStats] = useState<VisitorStats>(sharedState)

  useEffect(() => {
    listeners.add(setStats)
    startSiteVisitorTracker()
    setStats(sharedState)

    return () => {
      listeners.delete(setStats)
    }
  }, [])

  return stats
}
