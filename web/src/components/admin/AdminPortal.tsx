import { useCallback, useEffect, useState } from 'react'
import {
  AlertTriangle,
  Award,
  BookOpen,
  Briefcase,
  Check,
  CloudUpload,
  Database,
  Download,
  ExternalLink,
  Layers,
  Lock,
  Plus,
  RotateCcw,
  Save,
  Shield,
  Trash2,
  User,
} from 'lucide-react'
import {
  type PortfolioData,
  clearLocalPortfolioOverrides,
  getDefaultPortfolioData,
  getEffectivePortfolioData,
  hasLocalDraftOverrides,
  saveLocalPortfolioOverrides,
} from '../../data/portfolioStore'
import type {
  BlogPost,
  CredentialItem,
  EducationItem,
  ExperienceItem,
  ProjectItem,
  StackRow,
} from '../../types/portfolio'
import {
  clearVault,
  decryptText,
  encryptText,
  saveVault,
  sealVault,
} from '../../utils/adminCrypto'
import { AdminAuthGate, type AuthenticatedSession } from './AdminAuthGate'

type AdminTab =
  | 'profile'
  | 'projects'
  | 'experience'
  | 'credentials'
  | 'stack'
  | 'blog'
  | 'publish'

const IDLE_LOCK_MS = 15 * 60 * 1000
const REPO_OWNER = 'NIDNASSER-Abdelmajid'
const REPO_NAME = 'NIDNASSER-Abdelmajid.github.io'
const OVERRIDES_FILE_PATH = 'web/src/data/overrides.json'

