import { useState } from 'react'
import {
  BookOpen,
  Briefcase,
  Command,
  Database,
  Layers,
  Mail,
  MapPin,
  Menu,
  Monitor,
  Moon,
  Sun,
  Terminal,
  X,
} from 'lucide-react'
import { PROFILE } from '../data/portfolio'
import type { RouteMatch } from '../hooks/useRouter'
import type { ResolvedTheme, ThemePreference } from '../hooks/useTheme'
import { GitHubIcon, LinkedInIcon } from './BrandIcons'
import { ProfilePhoto } from './ProfilePhoto'

interface SidebarProps {
  route: RouteMatch
  onNavigate: (path: string) => void
  resolvedTheme: ResolvedTheme
  preference: ThemePreference
  onToggleTheme: () => void
  onResetSystem: () => void
  onOpenPalette: () => void
}

const NAV_ITEMS: {
  path: string
  page: RouteMatch['page']
  code: string
  label: string
  icon: typeof Terminal
}[] = [
  { path: '/', page: 'home', code: '00', label: 'Overview', icon: Terminal },
  { path: '/projects', page: 'projects', code: '01', label: 'Projects', icon: Database },
  { path: '/experience', page: 'experience', code: '02', label: 'Experience', icon: Briefcase },
  { path: '/stack', page: 'stack', code: '03', label: 'Stack', icon: Layers },
  { path: '/blog', page: 'blog', code: '04', label: 'Blog', icon: BookOpen },
  { path: '/contact', page: 'contact', code: '05', label: 'Contact', icon: Mail },
]

