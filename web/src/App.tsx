import { useCallback, useEffect, useState } from 'react'
import { ArrowDownRight, Check, Copy, MapPin } from 'lucide-react'
import { GitHubIcon, LinkedInIcon } from './components/BrandIcons'
import { CommandPalette } from './components/CommandPalette'
import { ContactFooter } from './components/ContactFooter'
import { ExperienceSection } from './components/ExperienceSection'
import { Header } from './components/Header'
import { PipelineTopology } from './components/PipelineTopology'
import { ProjectsSection } from './components/ProjectsSection'
import { StackSection } from './components/StackSection'
import { PROFILE } from './data/portfolio'
import { useTheme } from './hooks/useTheme'

export function App() {
  const { preference, resolvedTheme, setPreference, toggleTheme } = useTheme()
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>('alphapay-lakehouse')

  const handleCopyEmail = useCallback(() => {
    navigator.clipboard?.writeText(PROFILE.email).catch(() => {})
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }, [])

  const handleInspectProject = useCallback((projectId: string) => {
    setExpandedProjectId(projectId)
    window.requestAnimationFrame(() => {
      const target = document.getElementById(`project-${projectId}`)
      target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
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

  return (
    <div id="top" className="min-h-screen bg-neutral-50 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <Header
        resolvedTheme={resolvedTheme}
        preference={preference}
        onToggleTheme={toggleTheme}
        onResetSystem={() => setPreference('system')}
        onOpenPalette={() => setPaletteOpen(true)}
      />

      <main>
        {/* Hero Section */}
        <section id="pipeline" className="bg-blueprint-grid relative overflow-hidden py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-6">
                <div className="mb-5 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded border border-neutral-300 bg-white px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-950 dark:bg-neutral-50" />
                    {PROFILE.role}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-xs text-neutral-600 dark:text-neutral-400">
                    <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
                    {PROFILE.location}
                  </span>
                </div>

                <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl dark:text-neutral-50">
                  {PROFILE.name}
                </h1>

                <p className="mt-4 text-lg font-medium leading-snug text-neutral-800 sm:text-xl dark:text-neutral-200">
                  {PROFILE.headline}
                </p>

                <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {PROFILE.summary}
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <a
                    href="#projects"
                    className="inline-flex items-center gap-2 rounded border border-neutral-950 bg-neutral-950 px-4 py-2.5 font-mono text-xs font-medium text-neutral-50 transition-colors hover:bg-neutral-800 dark:border-neutral-50 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200"
                  >
                    <span>Explore Pipelines</span>
                    <ArrowDownRight className="h-3.5 w-3.5" strokeWidth={1.8} />
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-2 rounded border border-neutral-300 bg-white px-4 py-2.5 font-mono text-xs text-neutral-800 transition-colors hover:border-neutral-950 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-400"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5" strokeWidth={1.8} />
                        <span>Email Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" strokeWidth={1.8} />
                        <span>{PROFILE.email}</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <a
                      href={PROFILE.links.github}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="GitHub profile"
                      className="inline-flex h-9 w-9 items-center justify-center rounded border border-neutral-300 bg-white text-neutral-700 transition-colors hover:border-neutral-950 hover:text-neutral-950 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-400 dark:hover:text-neutral-50"
                    >
                      <GitHubIcon className="h-4 w-4" />
                    </a>
                    <a
                      href={PROFILE.links.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="LinkedIn profile"
                      className="inline-flex h-9 w-9 items-center justify-center rounded border border-neutral-300 bg-white text-neutral-700 transition-colors hover:border-neutral-950 hover:text-neutral-950 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-400 dark:hover:text-neutral-50"
                    >
                      <LinkedInIcon className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                {/* Metrics Strip */}
                <div className="mt-10 grid grid-cols-3 gap-3 border-t border-neutral-200 pt-6 dark:border-neutral-800">
                  {PROFILE.metrics.map((metric) => (
                    <div key={metric.label}>
                      <div className="font-mono text-xl font-semibold tracking-tight text-neutral-950 sm:text-2xl dark:text-neutral-50">
                        {metric.value}
                      </div>
                      <div className="mt-1 text-[11px] leading-snug text-neutral-600 dark:text-neutral-400">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-6">
                <PipelineTopology />
              </div>
            </div>
          </div>
        </section>

        <ProjectsSection
          expandedProjectId={expandedProjectId}
          onToggleProject={(id) =>
            setExpandedProjectId((prev) => (prev === id ? null : id))
          }
        />

        <ExperienceSection />

        <StackSection />
      </main>

      <ContactFooter copied={copied} onCopyEmail={handleCopyEmail} />

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onSelectTheme={setPreference}
        onInspectProject={handleInspectProject}
        onCopyEmail={handleCopyEmail}
      />
    </div>
  )
}

export default App
