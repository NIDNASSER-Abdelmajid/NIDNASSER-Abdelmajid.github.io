import { ArrowUpRight, Check, Copy, Mail, MapPin, Terminal } from 'lucide-react'
import { GitHubIcon, LinkedInIcon } from '../components/BrandIcons'
import { PROFILE } from '../data/portfolio'

interface ContactPageProps {
  copied: boolean
  onCopyEmail: () => void
}

const ENGAGEMENT_AREAS = [
  'Batch & Incremental CDC Pipelines (Databricks / PySpark / SQL)',
  'Workflow Orchestration & Event Streaming (Airflow / Kafka)',
  'Dimensional Modeling & BI Semantic Layers (Star & Snowflake Schemas)',
  'Large-Scale Web Acquisition & Automated ETL QA Systems',
]

export function ContactPage({ copied, onCopyEmail }: ContactPageProps) {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 border-b border-neutral-200 pb-8 dark:border-neutral-800">
          <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
            <Terminal className="h-3.5 w-3.5" strokeWidth={1.8} />
            <span>05 // Connect</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl dark:text-neutral-50">
            Contact &amp; Availability
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Open to Data Engineering roles, lakehouse and ETL architecture projects, and
            distributed data platform collaborations.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="rounded-lg border border-neutral-200 bg-white p-6 sm:p-8 lg:col-span-7 dark:border-neutral-800 dark:bg-neutral-900/50">
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-neutral-600 dark:text-neutral-400">
              <span className="inline-flex items-center gap-2 rounded border border-neutral-300 bg-neutral-50 px-2.5 py-1 text-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100">
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-950 dark:bg-neutral-50" />
                {PROFILE.availability}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
                {PROFILE.location}
              </span>
            </div>

            <h2 className="mt-6 text-2xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
              Direct Endpoint
            </h2>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Fastest way to reach me is directly by email or LinkedIn.
            </p>

            <div className="mt-5 rounded border border-neutral-200 bg-neutral-50 p-4 font-mono text-xs text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100">
              {PROFILE.email}
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={`mailto:${PROFILE.email}`}
                className="inline-flex items-center gap-2 rounded border border-neutral-950 bg-neutral-950 px-4 py-2.5 font-mono text-xs font-medium text-neutral-50 transition-colors hover:bg-neutral-800 dark:border-neutral-50 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200"
              >
                <Mail className="h-3.5 w-3.5" strokeWidth={1.8} />
                <span>Send Email</span>
              </a>

              <button
                type="button"
                onClick={onCopyEmail}
                className="inline-flex items-center gap-2 rounded border border-neutral-300 bg-white px-4 py-2.5 font-mono text-xs text-neutral-900 transition-colors hover:border-neutral-950 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:border-neutral-400"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" strokeWidth={1.8} />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" strokeWidth={1.8} />
                    <span>Copy Address</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900/50">
              <div className="font-mono text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Engineering Focus
              </div>
              <ul className="mt-4 space-y-2.5">
                {ENGAGEMENT_AREAS.map((area) => (
                  <li
                    key={area}
                    className="flex items-start gap-2.5 text-xs leading-relaxed text-neutral-700 dark:text-neutral-300"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-neutral-400" />
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900/50">
              <div className="font-mono text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Profiles
              </div>
              <div className="mt-4 space-y-2.5">
                <a
                  href={PROFILE.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 font-mono text-xs text-neutral-800 transition-colors hover:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:border-neutral-400"
                >
                  <span className="inline-flex items-center gap-2">
                    <GitHubIcon className="h-3.5 w-3.5" />
                    GitHub (@NIDNASSER-Abdelmajid)
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
                </a>

                <a
                  href={PROFILE.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 font-mono text-xs text-neutral-800 transition-colors hover:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:border-neutral-400"
                >
                  <span className="inline-flex items-center gap-2">
                    <LinkedInIcon className="h-3.5 w-3.5" />
                    LinkedIn (Abdelmajid NIDNASSER)
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
                </a>

                <a
                  href={PROFILE.links.freelancer}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 font-mono text-xs text-neutral-800 transition-colors hover:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:border-neutral-400"
                >
                  <span>Freelancer (@NIDNASSER)</span>
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
