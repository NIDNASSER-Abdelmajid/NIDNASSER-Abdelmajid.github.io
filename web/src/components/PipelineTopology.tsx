import { useState } from 'react'
import { BarChart3, Database, Layers, Terminal, Workflow } from 'lucide-react'
import { PIPELINE_STAGES } from '../data/portfolio'
import type { PipelineStage } from '../types/portfolio'

const STAGE_ICONS: Record<PipelineStage['id'], typeof Database> = {
  sources: Database,
  ingest: Workflow,
  lakehouse: Layers,
  serve: BarChart3,
}

export function PipelineTopology() {
  const [activeId, setActiveId] = useState<PipelineStage['id']>('lakehouse')
  const activeStage = PIPELINE_STAGES.find((s) => s.id === activeId) ?? PIPELINE_STAGES[2]
  const activeIdx = PIPELINE_STAGES.findIndex((s) => s.id === activeId)

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6 dark:border-neutral-800 dark:bg-neutral-900/50">
      <div className="mb-5 flex items-center justify-between border-b border-neutral-200 pb-3 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-neutral-950 dark:bg-neutral-50" />
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
            Pipeline Architecture
          </span>
        </div>
        <span className="font-mono text-xs text-neutral-500">
          Select node
        </span>
      </div>

      {/* Connected Node-Edge Flow */}
      <div className="relative">
        {/* Horizontal SVG Flow Backbone (desktop) */}
        <svg
          viewBox="0 0 600 28"
          aria-hidden="true"
          className="mb-3 hidden h-7 w-full text-neutral-300 sm:block dark:text-neutral-700"
        >
          <line
            x1="40"
            y1="14"
            x2="560"
            y2="14"
            stroke="currentColor"
            strokeWidth="1.5"
            className="animate-pipeline-flow"
          />
          {[40, 213, 386, 560].map((cx, idx) => {
            const selected = idx === activeIdx
            return (
              <g key={cx}>
                <circle
                  cx={cx}
                  cy="14"
                  r={selected ? 6 : 4}
                  className={
                    selected
                      ? 'fill-neutral-950 dark:fill-neutral-50'
                      : 'fill-neutral-400 dark:fill-neutral-600'
                  }
                />
                {idx < 3 && (
                  <path
                    d={`M ${cx + 82} 10 L ${cx + 90} 14 L ${cx + 82} 18`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                )}
              </g>
            )
          })}
        </svg>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {PIPELINE_STAGES.map((stage) => {
            const Icon = STAGE_ICONS[stage.id]
            const isSelected = stage.id === activeId
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveId(stage.id)}
                onMouseEnter={() => setActiveId(stage.id)}
                className={`flex flex-col items-start rounded-lg p-3 text-left transition-all ${
                  isSelected
                    ? 'bg-neutral-950 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-950'
                    : 'bg-neutral-100/80 text-neutral-900 hover:bg-neutral-200/70 dark:bg-neutral-800/50 dark:text-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <div className="mb-2 flex w-full items-center justify-between">
                  <span
                    className={`font-mono text-xs ${
                      isSelected
                        ? 'text-neutral-400 dark:text-neutral-600'
                        : 'text-neutral-500 dark:text-neutral-400'
                    }`}
                  >
                    {stage.step}
                  </span>
                  <Icon className="h-4 w-4" strokeWidth={1.8} />
                </div>
                <div className="font-mono text-xs font-semibold tracking-wide">
                  {stage.label}
                </div>
                <div
                  className={`mt-1 text-xs ${
                    isSelected
                      ? 'text-neutral-300 dark:text-neutral-600'
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  {stage.subtitle}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Borderless Tonal Inspector */}
      <div className="mt-5 rounded-lg bg-neutral-100/70 p-4 dark:bg-neutral-950/70">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-mono text-xs font-medium text-neutral-900 dark:text-neutral-100">
            <Terminal className="h-3.5 w-3.5 text-neutral-500" strokeWidth={1.8} />
            <span>{activeStage.pattern}</span>
          </div>
          <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
            {activeStage.contract}
          </span>
        </div>

        <pre className="overflow-x-auto rounded-md bg-white p-3.5 font-mono text-xs leading-relaxed text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
          <code>{activeStage.snippet}</code>
        </pre>

        <div className="mt-3 flex flex-wrap gap-2">
          {activeStage.engines.map((engine) => (
            <span
              key={engine}
              className="rounded bg-neutral-200/70 px-2.5 py-1 font-mono text-xs text-neutral-800 dark:bg-neutral-800/80 dark:text-neutral-200"
            >
              {engine}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
