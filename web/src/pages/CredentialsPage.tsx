import { useEffect, useState } from 'react'
import { ArrowUpRight, Award, BadgeCheck, Eye, Trophy, X } from 'lucide-react'
import { CREDENTIALS } from '../data/portfolio'
import type { CredentialItem } from '../types/portfolio'

type CredFilter = 'All' | CredentialItem['category']

const FILTERS: CredFilter[] = ['All', 'Certification', 'Recognition']

export function CredentialsPage() {
  const [filter, setFilter] = useState<CredFilter>('All')
  const [previewItem, setPreviewItem] = useState<CredentialItem | null>(null)

  useEffect(() => {
    if (!previewItem) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPreviewItem(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [previewItem])

  const filtered =
    filter === 'All'
      ? CREDENTIALS
      : CREDENTIALS.filter((item) => item.category === filter)

  const countFor = (cat: CredFilter) =>
    cat === 'All'
      ? CREDENTIALS.length
      : CREDENTIALS.filter((item) => item.category === cat).length

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <div className="mb-10 flex flex-col justify-between gap-6 border-b border-neutral-200 pb-8 @4xl:flex-row @4xl:items-end dark:border-neutral-800">
          <div>
            <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              <Award className="h-3.5 w-3.5" strokeWidth={1.8} />
              <span>03 // Verified Record</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl dark:text-neutral-50">
              Credentials
            </h1>
            <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
              Technical certifications, competitive honors, and engineering recognitions.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Filter credentials"
            className="flex flex-wrap gap-2"
          >
            {FILTERS.map((cat) => {
              const active = filter === cat
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(cat)}
                  className={`rounded-md px-3 py-1.5 font-mono text-xs transition-colors ${
                    active
                      ? 'bg-neutral-950 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-950'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-950 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-50'
                  }`}
                >
                  {cat} ({countFor(cat)})
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 @3xl:grid-cols-2 @5xl:grid-cols-3">
          {filtered.map((cred) => {
            const Icon = cred.category === 'Certification' ? BadgeCheck : Trophy
            const hasActions = Boolean(cred.credentialUrl || cred.imageUrl)

            return (
              <article
                key={cred.id}
                className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900/50"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                    <span className="inline-flex items-center gap-1.5 rounded bg-neutral-100 px-2.5 py-1 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                      <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
                      <span>{cred.category}</span>
                    </span>
                    <span>{cred.year}</span>
                  </div>

                  <h2 className="mt-4 text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
                    {cred.title}
                  </h2>
                  <div className="mt-1 font-mono text-xs text-neutral-600 dark:text-neutral-400">
                    {cred.issuer}
                  </div>

                  {cred.summary && (
                    <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                      {cred.summary}
                    </p>
                  )}
                </div>

                {hasActions && (
                  <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-neutral-200/80 pt-4 dark:border-neutral-800">
                    {cred.credentialUrl && (
                      <a
                        href={cred.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-md bg-neutral-950 px-3 py-1.5 font-mono text-xs text-neutral-50 transition-colors hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200"
                      >
                        <span>Verify Link</span>
                        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
                      </a>
                    )}

                    {cred.imageUrl && (
                      <button
                        type="button"
                        onClick={() => setPreviewItem(cred)}
                        className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3 py-1.5 font-mono text-xs text-neutral-800 transition-colors hover:border-neutral-950 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-400"
                      >
                        <Eye className="h-3.5 w-3.5" strokeWidth={1.8} />
                        <span>View Certificate</span>
                      </button>
                    )}
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </div>

      {/* Certificate Image Lightbox Modal */}
      {previewItem && previewItem.imageUrl && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Certificate image for ${previewItem.title}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 p-4 backdrop-blur-xs"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="w-full max-w-3xl overflow-hidden rounded-xl border border-neutral-300 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-950"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-3.5 dark:border-neutral-800">
              <div>
                <div className="text-sm font-semibold text-neutral-950 dark:text-neutral-50">
                  {previewItem.title}
                </div>
                <div className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
                  {previewItem.issuer} · {previewItem.year}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                aria-label="Close certificate preview"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <X className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </div>

            <div className="bg-neutral-100 p-4 dark:bg-neutral-900">
              <img
                src={previewItem.imageUrl}
                alt={previewItem.imageAlt ?? `${previewItem.title} certificate`}
                className="mx-auto max-h-[75vh] w-auto rounded object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
