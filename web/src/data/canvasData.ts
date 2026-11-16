import type { RouteMatch } from '../hooks/useRouter'

export interface CanvasNodeConfig {
  id: RouteMatch['page']
  path: string
  code: string
  stage: string
  title: string
  subtitle: string
  status: string
  tag: string
  metric: string
  description: string
  x: number // in vw
  y: number // in vh
}

export interface PipelineEdgeConfig {
  id: string
  from: RouteMatch['page']
  to: RouteMatch['page']
  label?: string
  fromPort: 'right' | 'bottom' | 'top'
  toPort: 'left' | 'top' | 'bottom'
}

export const CANVAS_NODES: CanvasNodeConfig[] = [
  {
    id: 'home',
    path: '/overview',
    code: '00',
    stage: 'STAGE 00 // INGESTION',
    title: 'Overview & Architecture',
    subtitle: 'Data Sources, Blueprint Topology & Signals',
    status: 'ONLINE',
    tag: 'SOURCE',
    metric: '100K+ Crawled / 45+ Systems',
    description: 'System ingestion blueprints, distributed web crawlers, operational telemetry, and end-to-end data pipeline scope.',
    x: 20,
    y: 30,
  },
  {
    id: 'projects',
    path: '/projects',
    code: '01',
    stage: 'STAGE 01 // TRANSFORM',
    title: 'Engineered Systems',
    subtitle: 'Production Lakehouses & Streaming Pipelines',
    status: 'ACTIVE',
    tag: 'PIPELINE',
    metric: '3 Production Blueprints',
    description: 'Autonomous multi-source scrapers, real-time telemetry streaming, and enterprise batch lakehouse architectures.',
    x: 155,
    y: -25,
  },
  {
    id: 'experience',
    path: '/experience',
    code: '02',
    stage: 'STAGE 02 // OPERATIONS',
    title: 'Execution History',
    subtitle: 'Data Engineering & Analytics Roles',
    status: 'STABLE',
    tag: 'HISTORY',
    metric: '6+ Years Track Record',
    description: 'Proven track record designing scalable ETL/ELT pipelines, warehousing, and distributed data infrastructure.',
    x: 155,
    y: 90,
  },
  {
    id: 'credentials',
    path: '/credentials',
    code: '03',
    stage: 'STAGE 03 // VALIDATION',
    title: 'Credentials & QA',
    subtitle: 'Verified Competencies & Certifications',
    status: 'VERIFIED',
    tag: 'VALIDATION',
    metric: 'Industry Certified',
    description: 'Formal data engineering, analytics engineering, and cloud data architecture accreditations.',
    x: 290,
    y: 90,
  },
  {
    id: 'stack',
    path: '/stack',
    code: '04',
    stage: 'STAGE 04 // TOOLING',
    title: 'Tooling Matrix',
    subtitle: 'Engines, Orchestration & Storage Layers',
    status: 'SYNCHRONIZED',
    tag: 'STACK',
    metric: '20+ Core Technologies',
    description: 'Apache Spark, Kafka, Airflow, dbt, DuckDB, PostgreSQL, BigQuery, ClickHouse, Docker, and Python.',
    x: 290,
    y: -25,
  },
  {
    id: 'blog',
    path: '/blog',
    code: '05',
    stage: 'STAGE 05 // LOGS',
    title: 'Engineering Notes',
    subtitle: 'Technical Write-ups & Telemetry',
    status: 'INDEXED',
    tag: 'LOGS',
    metric: 'Live Read Tracking',
    description: 'Practical engineering logs on data lakehouse design, streaming joins, distributed crawling, and schema governance.',
    x: 425,
    y: -5,
  },
  {
    id: 'contact',
    path: '/contact',
    code: '06',
    stage: 'STAGE 06 // SINK',
    title: 'Sink & Downstream',
    subtitle: 'Inquiries & Direct Communication Channel',
    status: 'LISTENING',
    tag: 'SINK',
    metric: 'Direct Response',
    description: 'Direct communication channel for data engineering contracts, advisory, and production inquiries.',
    x: 425,
    y: 80,
  },
]

export const PIPELINE_EDGES: PipelineEdgeConfig[] = [
  {
    id: 'edge-home-projects',
    from: 'home',
    to: 'projects',
    label: 'EXTRACT & TRANSFORM',
    fromPort: 'right',
    toPort: 'left',
  },
  {
    id: 'edge-home-experience',
    from: 'home',
    to: 'experience',
    label: 'OPERATIONAL LOGS',
    fromPort: 'right',
    toPort: 'left',
  },
  {
    id: 'edge-projects-stack',
    from: 'projects',
    to: 'stack',
    label: 'POWERED BY',
    fromPort: 'right',
    toPort: 'left',
  },
  {
    id: 'edge-projects-experience',
    from: 'projects',
    to: 'experience',
    label: 'PRODUCTION DEPLOY',
    fromPort: 'bottom',
    toPort: 'top',
  },
  {
    id: 'edge-experience-credentials',
    from: 'experience',
    to: 'credentials',
    label: 'QUALITY AUDIT',
    fromPort: 'right',
    toPort: 'left',
  },
  {
    id: 'edge-stack-blog',
    from: 'stack',
    to: 'blog',
    label: 'BENCHMARKS & DEEP DIVES',
    fromPort: 'right',
    toPort: 'left',
  },
  {
    id: 'edge-credentials-contact',
    from: 'credentials',
    to: 'contact',
    label: 'VERIFIED SKILLS',
    fromPort: 'right',
    toPort: 'left',
  },
  {
    id: 'edge-blog-contact',
    from: 'blog',
    to: 'contact',
    label: 'DOWNSTREAM OUTPUT',
    fromPort: 'bottom',
    toPort: 'top',
  },
]
