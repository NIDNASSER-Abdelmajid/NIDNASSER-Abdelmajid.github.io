import { useState } from 'react'
import { Award, Briefcase, GraduationCap, MapPin } from 'lucide-react'
import { CREDENTIALS, EDUCATION, EXPERIENCES } from '../data/portfolio'

type LogFilter = 'All' | 'Experience' | 'Education' | 'Credentials'

const FILTERS: LogFilter[] = ['All', 'Experience', 'Education', 'Credentials']

export function ExperiencePage() {
  const [filter, setFilter] = useState<LogFilter>('All')

  const showExperience = filter === 'All' || filter === 'Experience'
  const showEducation = filter === 'All' || filter === 'Education'
  const showCredentials = filter === 'All' || filter === 'Credentials'

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <div className="grid grid-cols-1 gap-10 @4xl:grid-cols-12 @4xl:gap-12">
          <div className="@4xl:col-span-4">
            <div className="@4xl:sticky @4xl:top-10">
              <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                <Briefcase className="h-3.5 w-3.5" strokeWidth={1.8} />
                <span>02 // Execution Log</span>
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl dark:text-neutral-50">
                Experience
              </h1>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                Data engineering across enterprise warehouses, web pipelines, and INPT.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {FILTERS.map((item) => {
                  const active = filter === item
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setFilter(item)}
                      className={`rounded-md px-3 py-1.5 font-mono text-xs transition-colors ${
                        active
                          ? 'bg-neutral-950 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-950'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800'
                      }`}
                    >
                      {item}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="space-y-12 @4xl:col-span-8">
            {showExperience && (
              <div>
                <div className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                  <Briefcase className="h-3.5 w-3.5" strokeWidth={1.8} />
                  <span>Roles</span>
                </div>

                <div className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900/50">
                  {EXPERIENCES.map((exp) => (
                    <div key={exp.id} className="p-6">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h2 className="text-base sm:text-lg font-semibold text-neutral-950 dark:text-neutral-50">
                            {exp.role}
                          </h2>
                          <div className="mt-0.5 text-sm text-neutral-700 dark:text-neutral-300">
                            {exp.organization}
                          </div>
                        </div>

                        <div className="text-left font-mono text-xs text-neutral-500 sm:text-right dark:text-neutral-400">
                          <div>{exp.period}</div>
                          <div className="mt-0.5 inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3" strokeWidth={1.8} />
                            <span>{exp.location}</span>
                          </div>
                        </div>
                      </div>

                      <ul className="mt-4 space-y-2">
                        {exp.highlights.map((bullet) => (
                          <li
                            key={bullet}
                            className="flex items-start gap-2.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300"
                          >
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400 dark:bg-neutral-500" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {exp.stack.map((tech) => (
                          <span
                            key={tech}
                            className="rounded bg-neutral-100 px-2.5 py-1 font-mono text-xs text-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showEducation && (
              <div>
                <div className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                  <GraduationCap className="h-3.5 w-3.5" strokeWidth={1.8} />
                  <span>Education</span>
                </div>

                <div className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900/50">
                  {EDUCATION.map((edu) => (
                    <div key={edu.id} className="p-6">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h2 className="text-base font-semibold text-neutral-950 dark:text-neutral-50">
                            {edu.degree}
                          </h2>
                          <div className="mt-0.5 text-sm text-neutral-700 dark:text-neutral-300">
                            {edu.institution}
                          </div>
                        </div>
                        <div className="text-left font-mono text-xs text-neutral-500 sm:text-right dark:text-neutral-400">
                          <div>{edu.period}</div>
                          <div className="mt-0.5">{edu.location}</div>
                        </div>
                      </div>
                      <ul className="mt-3 space-y-1.5">
                        {edu.details.map((line) => (
                          <li
                            key={line}
                            className="flex items-start gap-2.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400"
                          >
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400 dark:bg-neutral-500" />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showCredentials && (
              <div>
                <div className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                  <Award className="h-3.5 w-3.5" strokeWidth={1.8} />
                  <span>Certifications &amp; Honors</span>
                </div>

                <div className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900/50">
                  {CREDENTIALS.map((cred) => (
                    <div
                      key={cred.id}
                      className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
                    >
                      <div>
                        <div className="text-sm font-medium text-neutral-950 dark:text-neutral-50">
                          {cred.title}
                        </div>
                        <div className="mt-0.5 text-xs text-neutral-600 dark:text-neutral-400">
                          {cred.issuer} · {cred.category}
                        </div>
                      </div>
                      <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
                        {cred.year}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
