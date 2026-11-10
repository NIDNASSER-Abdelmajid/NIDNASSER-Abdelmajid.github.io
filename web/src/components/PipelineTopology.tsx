import { useState } from 'react'
import { BarChart3, ChevronRight, Database, Layers, Terminal, Workflow } from 'lucide-react'
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

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4 sm:p-5 dark:border-neutral-800 dark:bg-neutral-900/60">
      <div className="mb-4 flex items-center justify-between border-b border-neutral-200 pb-3 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-neutral-950 dark:bg-neutral-50" />
          <span className="font-mono text-[11px] uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
            Interactive Pipeline Lineage
          </span>
        </div>
        <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-500">
          Click stage to inspect
        </span>
      </div>

      {/* Interactive 4-stage DAG */}
      <div className="relative grid grid-cols-1 gap-3 sm:grid-cols-2">
        {PIPELINE_STAGES.map((stage, index) => {
          const Icon = STAGE_ICONS[stage.id]
          const isSelected = stage.id === activeId
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => setActiveId(stage.id)}
              onMouseEnter={() => setActiveId(stage.id)}
              className={`group relative flex flex-col items-start rounded border p-3.5 text-left transition-all ${
                isSelected
                  ? 'border-neutral-950 bg-neutral-950 text-neutral-50 dark:border-neutral-50 dark:bg-neutral-50 dark:text-neutral-950'
                  : 'border-neutral-200 bg-neutral-50/70 text-neutral-900 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950/60 dark:text-neutral-100 dark:hover:border-neutral-600'
              }`}
            >
              <div className="mb-2.5 flex w-full items-center justify-between">
                <span
                  className={`font-mono text-[10px] tracking-widest ${
                    isSelected
                      ? 'text-neutral-300 dark:text-neutral-600'
                      : 'text-neutral-500 dark:text-neutral-500'
                  }`}
                >
                  STAGE {stage.step}
                </span>
                <Icon
                  className={`h-4 w-4 ${
                    isSelected
                      ? 'text-neutral-50 dark:text-neutral-950'
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                  strokeWidth={1.7}
                />
              </div>

              <div className="font-mono text-xs font-semibold tracking-wide">{stage.label}</div>
              <div
                className={`mt-1 text-xs ${
                  isSelected
                    ? 'text-neutral-300 dark:text-neutral-600'
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                {stage.subtitle}
              </div>

              {index < PIPELINE_STAGES.length - 1 && (
                <ChevronRight
                  className={`pointer-events-none absolute right-2 bottom-2 h-3.5 w-3.5 opacity-40 sm:hidden`}
                  strokeWidth={1.6}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Vector SVG Dataflow Indicator */}
      <div className="my-4 hidden items-center justify-between px-2 sm:flex" aria-hidden="true">
        <svg viewBox="0 0 420 22" className="h-5 w-full overflow-visible text-neutral-400 dark:text-neutral-600">
          <line
            x1="8"
            y1="11"
            x2="412"
            y2="11"
            stroke="currentColor"
            strokeWidth="1"
            className="animate-pipeline-flow"
          />
          {[8, 142, 276, 412].map((cx, idx) => (
            <circle
              key={cx}
              cx={cx}
              cy="11"
              r={PIPELINE_STAGES[idx].id === activeId ? '4' : '2.5'}
              className={
                PIPELINE_STAGES[idx].id === activeId
                  ? 'fill-neutral-950 dark:fill-neutral-50'
                  : 'fill-neutral-400 dark:fill-neutral-600'
              }
            />
          ))}
        </svg>
      </div>

      {/* Live Stage Telemetry & SQL/Contract Readout */}
      <div className="mt-3 rounded border border-neutral-200 bg-neutral-50 p-3.5 dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-mono text-[11px] font-medium text-neutral-900 dark:text-neutral-100">
            <Terminal className="h-3.5 w-3.5" strokeWidth={1.8} />
            <span>{activeStage.pattern}</span>
          </div>
          <span className="rounded border border-neutral-200 bg-white px-2 py-0.5 font-mono text-[10px] text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
            {activeStage.contract}
          </span>
        </div>

        <pre className="overflow-x-auto rounded border border-neutral-200 bg-white p-2.5 font-mono text-[11px] leading-relaxed text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900/90 dark:text-neutral-200">
          <code>{activeStage.snippet}</code>
        </pre>

        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {activeStage.engines.map((engine) => (
            <span
              key={engine}
              className="rounded border border-neutral-200 bg-white px-2 py-0.5 font-mono text-[10px] text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
            >
              {engine}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

