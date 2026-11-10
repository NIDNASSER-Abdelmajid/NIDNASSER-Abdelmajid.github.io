import { useState } from 'react'
import {
  Activity,
  BarChart3,
  Cpu,
  Database,
  Globe,
  Layers,
  Radio,
  ShieldAlert,
  Workflow,
} from 'lucide-react'
import { ARCHITECTURE_BLUEPRINTS } from '../data/portfolio'
import type { ArchitectureModeId } from '../types/portfolio'

const MODE_ICONS: Record<ArchitectureModeId, typeof Database> = {
  batch: Layers,
  streaming: Radio,
  extraction: Globe,
  analytics: BarChart3,
}

const STAGE_NODE_X = [176, 290, 404, 518]

export function PipelineTopology() {
  const [modeId, setModeId] = useState<ArchitectureModeId>('batch')
  const [stageIdx, setStageIdx] = useState<number>(2)

  const blueprint = ARCHITECTURE_BLUEPRINTS.find((b) => b.id === modeId) ?? ARCHITECTURE_BLUEPRINTS[0]
  const activeStage = blueprint.stages[stageIdx] ?? blueprint.stages[0]

  const selectMode = (nextMode: ArchitectureModeId) => {
    setModeId(nextMode)
    setStageIdx(0)
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6 dark:border-neutral-800 dark:bg-neutral-900/50">
      {/* Header + Versatile Architecture Pattern Switcher */}
      <div className="flex flex-col justify-between gap-4 border-b border-neutral-200 pb-4 sm:flex-row sm:items-center dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-neutral-950 dark:text-neutral-50" strokeWidth={1.8} />
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
            Architecture Patterns
          </span>
        </div>

        <div role="tablist" aria-label="Architecture patterns" className="flex flex-wrap gap-1.5">
          {ARCHITECTURE_BLUEPRINTS.map((item) => {
            const Icon = MODE_ICONS[item.id]
            const active = item.id === modeId
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => selectMode(item.id)}
                className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-mono text-xs transition-colors ${
                  active
                    ? 'bg-neutral-950 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-950'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800/80 dark:text-neutral-300 dark:hover:bg-neutral-800'
                }`}
              >
                <Icon className="h-3 w-3" strokeWidth={1.8} />
                <span>{item.shortLabel}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Mode Headline */}
      <p className="mt-4 text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
        {blueprint.headline}
      </p>

      {/* Multi-Source -> Guarded Backbone -> Multi-Sink SVG Topology */}
      <div className="mt-4 hidden sm:block">
        <svg
          viewBox="0 0 660 128"
          aria-hidden="true"
          className="h-28 w-full text-neutral-300 dark:text-neutral-700"
        >
          {/* Fan-in source curves to Stage 01 */}
          {[22, 62, 102].map((y, idx) => (
            <g key={`in-${idx}`}>
              <path
                d={`M 108 ${y} C 142 ${y}, 142 62, 176 62`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                className="animate-pipeline-flow"
              />
              <rect
                x="4"
                y={y - 11}
                width="104"
                height="22"
                rx="4"
                className="fill-neutral-100 stroke-neutral-300 dark:fill-neutral-900 dark:stroke-neutral-700"
                strokeWidth="1"
              />
              <text
                x="56"
                y={y + 4}
                textAnchor="middle"
                className="fill-neutral-700 font-mono text-[11px] dark:fill-neutral-300"
              >
                {blueprint.inputs[idx] ?? ''}
              </text>
            </g>
          ))}

          {/* Main Spine between Stage 01..04 */}
          <line
            x1="176"
            y1="62"
            x2="518"
            y2="62"
            stroke="currentColor"
            strokeWidth="1.5"
            className="animate-pipeline-flow"
          />

          {/* Quality / DLQ Quarantine Branch under Stage 03 */}
          <path
            d="M 404 62 L 404 102"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeDasharray="3 3"
          />
          <rect
            x="324"
            y="96"
            width="160"
            height="22"
            rx="4"
            className="fill-neutral-100 stroke-neutral-300 dark:fill-neutral-900 dark:stroke-neutral-700"
            strokeWidth="1"
          />
          <text
            x="404"
            y="111"
            textAnchor="middle"
            className="fill-neutral-600 font-mono text-[11px] dark:fill-neutral-400"
          >
            {blueprint.guardLabel}
          </text>

          {/* Fan-out output curves from Stage 04 */}
          {[22, 62, 102].map((y, idx) => (
            <g key={`out-${idx}`}>
              <path
                d={`M 518 62 C 540 62, 538 ${y}, 560 ${y}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                className="animate-pipeline-flow"
              />
              <rect
                x="560"
                y={y - 11}
                width="96"
                height="22"
                rx="4"
                className="fill-neutral-100 stroke-neutral-300 dark:fill-neutral-900 dark:stroke-neutral-700"
                strokeWidth="1"
              />
              <text
                x="608"
                y={y + 4}
                textAnchor="middle"
                className="fill-neutral-700 font-mono text-[11px] dark:fill-neutral-300"
              >
                {blueprint.outputs[idx] ?? ''}
              </text>
            </g>
          ))}

          {/* Interactive Backbone Stage Nodes */}
          {STAGE_NODE_X.map((cx, idx) => {
            const selected = idx === stageIdx
            return (
              <g
                key={cx}
                onClick={() => setStageIdx(idx)}
                className="cursor-pointer"
              >
                <circle
                  cx={cx}
                  cy="62"
                  r={selected ? 11 : 8}
                  className={
                    selected
                      ? 'fill-neutral-950 stroke-neutral-400 dark:fill-neutral-50 dark:stroke-neutral-500'
                      : 'fill-white stroke-neutral-400 dark:fill-neutral-950 dark:stroke-neutral-600'
                  }
                  strokeWidth="1.5"
                />
                <text
                  x={cx}
                  y="66"
                  textAnchor="middle"
                  className={`font-mono text-[11px] font-semibold ${
                    selected
                      ? 'fill-neutral-50 dark:fill-neutral-950'
                      : 'fill-neutral-700 dark:fill-neutral-300'
                  }`}
                >
                  {idx + 1}
                </text>
                <text
                  x={cx}
                  y="40"
                  textAnchor="middle"
                  className={`font-mono text-[11px] uppercase ${
                    selected
                      ? 'fill-neutral-950 font-semibold dark:fill-neutral-50'
                      : 'fill-neutral-500 dark:fill-neutral-400'
                  }`}
                >
                  {blueprint.stages[idx]?.role}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Stage Selector Cards */}
      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {blueprint.stages.map((stage, idx) => {
          const isSelected = idx === stageIdx
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => setStageIdx(idx)}
              onMouseEnter={() => setStageIdx(idx)}
              className={`flex flex-col items-start rounded-lg p-3 text-left transition-all ${
                isSelected
                  ? 'bg-neutral-950 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-950'
                  : 'bg-neutral-100/80 text-neutral-900 hover:bg-neutral-200/70 dark:bg-neutral-800/50 dark:text-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <div className="flex w-full items-center justify-between font-mono text-xs">
                <span
                  className={
                    isSelected
                      ? 'text-neutral-400 dark:text-neutral-600'
                      : 'text-neutral-500 dark:text-neutral-400'
                  }
                >
                  {stage.step}
                </span>
                <span
                  className={
                    isSelected
                      ? 'text-neutral-300 dark:text-neutral-700'
                      : 'text-neutral-500 dark:text-neutral-400'
                  }
                >
                  {stage.role}
                </span>
              </div>
              <div className="mt-1.5 text-xs font-semibold leading-snug">{stage.label}</div>
            </button>
          )
        })}
      </div>

      {/* Stage Anatomy Details */}
      <div className="mt-4 rounded-lg bg-neutral-100/75 p-4 dark:bg-neutral-950/80">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-medium text-neutral-900 dark:text-neutral-100">
            <Workflow className="h-3.5 w-3.5 text-neutral-500" strokeWidth={1.8} />
            <span>{activeStage.label}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 font-mono text-xs text-neutral-600 dark:text-neutral-400">
            <ShieldAlert className="h-3.5 w-3.5" strokeWidth={1.8} />
            <span>{activeStage.guarantee}</span>
          </div>
        </div>

        <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          {activeStage.description}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <Cpu className="mr-1 h-3.5 w-3.5 text-neutral-400" strokeWidth={1.8} />
          {activeStage.tools.map((tool) => (
            <span
              key={tool}
              className="rounded bg-white px-2.5 py-1 font-mono text-xs text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
