import { useCallback, useEffect, useState } from 'react'

export type RouteMatch =
  | { page: 'home' }
  | { page: 'projects'; projectId: string | null }
  | { page: 'experience' }
  | { page: 'credentials' }
  | { page: 'stack' }
  | { page: 'blog'; slug: string | null }
  | { page: 'contact' }

function normalizeHash(rawHash: string): string {
  const cleaned = rawHash.replace(/^#/, '').trim()
  if (!cleaned || cleaned === '/') return '/'
  return cleaned.startsWith('/') ? cleaned : `/${cleaned}`
}

export function parseRoute(path: string): RouteMatch {
  const normalized = path === '/' ? '/' : path.replace(/\/+$/, '')
  const parts = normalized.split('/').filter(Boolean)

  if (parts.length === 0) return { page: 'home' }

  const [section, param] = parts
  switch (section) {
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
      return { page: 'home' }
  }
}

export function useRouter() {
  const [path, setPath] = useState<string>(() =>
    typeof window !== 'undefined' ? normalizeHash(window.location.hash) : '/'
  )

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
    if (normalizeHash(window.location.hash) === target) {
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
