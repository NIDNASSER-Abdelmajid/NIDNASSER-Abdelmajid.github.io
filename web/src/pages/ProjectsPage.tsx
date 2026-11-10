import { useMemo, useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Database,
  Layers,
  Radio,
  RotateCcw,
  Search,
  Server,
  X,
} from 'lucide-react'
import { GitHubIcon } from '../components/BrandIcons'
import { ProjectDetailModalPage } from '../components/ProjectDetailModalPage'
import { PROJECTS } from '../data/portfolio'
import type { ProjectCategory, ProjectItem } from '../types/portfolio'

const CATEGORIES: ProjectCategory[] = [
  'All',
  'Lakehouse & ETL',
  'Streaming',
  'Crawling & Extraction',
]

const CATEGORY_ICONS: Record<Exclude<ProjectCategory, 'All'>, typeof Database> = {
  'Lakehouse & ETL': Layers,
  Streaming: Radio,
  'Crawling & Extraction': Server,
}

const TOOL_FILTERS = [
  'All Tools',
  'Python',
  'Apache Spark',
  'SQL',
  'Databricks',
  'PostgreSQL',
  'Apache Kafka',
  'Scrapy',
  'FastAPI',
]

interface ProjectsPageProps {
  activeProjectId: string | null
  onNavigate: (path: string) => void
}

