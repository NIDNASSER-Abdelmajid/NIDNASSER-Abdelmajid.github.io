import { ArrowDown, Database } from 'lucide-react'
import { CANVAS_NODES, PIPELINE_EDGES } from '../data/canvasData'

interface MobilePipelineOverviewProps {
  onSelectNode: (path: string) => void
}

export function MobilePipelineOverview({ onSelectNode }: MobilePipelineOverviewProps) {
  return (
    <div className="min-h-screen w-full bg-blueprint-grid px-4 pt-20 pb-28 text-neutral-900 dark:text-neutral-100">
      <div className="mx-auto max-w-md">
        {/* Banner */}
        <div className="mb-8 rounded-2xl border border-neutral-200/90 bg-white/90 p-5 shadow-lg backdrop-blur-md dark:border-neutral-800/90 dark:bg-neutral-900/90">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Pipeline Architecture DAG
            </span>
            <span className="flex items-center gap-1.5 font-mono text-xs text-neutral-600 dark:text-neutral-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              7 Nodes Online
            </span>
          </div>
          <h2 className="mt-2 text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
            End-to-End Data Pipeline
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
            Continuous directed acyclic graph from raw operational sources to production lakehouse, operational history, and downstream sinks. Tap any node to inspect.
          </p>
        </div>

        {/* Vertical Nodes & Connecting Edges */}
        <div className="space-y-3">
          {CANVAS_NODES.map((node, index) => {
            const edge = PIPELINE_EDGES.find((e) => e.from === node.id)
            return (
              <div key={node.id} className="relative">
                {/* Node Card */}
                <button
                  type="button"
                  onClick={() => onSelectNode(node.path)}
                  className="group block w-full rounded-2xl border border-neutral-300 bg-white/95 p-4 text-left shadow-md transition-all hover:border-neutral-950 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900/95 dark:hover:border-neutral-100"
                >
                  <div className="flex items-center justify-between border-b border-neutral-200/80 pb-2.5 font-mono text-[11px] text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {node.stage}
                      </span>
                    </div>
                    <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] uppercase dark:bg-neutral-800">
                      {node.status}
                    </span>
                  </div>

                  <div className="mt-3">
                    <div className="text-base font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
                      {node.title}
                    </div>
                    <div className="mt-0.5 text-xs text-neutral-600 dark:text-neutral-400">
                      {node.subtitle}
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                      {node.description}
                    </p>
                  </div>

                  <div className="mt-3.5 flex items-center justify-between border-t border-neutral-200/80 pt-2.5 font-mono text-[11px] dark:border-neutral-800">
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">
                      {node.metric}
                    </span>
                    <span className="inline-flex items-center gap-1 text-neutral-950 underline underline-offset-4 group-hover:opacity-80 dark:text-neutral-50">
                      <span>Inspect Stage</span>
                      <Database className="h-3 w-3" strokeWidth={1.8} />
                    </span>
                  </div>
                </button>

                {/* Animated Edge connector to next node */}
                {index < CANVAS_NODES.length - 1 && (
                  <div className="flex flex-col items-center py-2">
                    <div className="flex items-center gap-1.5 rounded-full border border-neutral-300 bg-white/90 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-neutral-600 shadow-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                      <span>{edge?.label ?? 'DATA FLOW'}</span>
                    </div>
                    <div className="my-1 h-5 w-px border-r-2 border-dashed border-neutral-400 dark:border-neutral-600" />
                    <ArrowDown className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" strokeWidth={2} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
