import { useCallback, useEffect, useRef, useState } from 'react'
import { CommandPalette } from './components/CommandPalette'
import { Footer } from './components/Footer'
import { Sidebar } from './components/Sidebar'
import { PROFILE } from './data/portfolio'
import { parseRoute, useRouter, type RouteMatch } from './hooks/useRouter'
import { useTheme } from './hooks/useTheme'
import { BlogPage } from './pages/BlogPage'
import { ContactPage } from './pages/ContactPage'
import { CredentialsPage } from './pages/CredentialsPage'
import { ExperiencePage } from './pages/ExperiencePage'
import { HomePage } from './pages/HomePage'
import { ProjectsPage } from './pages/ProjectsPage'
import { StackPage } from './pages/StackPage'

const SECTIONS: { id: RouteMatch['page']; path: string; label: string }[] = [
  { id: 'home', path: '/', label: 'Overview' },
  { id: 'projects', path: '/projects', label: 'Projects' },
  { id: 'experience', path: '/experience', label: 'Experience' },
  { id: 'credentials', path: '/credentials', label: 'Credentials' },
  { id: 'stack', path: '/stack', label: 'Stack' },
  { id: 'blog', path: '/blog', label: 'Blog' },
  { id: 'contact', path: '/contact', label: 'Contact' },
]

