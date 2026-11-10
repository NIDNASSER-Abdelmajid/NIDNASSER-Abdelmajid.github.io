import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Check,
  Copy,
  Database,
  Layers,
  Mail,
  MapPin,
} from 'lucide-react'
import { GitHubIcon, LinkedInIcon } from '../components/BrandIcons'
import { PipelineTopology } from '../components/PipelineTopology'
import { BLOG_POSTS } from '../data/blog'
import { PROFILE, PROJECTS } from '../data/portfolio'

interface HomePageProps {
  copied: boolean
  onCopyEmail: () => void
  onNavigate: (path: string) => void
}

export function HomePage({ copied, onCopyEmail, onNavigate }: HomePageProps) {
  return (
    <>
      <section className="bg-blueprint-grid relative overflow-hidden py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded border border-neutral-300 bg-white px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-neutral-950 dark:bg-neutral-50" />
                  {PROFILE.role}
                </span>
                <span className="inline-flex items-center gap-1 font-mono text-xs text-neutral-600 dark:text-neutral-400">
                  <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
                  {PROFILE.location}
                </span>
              </div>

              <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl dark:text-neutral-50">
                {PROFILE.name}
              </h1>

              <p className="mt-4 text-lg font-medium leading-snug text-neutral-800 sm:text-xl dark:text-neutral-200">
                {PROFILE.headline}
              </p>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {PROFILE.summary}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('/projects')}
                  className="inline-flex items-center gap-2 rounded border border-neutral-950 bg-neutral-950 px-4 py-2.5 font-mono text-xs font-medium text-neutral-50 transition-colors hover:bg-neutral-800 dark:border-neutral-50 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200"
                >
                  <span>Explore Projects</span>
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.8} />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('/blog')}
                  className="inline-flex items-center gap-2 rounded border border-neutral-300 bg-white px-4 py-2.5 font-mono text-xs text-neutral-800 transition-colors hover:border-neutral-950 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-400"
                >
                  <BookOpen className="h-3.5 w-3.5" strokeWidth={1.8} />
                  <span>Engineering Notes</span>
                </button>

                <button
                  type="button"
                  onClick={onCopyEmail}
                  className="inline-flex items-center gap-2 rounded border border-neutral-300 bg-white px-3.5 py-2.5 font-mono text-xs text-neutral-800 transition-colors hover:border-neutral-950 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-400"
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

                <div className="flex items-center gap-2">
                  <a
                    href={PROFILE.links.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub profile"
                    className="inline-flex h-9 w-9 items-center justify-center rounded border border-neutral-300 bg-white text-neutral-700 transition-colors hover:border-neutral-950 hover:text-neutral-950 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-400 dark:hover:text-neutral-50"
                  >
                    <GitHubIcon className="h-4 w-4" />
                  </a>
                  <a
                    href={PROFILE.links.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn profile"
                    className="inline-flex h-9 w-9 items-center justify-center rounded border border-neutral-300 bg-white text-neutral-700 transition-colors hover:border-neutral-950 hover:text-neutral-950 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-400 dark:hover:text-neutral-50"
                  >
                    <LinkedInIcon className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-3 border-t border-neutral-200 pt-6 dark:border-neutral-800">
                {PROFILE.metrics.map((metric) => (
                  <div key={metric.label}>
                    <div className="font-mono text-xl font-semibold tracking-tight text-neutral-950 sm:text-2xl dark:text-neutral-50">
                      {metric.value}
                    </div>
                    <div className="mt-1 text-[11px] leading-snug text-neutral-600 dark:text-neutral-400">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <PipelineTopology />
            </div>
          </div>
        </div>
      </section>

      {/* Section Directory Routing Cards */}
      <section className="border-t border-neutral-200 py-14 dark:border-neutral-800">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-6 flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              Portfolio Modules
            </span>
            <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
              Select a dedicated page
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              {
                path: '/projects',
                code: '01',
                title: 'Projects',
                meta: `${PROJECTS.length} Pipeline Specs`,
                desc: 'Lineage DAGs, schema contracts, and quality gates.',
                icon: Database,
              },
              {
                path: '/experience',
                code: '02',
                title: 'Experience',
                meta: 'UM6P · Leyton · INPT',
                desc: 'Production roles, education, and certifications.',
                icon: Briefcase,
              },
              {
                path: '/stack',
                code: '03',
                title: 'Tech Stack',
                meta: 'SQL Matrix',
                desc: 'Query core tools across lakehouse, stream, and BI.',
                icon: Layers,
              },
              {
                path: '/blog',
                code: '04',
                title: 'Blog',
                meta: `${BLOG_POSTS.length} Articles`,
                desc: 'Notes on CDC, crawling, and dimensional modeling.',
                icon: BookOpen,
              },
              {
                path: '/contact',
                code: '05',
                title: 'Contact',
                meta: 'Rabat / Remote',
                desc: 'Direct email, GitHub, and engineering inquiries.',
                icon: Mail,
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => onNavigate(item.path)}
                  className="group flex flex-col justify-between rounded-lg border border-neutral-200 bg-white p-4 text-left transition-colors hover:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-neutral-400"
                >
                  <div>
                    <div className="flex items-center justify-between font-mono text-[10px] text-neutral-500 dark:text-neutral-400">
                      <span>{item.code}</span>
                      <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
                    </div>
                    <div className="mt-3 text-base font-semibold text-neutral-950 dark:text-neutral-50">
                      {item.title}
                    </div>
                    <div className="mt-1 font-mono text-[10px] text-neutral-500 dark:text-neutral-400">
                      {item.meta}
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {item.desc}
                    </p>
                  </div>
                  <div className="mt-4 inline-flex items-center gap-1 font-mono text-[11px] text-neutral-700 transition-transform group-hover:translate-x-0.5 dark:text-neutral-300">
                    <span>Open</span>
                    <ArrowRight className="h-3 w-3" strokeWidth={1.8} />
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
