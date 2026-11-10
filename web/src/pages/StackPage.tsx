import { useState } from 'react'
import { Database, Layers, Radio, ShieldCheck, Terminal } from 'lucide-react'
import { STACK_MATRIX } from '../data/portfolio'
import type { StackRow } from '../types/portfolio'

type StackFilter = 'all' | StackRow['layer']

const QUERY_TABS: { id: StackFilter; sql: string; label: string }[] = [
  { id: 'all', sql: 'SELECT * FROM stack;', label: 'All Layers' },
  {
    id: 'lakehouse',
    sql: "SELECT * FROM stack WHERE layer = 'lakehouse';",
    label: 'Lakehouse & Compute',
  },
  {
    id: 'pipelines',
    sql: "SELECT * FROM stack WHERE layer = 'pipelines';",
    label: 'Orchestration & Stream',
  },
  {
    id: 'storage',
    sql: "SELECT * FROM stack WHERE layer = 'storage';",
    label: 'Databases & Modeling',
  },
  {
    id: 'bi_ml',
    sql: "SELECT * FROM stack WHERE layer = 'bi_ml';",
    label: 'BI & Serving',
  },
]

const CAPABILITY_PILLARS = [
  {
    icon: Layers,
    title: 'Lakehouse & Medallion Design',
    detail: 'Incremental CDC merges, schema enforcement, and Bronze/Silver/Gold isolation in Databricks and Spark.',
  },
  {
    icon: Radio,
    title: 'Batch & Event Streaming',
    detail: 'Airflow DAG orchestration, Kafka partitioned topics, dead-letter handling, and idempotent retries.',
  },
  {
    icon: Database,
    title: 'Dimensional Warehousing',
    detail: 'Star and Snowflake schemas, conformed client crosswalks, query tuning, and analytical SQL.',
  },
  {
    icon: ShieldCheck,
    title: 'Data Quality & Observability',
    detail: 'Row-count drift guards, primary key checks, GL reconciliation assertions, and hash deduplication.',
  },
]

export function StackPage() {
  const [activeLayer, setActiveLayer] = useState<StackFilter>('all')
  const currentTab = QUERY_TABS.find((t) => t.id === activeLayer) ?? QUERY_TABS[0]

  const rows =
    activeLayer === 'all'
      ? STACK_MATRIX
      : STACK_MATRIX.filter((row) => row.layer === activeLayer)

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 flex flex-col justify-between gap-6 border-b border-neutral-200 pb-8 lg:flex-row lg:items-end dark:border-neutral-800">
          <div>
            <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              <Layers className="h-3.5 w-3.5" strokeWidth={1.8} />
              <span>03 // Query My Stack</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl dark:text-neutral-50">
              Engineering Specification
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              Core languages, distributed compute engines, storage layers, and analytics tools
              organized by pipeline responsibility.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {QUERY_TABS.map((tab) => {
              const active = activeLayer === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveLayer(tab.id)}
                  className={`rounded border px-2.5 py-1.5 font-mono text-[11px] transition-colors ${
                    active
                      ? 'border-neutral-950 bg-neutral-950 text-neutral-50 dark:border-neutral-50 dark:bg-neutral-50 dark:text-neutral-950'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-600'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900/50">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-950">
            <div className="flex items-center gap-2 font-mono text-xs text-neutral-900 dark:text-neutral-100">
              <Terminal className="h-3.5 w-3.5 text-neutral-500" strokeWidth={1.8} />
              <span className="break-all">{currentTab.sql}</span>
            </div>
            <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
              {rows.length} rows returned
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-neutral-200 font-mono text-[10px] uppercase tracking-wider text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                  <th className="px-4 py-3 font-medium">Layer</th>
                  <th className="px-4 py-3 font-medium">Technology</th>
                  <th className="px-4 py-3 font-medium">Pipeline Responsibility</th>
                  <th className="px-4 py-3 font-medium">Workload</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-xs dark:divide-neutral-800">
                {rows.map((row) => (
                  <tr
                    key={row.technology}
                    className="transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
                  >
                    <td className="whitespace-nowrap px-4 py-3.5 font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                      {row.layerLabel}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 font-semibold text-neutral-950 dark:text-neutral-50">
                      {row.technology}
                    </td>
                    <td className="min-w-[260px] px-4 py-3.5 text-neutral-600 dark:text-neutral-300">
                      {row.role}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <span className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-mono text-[10px] text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300">
                        {row.workload}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Core Data Engineering Capabilities */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CAPABILITY_PILLARS.map((pillar) => {
            const Icon = pillar.icon
            return (
              <div
                key={pillar.title}
                className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900/50"
              >
                <Icon className="h-4 w-4 text-neutral-700 dark:text-neutral-300" strokeWidth={1.8} />
                <h2 className="mt-3 text-sm font-semibold text-neutral-950 dark:text-neutral-50">
                  {pillar.title}
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {pillar.detail}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
