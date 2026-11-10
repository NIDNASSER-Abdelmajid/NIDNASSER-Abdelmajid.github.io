export type ProjectCategory = 'All' | 'Lakehouse & ETL' | 'Streaming' | 'Crawling & Extraction'

export interface PipelineStage {
  id: 'sources' | 'ingest' | 'lakehouse' | 'serve'
  step: string
  label: string
  subtitle: string
  engines: string[]
  pattern: string
  contract: string
  snippet: string
}

export interface ProjectArchitectureNode {
  layer: string
  component: string
  format: string
  tablesOrTopics: string[]
  detail: string
}

export interface ProjectTableSchema {
  tableName: string
  layer: 'Source' | 'Bronze' | 'Silver' | 'Gold' | 'Stream' | 'Serving'
  primaryKey: string
  partitionOrCluster: string
  updateMode: string
  columns: { name: string; type: string; note: string }[]
}

export interface ProjectQualityGate {
  rule: string
  layer: string
  enforcement: string
}

export interface ProjectItem {
  id: string
  code: string
  title: string
  category: Exclude<ProjectCategory, 'All'>
  year: string
  context: string
  summary: string
  ingestionMode: string
  computeEngine: string
  orchestration: string
  storageSink: string
  grain: string
  sla: string
  impact: string[]
  stack: string[]
  repoUrl?: string
  architecture: ProjectArchitectureNode[]
  schemas: ProjectTableSchema[]
  qualityGates: ProjectQualityGate[]
  codeSnippet: {
    filename: string
    language: string
    content: string
  }
  tradeoffs: string[]
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
}

export interface StackRow {
  layer: 'lakehouse' | 'pipelines' | 'storage' | 'bi_ml'
  layerLabel: string
  technology: string
  role: string
  workload: string
}

export interface BlogSection {
  heading: string
  paragraphs: string[]
  code?: {
    label: string
    content: string
  }
  bullets?: string[]
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
  takeaways: string[]
  sections: BlogSection[]
}
