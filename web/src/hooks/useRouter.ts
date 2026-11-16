import { useCallback, useEffect, useState } from 'react'

export type RouteMatch =
  | { page: 'canvas' }
  | { page: 'home' }
  | { page: 'projects'; projectId: string | null }
  | { page: 'experience' }
  | { page: 'credentials' }
  | { page: 'stack' }
  | { page: 'blog'; slug: string | null }
  | { page: 'contact' }

function normalizeHash(rawHash: string): string {
  const cleaned = rawHash.replace(/^#/, '').trim()
  if (!cleaned || cleaned === '/') return '/canvas'
  return cleaned.startsWith('/') ? cleaned : `/${cleaned}`
}

export function parseRoute(path: string): RouteMatch {
  const normalized = path === '/' ? '/canvas' : path.replace(/\/+$/, '')
  const parts = normalized.split('/').filter(Boolean)

  if (parts.length === 0 || parts[0] === 'canvas') {
    return { page: 'canvas' }
  }

  const [section, param] = parts
  switch (section) {
    case 'overview':
    case 'home':
      return { page: 'home' }
    case 'projects':
      return { page: 'projects', projectId: param ?? null }
    case 'experience':
      return { page: 'experience' }
    case 'credentials':
      return { page: 'credentials' }
    case 'stack':
      return { page: 'stack' }
    case 'blog':
      return { page: 'blog', slug: param ?? null }
    case 'contact':
      return { page: 'contact' }
    default:
      return { page: 'canvas' }
  }
}

function getInitialPath(): string {
  if (typeof window === 'undefined') return '/canvas'

  // On page reload, ensure user lands on the scattered pipeline canvas
  const navEntries = window.performance?.getEntriesByType?.('navigation') as
    | PerformanceNavigationTiming[]
    | undefined
  const isReload = navEntries && navEntries.length > 0 && navEntries[0].type === 'reload'

  if (isReload) {
    window.location.hash = '/canvas'
    return '/canvas'
  }

  const current = normalizeHash(window.location.hash)
  if (!current || current === '/' || current === '/canvas') {
    return '/canvas'
  }
  return current
}

export function useRouter() {
  const [path, setPath] = useState<string>(getInitialPath)

  useEffect(() => {
    const onHashChange = () => {
      setPath(normalizeHash(window.location.hash))
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = useCallback((nextPath: string) => {
    const target = nextPath.startsWith('/') ? nextPath : `/${nextPath}`
    const current = normalizeHash(window.location.hash)
    if (current === target) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    window.location.hash = target
  }, [])

  return {
    path,
    route: parseRoute(path),
    navigate,
  }
}
