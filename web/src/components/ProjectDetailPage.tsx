import { useEffect, useState } from 'react'
import {
  AlertCircle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  Compass,
  Copy,
  Database,
  GitBranch,
  Layers,
  Target,
  Workflow,
  X,
} from 'lucide-react'
import { PROJECTS } from '../data/portfolio'
import type { ProjectCodeBlock } from '../types/portfolio'
import { GitHubIcon } from './BrandIcons'

interface ProjectDetailPageProps {
  projectId: string
  onBack: () => void
  onSelectProject: (id: string) => void
  onOpenArticle: (slug: string) => void
}

function CodeBlockCard({ block }: { block: ProjectCodeBlock }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard?.writeText(block.content).catch(() => {})
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900/50">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 bg-neutral-50/80 px-4 py-2.5 dark:border-neutral-800 dark:bg-neutral-900/90">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">
            {block.title}
          </span>
          {block.filename && (
            <>
              <span className="text-neutral-400">·</span>
              <span className="text-neutral-500 dark:text-neutral-400">{block.filename}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded bg-neutral-200/70 px-2 py-0.5 font-mono text-[11px] uppercase text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
            {block.language}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded border border-neutral-200 bg-white px-2 py-0.5 font-mono text-[11px] text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-950 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:border-neutral-300 dark:hover:text-neutral-50"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" strokeWidth={2} />
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
      </div>

      {block.description && (
        <p className="border-b border-neutral-200/70 px-4 py-2.5 text-xs sm:text-sm text-neutral-600 dark:border-neutral-800/70 dark:text-neutral-400">
          {block.description}
        </p>
      )}

      <pre className="overflow-x-auto bg-neutral-950 p-4 font-mono text-xs leading-relaxed text-neutral-100 sm:p-5">
        <code>{block.content}</code>
      </pre>
    </div>
  )
}

export function ProjectDetailPage({
  projectId,
  onBack,
  onSelectProject,
  onOpenArticle,
}: ProjectDetailPageProps) {
  const index = PROJECTS.findIndex((p) => p.id === projectId)
  const project = index >= 0 ? PROJECTS[index] : PROJECTS[0]
  const prevProject = index > 0 ? PROJECTS[index - 1] : null
  const nextProject = index < PROJECTS.length - 1 ? PROJECTS[index + 1] : null

  const images = project.images ?? []
  const [slideIdx, setSlideIdx] = useState(0)
  const [showImageContext, setShowImageContext] = useState(false)

  useEffect(() => {
    setSlideIdx(0)
    setShowImageContext(false)
  }, [project.id])

  const currentImage = images[slideIdx]

  const goSlide = (next: number) => {
    if (images.length === 0) return
    setSlideIdx((next + images.length) % images.length)
    setShowImageContext(false)
  }

  return (
    <article className="py-10 sm:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-8">
        {/* Top Action Bar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-5 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3 py-1.5 font-mono text-xs text-neutral-800 transition-colors hover:border-neutral-950 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-400 dark:hover:text-neutral-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
              <span>All Projects</span>
            </button>
            <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
              {project.code} // PROJECT PAGE
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {project.articleSlug && (
              <button
                type="button"
                onClick={() => onOpenArticle(project.articleSlug!)}
                className="inline-flex items-center gap-1.5 rounded-md bg-neutral-950 px-3 py-1.5 font-mono text-xs text-neutral-50 transition-colors hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200"
              >
                <BookOpen className="h-3.5 w-3.5" strokeWidth={1.8} />
                <span>Read Article</span>
              </button>
            )}

            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3 py-1.5 font-mono text-xs text-neutral-800 transition-colors hover:border-neutral-950 hover:bg-neutral-950 hover:text-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-50 dark:hover:bg-neutral-50 dark:hover:text-neutral-950"
              >
                <GitHubIcon className="h-3.5 w-3.5" />
                <span>Repository</span>
                <ArrowUpRight className="h-3 w-3" strokeWidth={1.8} />
              </a>
            )}
          </div>
        </div>

        {/* Hero Overview */}
        <header className="pb-8 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs text-neutral-500 dark:text-neutral-400">
            <span className="rounded bg-neutral-100 px-2.5 py-0.5 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100">
              {project.category}
            </span>
            <span>·</span>
            <span>{project.context}</span>
            <span>·</span>
            <span>{project.year}</span>
          </div>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl dark:text-neutral-50">
            {project.title}
          </h1>

          <p className="mt-3 max-w-3xl text-sm sm:text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
            {project.summary}
          </p>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded bg-neutral-100 px-2.5 py-1 font-mono text-xs text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </header>

        <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {/* 01 // Sliding Visual Walkthrough Gallery */}
          {images.length > 0 && currentImage && (
            <section className="py-8">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                  Visual Walkthrough
                </span>
                <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
                  {slideIdx + 1} / {images.length}
                </span>
              </div>

              <div className="relative overflow-hidden rounded-xl border border-neutral-200 bg-neutral-950 dark:border-neutral-800">
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={currentImage.src}
                    alt={currentImage.alt}
                    className="h-full w-full object-contain"
                  />
                </div>

                {/* Prev / Next Slider Controls */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => goSlide(slideIdx - 1)}
                      aria-label="Previous image"
                      className="absolute top-1/2 left-3 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-300 bg-white/95 text-neutral-900 shadow-sm transition-colors hover:bg-white dark:border-neutral-700 dark:bg-neutral-900/95 dark:text-neutral-100 dark:hover:bg-neutral-900"
                    >
                      <ChevronLeft className="h-4 w-4" strokeWidth={1.8} />
                    </button>
                    <button
                      type="button"
                      onClick={() => goSlide(slideIdx + 1)}
                      aria-label="Next image"
                      className="absolute top-1/2 right-3 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-300 bg-white/95 text-neutral-900 shadow-sm transition-colors hover:bg-white dark:border-neutral-700 dark:bg-neutral-900/95 dark:text-neutral-100 dark:hover:bg-neutral-900"
                    >
                      <ChevronRight className="h-4 w-4" strokeWidth={1.8} />
                    </button>
                  </>
                )}

                {/* Circle-Exclamation Context Trigger (ONLY shown when context is available) */}
                {currentImage.context && (
                  <button
                    type="button"
                    onClick={() => setShowImageContext((prev) => !prev)}
                    aria-label={showImageContext ? 'Hide image explanation' : 'Show image explanation'}
                    title="Explain what is in this image"
                    className={`absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-full border shadow-sm transition-colors ${
                      showImageContext
                        ? 'border-neutral-950 bg-neutral-950 text-neutral-50 dark:border-neutral-50 dark:bg-neutral-50 dark:text-neutral-950'
                        : 'border-neutral-200 bg-white/95 text-neutral-900 hover:bg-white dark:border-neutral-700 dark:bg-neutral-900/95 dark:text-neutral-100 dark:hover:bg-neutral-900'
                    }`}
                  >
                    <AlertCircle className="h-4 w-4" strokeWidth={1.9} />
                  </button>
                )}

                {/* Image Explanation Drawer Overlay */}
                {showImageContext && currentImage.context && (
                  <div className="absolute inset-x-3 bottom-3 rounded-lg border border-neutral-200 bg-white/95 p-4 shadow-lg backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-950/95">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        {currentImage.title && (
                          <div className="font-mono text-xs font-semibold text-neutral-950 dark:text-neutral-50">
                            {currentImage.title}
                          </div>
                        )}
                        <p className="mt-1 text-xs sm:text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                          {currentImage.context}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowImageContext(false)}
                        aria-label="Close image explanation"
                        className="rounded p-1 text-neutral-500 hover:text-neutral-950 dark:hover:text-neutral-50"
                      >
                        <X className="h-3.5 w-3.5" strokeWidth={1.8} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {(currentImage.title || images.length > 1) && (
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <span className="font-mono text-xs text-neutral-600 dark:text-neutral-400">
                    {currentImage.title ?? currentImage.alt}
                  </span>

                  {images.length > 1 && (
                    <div className="flex items-center gap-1.5">
                      {images.map((img, i) => (
                        <button
                          key={img.src + i}
                          type="button"
                          onClick={() => goSlide(i)}
                          aria-label={`View slide ${i + 1}`}
                          className={`h-2 rounded-full transition-all ${
                            i === slideIdx
                              ? 'w-5 bg-neutral-950 dark:bg-neutral-50'
                              : 'w-2 bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-700 dark:hover:bg-neutral-600'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          {/* 02 // Architecture Diagram */}
          {project.diagram && (
            <section className="py-8">
              <div className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                <GitBranch className="h-4 w-4" strokeWidth={1.8} />
                <span>Architecture Diagram // {project.diagram.title}</span>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-white/90 p-5 sm:p-6 dark:border-neutral-800 dark:bg-neutral-900/50">
                <div className="grid grid-cols-1 gap-3 @4xl:grid-cols-4 @4xl:gap-4">
                  {project.diagram.nodes.map((node, i) => (
                    <div key={node.id} className="relative flex flex-col">
                      <div className="flex h-full flex-col justify-between rounded-lg border border-neutral-200 bg-neutral-50/90 p-4 dark:border-neutral-800 dark:bg-neutral-950/90">
                        <div>
                          <div className="flex items-center justify-between font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                            <span>NODE {node.step}</span>
                            <span className="rounded border border-neutral-200 bg-white px-1.5 py-0.5 text-[10px] uppercase dark:border-neutral-800 dark:bg-neutral-900">
                              {node.layer}
                            </span>
                          </div>
                          <div className="mt-2.5 text-sm font-semibold text-neutral-950 dark:text-neutral-50">
                            {node.label}
                          </div>
                          <div className="mt-1 font-mono text-xs text-neutral-600 dark:text-neutral-400">
                            {node.sublabel}
                          </div>
                        </div>

                        {i < project.diagram!.nodes.length - 1 && project.diagram!.edgeLabels[i] && (
                          <div className="mt-3 hidden items-center gap-1.5 border-t border-neutral-200/80 pt-2 font-mono text-[10px] uppercase tracking-wider text-neutral-500 @4xl:flex dark:border-neutral-800 dark:text-neutral-400">
                            <span>{project.diagram!.edgeLabels[i]}</span>
                            <ArrowRight className="h-3 w-3 shrink-0" strokeWidth={1.8} />
                          </div>
                        )}
                      </div>

                      {/* Mobile vertical connector */}
                      {i < project.diagram!.nodes.length - 1 && (
                        <div className="flex items-center justify-center gap-2 py-2 font-mono text-[10px] uppercase tracking-wider text-neutral-500 @4xl:hidden dark:text-neutral-400">
                          <ArrowDown className="h-3.5 w-3.5" strokeWidth={1.8} />
                          {project.diagram!.edgeLabels[i] && (
                            <span>{project.diagram!.edgeLabels[i]}</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <p className="mt-4 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                  {project.diagram.caption}
                </p>
              </div>
            </section>
          )}

          {/* 03 // Challenge & Approach */}
          <section className="grid grid-cols-1 gap-8 py-8 md:grid-cols-2">
            <div>
              <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                <Target className="h-4 w-4" strokeWidth={1.8} />
                <span>01 // The Challenge</span>
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
                {project.wiki.problem}
              </p>
            </div>

            <div>
              <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                <Compass className="h-4 w-4" strokeWidth={1.8} />
                <span>02 // Approach</span>
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
                {project.wiki.solution}
              </p>
            </div>
          </section>

          {/* 04 // How It Works (Narrative Stages) */}
          <section className="py-8">
            <div className="mb-5 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              <Workflow className="h-4 w-4" strokeWidth={1.8} />
              <span>03 // How It Works</span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {project.wiki.workflow.map((stage) => (
                <div
                  key={stage.step}
                  className="rounded-lg border border-neutral-200 bg-white p-4 sm:p-5 dark:border-neutral-800 dark:bg-neutral-900/50"
                >
                  <div className="flex items-center justify-between font-mono text-xs text-neutral-500 dark:text-neutral-400">
                    <span>STAGE {stage.step}</span>
                  </div>
                  <h2 className="mt-1.5 text-base font-semibold text-neutral-950 dark:text-neutral-50">
                    {stage.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                    {stage.summary}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {stage.tools.map((tool) => (
                      <span
                        key={tool}
                        className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-xs text-neutral-700 dark:bg-neutral-950 dark:text-neutral-300"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 05 // Code Parts */}
          {project.codeParts && project.codeParts.length > 0 && (
            <section className="py-8">
              <div className="mb-5 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                <Code2 className="h-4 w-4" strokeWidth={1.8} />
                <span>04 // Code Implementation</span>
              </div>
              <div className="space-y-5">
                {project.codeParts.map((block) => (
                  <CodeBlockCard key={block.title} block={block} />
                ))}
              </div>
            </section>
          )}

          {/* 06 // SQL Parts */}
          {project.sqlParts && project.sqlParts.length > 0 && (
            <section className="py-8">
              <div className="mb-5 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                <Database className="h-4 w-4" strokeWidth={1.8} />
                <span>05 // SQL &amp; Data Layer</span>
              </div>
              <div className="space-y-5">
                {project.sqlParts.map((block) => (
                  <CodeBlockCard key={block.title} block={block} />
                ))}
              </div>
            </section>
          )}

          {/* 07 // Key Decisions & Outcomes */}
          <section className="grid grid-cols-1 gap-8 py-8 md:grid-cols-2">
            <div>
              <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                <Layers className="h-4 w-4" strokeWidth={1.8} />
                <span>06 // Key Decisions</span>
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
              <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                <CheckCircle2 className="h-4 w-4" strokeWidth={1.8} />
                <span>07 // Outcomes</span>
              </div>
              <ul className="space-y-2.5">
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
          </section>

          {/* Prev / Next Footer */}
          <nav
            aria-label="Project pagination"
            className="flex flex-wrap items-center justify-between gap-3 py-6"
          >
            <div>
              {prevProject && (
                <button
                  type="button"
                  onClick={() => onSelectProject(prevProject.id)}
                  className="inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3.5 py-2 font-mono text-xs text-neutral-800 transition-colors hover:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-400"
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
                  className="inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3.5 py-2 font-mono text-xs text-neutral-800 transition-colors hover:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-400"
                >
                  <span>
                    {nextProject.code}: {nextProject.title}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.8} />
                </button>
              )}
            </div>
          </nav>
        </div>
      </div>
    </article>
  )
}
