import { ArrowUp, ArrowUpRight, Check, Copy, Mail, Terminal } from 'lucide-react'
import { GitHubIcon, LinkedInIcon } from './BrandIcons'
import { PROFILE } from '../data/portfolio'

interface ContactFooterProps {
  copied: boolean
  onCopyEmail: () => void
}

export function ContactFooter({ copied, onCopyEmail }: ContactFooterProps) {
  return (
    <>
      <section
        id="contact"
        className="border-t border-neutral-200 py-20 sm:py-24 dark:border-neutral-800"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rounded-lg border border-neutral-200 bg-white p-6 sm:p-10 dark:border-neutral-800 dark:bg-neutral-900/50">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                  <Terminal className="h-3.5 w-3.5" strokeWidth={1.8} />
                  <span>05 // Connect</span>
                </div>
                <h2 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl dark:text-neutral-50">
                  Let&apos;s build reliable data infrastructure.
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Open to Data Engineering roles, Lakehouse / ETL architecture consulting,
                  and distributed pipeline engineering collaborations.
                </p>
              </div>

              <div className="flex flex-col gap-3 lg:col-span-5">
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={`mailto:${PROFILE.email}`}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded border border-neutral-950 bg-neutral-950 px-4 py-2.5 font-mono text-xs font-medium text-neutral-50 transition-colors hover:bg-neutral-800 dark:border-neutral-50 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200"
                  >
                    <Mail className="h-3.5 w-3.5" strokeWidth={1.8} />
                    <span>Send Email</span>
                  </a>

                  <button
                    type="button"
                    onClick={onCopyEmail}
                    className="inline-flex items-center justify-center gap-2 rounded border border-neutral-300 bg-neutral-50 px-4 py-2.5 font-mono text-xs text-neutral-900 transition-colors hover:border-neutral-950 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:border-neutral-400"
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

                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={PROFILE.links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded border border-neutral-200 bg-neutral-50 px-3 py-2 font-mono text-xs text-neutral-700 transition-colors hover:border-neutral-950 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:border-neutral-50 dark:hover:text-neutral-50"
                  >
                    <GitHubIcon className="h-3.5 w-3.5" />
                    <span>GitHub</span>
                  </a>

                  <a
                    href={PROFILE.links.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded border border-neutral-200 bg-neutral-50 px-3 py-2 font-mono text-xs text-neutral-700 transition-colors hover:border-neutral-950 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:border-neutral-50 dark:hover:text-neutral-50"
                  >
                    <LinkedInIcon className="h-3.5 w-3.5" />
                    <span>LinkedIn</span>
                  </a>

                  <a
                    href={PROFILE.links.freelancer}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1 rounded border border-neutral-200 bg-neutral-50 px-3 py-2 font-mono text-xs text-neutral-700 transition-colors hover:border-neutral-950 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:border-neutral-50 dark:hover:text-neutral-50"
                  >
                    <span>Freelancer</span>
                    <ArrowUpRight className="h-3 w-3" strokeWidth={1.8} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-neutral-200 py-8 dark:border-neutral-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 font-mono text-[11px] text-neutral-500 sm:flex-row sm:px-6 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <span>{PROFILE.name}</span>
            <span>·</span>
            <span>{PROFILE.role}</span>
            <span>·</span>
            <span>{new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-4">
            <span>Press Cmd/Ctrl + K for quick navigation</span>
            <a
              href="#top"
              aria-label="Back to top"
              className="inline-flex h-7 w-7 items-center justify-center rounded border border-neutral-200 bg-white text-neutral-600 transition-colors hover:border-neutral-950 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-50 dark:hover:text-neutral-50"
            >
              <ArrowUp className="h-3.5 w-3.5" strokeWidth={1.8} />
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
