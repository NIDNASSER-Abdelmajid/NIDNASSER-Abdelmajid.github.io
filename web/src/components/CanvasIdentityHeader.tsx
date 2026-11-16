import { Command, Moon, Sun } from 'lucide-react'
import { PROFILE } from '../data/portfolio'
import type { ResolvedTheme } from '../hooks/useTheme'
import { GitHubIcon, LinkedInIcon } from './BrandIcons'
import { ProfilePhoto } from './ProfilePhoto'

interface CanvasIdentityHeaderProps {
  resolvedTheme: ResolvedTheme
  onToggleTheme: () => void
  onOpenPalette: () => void
}

export function CanvasIdentityHeader({
  resolvedTheme,
  onToggleTheme,
  onOpenPalette,
}: CanvasIdentityHeaderProps) {
  return (
    <div className="fixed top-5 left-5 z-40 hidden md:flex items-center gap-4 rounded-2xl border border-neutral-300/80 bg-white/95 p-3.5 shadow-2xl backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-900/95">
      <ProfilePhoto name={PROFILE.name} photoUrl={PROFILE.photoUrl} size="sidebar" />

      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
            {PROFILE.name}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-neutral-300 bg-neutral-100 px-2 py-0.5 font-mono text-[10px] text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            7 Nodes Live
          </span>
        </div>

        <div className="mt-0.5 flex items-center gap-2 font-mono text-xs text-neutral-600 dark:text-neutral-400">
          <span>{PROFILE.role}</span>
          <span>·</span>
          <span>{PROFILE.location}</span>
        </div>

        <div className="mt-1 font-mono text-[11px] text-neutral-500 dark:text-neutral-500">
          Click any node container to zoom in
        </div>
      </div>

      {/* Quick utility controls */}
      <div className="ml-2 flex items-center gap-1.5 border-l border-neutral-200 pl-3 dark:border-neutral-800">
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={`Theme: ${resolvedTheme}`}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-700 transition-colors hover:border-neutral-400 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:text-neutral-50"
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="h-3.5 w-3.5" strokeWidth={1.8} />
          ) : (
            <Moon className="h-3.5 w-3.5" strokeWidth={1.8} />
          )}
        </button>

        <button
          type="button"
          onClick={onOpenPalette}
          aria-label="Open command palette"
          title="Quick jump (Cmd/Ctrl + K)"
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 font-mono text-xs text-neutral-700 transition-colors hover:border-neutral-400 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:text-neutral-50"
        >
          <Command className="h-3.5 w-3.5" strokeWidth={1.8} />
          <span className="font-semibold">K</span>
        </button>

        <a
          href={PROFILE.links.github}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub profile"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-700 transition-colors hover:border-neutral-400 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:text-neutral-50"
        >
          <GitHubIcon className="h-3.5 w-3.5" />
        </a>

        <a
          href={PROFILE.links.linkedin}
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn profile"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-700 transition-colors hover:border-neutral-400 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:text-neutral-50"
        >
          <LinkedInIcon className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  )
}
