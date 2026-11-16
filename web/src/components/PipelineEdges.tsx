import { useMemo } from 'react'
import { CANVAS_NODES, PIPELINE_EDGES, type CanvasNodeConfig } from '../data/canvasData'

interface PipelineEdgesProps {
  windowWidth: number
  windowHeight: number
}

export function PipelineEdges({ windowWidth, windowHeight }: PipelineEdgesProps) {
  const nodeMap = useMemo(() => {
    const map = new Map<string, CanvasNodeConfig>()
    for (const node of CANVAS_NODES) {
      map.set(node.id, node)
    }
    return map
  }, [])

  const edges = useMemo(() => {
    return PIPELINE_EDGES.map((edge) => {
      const source = nodeMap.get(edge.from)
      const target = nodeMap.get(edge.to)
      if (!source || !target) return null

      // Convert vw and vh to pixel coordinates
      const srcX = (source.x / 100) * windowWidth
      const srcY = (source.y / 100) * windowHeight
      const tgtX = (target.x / 100) * windowWidth
      const tgtY = (target.y / 100) * windowHeight

      let x1 = 0
      let y1 = 0
      if (edge.fromPort === 'right') {
        x1 = srcX + windowWidth
        y1 = srcY + windowHeight * 0.5
      } else if (edge.fromPort === 'bottom') {
        x1 = srcX + windowWidth * 0.5
        y1 = srcY + windowHeight
      } else {
        x1 = srcX + windowWidth * 0.5
        y1 = srcY
      }

      let x2 = 0
      let y2 = 0
      if (edge.toPort === 'left') {
        x2 = tgtX
        y2 = tgtY + windowHeight * 0.5
      } else if (edge.toPort === 'top') {
        x2 = tgtX + windowWidth * 0.5
        y2 = tgtY
      } else {
        x2 = tgtX + windowWidth * 0.5
        y2 = tgtY + windowHeight
      }

      let pathD = ''
      let midX = (x1 + x2) / 2
      let midY = (y1 + y2) / 2

      if (edge.fromPort === 'right' && edge.toPort === 'left') {
        const dx = x2 - x1
        const cx1 = x1 + dx * 0.45
        const cy1 = y1
        const cx2 = x2 - dx * 0.45
        const cy2 = y2
        pathD = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`
      } else if (edge.fromPort === 'bottom' && edge.toPort === 'top') {
        const dy = y2 - y1
        const cx1 = x1
        const cy1 = y1 + dy * 0.45
        const cx2 = x2
        const cy2 = y2 - dy * 0.45
        pathD = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`
      } else {
        const dx = x2 - x1
        const cx1 = x1 + dx * 0.5
        const cy1 = y1
        const cx2 = x1 + dx * 0.5
        const cy2 = y2
        pathD = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`
      }

      return {
        id: edge.id,
        pathD,
        midX,
        midY,
        label: edge.label,
      }
    }).filter(Boolean)
  }, [nodeMap, windowWidth, windowHeight])

  const totalWidth = windowWidth * 5.6
  const totalHeight = windowHeight * 2.5

  return (
    <svg
      width={totalWidth}
      height={totalHeight}
      className="pointer-events-none absolute top-0 left-0 z-10 overflow-visible"
      style={{ width: `${totalWidth}px`, height: `${totalHeight}px` }}
    >
      <defs>
        {/* Dark theme arrow */}
        <marker
          id="pipeline-arrow-dark"
          viewBox="0 0 10 10"
          refX="7"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 1.5 L 9 5 L 0 8.5 z" className="fill-neutral-400" />
        </marker>

        {/* Light theme arrow */}
        <marker
          id="pipeline-arrow-light"
          viewBox="0 0 10 10"
          refX="7"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 1.5 L 9 5 L 0 8.5 z" className="fill-neutral-600" />
        </marker>
      </defs>

      {edges.map((edge) => {
        if (!edge) return null
        return (
          <g key={edge.id} className="text-neutral-500/80 dark:text-neutral-400/80">
            {/* Background shadow stroke for depth */}
            <path
              d={edge.pathD}
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              strokeOpacity="0.12"
            />

            {/* Living pipeline animated dashed line */}
            <path
              d={edge.pathD}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              className="animate-pipeline-flow"
              markerEnd="url(#pipeline-arrow-dark)"
            />

            {/* Flow label pill */}
            {edge.label && (
              <g transform={`translate(${edge.midX}, ${edge.midY})`}>
                <rect
                  x="-75"
                  y="-12"
                  width="150"
                  height="24"
                  rx="6"
                  className="fill-white/95 stroke-neutral-300 shadow-sm dark:fill-neutral-900/95 dark:stroke-neutral-700"
                  strokeWidth="1"
                />
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  className="fill-neutral-700 font-mono text-[10px] font-semibold tracking-wider uppercase dark:fill-neutral-300"
                >
                  {edge.label}
                </text>
              </g>
            )}
          </g>
        )
      })}
    </svg>
  )
}
