import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  Copy,
  GitBranch,
  Monitor,
  Moon,
  Search,
  Sun,
  X,
} from 'lucide-react'
import { BLOG_POSTS } from '../data/blog'
import { PROFILE, PROJECTS } from '../data/portfolio'
import type { ThemePreference } from '../hooks/useTheme'

interface CommandItem {
  id: string
  group: string
  label: string
  hint?: string
  icon: typeof ArrowRight
  action: () => void
}

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
  onNavigate: (path: string) => void
  onSelectTheme: (pref: ThemePreference) => void
  onCopyEmail: () => void
}

export function CommandPalette({
  open,
  onClose,
  onNavigate,
  onSelectTheme,
  onCopyEmail,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const commands = useMemo<CommandItem[]>(() => {
    const navItems: CommandItem[] = [
      {
        id: 'nav-home',
        group: 'Pages',
        label: 'Overview & Pipeline Topology',
        hint: '/',
        icon: ArrowRight,
        action: () => {
          onNavigate('/')
          onClose()
        },
      },
      {
        id: 'nav-projects',
        group: 'Pages',
        label: 'Projects Catalog',
        hint: '/projects',
        icon: ArrowRight,
        action: () => {
          onNavigate('/projects')
          onClose()
        },
      },
      {
        id: 'nav-experience',
        group: 'Pages',
        label: 'Experience & Education',
        hint: '/experience',
        icon: ArrowRight,
        action: () => {
          onNavigate('/experience')
          onClose()
        },
      },
      {
        id: 'nav-credentials',
        group: 'Pages',
        label: 'Credentials & Certifications',
        hint: '/credentials',
        icon: ArrowRight,
        action: () => {
          onNavigate('/credentials')
          onClose()
        },
      },
      {
        id: 'nav-stack',
        group: 'Pages',
        label: 'SQL Tech Stack Matrix',
        hint: '/stack',
        icon: ArrowRight,
        action: () => {
          onNavigate('/stack')
          onClose()
        },
      },
      {
        id: 'nav-blog',
        group: 'Pages',
        label: 'Data Engineering Blog',
        hint: '/blog',
        icon: ArrowRight,
        action: () => {
          onNavigate('/blog')
          onClose()
        },
      },
      {
        id: 'nav-contact',
        group: 'Pages',
        label: 'Contact & Profiles',
        hint: '/contact',
        icon: ArrowRight,
        action: () => {
          onNavigate('/contact')
          onClose()
        },
      },
    ]

    const projectItems: CommandItem[] = PROJECTS.map((project) => ({
      id: `prj-${project.id}`,
      group: 'Project Spec',
      label: `${project.code}: ${project.title}`,
      hint: project.category,
      icon: GitBranch,
      action: () => {
        onNavigate(`/projects/${project.id}`)
        onClose()
      },
    }))

    const blogItems: CommandItem[] = BLOG_POSTS.map((post) => ({
      id: `blog-${post.slug}`,
      group: 'Blog',
      label: `${post.code}: ${post.title}`,
      hint: post.readTime,
      icon: BookOpen,
      action: () => {
        onNavigate(`/blog/${post.slug}`)
        onClose()
      },
    }))

    const utilityItems: CommandItem[] = [
      {
        id: 'copy-email',
        group: 'Actions',
        label: `Copy Email (${PROFILE.email})`,
        hint: 'Clipboard',
        icon: Copy,
        action: () => {
          onCopyEmail()
          onClose()
        },
      },
      {
        id: 'theme-dark',
        group: 'Appearance',
        label: 'Switch Theme: Dark Mode',
        hint: 'Obsidian',
        icon: Moon,
        action: () => {
          onSelectTheme('dark')
          onClose()
        },
      },
      {
        id: 'theme-light',
        group: 'Appearance',
        label: 'Switch Theme: Light Mode',
        hint: 'Blueprint',
        icon: Sun,
        action: () => {
          onSelectTheme('light')
          onClose()
        },
      },
      {
        id: 'theme-system',
        group: 'Appearance',
        label: 'Switch Theme: Follow System Preference',
        hint: 'Auto',
        icon: Monitor,
        action: () => {
          onSelectTheme('system')
          onClose()
        },
      },
    ]

    return [...navItems, ...projectItems, ...blogItems, ...utilityItems]
  }, [onClose, onCopyEmail, onNavigate, onSelectTheme])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.group.toLowerCase().includes(q) ||
        (item.hint?.toLowerCase().includes(q) ?? false)
    )
  }, [commands, query])

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIndex(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (filtered.length ? (prev + 1) % filtered.length : 0))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) =>
          filtered.length ? (prev - 1 + filtered.length) % filtered.length : 0
        )
      } else if (e.key === 'Enter' && filtered[selectedIndex]) {
        e.preventDefault()
        filtered[selectedIndex].action()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [filtered, onClose, open, selectedIndex])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      className="fixed inset-0 z-50 flex items-start justify-center bg-neutral-950/60 px-4 pt-20 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-lg border border-neutral-300 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-950"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
          <Search className="h-4 w-4 text-neutral-400" strokeWidth={1.8} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to page, project spec, or blog note..."
            className="w-full bg-transparent font-mono text-xs text-neutral-950 placeholder:text-neutral-400 focus:outline-none dark:text-neutral-50"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close command palette"
            className="rounded p-1 text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-50"
          >
            <X className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="px-3 py-6 text-center font-mono text-xs text-neutral-500">
              No matching commands.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon
              const active = idx === selectedIndex
              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={item.action}
                  className={`flex w-full items-center justify-between rounded px-3 py-2 text-left text-xs transition-colors ${
                    active
                      ? 'bg-neutral-950 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-950'
                      : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.8} />
                    <span className="truncate font-medium">{item.label}</span>
                  </div>
                  <div className="ml-3 flex shrink-0 items-center gap-2 font-mono text-xs opacity-70">
                    <span>{item.group}</span>
                    {item.hint && <span>· {item.hint}</span>}
                  </div>
                </button>
              )
            })
          )}
        </div>

        <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-2.5 font-mono text-xs text-neutral-500 dark:border-neutral-800">
          <span>Arrows to navigate · Enter to execute</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  )
}
