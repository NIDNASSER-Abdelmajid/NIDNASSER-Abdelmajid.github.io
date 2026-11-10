import { useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Database,
  GitBranch,
  Layers,
  Radio,
  Server,
} from 'lucide-react'
import { GitHubIcon } from './BrandIcons'
import {
  PROJECTS,
  type ProjectCategory,
  type ProjectItem,
} from '../data/portfolio'

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

interface ProjectsSectionProps {
  expandedProjectId: string | null
  onToggleProject: (id: string) => void
}

export function ProjectsSection({
  expandedProjectId,
  onToggleProject,
}: ProjectsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('All')

  const filteredProjects =
    selectedCategory === 'All'
      ? PROJECTS
      : PROJECTS.filter((project) => project.category === selectedCategory)

  return (
    <section
      id="projects"
      className="border-t border-neutral-200 py-20 sm:py-24 dark:border-neutral-800"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              <Database className="h-3.5 w-3.5" strokeWidth={1.8} />
              <span>02 // Pipeline Blueprints</span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl dark:text-neutral-50">
              Selected Data Engineering Work
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              Production and showcase pipelines across lakehouse modeling, event streaming,
              and large-scale automated extraction. Inspect any card to view its underlying
              data lineage.
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
            const isExpanded = expandedProjectId === project.id

            return (
              <article
                key={project.id}
                id={`project-${project.id}`}
                className="flex flex-col justify-between rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-400 sm:p-6 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-neutral-600"
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
                        aria-label={`View ${project.title} repository on GitHub`}
                        className="inline-flex items-center gap-1 rounded border border-neutral-200 px-2 py-1 font-mono text-[11px] text-neutral-600 transition-colors hover:border-neutral-950 hover:text-neutral-950 dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-50 dark:hover:text-neutral-50"
                      >
                        <GitHubIcon className="h-3 w-3" />
                        <span>Repo</span>
                        <ArrowUpRight className="h-3 w-3" strokeWidth={1.8} />
                      </a>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
                    {project.title}
                  </h3>
                  <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    {project.context}
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                    {project.summary}
                  </p>

                  <ul className="mt-4 space-y-2 border-t border-neutral-100 pt-4 dark:border-neutral-800/80">
                    {project.impact.map((line) => (
                      <li
                        key={line}
                        className="flex items-start gap-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400"
                      >
                        <ArrowRight
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neutral-400 dark:text-neutral-500"
                          strokeWidth={1.8}
                        />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      {project.stack.map((tech) => (
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
                      onClick={() => onToggleProject(project.id)}
                      aria-expanded={isExpanded}
                      className="inline-flex items-center gap-1.5 rounded border border-neutral-300 bg-neutral-50 px-2.5 py-1 font-mono text-[11px] font-medium text-neutral-900 transition-colors hover:border-neutral-950 hover:bg-neutral-950 hover:text-neutral-50 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:border-neutral-50 dark:hover:bg-neutral-50 dark:hover:text-neutral-950"
                    >
                      <GitBranch className="h-3 w-3" strokeWidth={1.8} />
                      <span>{isExpanded ? 'Hide Lineage' : 'Inspect Lineage'}</span>
                      {isExpanded ? (
                        <ChevronUp className="h-3 w-3" strokeWidth={1.8} />
                      ) : (
                        <ChevronDown className="h-3 w-3" strokeWidth={1.8} />
                      )}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 rounded border border-neutral-200 bg-neutral-50 p-3.5 dark:border-neutral-800 dark:bg-neutral-950">
                      <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                        Data Flow & Architecture Blueprint
                      </div>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {project.architecture.map((node) => (
                          <div
                            key={node.layer}
                            className="rounded border border-neutral-200 bg-white p-2.5 dark:border-neutral-800 dark:bg-neutral-900"
                          >
                            <div className="font-mono text-[10px] text-neutral-500 dark:text-neutral-400">
                              {node.layer}
                            </div>
                            <div className="mt-0.5 text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                              {node.component}
                            </div>
                            <div className="mt-1 text-[11px] leading-snug text-neutral-600 dark:text-neutral-400">
                              {node.detail}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 rounded border border-dashed border-neutral-300 bg-white px-2.5 py-2 font-mono text-[10px] text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900/70 dark:text-neutral-300">
                        {project.schemaNote}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