function toBase64Utf8(text: string): string {
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

function AdminDashboard({
  session,
  onLock,
}: {
  session: AuthenticatedSession
  onLock: () => void
}) {
  const [activeTab, setActiveTab] = useState<AdminTab>('profile')
  const [draft, setDraft] = useState<PortfolioData>(() => getEffectivePortfolioData())
  const [hasUnsaved, setHasUnsaved] = useState(false)
  const [hasLocalDraft, setHasLocalDraft] = useState(() => hasLocalDraftOverrides())
  const [toast, setToast] = useState<string | null>(null)

  // Selected entity indices for detail editors
  const [selectedProjectIdx, setSelectedProjectIdx] = useState(0)
  const [selectedBlogIdx, setSelectedBlogIdx] = useState(0)

  // GitHub publishing state (token never hardcoded)
  const [ghToken, setGhToken] = useState('')
  const [rememberTokenEncrypted, setRememberTokenEncrypted] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [publishLog, setPublishLog] = useState<string | null>(null)
  const [vaultState, setVaultState] = useState(session.vault)
  const [confirmWipeVault, setConfirmWipeVault] = useState(false)

  // Idle auto-lock timer
  const [idleRemainingSec, setIdleRemainingSec] = useState(Math.floor(IDLE_LOCK_MS / 1000))

  useEffect(() => {
    let lastActivity = Date.now()
    const bump = () => {
      lastActivity = Date.now()
    }
    const events: (keyof WindowEventMap)[] = ['mousemove', 'keydown', 'mousedown', 'touchstart']
    events.forEach((evt) => window.addEventListener(evt, bump, { passive: true }))

    const timer = window.setInterval(() => {
      const elapsed = Date.now() - lastActivity
      const remaining = Math.max(0, Math.floor((IDLE_LOCK_MS - elapsed) / 1000))
      setIdleRemainingSec(remaining)
      if (elapsed >= IDLE_LOCK_MS) {
        onLock()
      }
    }, 1000)

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, bump))
      window.clearInterval(timer)
    }
  }, [onLock])

  // Load previously AES-256-GCM encrypted GitHub PAT from vault if present
  useEffect(() => {
    if (!vaultState.encryptedGithubToken || !session.sessionKeyMaterial) return
    let active = true
    decryptText(vaultState.encryptedGithubToken, session.sessionKeyMaterial).then((plain) => {
      if (active && plain) {
        setGhToken(plain)
        setRememberTokenEncrypted(true)
      }
    })
    return () => {
      active = false
    }
  }, [session.sessionKeyMaterial, vaultState.encryptedGithubToken])

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 3200)
  }, [])

  const updateDraft = useCallback((updater: (prev: PortfolioData) => PortfolioData) => {
    setDraft((prev) => updater(prev))
    setHasUnsaved(true)
  }, [])

  const handleSaveLocal = () => {
    saveLocalPortfolioOverrides(draft)
    setHasUnsaved(false)
    setHasLocalDraft(true)
    showToast('Saved locally. Open the portfolio tab to preview live changes.')
  }

  const handleResetToDefaults = () => {
    clearLocalPortfolioOverrides()
    setDraft(getDefaultPortfolioData())
    setHasUnsaved(false)
    setHasLocalDraft(false)
    showToast('Cleared local drafts and restored default portfolio content.')
  }

  const handleDownloadOverridesJson = () => {
    const json = JSON.stringify(draft, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'overrides.json'
    a.click()
    URL.revokeObjectURL(url)
    showToast('Downloaded overrides.json')
  }

  const handleExportVaultBackup = () => {
    const json = JSON.stringify(vaultState, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'admin-vault-backup.json'
    a.click()
    URL.revokeObjectURL(url)
    showToast('Exported hashed & encrypted vault backup.')
  }

  const handlePublishToGitHub = async () => {
    const token = ghToken.trim()
    if (!token) {
      setPublishLog('Enter a GitHub Fine-Grained Personal Access Token with Contents write permission.')
      return
    }

    setPublishing(true)
    setPublishLog('Saving local draft and connecting to GitHub API...')

    try {
      saveLocalPortfolioOverrides(draft)
      setHasUnsaved(false)
      setHasLocalDraft(true)

      // Optionally encrypt & store PAT inside the AES-256-GCM vault
      if (rememberTokenEncrypted && session.sessionKeyMaterial) {
        const encryptedToken = await encryptText(token, session.sessionKeyMaterial)
        const { integrityDigest: _old, ...rest } = vaultState
        const updatedVault = await sealVault({
          ...rest,
          encryptedGithubToken: encryptedToken,
        })
        saveVault(updatedVault)
        setVaultState(updatedVault)
      }

      const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${OVERRIDES_FILE_PATH}`
      const headers = {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      }

      // Fetch current file SHA if it exists
      let existingSha: string | undefined
      const getRes = await fetch(apiUrl, { headers, cache: 'no-store' })
      if (getRes.ok) {
        const getData = (await getRes.json()) as { sha?: string }
        existingSha = getData.sha
      }

      const payloadJson = `${JSON.stringify(draft, null, 2)}\n`
      const putRes = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'chore(admin): update portfolio content via admin portal',
          content: toBase64Utf8(payloadJson),
          branch: 'main',
          ...(existingSha ? { sha: existingSha } : {}),
        }),
      })

      if (!putRes.ok) {
        const errBody = await putRes.text()
        setPublishLog(`GitHub API returned ${putRes.status}: ${errBody.slice(0, 220)}`)
        return
      }

      setPublishLog(
        'Published overrides.json to main. GitHub Actions deploy.yml will rebuild and publish the live site shortly.'
      )
      showToast('Published to GitHub main branch.')
    } catch (err) {
      setPublishLog(`Publish failed: ${err instanceof Error ? err.message : 'Network error'}`)
    } finally {
      setPublishing(false)
    }
  }

  const handleWipeVault = () => {
    clearVault()
    onLock()
  }

  const formatIdleTime = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const tabs: { id: AdminTab; label: string; icon: typeof User; count?: number }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'projects', label: 'Projects', icon: Database, count: draft.projects.length },
    {
      id: 'experience',
      label: 'Experience & Edu',
      icon: Briefcase,
      count: draft.experiences.length + draft.education.length,
    },
    { id: 'credentials', label: 'Credentials', icon: Award, count: draft.credentials.length },
    { id: 'stack', label: 'Stack', icon: Layers, count: draft.stackMatrix.length },
    { id: 'blog', label: 'Blog', icon: BookOpen, count: draft.blogPosts.length },
    { id: 'publish', label: 'Publish & Security', icon: Shield },
  ]

  const activeProject = draft.projects[selectedProjectIdx] ?? draft.projects[0]
  const activeBlog = draft.blogPosts[selectedBlogIdx] ?? draft.blogPosts[0]

  const inputCls =
    'w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 font-mono text-xs text-neutral-950 focus:border-neutral-950 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50 dark:focus:border-neutral-400'
  const labelCls = 'block font-mono text-[11px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400'

  return (
    <div className="min-h-screen w-full bg-neutral-50 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/95">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-950 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-950">
              <Shield className="h-4 w-4" strokeWidth={1.8} />
            </span>
            <div>
              <div className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-950 dark:text-neutral-50">
                Portfolio Admin Console
              </div>
              <div className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                Auto-lock in {formatIdleTime(idleRemainingSec)} ·{' '}
                {hasUnsaved
                  ? 'Unsaved edits'
                  : hasLocalDraft
                    ? 'Local preview active'
                    : 'Synced with defaults'}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleSaveLocal}
              className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-950 px-3 py-1.5 font-mono text-xs font-medium text-neutral-50 transition-colors hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200"
            >
              <Save className="h-3.5 w-3.5" strokeWidth={1.8} />
              <span>Save Preview</span>
            </button>

            <a
              href="#/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 font-mono text-xs text-neutral-700 transition-colors hover:border-neutral-950 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-400 dark:hover:text-neutral-50"
            >
              <span>View Site</span>
              <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.8} />
            </a>

            <button
              type="button"
              onClick={onLock}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 font-mono text-xs text-neutral-700 transition-colors hover:border-neutral-950 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-400 dark:hover:text-neutral-50"
            >
              <Lock className="h-3.5 w-3.5" strokeWidth={1.8} />
              <span>Lock</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 pb-2 sm:px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 font-mono text-xs transition-colors ${
                  active
                    ? 'bg-neutral-950 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-950'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-50'
                }`}
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span className="opacity-65">({tab.count})</span>
                )}
              </button>
            )
          })}
        </div>
      </header>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed right-5 bottom-5 z-50 flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2.5 font-mono text-xs text-neutral-50 shadow-xl dark:border-neutral-200 dark:bg-neutral-50 dark:text-neutral-950">
          <Check className="h-3.5 w-3.5" strokeWidth={2} />
          <span>{toast}</span>
        </div>
      )}

      {/* Main Editor Body */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* ================= PROFILE TAB ================= */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900/50">
              <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-950 dark:text-neutral-50">
                Identity & Bio
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>Full Name</label>
                  <input
                    className={`mt-1 ${inputCls}`}
                    value={draft.profile.name}
                    onChange={(e) =>
                      updateDraft((p) => ({ ...p, profile: { ...p.profile, name: e.target.value } }))
                    }
                  />
                </div>
                <div>
                  <label className={labelCls}>Role Title</label>
                  <input
                    className={`mt-1 ${inputCls}`}
                    value={draft.profile.role}
                    onChange={(e) =>
                      updateDraft((p) => ({ ...p, profile: { ...p.profile, role: e.target.value } }))
                    }
                  />
                </div>
                <div>
                  <label className={labelCls}>Location</label>
                  <input
                    className={`mt-1 ${inputCls}`}
                    value={draft.profile.location}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        profile: { ...p.profile, location: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className={labelCls}>Availability</label>
                  <input
                    className={`mt-1 ${inputCls}`}
                    value={draft.profile.availability}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        profile: { ...p.profile, availability: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className={labelCls}>Email</label>
                  <input
                    className={`mt-1 ${inputCls}`}
                    value={draft.profile.email}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        profile: { ...p.profile, email: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className={labelCls}>Photo URL (e.g. /profile.jpg)</label>
                  <input
                    className={`mt-1 ${inputCls}`}
                    value={draft.profile.photoUrl}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        profile: { ...p.profile, photoUrl: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Headline</label>
                <textarea
                  rows={2}
                  className={`mt-1 ${inputCls}`}
                  value={draft.profile.headline}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      profile: { ...p.profile, headline: e.target.value },
                    }))
                  }
                />
              </div>

              <div>
                <label className={labelCls}>Summary</label>
                <textarea
                  rows={3}
                  className={`mt-1 ${inputCls}`}
                  value={draft.profile.summary}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      profile: { ...p.profile, summary: e.target.value },
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900/50">
                <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-950 dark:text-neutral-50">
                  Social & External Links
                </h2>
                <div>
                  <label className={labelCls}>GitHub URL</label>
                  <input
                    className={`mt-1 ${inputCls}`}
                    value={draft.profile.links.github}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        profile: {
                          ...p.profile,
                          links: { ...p.profile.links, github: e.target.value },
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className={labelCls}>LinkedIn URL</label>
                  <input
                    className={`mt-1 ${inputCls}`}
                    value={draft.profile.links.linkedin}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        profile: {
                          ...p.profile,
                          links: { ...p.profile.links, linkedin: e.target.value },
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className={labelCls}>Freelancer URL</label>
                  <input
                    className={`mt-1 ${inputCls}`}
                    value={draft.profile.links.freelancer}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        profile: {
                          ...p.profile,
                          links: { ...p.profile.links, freelancer: e.target.value },
                        },
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-3 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900/50">
                <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-950 dark:text-neutral-50">
                  Overview Metrics
                </h2>
                {draft.profile.metrics.map((metric, idx) => (
                  <div key={idx} className="grid grid-cols-2 gap-3">
                    <input
                      className={inputCls}
                      value={metric.value}
                      placeholder="Value"
                      onChange={(e) =>
                        updateDraft((p) => {
                          const next = [...p.profile.metrics]
                          next[idx] = { ...next[idx], value: e.target.value }
                          return { ...p, profile: { ...p.profile, metrics: next } }
                        })
                      }
                    />
                    <input
                      className={inputCls}
                      value={metric.label}
                      placeholder="Label"
                      onChange={(e) =>
                        updateDraft((p) => {
                          const next = [...p.profile.metrics]
                          next[idx] = { ...next[idx], label: e.target.value }
                          return { ...p, profile: { ...p.profile, metrics: next } }
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= PROJECTS TAB ================= */}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Project List Sidebar */}
            <div className="space-y-2 lg:col-span-4">
              <button
                type="button"
                onClick={() => {
                  const num = String(draft.projects.length + 1).padStart(2, '0')
                  const newProject: ProjectItem = {
                    id: `new-project-${Date.now()}`,
                    code: `PRJ-${num}`,
                    title: 'New Data Pipeline Project',
                    category: 'Lakehouse & ETL',
                    year: String(new Date().getFullYear()),
                    context: 'Production Pipeline',
                    summary: 'Short technical overview of the pipeline.',
                    impact: ['Delivered reliable incremental ingestion.'],
                    stack: ['Python', 'SQL'],
                    images: [],
                    codeParts: [],
                    sqlParts: [],
                    wiki: {
                      problem: 'Describe the core data engineering challenge.',
                      solution: 'Describe the architecture and implementation approach.',
                      workflow: [
                        {
                          step: '01',
                          title: 'Ingestion',
                          summary: 'Extract and land raw records safely.',
                          tools: ['Python'],
                        },
                      ],
                    },
                    decisions: [
                      {
                        choice: 'Key architectural choice',
                        rationale: 'Why this tradeoff was chosen.',
                      },
                    ],
                  }
                  updateDraft((p) => ({ ...p, projects: [...p.projects, newProject] }))
                  setSelectedProjectIdx(draft.projects.length)
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-950 px-3 py-2 font-mono text-xs text-neutral-50 hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add New Project</span>
              </button>

              {draft.projects.map((proj, idx) => (
                <button
                  key={proj.id + idx}
                  type="button"
                  onClick={() => setSelectedProjectIdx(idx)}
                  className={`flex w-full items-center justify-between rounded-lg border px-3.5 py-2.5 text-left font-mono text-xs transition-colors ${
                    idx === selectedProjectIdx
                      ? 'border-neutral-950 bg-neutral-950 text-neutral-50 dark:border-neutral-50 dark:bg-neutral-50 dark:text-neutral-950'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-300'
                  }`}
                >
                  <div className="truncate">
                    <span className="opacity-70">{proj.code}</span> · {proj.title}
                  </div>
                </button>
              ))}
            </div>

            {/* Project Editor */}
            {activeProject && (
              <div className="space-y-5 rounded-xl border border-neutral-200 bg-white p-6 lg:col-span-8 dark:border-neutral-800 dark:bg-neutral-900/50">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-neutral-800">
                  <div className="font-mono text-xs font-semibold uppercase tracking-wider">
                    Editing {activeProject.code}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (draft.projects.length <= 1) return
                      updateDraft((p) => ({
                        ...p,
                        projects: p.projects.filter((_, i) => i !== selectedProjectIdx),
                      }))
                      setSelectedProjectIdx(Math.max(0, selectedProjectIdx - 1))
                    }}
                    className="inline-flex items-center gap-1 rounded border border-neutral-300 px-2.5 py-1 font-mono text-xs text-neutral-700 hover:border-neutral-950 hover:text-neutral-950 dark:border-neutral-700 dark:text-neutral-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                </div>

                {(() => {
                  const patchProject = (patch: Partial<ProjectItem>) =>
                    updateDraft((p) => {
                      const next = [...p.projects]
                      next[selectedProjectIdx] = { ...next[selectedProjectIdx], ...patch }
                      return { ...p, projects: next }
                    })

                  return (
                    <>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className={labelCls}>Title</label>
                          <input
                            className={`mt-1 ${inputCls}`}
                            value={activeProject.title}
                            onChange={(e) => patchProject({ title: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>URL Slug ID</label>
                          <input
                            className={`mt-1 ${inputCls}`}
                            value={activeProject.id}
                            onChange={(e) => patchProject({ id: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Code</label>
                          <input
                            className={`mt-1 ${inputCls}`}
                            value={activeProject.code}
                            onChange={(e) => patchProject({ code: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Category</label>
                          <select
                            className={`mt-1 ${inputCls}`}
                            value={activeProject.category}
                            onChange={(e) =>
                              patchProject({
                                category: e.target.value as ProjectItem['category'],
                              })
                            }
                          >
                            <option value="Lakehouse & ETL">Lakehouse & ETL</option>
                            <option value="Streaming">Streaming</option>
                            <option value="Crawling & Extraction">Crawling & Extraction</option>
                          </select>
                        </div>
                        <div>
                          <label className={labelCls}>Year</label>
                          <input
                            className={`mt-1 ${inputCls}`}
                            value={activeProject.year}
                            onChange={(e) => patchProject({ year: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Context</label>
                          <input
                            className={`mt-1 ${inputCls}`}
                            value={activeProject.context}
                            onChange={(e) => patchProject({ context: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>GitHub Repo URL</label>
                          <input
                            className={`mt-1 ${inputCls}`}
                            value={activeProject.repoUrl ?? ''}
                            onChange={(e) =>
                              patchProject({ repoUrl: e.target.value || undefined })
                            }
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Linked Article Slug</label>
                          <input
                            className={`mt-1 ${inputCls}`}
                            value={activeProject.articleSlug ?? ''}
                            onChange={(e) =>
                              patchProject({ articleSlug: e.target.value || undefined })
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <label className={labelCls}>Summary</label>
                        <textarea
                          rows={2}
                          className={`mt-1 ${inputCls}`}
                          value={activeProject.summary}
                          onChange={(e) => patchProject({ summary: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className={labelCls}>Stack Tags (comma-separated)</label>
                        <input
                          className={`mt-1 ${inputCls}`}
                          value={activeProject.stack.join(', ')}
                          onChange={(e) =>
                            patchProject({
                              stack: e.target.value
                                .split(',')
                                .map((s) => s.trim())
                                .filter(Boolean),
                            })
                          }
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className={labelCls}>The Challenge</label>
                          <textarea
                            rows={3}
                            className={`mt-1 ${inputCls}`}
                            value={activeProject.wiki.problem}
                            onChange={(e) =>
                              patchProject({
                                wiki: { ...activeProject.wiki, problem: e.target.value },
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className={labelCls}>The Approach</label>
                          <textarea
                            rows={3}
                            className={`mt-1 ${inputCls}`}
                            value={activeProject.wiki.solution}
                            onChange={(e) =>
                              patchProject({
                                wiki: { ...activeProject.wiki, solution: e.target.value },
                              })
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <label className={labelCls}>Impact Outcomes (one per line)</label>
                        <textarea
                          rows={3}
                          className={`mt-1 ${inputCls}`}
                          value={activeProject.impact.join('\n')}
                          onChange={(e) =>
                            patchProject({
                              impact: e.target.value
                                .split('\n')
                                .map((s) => s.trim())
                                .filter(Boolean),
                            })
                          }
                        />
                      </div>

                      {/* Images Manager */}
                      <div className="space-y-3 border-t border-neutral-200 pt-4 dark:border-neutral-800">
                        <div className="flex items-center justify-between">
                          <span className={labelCls}>Sliding Gallery Images</span>
                          <button
                            type="button"
                            onClick={() =>
                              patchProject({
                                images: [
                                  ...(activeProject.images ?? []),
                                  {
                                    src: '/projects/placeholder.png',
                                    alt: 'Project visual',
                                    title: 'Slide Title',
                                    context: 'Explanation shown on circle-exclamation click.',
                                  },
                                ],
                              })
                            }
                            className="inline-flex items-center gap-1 rounded border border-neutral-200 px-2 py-1 font-mono text-[11px] hover:border-neutral-900 dark:border-neutral-700"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Add Image</span>
                          </button>
                        </div>

                        {(activeProject.images ?? []).map((img, i) => (
                          <div
                            key={i}
                            className="space-y-2 rounded-lg border border-neutral-200 p-3 dark:border-neutral-800"
                          >
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                              <input
                                className={inputCls}
                                placeholder="Image URL (e.g. /projects/img.png)"
                                value={img.src}
                                onChange={(e) => {
                                  const nextImgs = [...(activeProject.images ?? [])]
                                  nextImgs[i] = { ...nextImgs[i], src: e.target.value }
                                  patchProject({ images: nextImgs })
                                }}
                              />
                              <input
                                className={inputCls}
                                placeholder="Slide Title"
                                value={img.title ?? ''}
                                onChange={(e) => {
                                  const nextImgs = [...(activeProject.images ?? [])]
                                  nextImgs[i] = { ...nextImgs[i], title: e.target.value }
                                  patchProject({ images: nextImgs })
                                }}
                              />
                            </div>
                            <textarea
                              rows={2}
                              className={inputCls}
                              placeholder="Context explanation (shown in corner info popup)"
                              value={img.context ?? ''}
                              onChange={(e) => {
                                const nextImgs = [...(activeProject.images ?? [])]
                                nextImgs[i] = { ...nextImgs[i], context: e.target.value }
                                patchProject({ images: nextImgs })
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const nextImgs = (activeProject.images ?? []).filter(
                                  (_, idx) => idx !== i
                                )
                                patchProject({ images: nextImgs })
                              }}
                              className="font-mono text-[11px] text-neutral-500 hover:text-neutral-950 dark:hover:text-neutral-50"
                            >
                              Remove Slide
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Code Parts & SQL Parts Manager */}
                      <div className="space-y-3 border-t border-neutral-200 pt-4 dark:border-neutral-800">
                        <div className="flex items-center justify-between">
                          <span className={labelCls}>Code Snippets</span>
                          <button
                            type="button"
                            onClick={() =>
                              patchProject({
                                codeParts: [
                                  ...(activeProject.codeParts ?? []),
                                  {
                                    title: 'Pipeline Step',
                                    language: 'python',
                                    filename: 'pipeline/step.py',
                                    description: 'Describe what this snippet does.',
                                    content: '# Python code here',
                                  },
                                ],
                              })
                            }
                            className="inline-flex items-center gap-1 rounded border border-neutral-200 px-2 py-1 font-mono text-[11px] hover:border-neutral-900 dark:border-neutral-700"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Add Code Block</span>
                          </button>
                        </div>

                        {(activeProject.codeParts ?? []).map((blk, i) => (
                          <div
                            key={i}
                            className="space-y-2 rounded-lg border border-neutral-200 p-3 dark:border-neutral-800"
                          >
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                              <input
                                className={inputCls}
                                placeholder="Block Title"
                                value={blk.title}
                                onChange={(e) => {
                                  const next = [...(activeProject.codeParts ?? [])]
                                  next[i] = { ...next[i], title: e.target.value }
                                  patchProject({ codeParts: next })
                                }}
                              />
                              <input
                                className={inputCls}
                                placeholder="Filename"
                                value={blk.filename ?? ''}
                                onChange={(e) => {
                                  const next = [...(activeProject.codeParts ?? [])]
                                  next[i] = { ...next[i], filename: e.target.value }
                                  patchProject({ codeParts: next })
                                }}
                              />
                              <input
                                className={inputCls}
                                placeholder="Language"
                                value={blk.language}
                                onChange={(e) => {
                                  const next = [...(activeProject.codeParts ?? [])]
                                  next[i] = { ...next[i], language: e.target.value }
                                  patchProject({ codeParts: next })
                                }}
                              />
                            </div>
                            <textarea
                              rows={5}
                              className={inputCls}
                              value={blk.content}
                              onChange={(e) => {
                                const next = [...(activeProject.codeParts ?? [])]
                                next[i] = { ...next[i], content: e.target.value }
                                patchProject({ codeParts: next })
                              }}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                patchProject({
                                  codeParts: (activeProject.codeParts ?? []).filter(
                                    (_, idx) => idx !== i
                                  ),
                                })
                              }
                              className="font-mono text-[11px] text-neutral-500 hover:text-neutral-950 dark:hover:text-neutral-50"
                            >
                              Remove Code Block
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3 border-t border-neutral-200 pt-4 dark:border-neutral-800">
                        <div className="flex items-center justify-between">
                          <span className={labelCls}>SQL Snippets</span>
                          <button
                            type="button"
                            onClick={() =>
                              patchProject({
                                sqlParts: [
                                  ...(activeProject.sqlParts ?? []),
                                  {
                                    title: 'SQL Transformation',
                                    language: 'sql',
                                    filename: 'models/query.sql',
                                    description: 'Describe what this SQL query does.',
                                    content: 'SELECT 1;',
                                  },
                                ],
                              })
                            }
                            className="inline-flex items-center gap-1 rounded border border-neutral-200 px-2 py-1 font-mono text-[11px] hover:border-neutral-900 dark:border-neutral-700"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Add SQL Block</span>
                          </button>
                        </div>

                        {(activeProject.sqlParts ?? []).map((blk, i) => (
                          <div
                            key={i}
                            className="space-y-2 rounded-lg border border-neutral-200 p-3 dark:border-neutral-800"
                          >
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                              <input
                                className={inputCls}
                                placeholder="SQL Title"
                                value={blk.title}
                                onChange={(e) => {
                                  const next = [...(activeProject.sqlParts ?? [])]
                                  next[i] = { ...next[i], title: e.target.value }
                                  patchProject({ sqlParts: next })
                                }}
                              />
                              <input
                                className={inputCls}
                                placeholder="Filename"
                                value={blk.filename ?? ''}
                                onChange={(e) => {
                                  const next = [...(activeProject.sqlParts ?? [])]
                                  next[i] = { ...next[i], filename: e.target.value }
                                  patchProject({ sqlParts: next })
                                }}
                              />
                            </div>
                            <textarea
                              rows={5}
                              className={inputCls}
                              value={blk.content}
                              onChange={(e) => {
                                const next = [...(activeProject.sqlParts ?? [])]
                                next[i] = { ...next[i], content: e.target.value }
                                patchProject({ sqlParts: next })
                              }}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                patchProject({
                                  sqlParts: (activeProject.sqlParts ?? []).filter(
                                    (_, idx) => idx !== i
                                  ),
                                })
                              }
                              className="font-mono text-[11px] text-neutral-500 hover:text-neutral-950 dark:hover:text-neutral-50"
                            >
                              Remove SQL Block
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )
                })()}
              </div>
            )}
          </div>
        )}

        {/* ================= EXPERIENCE & EDUCATION TAB ================= */}
        {activeTab === 'experience' && (
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-mono text-xs font-semibold uppercase tracking-wider">
                  Experience ({draft.experiences.length})
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    const item: ExperienceItem = {
                      id: `exp-${Date.now()}`,
                      role: 'Data Engineer',
                      organization: 'Company',
                      location: 'Remote',
                      period: '2026 - Present',
                      type: 'Industry',
                      highlights: ['Built scalable data pipelines.'],
                      stack: ['Python', 'SQL'],
                    }
                    updateDraft((p) => ({ ...p, experiences: [item, ...p.experiences] }))
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-950 px-3 py-1.5 font-mono text-xs text-neutral-50 dark:bg-neutral-50 dark:text-neutral-950"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Role</span>
                </button>
              </div>

              {draft.experiences.map((exp, idx) => (
                <div
                  key={exp.id + idx}
                  className="space-y-3 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900/50"
                >
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <input
                      className={inputCls}
                      placeholder="Role"
                      value={exp.role}
                      onChange={(e) =>
                        updateDraft((p) => {
                          const next = [...p.experiences]
                          next[idx] = { ...next[idx], role: e.target.value }
                          return { ...p, experiences: next }
                        })
                      }
                    />
                    <input
                      className={inputCls}
                      placeholder="Organization"
                      value={exp.organization}
                      onChange={(e) =>
                        updateDraft((p) => {
                          const next = [...p.experiences]
                          next[idx] = { ...next[idx], organization: e.target.value }
                          return { ...p, experiences: next }
                        })
                      }
                    />
                    <input
                      className={inputCls}
                      placeholder="Period"
                      value={exp.period}
                      onChange={(e) =>
                        updateDraft((p) => {
                          const next = [...p.experiences]
                          next[idx] = { ...next[idx], period: e.target.value }
                          return { ...p, experiences: next }
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input
                      className={inputCls}
                      placeholder="Location"
                      value={exp.location}
                      onChange={(e) =>
                        updateDraft((p) => {
                          const next = [...p.experiences]
                          next[idx] = { ...next[idx], location: e.target.value }
                          return { ...p, experiences: next }
                        })
                      }
                    />
                    <input
                      className={inputCls}
                      placeholder="Stack (comma-separated)"
                      value={exp.stack.join(', ')}
                      onChange={(e) =>
                        updateDraft((p) => {
                          const next = [...p.experiences]
                          next[idx] = {
                            ...next[idx],
                            stack: e.target.value
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean),
                          }
                          return { ...p, experiences: next }
                        })
                      }
                    />
                  </div>
                  <textarea
                    rows={3}
                    className={inputCls}
                    placeholder="Highlights (one per line)"
                    value={exp.highlights.join('\n')}
                    onChange={(e) =>
                      updateDraft((p) => {
                        const next = [...p.experiences]
                        next[idx] = {
                          ...next[idx],
                          highlights: e.target.value
                            .split('\n')
                            .map((s) => s.trim())
                            .filter(Boolean),
                        }
                        return { ...p, experiences: next }
                      })
                    }
                  />
                  <button
                    type="button"
                    onClick={() =>
                      updateDraft((p) => ({
                        ...p,
                        experiences: p.experiences.filter((_, i) => i !== idx),
                      }))
                    }
                    className="inline-flex items-center gap-1 font-mono text-xs text-neutral-500 hover:text-neutral-950 dark:hover:text-neutral-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Remove Role</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-mono text-xs font-semibold uppercase tracking-wider">
                  Education ({draft.education.length})
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    const item: EducationItem = {
                      id: `edu-${Date.now()}`,
                      degree: 'Degree Program',
                      institution: 'Institution',
                      location: 'City',
                      period: '2021 - 2024',
                      details: ['Coursework focus'],
                    }
                    updateDraft((p) => ({ ...p, education: [...p.education, item] }))
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-950 px-3 py-1.5 font-mono text-xs text-neutral-50 dark:bg-neutral-50 dark:text-neutral-950"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Education</span>
                </button>
              </div>

              {draft.education.map((edu, idx) => (
                <div
                  key={edu.id + idx}
                  className="space-y-3 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900/50"
                >
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <input
                      className={inputCls}
                      value={edu.degree}
                      onChange={(e) =>
                        updateDraft((p) => {
                          const next = [...p.education]
                          next[idx] = { ...next[idx], degree: e.target.value }
                          return { ...p, education: next }
                        })
                      }
                    />
                    <input
                      className={inputCls}
                      value={edu.institution}
                      onChange={(e) =>
                        updateDraft((p) => {
                          const next = [...p.education]
                          next[idx] = { ...next[idx], institution: e.target.value }
                          return { ...p, education: next }
                        })
                      }
                    />
                    <input
                      className={inputCls}
                      value={edu.period}
                      onChange={(e) =>
                        updateDraft((p) => {
                          const next = [...p.education]
                          next[idx] = { ...next[idx], period: e.target.value }
                          return { ...p, education: next }
                        })
                      }
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateDraft((p) => ({
                        ...p,
                        education: p.education.filter((_, i) => i !== idx),
                      }))
                    }
                    className="inline-flex items-center gap-1 font-mono text-xs text-neutral-500 hover:text-neutral-950 dark:hover:text-neutral-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Remove Education</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= CREDENTIALS TAB ================= */}
        {activeTab === 'credentials' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-mono text-xs font-semibold uppercase tracking-wider">
                Credentials & Recognitions ({draft.credentials.length})
              </h2>
              <button
                type="button"
                onClick={() => {
                  const item: CredentialItem = {
                    id: `cred-${Date.now()}`,
                    title: 'New Certification',
                    issuer: 'Issuing Body',
                    year: String(new Date().getFullYear()),
                    category: 'Certification',
                    summary: '',
                    credentialUrl: '',
                    imageUrl: '',
                  }
                  updateDraft((p) => ({ ...p, credentials: [item, ...p.credentials] }))
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-950 px-3 py-1.5 font-mono text-xs text-neutral-50 dark:bg-neutral-50 dark:text-neutral-950"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Credential</span>
              </button>
            </div>

            {draft.credentials.map((cred, idx) => (
              <div
                key={cred.id + idx}
                className="space-y-3 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900/50"
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                  <input
                    className={inputCls}
                    placeholder="Title"
                    value={cred.title}
                    onChange={(e) =>
                      updateDraft((p) => {
                        const next = [...p.credentials]
                        next[idx] = { ...next[idx], title: e.target.value }
                        return { ...p, credentials: next }
                      })
                    }
                  />
                  <input
                    className={inputCls}
                    placeholder="Issuer"
                    value={cred.issuer}
                    onChange={(e) =>
                      updateDraft((p) => {
                        const next = [...p.credentials]
                        next[idx] = { ...next[idx], issuer: e.target.value }
                        return { ...p, credentials: next }
                      })
                    }
                  />
                  <input
                    className={inputCls}
                    placeholder="Year"
                    value={cred.year}
                    onChange={(e) =>
                      updateDraft((p) => {
                        const next = [...p.credentials]
                        next[idx] = { ...next[idx], year: e.target.value }
                        return { ...p, credentials: next }
                      })
                    }
                  />
                  <select
                    className={inputCls}
                    value={cred.category}
                    onChange={(e) =>
                      updateDraft((p) => {
                        const next = [...p.credentials]
                        next[idx] = {
                          ...next[idx],
                          category: e.target.value as CredentialItem['category'],
                        }
                        return { ...p, credentials: next }
                      })
                    }
                  >
                    <option value="Certification">Certification</option>
                    <option value="Recognition">Recognition</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    className={inputCls}
                    placeholder="Verification URL (optional)"
                    value={cred.credentialUrl ?? ''}
                    onChange={(e) =>
                      updateDraft((p) => {
                        const next = [...p.credentials]
                        next[idx] = {
                          ...next[idx],
                          credentialUrl: e.target.value || undefined,
                        }
                        return { ...p, credentials: next }
                      })
                    }
                  />
                  <input
                    className={inputCls}
                    placeholder="Certificate Image URL (optional)"
                    value={cred.imageUrl ?? ''}
                    onChange={(e) =>
                      updateDraft((p) => {
                        const next = [...p.credentials]
                        next[idx] = { ...next[idx], imageUrl: e.target.value || undefined }
                        return { ...p, credentials: next }
                      })
                    }
                  />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    updateDraft((p) => ({
                      ...p,
                      credentials: p.credentials.filter((_, i) => i !== idx),
                    }))
                  }
                  className="inline-flex items-center gap-1 font-mono text-xs text-neutral-500 hover:text-neutral-950 dark:hover:text-neutral-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Remove Credential</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ================= STACK TAB ================= */}
        {activeTab === 'stack' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-mono text-xs font-semibold uppercase tracking-wider">
                Tech Stack Items ({draft.stackMatrix.length})
              </h2>
              <button
                type="button"
                onClick={() => {
                  const row: StackRow = {
                    id: `stack-${Date.now()}`,
                    layer: 'lakehouse',
                    layerLabel: 'Lakehouse',
                    technology: 'New Tool',
                  }
                  updateDraft((p) => ({ ...p, stackMatrix: [...p.stackMatrix, row] }))
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-950 px-3 py-1.5 font-mono text-xs text-neutral-50 dark:bg-neutral-50 dark:text-neutral-950"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Technology</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {draft.stackMatrix.map((row, idx) => (
                <div
                  key={row.id + idx}
                  className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900/50"
                >
                  <input
                    className={inputCls}
                    value={row.technology}
                    onChange={(e) =>
                      updateDraft((p) => {
                        const next = [...p.stackMatrix]
                        next[idx] = { ...next[idx], technology: e.target.value }
                        return { ...p, stackMatrix: next }
                      })
                    }
                  />
                  <select
                    className="rounded-lg border border-neutral-200 bg-white px-2 py-2 font-mono text-xs dark:border-neutral-800 dark:bg-neutral-900"
                    value={row.layer}
                    onChange={(e) => {
                      const layer = e.target.value as StackRow['layer']
                      const labels: Record<StackRow['layer'], string> = {
                        lakehouse: 'Lakehouse',
                        pipelines: 'Pipelines',
                        storage: 'Storage',
                        bi_ml: 'BI & Serving',
                      }
                      updateDraft((p) => {
                        const next = [...p.stackMatrix]
                        next[idx] = { ...next[idx], layer, layerLabel: labels[layer] }
                        return { ...p, stackMatrix: next }
                      })
                    }}
                  >
                    <option value="lakehouse">Lakehouse</option>
                    <option value="pipelines">Pipelines</option>
                    <option value="storage">Storage</option>
                    <option value="bi_ml">BI & ML</option>
                  </select>
                  <button
                    type="button"
                    onClick={() =>
                      updateDraft((p) => ({
                        ...p,
                        stackMatrix: p.stackMatrix.filter((_, i) => i !== idx),
                      }))
                    }
                    aria-label="Remove technology"
                    className="p-1.5 text-neutral-500 hover:text-neutral-950 dark:hover:text-neutral-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= BLOG TAB ================= */}
        {activeTab === 'blog' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-2 lg:col-span-4">
              <button
                type="button"
                onClick={() => {
                  const num = String(draft.blogPosts.length + 1).padStart(2, '0')
                  const post: BlogPost = {
                    slug: `engineering-note-${Date.now()}`,
                    code: `LOG-${num}`,
                    title: 'New Data Engineering Article',
                    topic: 'Lakehouse',
                    publishedAt: new Date().toISOString().slice(0, 10),
                    readTime: '5 min read',
                    excerpt: 'Summary of this engineering note.',
                    tags: ['Data Engineering'],
                    sections: [
                      {
                        heading: 'Overview',
                        paragraphs: ['Write your article content here.'],
                      },
                    ],
                  }
                  updateDraft((p) => ({ ...p, blogPosts: [post, ...p.blogPosts] }))
                  setSelectedBlogIdx(0)
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-950 px-3 py-2 font-mono text-xs text-neutral-50 dark:bg-neutral-50 dark:text-neutral-950"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Article</span>
              </button>

              {draft.blogPosts.map((post, idx) => (
                <button
                  key={post.slug + idx}
                  type="button"
                  onClick={() => setSelectedBlogIdx(idx)}
                  className={`flex w-full items-center justify-between rounded-lg border px-3.5 py-2.5 text-left font-mono text-xs transition-colors ${
                    idx === selectedBlogIdx
                      ? 'border-neutral-950 bg-neutral-950 text-neutral-50 dark:border-neutral-50 dark:bg-neutral-50 dark:text-neutral-950'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-300'
                  }`}
                >
                  <div className="truncate">
                    <span className="opacity-70">{post.code}</span> · {post.title}
                  </div>
                </button>
              ))}
            </div>

            {activeBlog && (
              <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-6 lg:col-span-8 dark:border-neutral-800 dark:bg-neutral-900/50">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-neutral-800">
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider">
                    Editing {activeBlog.code}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (draft.blogPosts.length <= 1) return
                      updateDraft((p) => ({
                        ...p,
                        blogPosts: p.blogPosts.filter((_, i) => i !== selectedBlogIdx),
                      }))
                      setSelectedBlogIdx(Math.max(0, selectedBlogIdx - 1))
                    }}
                    className="inline-flex items-center gap-1 rounded border border-neutral-300 px-2.5 py-1 font-mono text-xs text-neutral-700 hover:border-neutral-950 dark:border-neutral-700 dark:text-neutral-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                </div>

                {(() => {
                  const patchBlog = (patch: Partial<BlogPost>) =>
                    updateDraft((p) => {
                      const next = [...p.blogPosts]
                      next[selectedBlogIdx] = { ...next[selectedBlogIdx], ...patch }
                      return { ...p, blogPosts: next }
                    })

                  return (
                    <>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className={labelCls}>Article Title</label>
                          <input
                            className={`mt-1 ${inputCls}`}
                            value={activeBlog.title}
                            onChange={(e) => patchBlog({ title: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>URL Slug</label>
                          <input
                            className={`mt-1 ${inputCls}`}
                            value={activeBlog.slug}
                            onChange={(e) => patchBlog({ slug: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Topic</label>
                          <select
                            className={`mt-1 ${inputCls}`}
                            value={activeBlog.topic}
                            onChange={(e) =>
                              patchBlog({ topic: e.target.value as BlogPost['topic'] })
                            }
                          >
                            <option value="Lakehouse">Lakehouse</option>
                            <option value="ETL & Ingestion">ETL & Ingestion</option>
                            <option value="Data Modeling">Data Modeling</option>
                          </select>
                        </div>
                        <div>
                          <label className={labelCls}>Published Date & Read Time</label>
                          <div className="mt-1 grid grid-cols-2 gap-2">
                            <input
                              className={inputCls}
                              value={activeBlog.publishedAt}
                              onChange={(e) => patchBlog({ publishedAt: e.target.value })}
                            />
                            <input
                              className={inputCls}
                              value={activeBlog.readTime}
                              onChange={(e) => patchBlog({ readTime: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className={labelCls}>Excerpt</label>
                        <textarea
                          rows={2}
                          className={`mt-1 ${inputCls}`}
                          value={activeBlog.excerpt}
                          onChange={(e) => patchBlog({ excerpt: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className={labelCls}>Tags (comma-separated)</label>
                        <input
                          className={`mt-1 ${inputCls}`}
                          value={activeBlog.tags.join(', ')}
                          onChange={(e) =>
                            patchBlog({
                              tags: e.target.value
                                .split(',')
                                .map((s) => s.trim())
                                .filter(Boolean),
                            })
                          }
                        />
                      </div>

                      <div className="space-y-3 border-t border-neutral-200 pt-4 dark:border-neutral-800">
                        <div className="flex items-center justify-between">
                          <span className={labelCls}>Article Sections</span>
                          <button
                            type="button"
                            onClick={() =>
                              patchBlog({
                                sections: [
                                  ...activeBlog.sections,
                                  { heading: 'New Section', paragraphs: ['Section body text.'] },
                                ],
                              })
                            }
                            className="inline-flex items-center gap-1 rounded border border-neutral-200 px-2 py-1 font-mono text-[11px] dark:border-neutral-700"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Add Section</span>
                          </button>
                        </div>

                        {activeBlog.sections.map((sec, sIdx) => (
                          <div
                            key={sIdx}
                            className="space-y-2 rounded-lg border border-neutral-200 p-3 dark:border-neutral-800"
                          >
                            <input
                              className={inputCls}
                              placeholder="Section Heading"
                              value={sec.heading}
                              onChange={(e) => {
                                const nextSecs = [...activeBlog.sections]
                                nextSecs[sIdx] = { ...nextSecs[sIdx], heading: e.target.value }
                                patchBlog({ sections: nextSecs })
                              }}
                            />
                            <textarea
                              rows={4}
                              className={inputCls}
                              placeholder="Paragraphs (separate with blank line)"
                              value={sec.paragraphs.join('\n\n')}
                              onChange={(e) => {
                                const nextSecs = [...activeBlog.sections]
                                nextSecs[sIdx] = {
                                  ...nextSecs[sIdx],
                                  paragraphs: e.target.value
                                    .split(/\n{2,}/)
                                    .map((p) => p.trim())
                                    .filter(Boolean),
                                }
                                patchBlog({ sections: nextSecs })
                              }}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                patchBlog({
                                  sections: activeBlog.sections.filter((_, i) => i !== sIdx),
                                })
                              }
                              className="font-mono text-[11px] text-neutral-500 hover:text-neutral-950 dark:hover:text-neutral-50"
                            >
                              Remove Section
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )
                })()}
              </div>
            )}
          </div>
        )}

        {/* ================= PUBLISH & SECURITY TAB ================= */}
        {activeTab === 'publish' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* GitHub Live Publisher */}
            <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900/50">
              <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider">
                <CloudUpload className="h-4 w-4" strokeWidth={1.8} />
                <span>Publish Live to GitHub Pages</span>
              </div>
              <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                Commits your updated portfolio data to{' '}
                <code>
                  {REPO_OWNER}/{REPO_NAME}/{OVERRIDES_FILE_PATH}
                </code>
                , automatically triggering GitHub Actions deployment for all visitors. Your token is never hardcoded.
              </p>

              <div>
                <label className={labelCls}>GitHub Fine-Grained PAT (Contents: Read & Write)</label>
                <input
                  type="password"
                  autoComplete="off"
                  className={`mt-1 ${inputCls}`}
                  placeholder="github_pat_..."
                  value={ghToken}
                  onChange={(e) => setGhToken(e.target.value)}
                />
              </div>

              <label className="flex items-center gap-2 font-mono text-xs text-neutral-600 dark:text-neutral-400">
                <input
                  type="checkbox"
                  checked={rememberTokenEncrypted}
                  onChange={(e) => setRememberTokenEncrypted(e.target.checked)}
                />
                <span>Encrypt token inside AES-256-GCM vault (unlocked only after 4-step auth)</span>
              </label>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={publishing}
                  onClick={handlePublishToGitHub}
                  className="inline-flex items-center gap-2 rounded-lg bg-neutral-950 px-4 py-2 font-mono text-xs font-medium text-neutral-50 transition-colors hover:bg-neutral-800 disabled:opacity-50 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200"
                >
                  <CloudUpload className="h-3.5 w-3.5" />
                  <span>{publishing ? 'Publishing...' : 'Commit & Deploy to GitHub'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadOverridesJson}
                  className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3.5 py-2 font-mono text-xs text-neutral-700 hover:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download JSON</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetToDefaults}
                  className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3.5 py-2 font-mono text-xs text-neutral-700 hover:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset Drafts</span>
                </button>
              </div>

              {publishLog && (
                <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 font-mono text-xs text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300">
                  {publishLog}
                </div>
              )}
            </div>

            {/* Cryptographic Vault Management */}
            <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900/50">
              <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider">
                <Shield className="h-4 w-4" strokeWidth={1.8} />
                <span>Cryptographic Vault & Security</span>
              </div>

              <div className="space-y-1.5 rounded-lg border border-neutral-200 bg-neutral-50 p-4 font-mono text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
                <div>Vault Version: v{vaultState.version}</div>
                <div>Enrolled At: {new Date(vaultState.createdAt).toLocaleString()}</div>
                <div>KDF: PBKDF2-HMAC-SHA-256 (600,000 iterations)</div>
                <div>2FA Encryption: AES-256-GCM + RFC 6238 TOTP</div>
                <div>Integrity: SHA-256 Sealed Digest</div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleExportVaultBackup}
                  className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3.5 py-2 font-mono text-xs text-neutral-700 hover:border-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export Encrypted Vault Backup</span>
                </button>
              </div>

              <div className="border-t border-neutral-200 pt-4 dark:border-neutral-800">
                {!confirmWipeVault ? (
                  <button
                    type="button"
                    onClick={() => setConfirmWipeVault(true)}
                    className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-3.5 py-2 font-mono text-xs text-neutral-700 hover:border-neutral-950 hover:text-neutral-950 dark:border-neutral-700 dark:text-neutral-300"
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>Reset & Re-Enroll Security Vault</span>
                  </button>
                ) : (
                  <div className="space-y-3 rounded-lg border border-neutral-950 bg-neutral-100 p-4 dark:border-neutral-400 dark:bg-neutral-900">
                    <p className="font-mono text-xs text-neutral-900 dark:text-neutral-100">
                      This erases your local hashed credentials and 2FA seed so you can enroll new ones on next entry. Continue?
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleWipeVault}
                        className="rounded-lg bg-neutral-950 px-3 py-1.5 font-mono text-xs text-neutral-50 dark:bg-neutral-50 dark:text-neutral-950"
                      >
                        Confirm Vault Wipe
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmWipeVault(false)}
                        className="rounded-lg border border-neutral-300 px-3 py-1.5 font-mono text-xs dark:border-neutral-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export function AdminPortal() {
  const [session, setSession] = useState<AuthenticatedSession | null>(null)

  const handleLock = useCallback(() => {
    setSession(null)
  }, [])

  if (!session) {
    return <AdminAuthGate onAuthenticated={setSession} />
  }

  return <AdminDashboard session={session} onLock={handleLock} />
}

export default AdminPortal
