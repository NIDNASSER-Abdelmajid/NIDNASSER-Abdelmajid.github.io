import { useState } from 'react'
import { Database, Layers, Radio, Server, Terminal } from 'lucide-react'
import { StackLogo } from '../components/StackLogos'
import { STACK_MATRIX } from '../data/portfolio'
import type { StackRow } from '../types/portfolio'

type StackFilter = 'all' | StackRow['layer']

const QUERY_TABS: { id: StackFilter; sql: string; label: string }[] = [
  { id: 'all', sql: 'SELECT * FROM stack;', label: 'All Layers' },
  { id: 'lakehouse', sql: "SELECT * FROM stack WHERE layer = 'lakehouse';", label: 'Lakehouse' },
  { id: 'pipelines', sql: "SELECT * FROM stack WHERE layer = 'pipelines';", label: 'Streaming & Ops' },
  { id: 'storage', sql: "SELECT * FROM stack WHERE layer = 'storage';", label: 'Storage' },
  { id: 'bi_ml', sql: "SELECT * FROM stack WHERE layer = 'bi_ml';", label: 'BI & Serving' },
]

const LAYER_ORDER: { id: StackRow['layer']; title: string; icon: typeof Layers }[] = [
  { id: 'lakehouse', title: 'Lakehouse & Compute', icon: Layers },
  { id: 'pipelines', title: 'Orchestration & Streaming', icon: Radio },
  { id: 'storage', title: 'Storage & Modeling', icon: Database },
  { id: 'bi_ml', title: 'BI & Serving', icon: Server },
]

export function StackPage() {
  const [activeLayer, setActiveLayer] = useState<StackFilter>('all')
  const currentTab = QUERY_TABS.find((t) => t.id === activeLayer) ?? QUERY_TABS[0]

  const visibleLayers =
    activeLayer === 'all'
      ? LAYER_ORDER
      : LAYER_ORDER.filter((layer) => layer.id === activeLayer)

  const totalCount =
    activeLayer === 'all'
      ? STACK_MATRIX.length
      : STACK_MATRIX.filter((r) => r.layer === activeLayer).length

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <div className="mb-8 flex flex-col justify-between gap-6 border-b border-neutral-200 pb-8 @4xl:flex-row @4xl:items-end dark:border-neutral-800">
          <div>
            <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              <Layers className="h-3.5 w-3.5" strokeWidth={1.8} />
              <span>03 // Capability Matrix</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl dark:text-neutral-50">
              Tech Stack
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            {QUERY_TABS.map((tab) => {
              const active = activeLayer === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveLayer(tab.id)}
                  className={`rounded-md px-3 py-1.5 font-mono text-xs transition-colors ${
                    active
                      ? 'bg-neutral-950 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-950'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* SQL Prompt Filter Status */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-neutral-100/80 px-4 py-3 dark:bg-neutral-900">
          <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-neutral-900 dark:text-neutral-100">
            <Terminal className="h-4 w-4 text-neutral-500" strokeWidth={1.8} />
            <span className="break-all">{currentTab.sql}</span>
          </div>
          <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
            {totalCount} tools
          </span>
        </div>

        {/* Individual Monochrome Logo + Name Grid */}
        <div className="space-y-10">
          {visibleLayers.map((layerMeta) => {
            const Icon = layerMeta.icon
            const items = STACK_MATRIX.filter((item) => item.layer === layerMeta.id)

            return (
              <div key={layerMeta.id}>
                <div className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
                  <span>{layerMeta.title}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 @xl:grid-cols-3 @3xl:grid-cols-4 @5xl:grid-cols-5">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3.5 dark:border-neutral-800 dark:bg-neutral-900/50"
                    >
                      <StackLogo
                        id={item.id}
                        className="h-5 w-5 shrink-0 text-neutral-900 dark:text-neutral-100"
                      />
                      <span className="text-sm font-medium text-neutral-950 dark:text-neutral-50">
                        {item.technology}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
