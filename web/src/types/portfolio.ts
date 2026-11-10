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

export interface ProjectSchemaColumn {
  name: string
  type: string
  keyFlag?: 'PK' | 'FK' | 'CLUSTER'
}

export interface ProjectTableSchema {
  tableName: string
  layer: 'Source' | 'Bronze' | 'Silver' | 'Gold' | 'Stream' | 'Serving'
  primaryKey: string
  partitionOrCluster: string
  updateMode: string
  columns: ProjectSchemaColumn[]
}

export interface ProjectSchemaRelation {
  fromTable: string
  fromColumn: string
  toTable: string
  toColumn: string
  cardinality: string
}

export interface ProjectQualityGate {
  boundary: string
  contract: string
  enforcement: string
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
  relations: ProjectSchemaRelation[]
  qualityGates: ProjectQualityGate[]
  codeSnippet: {
    filename: string
    language: string
    content: string
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
}

export interface StackRow {
  id: string
  layer: 'lakehouse' | 'pipelines' | 'storage' | 'bi_ml'
  layerLabel: string
  technology: string
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
  views: number
  excerpt: string
  tags: string[]
  sections: BlogSection[]
}
