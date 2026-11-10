import { ArrowUp } from 'lucide-react'
import { PROFILE } from '../data/portfolio'

interface FooterProps {
  onNavigate: (path: string) => void
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-neutral-200 py-8 dark:border-neutral-800">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 font-mono text-[11px] text-neutral-500 sm:flex-row sm:px-6 dark:text-neutral-400">
        <div className="flex flex-wrap items-center gap-2">
          <span>{PROFILE.name}</span>
          <span>·</span>
          <span>{PROFILE.role}</span>
          <span>·</span>
          <span>{new Date().getFullYear()}</span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => onNavigate('/projects')}
            className="hover:text-neutral-950 dark:hover:text-neutral-50"
          >
            Projects
          </button>
          <button
            type="button"
            onClick={() => onNavigate('/blog')}
            className="hover:text-neutral-950 dark:hover:text-neutral-50"
          >
            Blog
          </button>
          <button
            type="button"
            onClick={() => onNavigate('/contact')}
            className="hover:text-neutral-950 dark:hover:text-neutral-50"
          >
            Contact
          </button>
          <span>Cmd/Ctrl + K</span>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className="inline-flex h-7 w-7 items-center justify-center rounded border border-neutral-200 bg-white text-neutral-600 transition-colors hover:border-neutral-950 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-50 dark:hover:text-neutral-50"
          >
            <ArrowUp className="h-3.5 w-3.5" strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </footer>
  )
}