export function ProjectsPage({ activeProjectId, onNavigate }: ProjectsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('All')
  const [selectedTool, setSelectedTool] = useState<string>('All Tools')
  const [onlyWithArticle, setOnlyWithArticle] = useState(false)
  const [query, setQuery] = useState('')

  const categoryCounts = useMemo(() => {
    const map: Record<ProjectCategory, number> = {
      All: PROJECTS.length,
      'Lakehouse & ETL': 0,
      Streaming: 0,
      'Crawling & Extraction': 0,
    }
    for (const p of PROJECTS) {
      map[p.category] = (map[p.category] ?? 0) + 1
    }
    return map
  }, [])

  const filteredProjects = useMemo(() => {
    const q = query.trim().toLowerCase()
    return PROJECTS.filter((project) => {
      const matchesCat = selectedCategory === 'All' || project.category === selectedCategory
      const matchesTool =
        selectedTool === 'All Tools' ||
        project.stack.some((t) => t.toLowerCase() === selectedTool.toLowerCase()) ||
        (selectedTool === 'Apache Spark' && project.stack.includes('PySpark'))
      const matchesArticle = !onlyWithArticle || Boolean(project.articleSlug)
      const matchesQuery =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.summary.toLowerCase().includes(q) ||
        project.context.toLowerCase().includes(q) ||
        project.stack.some((t) => t.toLowerCase().includes(q))
      return matchesCat && matchesTool && matchesArticle && matchesQuery
    })
  }, [onlyWithArticle, query, selectedCategory, selectedTool])

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedTool !== 'All Tools' ||
    onlyWithArticle ||
    query.trim().length > 0

  const resetFilters = () => {
    setSelectedCategory('All')
    setSelectedTool('All Tools')
    setOnlyWithArticle(false)
    setQuery('')
  }

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <div className="mb-8 border-b border-neutral-200 pb-7 dark:border-neutral-800">
          <div className="flex flex-col justify-between gap-6 @4xl:flex-row @4xl:items-end">
            <div>
              <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                <Database className="h-3.5 w-3.5" strokeWidth={1.8} />
                <span>01 // Project Wiki</span>
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl dark:text-neutral-50">
                Projects
              </h1>
              <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
                Open any project card to read its walkthrough, decisions, and outcomes.
              </p>
            </div>

            <div className="relative w-full @4xl:w-72">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400"
                strokeWidth={1.8}
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects or tools..."
                aria-label="Search projects"
                className="w-full rounded-lg border border-neutral-200 bg-white py-2 pr-8 pl-9 font-mono text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50 dark:focus:border-neutral-400"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-50"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={1.8} />
                </button>
              )}
            </div>
          </div>

          {/* Multi-Facet Filter Bar: Categories + Tools + Has Article */}
          <div className="mt-6 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div
                role="tablist"
                aria-label="Filter projects by category"
                className="flex flex-wrap gap-2"
              >
                {CATEGORIES.map((category) => {
                  const active = selectedCategory === category
                  return (
                    <button
                      key={category}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setSelectedCategory(category)}
                      className={`rounded-md px-3 py-1.5 font-mono text-xs transition-colors ${
                        active
                          ? 'bg-neutral-950 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-950'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-950 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-50'
                      }`}
                    >
                      {category} ({categoryCounts[category]})
                    </button>
                  )
                })}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setOnlyWithArticle((prev) => !prev)}
                  className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-xs transition-colors ${
                    onlyWithArticle
                      ? 'border-neutral-950 bg-neutral-950 text-neutral-50 dark:border-neutral-50 dark:bg-neutral-50 dark:text-neutral-950'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-600'
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5" strokeWidth={1.8} />
                  <span>Has Article</span>
                </button>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 font-mono text-xs text-neutral-500 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-50"
                  >
                    <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.8} />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {TOOL_FILTERS.map((tool) => {
                const active = selectedTool === tool
                return (
                  <button
                    key={tool}
                    type="button"
                    onClick={() => setSelectedTool(tool)}
                    className={`rounded px-2.5 py-1 font-mono text-xs transition-colors ${
                      active
                        ? 'bg-neutral-900 text-neutral-50 dark:bg-neutral-200 dark:text-neutral-950'
                        : 'bg-neutral-100/80 text-neutral-600 hover:bg-neutral-200/80 dark:bg-neutral-900/70 dark:text-neutral-400 dark:hover:bg-neutral-800'
                    }`}
                  >
                    {tool}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between font-mono text-xs text-neutral-500 dark:text-neutral-400">
          <span>
            Showing {filteredProjects.length} of {PROJECTS.length} projects
          </span>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 bg-white p-10 text-center dark:border-neutral-800 dark:bg-neutral-900/50">
            <p className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
              No projects match your current filters.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-neutral-950 px-4 py-2 font-mono text-xs text-neutral-50 dark:bg-neutral-50 dark:text-neutral-950"
            >
              <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.8} />
              <span>Reset Filters</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 @3xl:grid-cols-2 @3xl:gap-8">
            {filteredProjects.map((project: ProjectItem) => {
              const CategoryIcon = CATEGORY_ICONS[project.category]

              return (
                <article
                  key={project.id}
                  onClick={() => onNavigate(`/projects/${project.id}`)}
                  className="group flex cursor-pointer flex-col justify-between rounded-xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-950 sm:p-7 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-neutral-400"
                >
                  <div>
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-2.5 pt-1 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {project.code}
                        </span>
                        <span>·</span>
                        <span className="inline-flex items-center gap-1.5">
                          <CategoryIcon className="h-3.5 w-3.5" strokeWidth={1.8} />
                          {project.category}
                        </span>
                        <span>·</span>
                        <span>{project.year}</span>
                      </div>

                      {/* Vertical Action Stack: Repo on top, Article directly underneath when available */}
                      {(project.repoUrl || project.articleSlug) && (
                        <div className="flex shrink-0 flex-col items-end gap-1.5">
                          {project.repoUrl && (
                            <a
                              href={project.repoUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              aria-label={`View ${project.title} repository on GitHub`}
                              className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2.5 py-1 font-mono text-xs text-neutral-700 transition-colors hover:bg-neutral-950 hover:text-neutral-50 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-50 dark:hover:text-neutral-950"
                            >
                              <GitHubIcon className="h-3.5 w-3.5" />
                              <span>Repo</span>
                              <ArrowUpRight className="h-3 w-3" strokeWidth={1.8} />
                            </a>
                          )}

                          {project.articleSlug && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                onNavigate(`/blog/${project.articleSlug}`)
                              }}
                              aria-label={`Read article for ${project.title}`}
                              className="inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-white px-2.5 py-1 font-mono text-xs text-neutral-800 transition-colors hover:border-neutral-950 hover:bg-neutral-950 hover:text-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-50 dark:hover:bg-neutral-50 dark:hover:text-neutral-950"
                            >
                              <BookOpen className="h-3.5 w-3.5" strokeWidth={1.8} />
                              <span>Article</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <h2 className="text-xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
                      {project.title}
                    </h2>

                    <p className="mt-2.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                      {project.summary}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200/80 pt-4 dark:border-neutral-800">
                    <div className="flex flex-wrap gap-1.5">
                      {project.stack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="rounded bg-neutral-100 px-2.5 py-1 font-mono text-xs text-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-neutral-900 transition-transform group-hover:translate-x-0.5 dark:text-neutral-100">
                      <span>Open Wiki</span>
                      <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.8} />
                    </span>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>

      {activeProjectId && (
        <ProjectDetailModalPage
          projectId={activeProjectId}
          onClose={() => onNavigate('/projects')}
          onSelectProject={(id) => onNavigate(`/projects/${id}`)}
          onOpenArticle={(slug) => onNavigate(`/blog/${slug}`)}
        />
      )}
    </section>
  )
}
