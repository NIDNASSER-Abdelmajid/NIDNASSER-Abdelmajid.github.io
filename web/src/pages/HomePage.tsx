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

const MODULE_LINKS = [
  { path: '/projects', code: '01', title: 'Projects', meta: `${PROJECTS.length} Pipeline Specs`, icon: Database },
  { path: '/experience', code: '02', title: 'Experience', meta: 'UM6P · Leyton · INPT', icon: Briefcase },
  { path: '/stack', code: '03', title: 'Tech Stack', meta: '4-Layer Matrix', icon: Layers },
  { path: '/blog', code: '04', title: 'Blog', meta: `${BLOG_POSTS.length} Notes`, icon: BookOpen },
  { path: '/contact', code: '05', title: 'Contact', meta: 'Rabat / Remote', icon: Mail },
]

export function HomePage({ copied, onCopyEmail, onNavigate }: HomePageProps) {
  return (
    <>
      <section className="bg-blueprint-grid py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="mb-5 flex flex-wrap items-center gap-3 font-mono text-xs text-neutral-600 dark:text-neutral-400">
                <span className="inline-flex items-center gap-2 rounded bg-neutral-200/70 px-2.5 py-1 font-medium text-neutral-900 dark:bg-neutral-800/80 dark:text-neutral-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-neutral-950 dark:bg-neutral-50" />
                  {PROFILE.role}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
                  {PROFILE.location}
                </span>
              </div>

              <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-neutral-950 sm:text-5xl dark:text-neutral-50">
                {PROFILE.name}
              </h1>

              <p className="mt-5 text-base leading-relaxed text-neutral-700 sm:text-lg dark:text-neutral-300">
                {PROFILE.headline}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
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

                <div className="flex items-center gap-2">
                  <a
                    href={PROFILE.links.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub profile"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-300 bg-white text-neutral-700 transition-colors hover:border-neutral-950 hover:text-neutral-950 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-400 dark:hover:text-neutral-50"
                  >
                    <GitHubIcon className="h-4 w-4" />
                  </a>
                  <a
                    href={PROFILE.links.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn profile"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-300 bg-white text-neutral-700 transition-colors hover:border-neutral-950 hover:text-neutral-950 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-400 dark:hover:text-neutral-50"
                  >
                    <LinkedInIcon className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-neutral-200 pt-6 dark:border-neutral-800">
                {PROFILE.metrics.map((metric) => (
                  <div key={metric.label}>
                    <div className="font-mono text-2xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
                      {metric.value}
                    </div>
                    <div className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              <PipelineTopology />
            </div>
          </div>
        </div>
      </section>

      {/* Clean Minimal Module Directory Strip */}
      <section className="border-t border-neutral-200 py-10 dark:border-neutral-800">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-2 divide-y divide-neutral-200 sm:grid-cols-5 sm:divide-x sm:divide-y-0 dark:divide-neutral-800">
            {MODULE_LINKS.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => onNavigate(item.path)}
                  className="group flex flex-col justify-between px-4 py-4 text-left transition-colors hover:bg-neutral-100/70 dark:hover:bg-neutral-900/50"
                >
                  <div className="flex items-center justify-between font-mono text-xs text-neutral-500 dark:text-neutral-400">
                    <span>{item.code}</span>
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-neutral-950 dark:text-neutral-50">
                        {item.title}
                      </div>
                      <div className="mt-0.5 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                        {item.meta}
                      </div>
                    </div>
                    <ArrowRight
                      className="h-3.5 w-3.5 text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:text-neutral-950 dark:group-hover:text-neutral-50"
                      strokeWidth={1.8}
                    />
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
