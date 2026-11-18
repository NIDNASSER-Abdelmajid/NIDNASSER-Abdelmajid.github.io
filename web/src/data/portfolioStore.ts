import { useEffect, useState } from 'react'
import type {
  BlogPost,
  CredentialItem,
  EducationItem,
  ExperienceItem,
  ProjectItem,
  StackRow,
} from '../types/portfolio'
import { BLOG_POSTS } from './blog'
import rawCommittedOverrides from './overrides.json'
import {
  CREDENTIALS,
  EDUCATION,
  EXPERIENCES,
  PROFILE,
  PROJECTS,
  STACK_MATRIX,
} from './portfolio'

export type ProfileData = typeof PROFILE

export interface PortfolioData {
  profile: ProfileData
  projects: ProjectItem[]
  experiences: ExperienceItem[]
  education: EducationItem[]
  credentials: CredentialItem[]
  stackMatrix: StackRow[]
  blogPosts: BlogPost[]
}

export interface PortfolioOverrides {
  profile?: Partial<ProfileData>
  projects?: ProjectItem[]
  experiences?: ExperienceItem[]
  education?: EducationItem[]
  credentials?: CredentialItem[]
  stackMatrix?: StackRow[]
  blogPosts?: BlogPost[]
}

const LOCAL_OVERRIDES_KEY = 'portfolio_admin_overrides_v1'
const committedOverrides = rawCommittedOverrides as PortfolioOverrides

const listeners = new Set<() => void>()

function notifyAll() {
  for (const fn of listeners) {
    fn()
  }
}

export function loadLocalOverrides(): PortfolioOverrides | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(LOCAL_OVERRIDES_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PortfolioOverrides
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

export function hasLocalDraftOverrides(): boolean {
  return loadLocalOverrides() !== null
}

function mergeProfile(base: ProfileData, patch?: Partial<ProfileData>): ProfileData {
  if (!patch) return base
  return {
    ...base,
    ...patch,
    metrics: patch.metrics ?? base.metrics,
    links: {
      ...base.links,
      ...(patch.links ?? {}),
    },
  }
}

export function getDefaultPortfolioData(): PortfolioData {
  return {
    profile: PROFILE,
    projects: PROJECTS,
    experiences: EXPERIENCES,
    education: EDUCATION,
    credentials: CREDENTIALS,
    stackMatrix: STACK_MATRIX,
    blogPosts: BLOG_POSTS,
  }
}

export function getEffectivePortfolioData(): PortfolioData {
  const local = loadLocalOverrides()
  const baseProfile = mergeProfile(PROFILE, committedOverrides.profile)
  const profile = mergeProfile(baseProfile, local?.profile)

  return {
    profile,
    projects: local?.projects ?? committedOverrides.projects ?? PROJECTS,
    experiences: local?.experiences ?? committedOverrides.experiences ?? EXPERIENCES,
    education: local?.education ?? committedOverrides.education ?? EDUCATION,
    credentials: local?.credentials ?? committedOverrides.credentials ?? CREDENTIALS,
    stackMatrix: local?.stackMatrix ?? committedOverrides.stackMatrix ?? STACK_MATRIX,
    blogPosts: local?.blogPosts ?? committedOverrides.blogPosts ?? BLOG_POSTS,
  }
}

export function saveLocalPortfolioOverrides(data: PortfolioData): void {
  if (typeof window === 'undefined') return
  const payload: PortfolioOverrides = {
    profile: data.profile,
    projects: data.projects,
    experiences: data.experiences,
    education: data.education,
    credentials: data.credentials,
    stackMatrix: data.stackMatrix,
    blogPosts: data.blogPosts,
  }
  window.localStorage.setItem(LOCAL_OVERRIDES_KEY, JSON.stringify(payload))
  notifyAll()
}

export function clearLocalPortfolioOverrides(): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(LOCAL_OVERRIDES_KEY)
  notifyAll()
}

export function usePortfolioData(): PortfolioData {
  const [data, setData] = useState<PortfolioData>(() => getEffectivePortfolioData())

  useEffect(() => {
    const sync = () => setData(getEffectivePortfolioData())
    listeners.add(sync)

    const onStorage = (e: StorageEvent) => {
      if (e.key === LOCAL_OVERRIDES_KEY || e.key === null) {
        sync()
      }
    }
    window.addEventListener('storage', onStorage)

    return () => {
      listeners.delete(sync)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  return data
}
