import { useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  Database,
  GitBranch,
  Layers,
  Radio,
  Server,
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

interface ProjectsPageProps {
  activeProjectId: string | null
  onNavigate: (path: string) => void
}

export function ProjectsPage({ activeProjectId, onNavigate }: ProjectsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('All')

  const filteredProjects =
    selectedCategory === 'All'
      ? PROJECTS
      : PROJECTS.filter((project) => project.category === selectedCategory)

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 flex flex-col justify-between gap-6 border-b border-neutral-200 pb-8 lg:flex-row lg:items-end dark:border-neutral-800">
          <div>
            <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              <Database className="h-3.5 w-3.5" strokeWidth={1.8} />
              <span>01 // Pipeline Blueprints</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl dark:text-neutral-50">
              Data Engineering Projects
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              Click any project card to open its full engineering specification: end-to-end
              lineage, physical schema contracts, data quality gates, and transformation code.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Filter projects by architecture type"
            className="flex flex-wrap gap-1.5"
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
                  className={`rounded border px-3 py-1.5 font-mono text-xs transition-colors ${
                    active
                      ? 'border-neutral-950 bg-neutral-950 text-neutral-50 dark:border-neutral-50 dark:bg-neutral-50 dark:text-neutral-950'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-neutral-50'
                  }`}
                >
                  {category}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {filteredProjects.map((project: ProjectItem) => {
            const CategoryIcon = CATEGORY_ICONS[project.category]

            return (
              <article
                key={project.id}
                onClick={() => onNavigate(`/projects/${project.id}`)}
                className="group flex cursor-pointer flex-col justify-between rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-950 sm:p-6 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-neutral-400"
              >
                <div>
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                      <span className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-neutral-800 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200">
                        {project.code}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <CategoryIcon className="h-3 w-3" strokeWidth={1.8} />
                        {project.category}
                      </span>
                      <span>·</span>
                      <span>{project.year}</span>
                    </div>

                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`View ${project.title} repository on GitHub`}
                        className="inline-flex items-center gap-1 rounded border border-neutral-200 px-2 py-1 font-mono text-[11px] text-neutral-600 transition-colors hover:border-neutral-950 hover:text-neutral-950 dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-50 dark:hover:text-neutral-50"
                      >
                        <GitHubIcon className="h-3 w-3" />
                        <span>Repo</span>
                        <ArrowUpRight className="h-3 w-3" strokeWidth={1.8} />
                      </a>
                    )}
                  </div>

                  <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
                    {project.title}
                  </h2>
                  <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    {project.context}
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                    {project.summary}
                  </p>

                  {/* Compact DE Telemetry Strip */}
                  <div className="mt-4 grid grid-cols-2 gap-2 rounded border border-neutral-200 bg-neutral-50 p-3 font-mono text-[10px] dark:border-neutral-800 dark:bg-neutral-950">
                    <div>
                      <span className="text-neutral-500">ENGINE: </span>
                      <span className="text-neutral-800 dark:text-neutral-200">
                        {project.computeEngine}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500">INGEST: </span>
                      <span className="text-neutral-800 dark:text-neutral-200">
                        {project.ingestionMode}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-neutral-500">GRAIN: </span>
                      <span className="text-neutral-800 dark:text-neutral-200">
                        {project.grain}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-4 dark:border-neutral-800">
                  <div className="flex flex-wrap gap-1.5">
                    {project.stack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-mono text-[10px] text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onNavigate(`/projects/${project.id}`)
                    }}
                    className="inline-flex items-center gap-1.5 rounded border border-neutral-300 bg-neutral-50 px-2.5 py-1 font-mono text-[11px] font-medium text-neutral-900 transition-colors group-hover:border-neutral-950 group-hover:bg-neutral-950 group-hover:text-neutral-50 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:group-hover:border-neutral-50 dark:group-hover:bg-neutral-50 dark:group-hover:text-neutral-950"
                  >
                    <GitBranch className="h-3 w-3" strokeWidth={1.8} />
                    <span>Open Data Spec</span>
                    <ArrowRight className="h-3 w-3" strokeWidth={1.8} />
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </div>

      {activeProjectId && (
        <ProjectDetailModalPage
          projectId={activeProjectId}
          onClose={() => onNavigate('/projects')}
          onSelectProject={(id) => onNavigate(`/projects/${id}`)}
        />
      )}
    </section>
  )
}
