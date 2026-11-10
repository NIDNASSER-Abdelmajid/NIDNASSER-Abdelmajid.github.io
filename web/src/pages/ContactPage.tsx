import { ArrowUpRight, Check, Copy, Mail, MapPin, Terminal } from 'lucide-react'
import { GitHubIcon, LinkedInIcon } from '../components/BrandIcons'
import { PROFILE } from '../data/portfolio'

interface ContactPageProps {
  copied: boolean
  onCopyEmail: () => void
}

const FOCUS_TAGS = [
  'Databricks & Spark Lakehouses',
  'Airflow & Kafka Pipelines',
  'Star & Snowflake Warehousing',
  'Automated Web Extraction',
]

export function ContactPage({ copied, onCopyEmail }: ContactPageProps) {
  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <div className="mb-10 border-b border-neutral-200 pb-8 dark:border-neutral-800">
          <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
            <Terminal className="h-3.5 w-3.5" strokeWidth={1.8} />
            <span>06 // Connect</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl dark:text-neutral-50">
            Contact
          </h1>
          <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
            Open to Data Engineering roles and data platform collaborations.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 @4xl:grid-cols-12">
          <div className="rounded-xl border border-neutral-200 bg-white p-6 sm:p-8 @4xl:col-span-7 dark:border-neutral-800 dark:bg-neutral-900/50">
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-neutral-600 dark:text-neutral-400">
              <span className="inline-flex items-center gap-2 rounded bg-neutral-100 px-2.5 py-1 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100">
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-950 dark:bg-neutral-50" />
                {PROFILE.availability}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
                {PROFILE.location}
              </span>
            </div>

            <div className="mt-6 rounded-lg bg-neutral-100/80 p-4 font-mono text-sm text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
              {PROFILE.email}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={`mailto:${PROFILE.email}`}
                className="inline-flex items-center gap-2 rounded-lg bg-neutral-950 px-5 py-2.5 font-mono text-xs font-medium text-neutral-50 transition-colors hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200"
              >
                <Mail className="h-3.5 w-3.5" strokeWidth={1.8} />
                <span>Send Email</span>
              </a>

              <button
                type="button"
                onClick={onCopyEmail}
                className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-5 py-2.5 font-mono text-xs text-neutral-900 transition-colors hover:border-neutral-950 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:border-neutral-400"
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

            <div className="mt-8 border-t border-neutral-200 pt-6 dark:border-neutral-800">
              <div className="mb-3 font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                Core Scope
              </div>
              <div className="flex flex-wrap gap-2">
                {FOCUS_TAGS.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-neutral-100 px-3 py-1.5 font-mono text-xs text-neutral-800 dark:bg-neutral-800/80 dark:text-neutral-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="@4xl:col-span-5">
            <div className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900/50">
              <a
                href={PROFILE.links.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-5 font-mono text-xs sm:text-sm text-neutral-800 transition-colors hover:bg-neutral-50 dark:text-neutral-200 dark:hover:bg-neutral-900"
              >
                <span className="inline-flex items-center gap-2.5">
                  <GitHubIcon className="h-4 w-4" />
                  GitHub (@NIDNASSER-Abdelmajid)
                </span>
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
              </a>

              <a
                href={PROFILE.links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-5 font-mono text-xs sm:text-sm text-neutral-800 transition-colors hover:bg-neutral-50 dark:text-neutral-200 dark:hover:bg-neutral-900"
              >
                <span className="inline-flex items-center gap-2.5">
                  <LinkedInIcon className="h-4 w-4" />
                  LinkedIn (Abdelmajid NIDNASSER)
                </span>
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
              </a>

              <a
                href={PROFILE.links.freelancer}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-5 font-mono text-xs sm:text-sm text-neutral-800 transition-colors hover:bg-neutral-50 dark:text-neutral-200 dark:hover:bg-neutral-900"
              >
                <span>Freelancer (@NIDNASSER)</span>
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
