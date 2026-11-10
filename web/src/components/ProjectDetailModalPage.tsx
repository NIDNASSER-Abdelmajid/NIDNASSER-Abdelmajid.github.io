import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Code2,
  Copy,
  Database,
  GitBranch,
  Layers,
  ShieldCheck,
  Table2,
  X,
} from 'lucide-react'
import { PROJECTS } from '../data/portfolio'
import { GitHubIcon } from './BrandIcons'

interface ProjectDetailModalPageProps {
  projectId: string
  onClose: () => void
  onSelectProject: (id: string) => void
}

export function ProjectDetailModalPage({
  projectId,
  onClose,
  onSelectProject,
}: ProjectDetailModalPageProps) {
  const index = PROJECTS.findIndex((p) => p.id === projectId)
  const project = index >= 0 ? PROJECTS[index] : PROJECTS[0]
  const prevProject = index > 0 ? PROJECTS[index - 1] : null
  const nextProject = index < PROJECTS.length - 1 ? PROJECTS[index + 1] : null

  const [selectedStageIdx, setSelectedStageIdx] = useState(0)
  const [schemaView, setSchemaView] = useState<'erd' | 'table'>('erd')
  const [copiedCode, setCopiedCode] = useState(false)

  useEffect(() => {
    setSelectedStageIdx(0)
    setSchemaView('erd')
    setCopiedCode(false)
  }, [project.id])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const activeStage = project.architecture[selectedStageIdx] ?? project.architecture[0]

  const copySnippet = () => {
    navigator.clipboard?.writeText(project.codeSnippet.content).catch(() => {})
    setCopiedCode(true)
    window.setTimeout(() => setCopiedCode(false), 1800)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Pipeline specification for ${project.title}`}
      className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/75 p-2 backdrop-blur-xs sm:p-6"
      onClick={onClose}
    >
      <div
        className="mx-auto my-2 max-w-5xl overflow-hidden rounded-xl border border-neutral-300 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-950"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Sticky Spec Bar */}
        <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 bg-white/95 px-5 py-3.5 backdrop-blur-md sm:px-8 dark:border-neutral-800 dark:bg-neutral-950/95">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-md bg-neutral-100 px-3 py-1.5 font-mono text-xs text-neutral-800 transition-colors hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
              <span>Projects</span>
            </button>
            <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
              {project.code} // DATA SPEC
            </span>
          </div>

          <div className="flex items-center gap-2">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md bg-neutral-100 px-3 py-1.5 font-mono text-xs text-neutral-800 transition-colors hover:bg-neutral-950 hover:text-neutral-50 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-50 dark:hover:text-neutral-950"
              >
                <GitHubIcon className="h-3.5 w-3.5" />
                <span>Repository</span>
                <ArrowUpRight className="h-3 w-3" strokeWidth={1.8} />
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close specification page"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-neutral-100 text-neutral-600 transition-colors hover:bg-neutral-200 hover:text-neutral-950 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
            >
              <X className="h-4 w-4" strokeWidth={1.8} />
            </button>
          </div>
        </div>

        <div className="divide-y divide-neutral-200 px-5 sm:px-8 dark:divide-neutral-800">
          {/* 1. Header & Flat Spec Rail */}
          <div className="py-8">
            <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs text-neutral-500 dark:text-neutral-400">
              <span className="rounded bg-neutral-100 px-2.5 py-0.5 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100">
                {project.category}
              </span>
              <span>·</span>
              <span>{project.context}</span>
              <span>·</span>
              <span>{project.year}</span>
            </div>

            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl dark:text-neutral-50">
              {project.title}
            </h1>
            <p className="mt-2.5 max-w-3xl text-sm sm:text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
              {project.summary}
            </p>

            {/* Flat hairline key-value spec strip (zero nested boxes) */}
            <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-neutral-200 pt-5 sm:grid-cols-3 lg:grid-cols-6 dark:border-neutral-800">
              {[
                { label: 'Ingestion', value: project.ingestionMode },
                { label: 'Engine', value: project.computeEngine },
                { label: 'Orchestration', value: project.orchestration },
                { label: 'Sink', value: project.storageSink },
                { label: 'Grain', value: project.grain },
                { label: 'Cadence', value: project.sla },
              ].map((spec) => (
                <div key={spec.label}>
                  <dt className="font-mono text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    {spec.label}
                  </dt>
                  <dd className="mt-1 text-xs sm:text-sm font-medium text-neutral-950 dark:text-neutral-50">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* 2. Interactive Visual Lineage Flow */}
          <div className="py-8">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
                <GitBranch className="h-4 w-4" strokeWidth={1.8} />
                <span>Pipeline Lineage</span>
              </div>
              <span className="font-mono text-xs text-neutral-500">Click stage</span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {project.architecture.map((node, idx) => {
                const selected = idx === selectedStageIdx
                return (
                  <div key={node.layer} className="flex items-stretch gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedStageIdx(idx)}
                      className={`flex-1 rounded-lg p-4 text-left transition-colors ${
                        selected
                          ? 'bg-neutral-950 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-950'
                          : 'bg-neutral-100/80 text-neutral-900 hover:bg-neutral-200/70 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800'
                      }`}
                    >
                      <div
                        className={`font-mono text-xs ${
                          selected
                            ? 'text-neutral-400 dark:text-neutral-600'
                            : 'text-neutral-500 dark:text-neutral-400'
                        }`}
                      >
                        {node.layer}
                      </div>
                      <div className="mt-1 text-sm font-semibold">{node.component}</div>
                      <div
                        className={`mt-2 inline-block rounded px-2 py-0.5 font-mono text-xs ${
                          selected
                            ? 'bg-neutral-800 text-neutral-200 dark:bg-neutral-200 dark:text-neutral-900'
                            : 'bg-white text-neutral-600 dark:bg-neutral-950 dark:text-neutral-400'
                        }`}
                      >
                        {node.format}
                      </div>
                    </button>
                    {idx < project.architecture.length - 1 && (
                      <div className="hidden items-center text-neutral-400 lg:flex dark:text-neutral-600">
                        <ArrowRight className="h-4 w-4" strokeWidth={1.6} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="mt-4 flex flex-col justify-between gap-3 rounded-lg bg-neutral-100/70 p-4 sm:flex-row sm:items-center dark:bg-neutral-900/60">
              <p className="text-sm text-neutral-700 dark:text-neutral-300">{activeStage.detail}</p>
              <div className="flex flex-wrap gap-1.5">
                {activeStage.tablesOrTopics.map((entity) => (
                  <span
                    key={entity}
                    className="rounded bg-white px-2.5 py-1 font-mono text-xs text-neutral-800 dark:bg-neutral-950 dark:text-neutral-200"
                  >
                    {entity}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Visual ERD & Schema Contract */}
          <div className="py-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
                <Table2 className="h-4 w-4" strokeWidth={1.8} />
                <span>Schema &amp; Relationships</span>
              </div>

              <div className="inline-flex rounded-md bg-neutral-100 p-1 dark:bg-neutral-900">
                <button
                  type="button"
                  onClick={() => setSchemaView('erd')}
                  className={`rounded px-3 py-1 font-mono text-xs transition-colors ${
                    schemaView === 'erd'
                      ? 'bg-neutral-950 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-950'
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  Visual ERD
                </button>
                <button
                  type="button"
                  onClick={() => setSchemaView('table')}
                  className={`rounded px-3 py-1 font-mono text-xs transition-colors ${
                    schemaView === 'table'
                      ? 'bg-neutral-950 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-950'
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  Contract Table
                </button>
              </div>
            </div>

            {schemaView === 'erd' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {project.schemas.map((schema) => (
                    <div
                      key={schema.tableName}
                      className="overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50/70 dark:border-neutral-800 dark:bg-neutral-900/50"
                    >
                      <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-100/80 px-4 py-2.5 dark:border-neutral-800 dark:bg-neutral-900">
                        <span className="font-mono text-xs font-semibold text-neutral-950 dark:text-neutral-50">
                          {schema.tableName}
                        </span>
                        <span className="font-mono text-xs text-neutral-500">{schema.layer}</span>
                      </div>

                      <div className="divide-y divide-neutral-200/70 px-4 dark:divide-neutral-800/80">
                        {schema.columns.map((col) => (
                          <div
                            key={col.name}
                            className="flex items-center justify-between gap-2 py-2 font-mono text-xs"
                          >
                            <div className="flex items-center gap-2 truncate">
                              {col.keyFlag && (
                                <span
                                  className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ${
                                    col.keyFlag === 'PK'
                                      ? 'bg-neutral-950 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-950'
                                      : 'bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200'
                                  }`}
                                >
                                  {col.keyFlag}
                                </span>
                              )}
                              <span className="truncate text-neutral-900 dark:text-neutral-100">
                                {col.name}
                              </span>
                            </div>
                            <span className="shrink-0 text-neutral-500 dark:text-neutral-400">
                              {col.type}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-neutral-200 bg-white/60 px-4 py-2 font-mono text-xs text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950/60 dark:text-neutral-400">
                        {schema.partitionOrCluster}
                      </div>
                    </div>
                  ))}
                </div>

                {project.relations.length > 0 && (
                  <div className="flex flex-wrap gap-3 pt-1">
                    {project.relations.map((rel) => (
                      <div
                        key={`${rel.fromTable}.${rel.fromColumn}`}
                        className="inline-flex items-center gap-2 rounded-md bg-neutral-100 px-3 py-1.5 font-mono text-xs text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200"
                      >
                        <span>
                          {rel.fromTable}.{rel.fromColumn}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-neutral-500" strokeWidth={1.8} />
                        <span>
                          {rel.toTable}.{rel.toColumn}
                        </span>
                        <span className="rounded bg-neutral-200 px-1.5 py-0.5 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100">
                          {rel.cardinality}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50 font-mono text-xs uppercase tracking-wider text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                      <th className="px-4 py-3">Table</th>
                      <th className="px-4 py-3">PK</th>
                      <th className="px-4 py-3">Physical Layout</th>
                      <th className="px-4 py-3">Write Mode</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 text-xs sm:text-sm dark:divide-neutral-800">
                    {project.schemas.map((schema) => (
                      <tr key={schema.tableName}>
                        <td className="px-4 py-3 font-mono font-medium text-neutral-950 dark:text-neutral-50">
                          {schema.tableName}
                        </td>
                        <td className="px-4 py-3 font-mono text-neutral-700 dark:text-neutral-300">
                          {schema.primaryKey}
                        </td>
                        <td className="px-4 py-3 font-mono text-neutral-600 dark:text-neutral-400">
                          {schema.partitionOrCluster}
                        </td>
                        <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">
                          {schema.updateMode}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* 4. Quality Gates Assertion Matrix + Transformation Code */}
          <div className="grid grid-cols-1 gap-8 py-8 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
                  <Code2 className="h-4 w-4" strokeWidth={1.8} />
                  <span>{project.codeSnippet.filename}</span>
                </div>
                <button
                  type="button"
                  onClick={copySnippet}
                  className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2.5 py-1 font-mono text-xs text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
                >
                  {copiedCode ? (
                    <>
                      <Check className="h-3.5 w-3.5" strokeWidth={1.8} />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" strokeWidth={1.8} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="overflow-x-auto rounded-lg bg-neutral-100/80 p-4 font-mono text-xs leading-relaxed text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
                <code>{project.codeSnippet.content}</code>
              </pre>
            </div>

            <div className="lg:col-span-6">
              <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
                <ShieldCheck className="h-4 w-4" strokeWidth={1.8} />
                <span>Quality Gates</span>
              </div>
              <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50 font-mono text-[11px] uppercase tracking-wider text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                      <th className="px-3.5 py-2.5">Boundary</th>
                      <th className="px-3.5 py-2.5">Contract</th>
                      <th className="px-3.5 py-2.5">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 text-xs dark:divide-neutral-800">
                    {project.qualityGates.map((gate) => (
                      <tr key={gate.contract}>
                        <td className="whitespace-nowrap px-3.5 py-3 font-mono text-neutral-600 dark:text-neutral-400">
                          {gate.boundary}
                        </td>
                        <td className="px-3.5 py-3 font-mono font-medium text-neutral-950 dark:text-neutral-50">
                          {gate.contract}
                        </td>
                        <td className="px-3.5 py-3 text-neutral-700 dark:text-neutral-300">
                          {gate.enforcement}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 5. Architecture Decisions & Outcomes */}
          <div className="grid grid-cols-1 gap-8 py-8 lg:grid-cols-2">
            <div>
              <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
                <Layers className="h-4 w-4" strokeWidth={1.8} />
                <span>Architecture Decisions</span>
              </div>
              <dl className="space-y-4">
                {project.decisions.map((d) => (
                  <div key={d.choice}>
                    <dt className="text-sm font-semibold text-neutral-950 dark:text-neutral-50">
                      {d.choice}
                    </dt>
                    <dd className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {d.rationale}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
                <Database className="h-4 w-4" strokeWidth={1.8} />
                <span>Impact</span>
              </div>
              <ul className="space-y-3">
                {project.impact.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300"
                  >
                    <ArrowRight
                      className="mt-1 h-3.5 w-3.5 shrink-0 text-neutral-400"
                      strokeWidth={1.8}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Prev / Next Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 py-6">
            <div>
              {prevProject && (
                <button
                  type="button"
                  onClick={() => onSelectProject(prevProject.id)}
                  className="inline-flex items-center gap-2 rounded-md bg-neutral-100 px-3.5 py-2 font-mono text-xs text-neutral-800 transition-colors hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
                  <span>{prevProject.code}: {prevProject.title}</span>
                </button>
              )}
            </div>
            <div>
              {nextProject && (
                <button
                  type="button"
                  onClick={() => onSelectProject(nextProject.id)}
                  className="inline-flex items-center gap-2 rounded-md bg-neutral-100 px-3.5 py-2 font-mono text-xs text-neutral-800 transition-colors hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  <span>{nextProject.code}: {nextProject.title}</span>
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.8} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
