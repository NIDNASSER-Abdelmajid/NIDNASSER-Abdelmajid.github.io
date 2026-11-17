export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const prefix = `${encodeURIComponent(name)}=`
  const parts = document.cookie.split(';')
  for (const rawPart of parts) {
    const part = rawPart.trim()
    if (part.startsWith(prefix)) {
      return decodeURIComponent(part.slice(prefix.length))
    }
  }
  return null
}

export function setCookie(name: string, value: string, maxAgeSeconds: number): void {
  if (typeof document === 'undefined') return
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:'
  const secureFlag = isHttps ? '; Secure' : ''
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; max-age=${Math.floor(maxAgeSeconds)}; path=/; SameSite=Lax${secureFlag}`
}

/**
 * Returns the current UTC hourly bucket identifier in YYYYMMDDHH format,
 * used to bucket session visits per hour.
 */
export function getUtcHourBucket(date: Date = new Date()): string {
  const yyyy = date.getUTCFullYear()
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(date.getUTCDate()).padStart(2, '0')
  const hh = String(date.getUTCHours()).padStart(2, '0')
  return `${yyyy}${mm}${dd}${hh}`
}

export function formatUtcHourLabel(date: Date = new Date()): string {
  const hh = String(date.getUTCHours()).padStart(2, '0')
  return `${hh}:00 UTC`
}

/**
 * Returns milliseconds remaining until the next UTC hour boundary (+1s buffer).
 */
export function msUntilNextUtcHour(date: Date = new Date()): number {
  const next = new Date(date.getTime())
  next.setUTCMinutes(0, 0, 0)
  next.setUTCHours(next.getUTCHours() + 1)
  return Math.max(1000, next.getTime() - date.getTime() + 1000)
}
