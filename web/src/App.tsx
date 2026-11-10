import { useCallback, useEffect, useState } from 'react'
import { CommandPalette } from './components/CommandPalette'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { PROFILE } from './data/portfolio'
import { useRouter } from './hooks/useRouter'
import { useTheme } from './hooks/useTheme'
import { BlogPage } from './pages/BlogPage'
import { ContactPage } from './pages/ContactPage'
import { ExperiencePage } from './pages/ExperiencePage'
import { HomePage } from './pages/HomePage'
import { ProjectsPage } from './pages/ProjectsPage'
import { StackPage } from './pages/StackPage'

export function App() {
  const { route, navigate } = useRouter()
  const { preference, resolvedTheme, setPreference, toggleTheme } = useTheme()
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = useCallback(() => {
    navigator.clipboard?.writeText(PROFILE.email).catch(() => {})
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const renderPage = () => {
    switch (route.page) {
      case 'projects':
        return (
          <ProjectsPage
            activeProjectId={route.projectId}
            onNavigate={navigate}
          />
        )
      case 'experience':
        return <ExperiencePage />
      case 'stack':
        return <StackPage />
      case 'blog':
        return <BlogPage activeSlug={route.slug} onNavigate={navigate} />
      case 'contact':
        return <ContactPage copied={copied} onCopyEmail={handleCopyEmail} />
      case 'home':
      default:
        return (
          <HomePage
            copied={copied}
            onCopyEmail={handleCopyEmail}
            onNavigate={navigate}
          />
        )
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <Header
        route={route}
        onNavigate={navigate}
        resolvedTheme={resolvedTheme}
        preference={preference}
        onToggleTheme={toggleTheme}
        onResetSystem={() => setPreference('system')}
        onOpenPalette={() => setPaletteOpen(true)}
      />

      <main className="flex-1">{renderPage()}</main>

      <Footer onNavigate={navigate} />

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNavigate={navigate}
        onSelectTheme={setPreference}
        onCopyEmail={handleCopyEmail}
      />
    </div>
  )
}

export default App
