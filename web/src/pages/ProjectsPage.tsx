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
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 flex flex-col justify-between gap-6 border-b border-neutral-200 pb-8 lg:flex-row lg:items-end dark:border-neutral-800">
          <div>
            <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              <Database className="h-3.5 w-3.5" strokeWidth={1.8} />
              <span>01 // Pipeline Blueprints</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl dark:text-neutral-50">
              Projects
            </h1>
            <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
              Select a pipeline to inspect its lineage graph, ERD schema contracts, and quality gates.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Filter projects by architecture type"
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
                  {category}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {filteredProjects.map((project: ProjectItem) => {
            const CategoryIcon = CATEGORY_ICONS[project.category]

            return (
              <article
                key={project.id}
                onClick={() => onNavigate(`/projects/${project.id}`)}
                className="group flex cursor-pointer flex-col justify-between rounded-xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-950 sm:p-7 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-neutral-400"
              >
                <div>
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs text-neutral-500 dark:text-neutral-400">
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
                  </div>

                  <h2 className="text-xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
                    {project.title}
                  </h2>

                  <p className="mt-2.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                    {project.summary}
                  </p>

                  {/* Single Inline Spec Line (No nested boxes) */}
                  <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                    <span>{project.computeEngine}</span>
                    <span>·</span>
                    <span>{project.ingestionMode}</span>
                    <span>·</span>
                    <span>{project.sla}</span>
                  </div>
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
                    <GitBranch className="h-3.5 w-3.5" strokeWidth={1.8} />
                    <span>Inspect Spec</span>
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.8} />
                  </span>
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
