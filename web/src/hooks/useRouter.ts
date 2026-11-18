import { useCallback, useEffect, useState } from 'react'

export type RouteMatch =
  | { page: 'home' }
  | { page: 'projects'; projectId: string | null }
  | { page: 'experience' }
  | { page: 'credentials' }
  | { page: 'stack' }
  | { page: 'blog'; slug: string | null }
  | { page: 'contact' }
  | { page: 'admin' }

function normalizePath(raw: string): string {
  const cleaned = raw.replace(/^#/, '').trim()
  if (!cleaned || cleaned === '/') return '/'
  return cleaned.startsWith('/') ? cleaned : `/${cleaned}`
}

function getInitialRoutePath(): string {
  if (typeof window === 'undefined') return '/'
  const fromHash = window.location.hash.replace(/^#/, '').trim()
  if (fromHash && fromHash !== '/') {
    return normalizePath(fromHash)
  }
  const fromPathname = window.location.pathname.replace(/\/+$/, '')
  if (fromPathname === '/admin/joyboy/laughtale') {
    return '/admin/joyboy/laughtale'
  }
  return '/'
}

export function parseRoute(path: string): RouteMatch {
  const normalized = path === '/' ? '/' : path.replace(/\/+$/, '')
  const parts = normalized.split('/').filter(Boolean)

  if (parts.length === 0) return { page: 'home' }

  if (
    parts.length === 3 &&
    parts[0] === 'admin' &&
    parts[1] === 'joyboy' &&
    parts[2] === 'laughtale'
  ) {
    return { page: 'admin' }
  }

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
  const [path, setPath] = useState<string>(getInitialRoutePath)

  useEffect(() => {
    const onHashChange = () => {
      setPath(normalizePath(window.location.hash))
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = useCallback((nextPath: string) => {
    const target = nextPath.startsWith('/') ? nextPath : `/${nextPath}`
    if (normalizePath(window.location.hash) === target) {
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
