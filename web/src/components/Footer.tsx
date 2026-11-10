import { ArrowUp } from 'lucide-react'
import { PROFILE } from '../data/portfolio'

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 py-6 dark:border-neutral-800">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 font-mono text-xs text-neutral-500 sm:px-8 dark:text-neutral-400">
        <div className="flex flex-wrap items-center gap-2">
          <span>{PROFILE.name}</span>
          <span>·</span>
          <span>{PROFILE.role}</span>
          <span>·</span>
          <span>{new Date().getFullYear()}</span>
        </div>

        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded border border-neutral-200 bg-white text-neutral-600 transition-colors hover:border-neutral-950 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-50 dark:hover:text-neutral-50"
        >
          <ArrowUp className="h-3.5 w-3.5" strokeWidth={1.8} />
        </button>
      </div>
    </footer>
  )
}
