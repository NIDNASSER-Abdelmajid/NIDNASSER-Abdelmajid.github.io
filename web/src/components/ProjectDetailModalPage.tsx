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
  const [selectedSchemaIdx, setSelectedSchemaIdx] = useState(0)
  const [copiedCode, setCopiedCode] = useState(false)

  useEffect(() => {
    setSelectedStageIdx(0)
    setSelectedSchemaIdx(0)
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
  const activeSchema = project.schemas[selectedSchemaIdx] ?? project.schemas[0]

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
        className="mx-auto my-2 max-w-5xl overflow-hidden rounded-lg border border-neutral-300 bg-neutral-50 shadow-2xl dark:border-neutral-700 dark:bg-neutral-950"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Sticky Spec Bar */}
        <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur-md sm:px-6 dark:border-neutral-800 dark:bg-neutral-900/95">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded border border-neutral-300 bg-neutral-50 px-2.5 py-1 font-mono text-xs text-neutral-800 transition-colors hover:border-neutral-950 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:border-neutral-400"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
              <span>All Projects</span>
            </button>
            <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
              {project.code} / DATA SPEC
            </span>
          </div>

          <div className="flex items-center gap-2">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded border border-neutral-200 bg-neutral-50 px-2.5 py-1 font-mono text-xs text-neutral-700 transition-colors hover:border-neutral-950 hover:text-neutral-950 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:border-neutral-400 dark:hover:text-neutral-50"
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
              className="inline-flex h-8 w-8 items-center justify-center rounded border border-neutral-200 bg-neutral-50 text-neutral-600 transition-colors hover:border-neutral-950 hover:text-neutral-950 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:border-neutral-400 dark:hover:text-neutral-50"
            >
              <X className="h-4 w-4" strokeWidth={1.8} />
            </button>
          </div>
        </div>

        <div className="space-y-8 p-4 sm:p-8">
          {/* Header & Pipeline SLA Metadata */}
          <div>
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              <span className="rounded border border-neutral-300 bg-white px-2 py-0.5 text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100">
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
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              {project.summary}
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { label: 'INGESTION MODE', value: project.ingestionMode },
                { label: 'COMPUTE ENGINE', value: project.computeEngine },
                { label: 'ORCHESTRATION', value: project.orchestration },
                { label: 'STORAGE SINK', value: project.storageSink },
                { label: 'DATA GRAIN', value: project.grain },
                { label: 'CADENCE / SLA', value: project.sla },
              ].map((spec) => (
                <div
                  key={spec.label}
                  className="rounded border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900/60"
                >
                  <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                    {spec.label}
                  </div>
                  <div className="mt-1 font-mono text-xs font-medium text-neutral-950 dark:text-neutral-50">
                    {spec.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Stage Lineage DAG */}
          <div className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900/50">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                <GitBranch className="h-4 w-4" strokeWidth={1.8} />
                <span>End-to-End Data Lineage</span>
              </div>
              <span className="font-mono text-[10px] text-neutral-500">
                Select stage to inspect storage &amp; contracts
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {project.architecture.map((node, idx) => {
                const selected = idx === selectedStageIdx
                return (
                  <button
                    key={node.layer}
                    type="button"
                    onClick={() => setSelectedStageIdx(idx)}
                    className={`rounded border p-3.5 text-left transition-colors ${
                      selected
                        ? 'border-neutral-950 bg-neutral-950 text-neutral-50 dark:border-neutral-50 dark:bg-neutral-50 dark:text-neutral-950'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-900 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:border-neutral-600'
                    }`}
                  >
                    <div
                      className={`font-mono text-[10px] tracking-widest ${
                        selected
                          ? 'text-neutral-300 dark:text-neutral-600'
                          : 'text-neutral-500 dark:text-neutral-400'
                      }`}
                    >
                      {node.layer}
                    </div>
                    <div className="mt-1 text-xs font-semibold">{node.component}</div>
                    <div
                      className={`mt-2 inline-block rounded border px-1.5 py-0.5 font-mono text-[10px] ${
                        selected
                          ? 'border-neutral-700 bg-neutral-900 text-neutral-200 dark:border-neutral-300 dark:bg-neutral-200 dark:text-neutral-900'
                          : 'border-neutral-200 bg-white text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400'
                      }`}
                    >
                      {node.format}
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="mt-4 rounded border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-950">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs font-semibold text-neutral-950 dark:text-neutral-50">
                  {activeStage.layer}: {activeStage.component}
                </span>
                <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                  Format: {activeStage.format}
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                {activeStage.detail}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {activeStage.tablesOrTopics.map((entity) => (
                  <span
                    key={entity}
                    className="rounded border border-neutral-200 bg-white px-2 py-0.5 font-mono text-[11px] text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200"
                  >
                    {entity}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Schema Catalog / INFORMATION_SCHEMA */}
          {activeSchema && (
            <div className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900/50">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                  <Table2 className="h-4 w-4" strokeWidth={1.8} />
                  <span>Schema Contract &amp; Physical Layout</span>
                </div>

                {project.schemas.length > 1 && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.schemas.map((schema, idx) => (
                      <button
                        key={schema.tableName}
                        type="button"
                        onClick={() => setSelectedSchemaIdx(idx)}
                        className={`rounded border px-2.5 py-1 font-mono text-[11px] transition-colors ${
                          idx === selectedSchemaIdx
                            ? 'border-neutral-950 bg-neutral-950 text-neutral-50 dark:border-neutral-50 dark:bg-neutral-50 dark:text-neutral-950'
                            : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400'
                        }`}
                      >
                        {schema.tableName}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-4 grid grid-cols-1 gap-2 rounded border border-neutral-200 bg-neutral-50 p-3 font-mono text-[11px] sm:grid-cols-3 dark:border-neutral-800 dark:bg-neutral-950">
                <div>
                  <span className="text-neutral-500">PK: </span>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {activeSchema.primaryKey}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500">LAYOUT: </span>
                  <span className="text-neutral-800 dark:text-neutral-200">
                    {activeSchema.partitionOrCluster}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500">WRITE MODE: </span>
                  <span className="text-neutral-800 dark:text-neutral-200">
                    {activeSchema.updateMode}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto rounded border border-neutral-200 dark:border-neutral-800">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50 font-mono text-[10px] uppercase tracking-wider text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
                      <th className="px-3.5 py-2.5">Column</th>
                      <th className="px-3.5 py-2.5">Type</th>
                      <th className="px-3.5 py-2.5">Contract / Semantics</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 text-xs dark:divide-neutral-800">
                    {activeSchema.columns.map((col) => (
                      <tr key={col.name}>
                        <td className="whitespace-nowrap px-3.5 py-2.5 font-mono font-medium text-neutral-950 dark:text-neutral-50">
                          {col.name}
                        </td>
                        <td className="whitespace-nowrap px-3.5 py-2.5 font-mono text-[11px] text-neutral-600 dark:text-neutral-400">
                          {col.type}
                        </td>
                        <td className="px-3.5 py-2.5 text-neutral-600 dark:text-neutral-300">
                          {col.note}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Two-Column: Transformation Logic + Data Quality Gates */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="rounded-lg border border-neutral-200 bg-white p-5 lg:col-span-7 dark:border-neutral-800 dark:bg-neutral-900/50">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                  <Code2 className="h-4 w-4" strokeWidth={1.8} />
                  <span>{project.codeSnippet.filename}</span>
                </div>
                <button
                  type="button"
                  onClick={copySnippet}
                  className="inline-flex items-center gap-1 rounded border border-neutral-200 bg-neutral-50 px-2 py-1 font-mono text-[10px] text-neutral-700 hover:border-neutral-950 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300"
                >
                  {copiedCode ? (
                    <>
                      <Check className="h-3 w-3" strokeWidth={1.8} />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" strokeWidth={1.8} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="overflow-x-auto rounded border border-neutral-200 bg-neutral-50 p-3.5 font-mono text-[11px] leading-relaxed text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100">
                <code>{project.codeSnippet.content}</code>
              </pre>
            </div>

            <div className="rounded-lg border border-neutral-200 bg-white p-5 lg:col-span-5 dark:border-neutral-800 dark:bg-neutral-900/50">
              <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                <ShieldCheck className="h-4 w-4" strokeWidth={1.8} />
                <span>Data Quality Gates</span>
              </div>
              <div className="space-y-3">
                {project.qualityGates.map((gate) => (
                  <div
                    key={gate.rule}
                    className="rounded border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-950"
                  >
                    <div className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      Gate: {gate.layer}
                    </div>
                    <div className="mt-1 text-xs font-medium text-neutral-900 dark:text-neutral-100">
                      {gate.rule}
                    </div>
                    <div className="mt-1 font-mono text-[11px] text-neutral-600 dark:text-neutral-400">
                      Action: {gate.enforcement}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Engineering Trade-offs & Quantified Impact */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900/50">
              <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                <Layers className="h-4 w-4" strokeWidth={1.8} />
                <span>Architecture Trade-Offs</span>
              </div>
              <ul className="space-y-2.5">
                {project.tradeoffs.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300"
                  >
                    <ArrowRight
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neutral-400"
                      strokeWidth={1.8}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900/50">
              <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                <Database className="h-4 w-4" strokeWidth={1.8} />
                <span>Delivered Outcomes</span>
              </div>
              <ul className="space-y-2.5">
                {project.impact.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300"
                  >
                    <ArrowRight
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neutral-400"
                      strokeWidth={1.8}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Prev / Next Project Footer Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-6 dark:border-neutral-800">
            <div>
              {prevProject && (
                <button
                  type="button"
                  onClick={() => onSelectProject(prevProject.id)}
                  className="inline-flex items-center gap-2 rounded border border-neutral-200 bg-white px-3 py-2 font-mono text-xs text-neutral-800 transition-colors hover:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-400"
                >
                  <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
                  <span>
                    {prevProject.code}: {prevProject.title}
                  </span>
                </button>
              )}
            </div>
            <div>
              {nextProject && (
                <button
                  type="button"
                  onClick={() => onSelectProject(nextProject.id)}
                  className="inline-flex items-center gap-2 rounded border border-neutral-200 bg-white px-3 py-2 font-mono text-xs text-neutral-800 transition-colors hover:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-400"
                >
                  <span>
                    {nextProject.code}: {nextProject.title}
                  </span>
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
