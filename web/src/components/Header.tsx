import { useState } from 'react'
import { Command, Menu, Monitor, Moon, Sun, X } from 'lucide-react'
import type { RouteMatch } from '../hooks/useRouter'
import type { ResolvedTheme, ThemePreference } from '../hooks/useTheme'

interface HeaderProps {
  route: RouteMatch
  onNavigate: (path: string) => void
  resolvedTheme: ResolvedTheme
  preference: ThemePreference
  onToggleTheme: () => void
  onResetSystem: () => void
  onOpenPalette: () => void
}

const NAV_ITEMS: { path: string; page: RouteMatch['page']; label: string }[] = [
  { path: '/', page: 'home', label: 'Overview' },
  { path: '/projects', page: 'projects', label: 'Projects' },
  { path: '/experience', page: 'experience', label: 'Experience' },
  { path: '/stack', page: 'stack', label: 'Stack' },
  { path: '/blog', page: 'blog', label: 'Blog' },
  { path: '/contact', page: 'contact', label: 'Contact' },
]

export function Header({
  route,
  onNavigate,
  resolvedTheme,
  preference,
  onToggleTheme,
  onResetSystem,
  onOpenPalette,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-neutral-50/90 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/90">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="group flex items-center gap-2.5 text-sm font-semibold tracking-tight text-neutral-950 dark:text-neutral-50"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded border border-neutral-300 bg-neutral-950 font-mono text-xs font-semibold text-neutral-50 transition-transform group-hover:scale-105 dark:border-neutral-700 dark:bg-neutral-50 dark:text-neutral-950">
            AN
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
            Data.Eng
          </span>
        </button>

        <nav aria-label="Primary navigation" className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = route.page === item.page
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => onNavigate(item.path)}
                aria-current={active ? 'page' : undefined}
                className={`rounded px-2.5 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
                  active
                    ? 'bg-neutral-950 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-950'
                    : 'text-neutral-600 hover:bg-neutral-200/70 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-50'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenPalette}
            aria-label="Open command palette"
            className="hidden items-center gap-1.5 rounded border border-neutral-200 bg-white px-2.5 py-1.5 font-mono text-xs text-neutral-600 transition-colors hover:border-neutral-400 hover:text-neutral-950 sm:inline-flex dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-neutral-50"
          >
            <Command className="h-3 w-3" strokeWidth={1.8} />
            <span>K</span>
          </button>

          {preference !== 'system' && (
            <button
              type="button"
              onClick={onResetSystem}
              title="Follow system theme preference"
              aria-label="Follow system theme preference"
              className="hidden items-center gap-1 rounded border border-neutral-200 bg-white px-2.5 py-1.5 font-mono text-xs uppercase tracking-wider text-neutral-500 transition-colors hover:border-neutral-400 hover:text-neutral-950 sm:inline-flex dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-neutral-50"
            >
              <Monitor className="h-3 w-3" strokeWidth={1.8} />
              <span>Sys</span>
            </button>
          )}

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={
              preference === 'system'
                ? `System (${resolvedTheme}) - click to switch`
                : `Mode: ${resolvedTheme} - click to switch`
            }
            className="inline-flex h-8 w-8 items-center justify-center rounded border border-neutral-200 bg-white text-neutral-700 transition-colors hover:border-neutral-400 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:text-neutral-50"
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="h-4 w-4" strokeWidth={1.8} />
            ) : (
              <Moon className="h-4 w-4" strokeWidth={1.8} />
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex h-8 w-8 items-center justify-center rounded border border-neutral-200 bg-white text-neutral-700 transition-colors hover:border-neutral-400 md:hidden dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
          >
            {mobileOpen ? (
              <X className="h-4 w-4" strokeWidth={1.8} />
            ) : (
              <Menu className="h-4 w-4" strokeWidth={1.8} />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-neutral-200 bg-neutral-50 px-4 py-3 md:hidden dark:border-neutral-800 dark:bg-neutral-950">
          <div className="flex flex-col gap-1.5">
            {NAV_ITEMS.map((item) => {
              const active = route.page === item.page
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => {
                    onNavigate(item.path)
                    setMobileOpen(false)
                  }}
                  className={`rounded px-3 py-2 text-left font-mono text-xs uppercase tracking-wider ${
                    active
                      ? 'bg-neutral-950 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-950'
                      : 'text-neutral-700 hover:bg-neutral-200/60 dark:text-neutral-300 dark:hover:bg-neutral-900'
                  }`}
                >
                  {item.label}
                </button>
              )
            })}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false)
                onOpenPalette()
              }}
              className="mt-1 flex items-center gap-2 rounded border border-neutral-200 bg-white px-3 py-2 font-mono text-xs text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
            >
              <Command className="h-3.5 w-3.5" strokeWidth={1.8} />
              <span>Command Palette</span>
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
