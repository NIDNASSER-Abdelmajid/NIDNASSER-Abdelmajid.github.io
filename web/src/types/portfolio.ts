export type ProjectCategory = 'All' | 'Lakehouse & ETL' | 'Streaming' | 'Crawling & Extraction'

export type ArchitectureModeId = 'batch' | 'streaming' | 'extraction' | 'analytics'

export interface ArchitectureStage {
  id: string
  step: string
  role: string
  label: string
  tools: string[]
  guarantee: string
  description: string
}

export interface ArchitectureBlueprint {
  id: ArchitectureModeId
  label: string
  shortLabel: string
  headline: string
  inputs: string[]
  guardLabel: string
  outputs: string[]
  stages: [ArchitectureStage, ArchitectureStage, ArchitectureStage, ArchitectureStage]
}

export interface ProjectImage {
  src: string
  alt: string
  title?: string
  context?: string
}

export interface ProjectWorkflowStep {
  step: string
  title: string
  summary: string
  tools: string[]
}

export interface ProjectDecision {
  choice: string
  rationale: string
}

export interface ProjectItem {
  id: string
  code: string
  title: string
  category: Exclude<ProjectCategory, 'All'>
  year: string
  context: string
  summary: string
  impact: string[]
  stack: string[]
  repoUrl?: string
  articleSlug?: string
  images?: ProjectImage[]
  wiki: {
    problem: string
    solution: string
    workflow: ProjectWorkflowStep[]
  }
  decisions: ProjectDecision[]
}

export interface ExperienceItem {
  id: string
  role: string
  organization: string
  location: string
  period: string
  type: 'Industry' | 'Research' | 'Startup' | 'Freelance'
  highlights: string[]
  stack: string[]
}

export interface EducationItem {
  id: string
  degree: string
  institution: string
  location: string
  period: string
  details: string[]
}

export interface CredentialItem {
  id: string
  title: string
  issuer: string
  year: string
  category: 'Certification' | 'Recognition'
  summary?: string
  credentialUrl?: string
  imageUrl?: string
  imageAlt?: string
}

export interface StackRow {
  id: string
  layer: 'lakehouse' | 'pipelines' | 'storage' | 'bi_ml'
  layerLabel: string
  technology: string
}

export interface BlogImage {
  src: string
  alt: string
  caption?: string
  context?: string
}

export type BlogEmbed =
  | {
      type: 'iframe'
      title: string
      src: string
      aspectRatio?: '16/9' | '4/3' | 'tall'
      caption?: string
    }
  | {
      type: 'link'
      title: string
      url: string
      source: string
      description?: string
    }
  | {
      type: 'callout'
      label: string
      title: string
      body: string
    }

export interface BlogSection {
  heading: string
  paragraphs: string[]
  bullets?: string[]
  code?: {
    label: string
    content: string
  }
  images?: BlogImage[]
  embeds?: BlogEmbed[]
}

export interface BlogPost {
  slug: string
  code: string
  title: string
  topic: 'Lakehouse' | 'ETL & Ingestion' | 'Data Modeling'
  publishedAt: string
  readTime: string
  excerpt: string
  tags: string[]
  sections: BlogSection[]
}