export function App() {
  const { route, navigate } = useRouter()
  const { preference, resolvedTheme, setPreference, toggleTheme } = useTheme()
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])

  const activeIndex = Math.max(
    0,
    SECTIONS.findIndex((s) => s.id === route.page)
  )

  const handleCopyEmail = useCallback(() => {
    navigator.clipboard?.writeText(PROFILE.email).catch(() => {})
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }, [])

  const handleNavigate = useCallback(
    (nextPath: string) => {
      const targetPage = parseRoute(nextPath).page
      if (route.page === targetPage) {
        const idx = SECTIONS.findIndex((s) => s.id === targetPage)
        if (idx !== -1 && sectionRefs.current[idx]) {
          sectionRefs.current[idx]?.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }
      navigate(nextPath)
    },
    [navigate, route.page]
  )

  // Reset scroll to top when sliding into an active section
  useEffect(() => {
    const el = sectionRefs.current[activeIndex]
    if (el && el.scrollTop > 0) {
      el.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [activeIndex])

  // Keyboard navigation: Cmd/Ctrl+K for palette, ArrowLeft/ArrowRight to slide sections
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((prev) => !prev)
        return
      }

      if (paletteOpen) return

      const activeEl = document.activeElement
      if (activeEl) {
        const tag = activeEl.tagName.toLowerCase()
        if (
          tag === 'input' ||
          tag === 'textarea' ||
          tag === 'select' ||
          (activeEl as HTMLElement).isContentEditable
        ) {
          return
        }
      }

      // Do not navigate between sections if a modal dialog is open
      if (document.querySelector('[role="dialog"]')) return

      if (e.key === 'ArrowRight') {
        e.preventDefault()
        if (activeIndex < SECTIONS.length - 1) {
          navigate(SECTIONS[activeIndex + 1].path)
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        if (activeIndex > 0) {
          navigate(SECTIONS[activeIndex - 1].path)
        }
      } else if (e.key === 'Home') {
        e.preventDefault()
        navigate(SECTIONS[0].path)
      } else if (e.key === 'End') {
        e.preventDefault()
        navigate(SECTIONS[SECTIONS.length - 1].path)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeIndex, navigate, paletteOpen])

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-neutral-50 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <Sidebar
        route={route}
        onNavigate={handleNavigate}
        resolvedTheme={resolvedTheme}
        preference={preference}
        onToggleTheme={toggleTheme}
        onResetSystem={() => setPreference('system')}
        onOpenPalette={() => setPaletteOpen(true)}
      />

      {/* The Single-Plane Horizontal Canvas Track with Unified Dotted Blueprint Background */}
      <div
        className="horizontal-canvas-track bg-blueprint-grid"
        style={{
          transform: `translate3d(-${activeIndex * 100}vw, 0, 0)`,
        }}
      >
        {/* Section 0: Overview */}
        <div
          ref={(el) => {
            sectionRefs.current[0] = el
          }}
          tabIndex={activeIndex === 0 ? 0 : -1}
          aria-hidden={activeIndex !== 0}
          className={`w-screen min-w-[100vw] shrink-0 h-screen overflow-y-auto overflow-x-hidden md:pl-60 lg:pl-64 pt-14 md:pt-0 flex flex-col justify-between outline-none @container ${
            Math.abs(activeIndex - 0) <= 1 ? '' : 'is-dormant'
          }`}
        >
          <div className="flex-1">
            <HomePage
              copied={copied}
              onCopyEmail={handleCopyEmail}
              onNavigate={handleNavigate}
            />
          </div>
          <Footer />
        </div>

        {/* Section 1: Projects */}
        <div
          ref={(el) => {
            sectionRefs.current[1] = el
          }}
          tabIndex={activeIndex === 1 ? 0 : -1}
          aria-hidden={activeIndex !== 1}
          className={`w-screen min-w-[100vw] shrink-0 h-screen overflow-y-auto overflow-x-hidden md:pl-60 lg:pl-64 pt-14 md:pt-0 flex flex-col justify-between outline-none @container ${
            Math.abs(activeIndex - 1) <= 1 ? '' : 'is-dormant'
          }`}
        >
          <div className="flex-1">
            <ProjectsPage
              activeProjectId={route.page === 'projects' ? route.projectId : null}
              onNavigate={handleNavigate}
            />
          </div>
          <Footer />
        </div>

        {/* Section 2: Experience */}
        <div
          ref={(el) => {
            sectionRefs.current[2] = el
          }}
          tabIndex={activeIndex === 2 ? 0 : -1}
          aria-hidden={activeIndex !== 2}
          className={`w-screen min-w-[100vw] shrink-0 h-screen overflow-y-auto overflow-x-hidden md:pl-60 lg:pl-64 pt-14 md:pt-0 flex flex-col justify-between outline-none @container ${
            Math.abs(activeIndex - 2) <= 1 ? '' : 'is-dormant'
          }`}
        >
          <div className="flex-1">
            <ExperiencePage />
          </div>
          <Footer />
        </div>

        {/* Section 3: Credentials */}
        <div
          ref={(el) => {
            sectionRefs.current[3] = el
          }}
          tabIndex={activeIndex === 3 ? 0 : -1}
          aria-hidden={activeIndex !== 3}
          className={`w-screen min-w-[100vw] shrink-0 h-screen overflow-y-auto overflow-x-hidden md:pl-60 lg:pl-64 pt-14 md:pt-0 flex flex-col justify-between outline-none @container ${
            Math.abs(activeIndex - 3) <= 1 ? '' : 'is-dormant'
          }`}
        >
          <div className="flex-1">
            <CredentialsPage />
          </div>
          <Footer />
        </div>

        {/* Section 4: Stack */}
        <div
          ref={(el) => {
            sectionRefs.current[4] = el
          }}
          tabIndex={activeIndex === 4 ? 0 : -1}
          aria-hidden={activeIndex !== 4}
          className={`w-screen min-w-[100vw] shrink-0 h-screen overflow-y-auto overflow-x-hidden md:pl-60 lg:pl-64 pt-14 md:pt-0 flex flex-col justify-between outline-none @container ${
            Math.abs(activeIndex - 4) <= 1 ? '' : 'is-dormant'
          }`}
        >
          <div className="flex-1">
            <StackPage />
          </div>
          <Footer />
        </div>

        {/* Section 5: Blog */}
        <div
          ref={(el) => {
            sectionRefs.current[5] = el
          }}
          tabIndex={activeIndex === 5 ? 0 : -1}
          aria-hidden={activeIndex !== 5}
          className={`w-screen min-w-[100vw] shrink-0 h-screen overflow-y-auto overflow-x-hidden md:pl-60 lg:pl-64 pt-14 md:pt-0 flex flex-col justify-between outline-none @container ${
            Math.abs(activeIndex - 5) <= 1 ? '' : 'is-dormant'
          }`}
        >
          <div className="flex-1">
            <BlogPage
              activeSlug={route.page === 'blog' ? route.slug : null}
              onNavigate={handleNavigate}
            />
          </div>
          <Footer />
        </div>

        {/* Section 6: Contact */}
        <div
          ref={(el) => {
            sectionRefs.current[6] = el
          }}
          tabIndex={activeIndex === 6 ? 0 : -1}
          aria-hidden={activeIndex !== 6}
          className={`w-screen min-w-[100vw] shrink-0 h-screen overflow-y-auto overflow-x-hidden md:pl-60 lg:pl-64 pt-14 md:pt-0 flex flex-col justify-between outline-none @container ${
            Math.abs(activeIndex - 6) <= 1 ? '' : 'is-dormant'
          }`}
        >
          <div className="flex-1">
            <ContactPage copied={copied} onCopyEmail={handleCopyEmail} />
          </div>
          <Footer />
        </div>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNavigate={handleNavigate}
        onSelectTheme={setPreference}
        onCopyEmail={handleCopyEmail}
      />
    </div>
  )
}

export default App
