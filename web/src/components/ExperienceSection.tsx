import { useState } from 'react'
import { Award, Briefcase, GraduationCap, MapPin } from 'lucide-react'
import { CREDENTIALS, EDUCATION, EXPERIENCES } from '../data/portfolio'

type LogFilter = 'All' | 'Experience' | 'Education' | 'Credentials'

const FILTERS: LogFilter[] = ['All', 'Experience', 'Education', 'Credentials']

export function ExperienceSection() {
  const [filter, setFilter] = useState<LogFilter>('All')

  const showExperience = filter === 'All' || filter === 'Experience'
  const showEducation = filter === 'All' || filter === 'Education'
  const showCredentials = filter === 'All' || filter === 'Credentials'

  return (
    <section
      id="experience"
      className="border-t border-neutral-200 py-20 sm:py-24 dark:border-neutral-800"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left Sticky Rail */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                <Briefcase className="h-3.5 w-3.5" strokeWidth={1.8} />
                <span>03 // Execution Log</span>
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
                Experience &amp; Training
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                Engineering roles spanning enterprise financial warehouses, high-scale web
                telemetry pipelines, startup data platforms, and formal CS engineering at INPT.
              </p>

              <div className="mt-6 flex flex-wrap gap-1.5">
                {FILTERS.map((item) => {
                  const active = filter === item
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setFilter(item)}
                      className={`rounded border px-2.5 py-1 font-mono text-[11px] transition-colors ${
                        active
                          ? 'border-neutral-950 bg-neutral-950 text-neutral-50 dark:border-neutral-50 dark:bg-neutral-50 dark:text-neutral-950'
                          : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-600'
                      }`}
                    >
                      {item}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Log Column */}
          <div className="space-y-10 lg:col-span-8">
            {showExperience && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-neutral-200 pb-2 font-mono text-xs uppercase tracking-wider text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                  <Briefcase className="h-3.5 w-3.5" strokeWidth={1.8} />
                  <span>Industry, Research &amp; Engineering Roles</span>
                </div>

                <div className="space-y-4">
                  {EXPERIENCES.map((exp) => (
                    <div
                      key={exp.id}
                      className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900/50"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h3 className="text-base font-semibold text-neutral-950 dark:text-neutral-50">
                            {exp.role}
                          </h3>
                          <div className="mt-0.5 text-sm text-neutral-700 dark:text-neutral-300">
                            {exp.organization}
                          </div>
                        </div>

                        <div className="text-right font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                          <div>{exp.period}</div>
                          <div className="mt-0.5 inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3" strokeWidth={1.8} />
                            <span>{exp.location}</span>
                          </div>
                        </div>
                      </div>

                      <ul className="mt-3.5 space-y-1.5">
                        {exp.highlights.map((bullet) => (
                          <li
                            key={bullet}
                            className="flex items-start gap-2.5 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400"
                          >
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-neutral-400 dark:bg-neutral-500" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {exp.stack.map((tech) => (
                          <span
                            key={tech}
                            className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-mono text-[10px] text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"
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
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-200 pb-2 font-mono text-xs uppercase tracking-wider text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                  <GraduationCap className="h-3.5 w-3.5" strokeWidth={1.8} />
                  <span>Education</span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {EDUCATION.map((edu) => (
                    <div
                      key={edu.id}
                      className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900/50"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h3 className="text-base font-semibold text-neutral-950 dark:text-neutral-50">
                            {edu.degree}
                          </h3>
                          <div className="mt-0.5 text-sm text-neutral-700 dark:text-neutral-300">
                            {edu.institution}
                          </div>
                        </div>
                        <div className="text-right font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                          <div>{edu.period}</div>
                          <div className="mt-0.5">{edu.location}</div>
                        </div>
                      </div>
                      <ul className="mt-3 space-y-1.5">
                        {edu.details.map((line) => (
                          <li
                            key={line}
                            className="flex items-start gap-2.5 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400"
                          >
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-neutral-400 dark:bg-neutral-500" />
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
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-200 pb-2 font-mono text-xs uppercase tracking-wider text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                  <Award className="h-3.5 w-3.5" strokeWidth={1.8} />
                  <span>Certifications &amp; Recognition</span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {CREDENTIALS.map((cred) => (
                    <div
                      key={cred.id}
                      className="flex items-start justify-between gap-3 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900/50"
                    >
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                          {cred.category}
                        </div>
                        <div className="mt-1 text-sm font-medium text-neutral-950 dark:text-neutral-50">
                          {cred.title}
                        </div>
                        <div className="mt-0.5 text-xs text-neutral-600 dark:text-neutral-400">
                          {cred.issuer}
                        </div>
                      </div>
                      <span className="shrink-0 rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-mono text-[11px] text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300">
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

