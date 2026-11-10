import { useEffect, useState } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Calendar,
  Check,
  Clock,
  Code2,
  Copy,
  ExternalLink,
  Eye,
  Maximize2,
  Search,
  X,
} from 'lucide-react'
import { BLOG_POSTS } from '../data/blog'
import { useBlogReads } from '../hooks/useBlogReads'
import type { BlogImage, BlogPost } from '../types/portfolio'

type TopicFilter = 'All' | BlogPost['topic']

const TOPICS: TopicFilter[] = ['All', 'Lakehouse', 'ETL & Ingestion', 'Data Modeling']
const POST_SLUGS = BLOG_POSTS.map((p) => p.slug)

function formatReadsLabel(count: number | null): string {
  if (count === null) return '...'
  return `${count.toLocaleString()} ${count === 1 ? 'read' : 'reads'}`
}

interface BlogPageProps {
  activeSlug: string | null
  onNavigate: (path: string) => void
}

export function BlogPage({ activeSlug, onNavigate }: BlogPageProps) {
  const [topic, setTopic] = useState<TopicFilter>('All')
  const [query, setQuery] = useState('')
  const [copiedCodeKey, setCopiedCodeKey] = useState<string | null>(null)
  const [openContextMap, setOpenContextMap] = useState<Record<string, boolean>>({})
  const [zoomedImage, setZoomedImage] = useState<BlogImage | null>(null)

  const readsMap = useBlogReads(POST_SLUGS, activeSlug)

  useEffect(() => {
    setOpenContextMap({})
    setZoomedImage(null)
  }, [activeSlug])

  useEffect(() => {
    if (!zoomedImage) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoomedImage(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [zoomedImage])

  const toggleImageContext = (key: string) => {
    setOpenContextMap((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  if (activeSlug) {
    const idx = BLOG_POSTS.findIndex((p) => p.slug === activeSlug)
    const post = idx >= 0 ? BLOG_POSTS[idx] : BLOG_POSTS[0]
    const prevPost = idx > 0 ? BLOG_POSTS[idx - 1] : null
    const nextPost = idx < BLOG_POSTS.length - 1 ? BLOG_POSTS[idx + 1] : null
    const postReads = readsMap[post.slug] ?? null

    const copyCode = (label: string, content: string) => {
      navigator.clipboard?.writeText(content).catch(() => {})
      setCopiedCodeKey(label)
      window.setTimeout(() => setCopiedCodeKey(null), 1800)
    }

    return (
      <article className="py-10 sm:py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-4 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => onNavigate('/blog')}
              className="inline-flex items-center gap-1.5 rounded-md bg-neutral-100 px-3 py-1.5 font-mono text-xs text-neutral-800 transition-colors hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
              <span>All Notes</span>
            </button>

            <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-neutral-500 dark:text-neutral-400">
              <span>{post.code}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" strokeWidth={1.8} />
                {post.publishedAt}
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" strokeWidth={1.8} />
                {post.readTime}
              </span>
              <span>·</span>
              <span
                title="Live global count of engaged reads"
                className="inline-flex items-center gap-1"
              >
                <Eye className="h-3.5 w-3.5" strokeWidth={1.8} />
                {formatReadsLabel(postReads)}
              </span>
            </div>
          </div>

          <header>
            <span className="rounded bg-neutral-100 px-2.5 py-1 font-mono text-xs text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
              {post.topic}
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl dark:text-neutral-50">
              {post.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
              {post.excerpt}
            </p>
          </header>

          <div className="mt-10 space-y-10">
            {post.sections.map((section, sectionIdx) => (
              <section key={section.heading} className="space-y-5">
                <h2 className="text-xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
                  {section.heading}
                </h2>

                {section.paragraphs.map((p) => (
                  <p
                    key={p}
                    className="text-sm sm:text-base leading-7 text-neutral-700 dark:text-neutral-300"
                  >
                    {p}
                  </p>
                ))}

                {section.bullets && (
                  <ul className="space-y-2 border-l-2 border-neutral-300 pl-4 dark:border-neutral-700">
                    {section.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="font-mono text-xs sm:text-sm leading-relaxed text-neutral-700 dark:text-neutral-300"
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}

                {section.images && section.images.length > 0 && (
                  <div className="space-y-4">
                    {section.images.map((img, imgIdx) => {
                      const imgKey = `${sectionIdx}-${imgIdx}`
                      const contextOpen = Boolean(openContextMap[imgKey])
                      return (
                        <figure
                          key={img.src + imgIdx}
                          className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100/70 dark:border-neutral-800 dark:bg-neutral-900"
                        >
                          <div className="relative">
                            <img
                              src={img.src}
                              alt={img.alt}
                              loading="lazy"
                              className="max-h-[480px] w-full object-contain bg-neutral-950/5 dark:bg-neutral-950"
                            />
                            <div className="absolute top-3 right-3 flex items-center gap-1.5">
                              {img.context && (
                                <button
                                  type="button"
                                  onClick={() => toggleImageContext(imgKey)}
                                  aria-label={contextOpen ? 'Hide image context' : 'Explain image'}
                                  className={`inline-flex h-8 w-8 items-center justify-center rounded-full border shadow-sm transition-colors ${
                                    contextOpen
                                      ? 'border-neutral-950 bg-neutral-950 text-neutral-50 dark:border-neutral-50 dark:bg-neutral-50 dark:text-neutral-950'
                                      : 'border-neutral-200 bg-white/95 text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900/95 dark:text-neutral-100'
                                  }`}
                                >
                                  <AlertCircle className="h-4 w-4" strokeWidth={1.8} />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => setZoomedImage(img)}
                                aria-label="Expand image"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white/95 text-neutral-900 shadow-sm dark:border-neutral-700 dark:bg-neutral-900/95 dark:text-neutral-100"
                              >
                                <Maximize2 className="h-3.5 w-3.5" strokeWidth={1.8} />
                              </button>
                            </div>

                            {contextOpen && img.context && (
                              <div className="border-t border-neutral-200 bg-white p-4 text-xs sm:text-sm leading-relaxed text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300">
                                {img.context}
                              </div>
                            )}
                          </div>
                          {img.caption && (
                            <figcaption className="border-t border-neutral-200 px-4 py-2.5 font-mono text-xs text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
                              {img.caption}
                            </figcaption>
                          )}
                        </figure>
                      )
                    })}
                  </div>
                )}

                {section.embeds && section.embeds.length > 0 && (
                  <div className="space-y-4">
                    {section.embeds.map((embed, embedIdx) => {
                      if (embed.type === 'callout') {
                        return (
                          <div
                            key={`${embed.title}-${embedIdx}`}
                            className="rounded-lg border border-neutral-200 bg-neutral-100/80 p-4 dark:border-neutral-800 dark:bg-neutral-900"
                          >
                            <div className="font-mono text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                              {embed.label}
                            </div>
                            <div className="mt-1 text-sm font-semibold text-neutral-950 dark:text-neutral-50">
                              {embed.title}
                            </div>
                            <p className="mt-1.5 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                              {embed.body}
                            </p>
                          </div>
                        )
                      }

                      if (embed.type === 'link') {
                        return (
                          <a
                            key={`${embed.url}-${embedIdx}`}
                            href={embed.url}
                            target="_blank"
                            rel="noreferrer"
                            className="group flex items-start justify-between gap-4 rounded-lg border border-neutral-200 bg-white p-4 transition-colors hover:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-neutral-400"
                          >
                            <div>
                              <div className="inline-flex items-center gap-1.5 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                                <ExternalLink className="h-3 w-3" strokeWidth={1.8} />
                                <span>{embed.source}</span>
                              </div>
                              <div className="mt-1 text-sm font-semibold text-neutral-950 dark:text-neutral-50">
                                {embed.title}
                              </div>
                              {embed.description && (
                                <p className="mt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                                  {embed.description}
                                </p>
                              )}
                            </div>
                            <ArrowUpRight
                              className="mt-1 h-4 w-4 shrink-0 text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neutral-950 dark:group-hover:text-neutral-50"
                              strokeWidth={1.8}
                            />
                          </a>
                        )
                      }

                      const ratioClass =
                        embed.aspectRatio === 'tall'
                          ? 'h-[480px]'
                          : embed.aspectRatio === '4/3'
                            ? 'aspect-[4/3]'
                            : 'aspect-video'

                      return (
                        <figure
                          key={`${embed.src}-${embedIdx}`}
                          className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
                        >
                          <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-2.5 dark:border-neutral-800">
                            <span className="font-mono text-xs text-neutral-700 dark:text-neutral-300">
                              {embed.title}
                            </span>
                            <a
                              href={embed.src}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 font-mono text-xs text-neutral-500 hover:text-neutral-950 dark:hover:text-neutral-50"
                            >
                              <span>Open</span>
                              <ArrowUpRight className="h-3 w-3" strokeWidth={1.8} />
                            </a>
                          </div>
                          <iframe
                            src={embed.src}
                            title={embed.title}
                            loading="lazy"
                            allowFullScreen
                            className={`w-full border-0 ${ratioClass}`}
                          />
                          {embed.caption && (
                            <figcaption className="border-t border-neutral-200 px-4 py-2.5 font-mono text-xs text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
                              {embed.caption}
                            </figcaption>
                          )}
                        </figure>
                      )
                    })}
                  </div>
                )}

                {section.code && (
                  <div className="overflow-hidden rounded-lg bg-neutral-100/80 dark:bg-neutral-900">
                    <div className="flex items-center justify-between border-b border-neutral-200/80 px-4 py-2.5 dark:border-neutral-800">
                      <span className="inline-flex items-center gap-1.5 font-mono text-xs text-neutral-700 dark:text-neutral-300">
                        <Code2 className="h-3.5 w-3.5" strokeWidth={1.8} />
                        {section.code.label}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyCode(section.code!.label, section.code!.content)}
                        className="inline-flex items-center gap-1 rounded bg-white px-2.5 py-1 font-mono text-xs text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-800"
                      >
                        {copiedCodeKey === section.code.label ? (
                          <>
                            <Check className="h-3.5 w-3.5" strokeWidth={1.8} />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" strokeWidth={1.8} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="overflow-x-auto p-4 font-mono text-xs sm:text-sm leading-relaxed text-neutral-900 dark:text-neutral-100">
                      <code>{section.code.content}</code>
                    </pre>
                  </div>
                )}
              </section>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-6 dark:border-neutral-800">
            <div>
              {prevPost && (
                <button
                  type="button"
                  onClick={() => onNavigate(`/blog/${prevPost.slug}`)}
                  className="inline-flex items-center gap-2 rounded-md bg-neutral-100 px-3.5 py-2 font-mono text-xs text-neutral-800 transition-colors hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
                  <span>{prevPost.code}</span>
                </button>
              )}
            </div>
            <div>
              {nextPost && (
                <button
                  type="button"
                  onClick={() => onNavigate(`/blog/${nextPost.slug}`)}
                  className="inline-flex items-center gap-2 rounded-md bg-neutral-100 px-3.5 py-2 font-mono text-xs text-neutral-800 transition-colors hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  <span>{nextPost.code}</span>
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.8} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Zoomed Blog Image Modal */}
        {zoomedImage && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={zoomedImage.alt}
            className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/85 p-4 backdrop-blur-xs"
            onClick={() => setZoomedImage(null)}
          >
            <div
              className="relative max-w-4xl overflow-hidden rounded-xl border border-neutral-700 bg-neutral-950 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setZoomedImage(null)}
                aria-label="Close expanded image"
                className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900/90 text-neutral-100 hover:bg-neutral-800"
              >
                <X className="h-4 w-4" strokeWidth={1.8} />
              </button>
              <img
                src={zoomedImage.src}
                alt={zoomedImage.alt}
                className="max-h-[82vh] w-auto object-contain"
              />
              {zoomedImage.caption && (
                <div className="border-t border-neutral-800 px-4 py-2.5 font-mono text-xs text-neutral-300">
                  {zoomedImage.caption}
                </div>
              )}
            </div>
          </div>
        )}
      </article>
    )
  }

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesTopic = topic === 'All' || post.topic === topic
    const q = query.trim().toLowerCase()
    const matchesQuery =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.tags.some((t) => t.toLowerCase().includes(q))
    return matchesTopic && matchesQuery
  })

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <div className="mb-8 flex flex-col justify-between gap-6 border-b border-neutral-200 pb-8 @4xl:flex-row @4xl:items-end dark:border-neutral-800">
          <div>
            <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              <BookOpen className="h-3.5 w-3.5" strokeWidth={1.8} />
              <span>05 // Engineering Notes</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl dark:text-neutral-50">
              Blog
            </h1>
            <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
              Short notes on CDC pipelines, web extraction, and warehouse modeling.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <div className="relative w-full sm:w-64">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400"
                strokeWidth={1.8}
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search notes..."
                aria-label="Search blog posts"
                className="w-full rounded-md border border-neutral-200 bg-white py-2 pr-3 pl-9 font-mono text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50 dark:focus:border-neutral-400"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {TOPICS.map((t) => {
                const active = topic === t
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTopic(t)}
                    className={`rounded-md px-3 py-1.5 font-mono text-xs transition-colors ${
                      active
                        ? 'bg-neutral-950 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-950'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800'
                    }`}
                  >
                    {t}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900/50">
          {filteredPosts.length === 0 ? (
            <div className="p-8 text-center font-mono text-xs text-neutral-500">
              No articles matched your filter.
            </div>
          ) : (
            filteredPosts.map((post) => {
              const postReads = readsMap[post.slug] ?? null
              return (
                <article
                  key={post.slug}
                  onClick={() => onNavigate(`/blog/${post.slug}`)}
                  className="group cursor-pointer p-6 transition-colors hover:bg-neutral-50 sm:p-7 dark:hover:bg-neutral-900"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {post.code}
                      </span>
                      <span>·</span>
                      <span>{post.topic}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span>{post.publishedAt}</span>
                      <span>·</span>
                      <span>{post.readTime}</span>
                      <span>·</span>
                      <span
                        title="Live global count of engaged reads"
                        className="inline-flex items-center gap-1"
                      >
                        <Eye className="h-3.5 w-3.5" strokeWidth={1.8} />
                        {formatReadsLabel(postReads)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                      <h2 className="text-xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
                        {post.title}
                      </h2>
                      <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                        {post.excerpt}
                      </p>
                    </div>

                    <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-xs font-medium text-neutral-900 transition-transform group-hover:translate-x-0.5 dark:text-neutral-100">
                      <span>Read</span>
                      <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.8} />
                    </span>
                  </div>
                </article>
              )
            })
          )}
        </div>
      </div>
    </section>
  )
}
