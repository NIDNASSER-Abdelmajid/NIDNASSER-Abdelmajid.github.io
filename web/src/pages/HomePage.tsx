import { ArrowRight, BookOpen, Check, Copy, MapPin } from 'lucide-react'
import { PipelineTopology } from '../components/PipelineTopology'
import { ProfilePhoto } from '../components/ProfilePhoto'
import { PROFILE } from '../data/portfolio'

interface HomePageProps {
  copied: boolean
  onCopyEmail: () => void
  onNavigate: (path: string) => void
}

export function HomePage({ copied, onCopyEmail, onNavigate }: HomePageProps) {
  return (
    <section className="bg-blueprint-grid flex min-h-[calc(100vh-8rem)] items-center py-10 @2xl:py-16">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-10 @5xl:grid-cols-12 @5xl:gap-12">
          <div className="@5xl:col-span-5">
            {/* Compact Mobile Identity Block (shown only on < md where sidebar is in drawer) */}
            <div className="mb-6 flex items-center gap-4 md:hidden">
              <ProfilePhoto name={PROFILE.name} photoUrl={PROFILE.photoUrl} size="compact" />
              <div>
                <div className="text-base font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
                  {PROFILE.name}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 font-mono text-xs text-neutral-600 dark:text-neutral-400">
                  <span>{PROFILE.role}</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" strokeWidth={1.8} />
                    {PROFILE.location}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-5 hidden items-center gap-2 font-mono text-xs text-neutral-600 md:inline-flex dark:text-neutral-400">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-950 dark:bg-neutral-50" />
              <span>{PROFILE.availability}</span>
            </div>

            <h1 className="text-3xl font-semibold leading-[1.12] tracking-tight text-neutral-950 @md:text-4xl dark:text-neutral-50">
              {PROFILE.headline}
            </h1>

            <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
              {PROFILE.summary}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('/projects')}
                className="inline-flex items-center gap-2 rounded-lg bg-neutral-950 px-5 py-2.5 font-mono text-xs font-medium text-neutral-50 transition-colors hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200"
              >
                <span>Projects</span>
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.8} />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/blog')}
                className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 font-mono text-xs text-neutral-800 transition-colors hover:border-neutral-950 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-400"
              >
                <BookOpen className="h-3.5 w-3.5" strokeWidth={1.8} />
                <span>Blog</span>
              </button>

              <button
                type="button"
                onClick={onCopyEmail}
                className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 font-mono text-xs text-neutral-800 transition-colors hover:border-neutral-950 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-400"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" strokeWidth={1.8} />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" strokeWidth={1.8} />
                    <span>Email</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-9 grid grid-cols-3 gap-4 border-t border-neutral-200 pt-6 dark:border-neutral-800">
              {PROFILE.metrics.map((metric) => (
                <div key={metric.label}>
                  <div className="font-mono text-lg sm:text-xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
                    {metric.value}
                  </div>
                  <div className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="@5xl:col-span-7">
            <PipelineTopology />
          </div>
        </div>
      </div>
    </section>
  )
}