export function Sidebar({
  route,
  onNavigate,
  resolvedTheme,
  preference,
  onToggleTheme,
  onResetSystem,
  onOpenPalette,
}: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleNav = (path: string) => {
    onNavigate(path)
    setMobileOpen(false)
  }

  const sidebarBody = (
    <div className="flex h-full flex-col justify-between overflow-y-auto px-5 py-6">
      <div>
        {/* Portrait + Identity */}
        <button
          type="button"
          onClick={() => handleNav('/')}
          className="group block w-full text-left"
        >
          <ProfilePhoto name={PROFILE.name} photoUrl={PROFILE.photoUrl} size="sidebar" />

          <div className="mt-4">
            <div className="text-sm font-semibold tracking-tight text-neutral-950 transition-opacity group-hover:opacity-80 dark:text-neutral-50">
              {PROFILE.name}
            </div>
            <div className="mt-1 flex items-center gap-2 font-mono text-xs text-neutral-600 dark:text-neutral-400">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-950 dark:bg-neutral-50" />
              <span>{PROFILE.role}</span>
            </div>
            <div className="mt-1 inline-flex items-center gap-1 font-mono text-xs text-neutral-500 dark:text-neutral-500">
              <MapPin className="h-3 w-3" strokeWidth={1.8} />
              <span>{PROFILE.location}</span>
            </div>
          </div>
        </button>

        {/* Vertical Navigation */}
        <nav aria-label="Primary navigation" className="mt-7 flex flex-col gap-1 border-t border-neutral-200 pt-5 dark:border-neutral-800">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = route.page === item.page
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNav(item.path)}
                aria-current={active ? 'page' : undefined}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 font-mono text-xs transition-colors ${
                  active
                    ? 'bg-neutral-950 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-950'
                    : 'text-neutral-600 hover:bg-neutral-200/60 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.8} />
                  <span className="uppercase tracking-wider">{item.label}</span>
                </span>
                <span
                  className={
                    active
                      ? 'text-neutral-400 dark:text-neutral-600'
                      : 'text-neutral-400 dark:text-neutral-600'
                  }
                >
                  {item.code}
                </span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Bottom Utility Dock */}
      <div className="mt-6 space-y-2.5 border-t border-neutral-200 pt-4 dark:border-neutral-800">
        <button
          type="button"
          onClick={() => {
            setMobileOpen(false)
            onOpenPalette()
          }}
          aria-label="Open command palette"
          className="flex w-full items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2 font-mono text-xs text-neutral-600 transition-colors hover:border-neutral-400 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-neutral-50"
        >
          <span className="inline-flex items-center gap-2">
            <Command className="h-3.5 w-3.5" strokeWidth={1.8} />
            <span>Quick Jump</span>
          </span>
          <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
            K
          </span>
        </button>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={
                preference === 'system'
                  ? `System (${resolvedTheme}) - click to switch`
                  : `Mode: ${resolvedTheme} - click to switch`
              }
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 font-mono text-xs text-neutral-700 transition-colors hover:border-neutral-400 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:text-neutral-50"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="h-3.5 w-3.5" strokeWidth={1.8} />
              ) : (
                <Moon className="h-3.5 w-3.5" strokeWidth={1.8} />
              )}
              <span className="capitalize">{resolvedTheme}</span>
            </button>

            {preference !== 'system' && (
              <button
                type="button"
                onClick={onResetSystem}
                title="Follow system theme preference"
                aria-label="Follow system theme preference"
                className="inline-flex h-8 items-center gap-1 rounded-lg border border-neutral-200 bg-white px-2 font-mono text-xs text-neutral-500 transition-colors hover:border-neutral-400 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-neutral-50"
              >
                <Monitor className="h-3.5 w-3.5" strokeWidth={1.8} />
                <span>Sys</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href={PROFILE.links.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub profile"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 transition-colors hover:border-neutral-400 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:text-neutral-50"
            >
              <GitHubIcon className="h-3.5 w-3.5" />
            </a>
            <a
              href={PROFILE.links.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn profile"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 transition-colors hover:border-neutral-400 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:text-neutral-50"
            >
              <LinkedInIcon className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Left Vertical Navigation Rail */}
      <aside className="hidden md:sticky md:top-0 md:flex md:h-screen md:w-60 md:shrink-0 md:flex-col md:border-r md:border-neutral-200 md:bg-neutral-50/95 lg:w-64 dark:md:border-neutral-800 dark:md:bg-neutral-950/95">
        {sidebarBody}
      </aside>

      {/* Mobile Compact Header Trigger (hidden on md+ where left sidebar is active) */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-neutral-200 bg-neutral-50/95 px-4 backdrop-blur-md md:hidden dark:border-neutral-800 dark:bg-neutral-950/95">
        <button
          type="button"
          onClick={() => handleNav('/')}
          className="flex items-center gap-2.5 text-sm font-semibold tracking-tight text-neutral-950 dark:text-neutral-50"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded border border-neutral-300 bg-neutral-950 font-mono text-xs font-semibold text-neutral-50 dark:border-neutral-700 dark:bg-neutral-50 dark:text-neutral-950">
            AN
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
            Data.Eng
          </span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenPalette}
            aria-label="Open command palette"
            className="inline-flex h-8 w-8 items-center justify-center rounded border border-neutral-200 bg-white text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
          >
            <Command className="h-3.5 w-3.5" strokeWidth={1.8} />
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="inline-flex h-8 w-8 items-center justify-center rounded border border-neutral-200 bg-white text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="h-4 w-4" strokeWidth={1.8} />
            ) : (
              <Moon className="h-4 w-4" strokeWidth={1.8} />
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation sidebar"
            className="inline-flex h-8 w-8 items-center justify-center rounded border border-neutral-200 bg-white text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
          >
            <Menu className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </div>
      </header>

      {/* Mobile Left Slide-Over Drawer */}
      {mobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation sidebar"
          className="fixed inset-0 z-50 flex md:hidden"
        >
          <div
            className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-10 flex h-full w-72 max-w-[85vw] flex-col border-r border-neutral-200 bg-neutral-50 shadow-2xl dark:border-neutral-800 dark:bg-neutral-950">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation sidebar"
              className="absolute top-4 right-4 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
            >
              <X className="h-4 w-4" strokeWidth={1.8} />
            </button>
            {sidebarBody}
          </aside>
        </div>
      )}
    </>
  )
}
