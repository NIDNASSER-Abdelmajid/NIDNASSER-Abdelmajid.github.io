import { useEffect, useState } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  Layers,
  Target,
  Workflow,
  X,
} from 'lucide-react'
import { PROJECTS } from '../data/portfolio'
import { GitHubIcon } from './BrandIcons'

interface ProjectDetailModalPageProps {
  projectId: string
  onClose: () => void
  onSelectProject: (id: string) => void
  onOpenArticle: (slug: string) => void
}

export function ProjectDetailModalPage({
  projectId,
  onClose,
  onSelectProject,
  onOpenArticle,
}: ProjectDetailModalPageProps) {
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

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (images.length > 1 && e.key === 'ArrowRight') {
        setSlideIdx((prev) => (prev + 1) % images.length)
        setShowImageContext(false)
      } else if (images.length > 1 && e.key === 'ArrowLeft') {
        setSlideIdx((prev) => (prev - 1 + images.length) % images.length)
        setShowImageContext(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [images.length, onClose])

  const currentImage = images[slideIdx]

  const goSlide = (next: number) => {
    if (images.length === 0) return
    setSlideIdx((next + images.length) % images.length)
    setShowImageContext(false)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Project wiki for ${project.title}`}
      className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/75 p-2 backdrop-blur-xs sm:p-6"
      onClick={onClose}
    >
      <div
        className="mx-auto my-2 max-w-4xl overflow-hidden rounded-xl border border-neutral-300 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-950"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Sticky Wiki Header */}
        <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 bg-white/95 px-5 py-3.5 backdrop-blur-md sm:px-8 dark:border-neutral-800 dark:bg-neutral-950/95">
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
              {project.code} // PROJECT WIKI
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
              aria-label="Close project wiki"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-neutral-100 text-neutral-600 transition-colors hover:bg-neutral-200 hover:text-neutral-950 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
            >
              <X className="h-4 w-4" strokeWidth={1.8} />
            </button>
          </div>
        </div>

        <div className="divide-y divide-neutral-200 px-5 sm:px-8 dark:divide-neutral-800">
          {/* Wiki Hero Overview */}
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
            <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
              {project.summary}
            </p>
          </div>

          {/* Sliding Visuals Gallery (ONLY shown when shared project images exist) */}
          {images.length > 0 && currentImage && (
            <div className="py-8">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                  Visual Walkthrough
                </span>
                <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
                  {slideIdx + 1} / {images.length}
                </span>
              </div>

              <div className="relative overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={currentImage.src}
                    alt={currentImage.alt}
                    className="h-full w-full object-contain bg-neutral-950/5 dark:bg-neutral-950"
                  />
                </div>

                {/* Prev / Next Slider Controls */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => goSlide(slideIdx - 1)}
                      aria-label="Previous image"
                      className="absolute top-1/2 left-3 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white/90 text-neutral-900 shadow-sm transition-colors hover:bg-white dark:border-neutral-700 dark:bg-neutral-900/90 dark:text-neutral-100 dark:hover:bg-neutral-900"
                    >
                      <ChevronLeft className="h-4 w-4" strokeWidth={1.8} />
                    </button>
                    <button
                      type="button"
                      onClick={() => goSlide(slideIdx + 1)}
                      aria-label="Next image"
                      className="absolute top-1/2 right-3 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white/90 text-neutral-900 shadow-sm transition-colors hover:bg-white dark:border-neutral-700 dark:bg-neutral-900/90 dark:text-neutral-100 dark:hover:bg-neutral-900"
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
            </div>
          )}

          {/* 01 // Challenge & Approach */}
          <div className="grid grid-cols-1 gap-8 py-8 md:grid-cols-2">
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
          </div>

          {/* 03 // How It Works (Narrative Stages) */}
          <div className="py-8">
            <div className="mb-5 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              <Workflow className="h-4 w-4" strokeWidth={1.8} />
              <span>03 // How It Works</span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {project.wiki.workflow.map((stage) => (
                <div
                  key={stage.step}
                  className="rounded-lg border border-neutral-200 bg-neutral-50/70 p-4 sm:p-5 dark:border-neutral-800 dark:bg-neutral-900/50"
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
                        className="rounded bg-white px-2 py-0.5 font-mono text-xs text-neutral-700 dark:bg-neutral-950 dark:text-neutral-300"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 04 // Key Decisions & Outcomes */}
          <div className="grid grid-cols-1 gap-8 py-8 md:grid-cols-2">
            <div>
              <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                <Layers className="h-4 w-4" strokeWidth={1.8} />
                <span>04 // Key Decisions</span>
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
                <span>05 // Outcomes &amp; Tools</span>
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

              <div className="mt-5 flex flex-wrap gap-1.5 border-t border-neutral-200 pt-4 dark:border-neutral-800">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded bg-neutral-100 px-2.5 py-1 font-mono text-xs text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
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
