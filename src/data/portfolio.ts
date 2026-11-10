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
  detail: string
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
  architecture: ProjectArchitectureNode[]
  schemaNote: string
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

export const PROFILE = {
  name: 'Abdelmajid NIDNASSER',
  handle: 'JoyBoy',
  monogram: 'AN // DE',
  role: 'Data Engineer',
  location: 'Rabat, Morocco',
  availability: 'Available for Data Engineering & Platform Roles',
  email: 'abdelmajidnidnasser1@gmail.com',
  headline: 'Building resilient pipelines from raw ingestion to analytical serving.',
  summary:
    'Data Engineer focused on turning fragmented operational systems, event streams, and large-scale web sources into structured lakehouses, reliable ETL workflows, and production-ready datasets.',
  metrics: [
    { value: '100K+', label: 'Web sources crawled & enriched' },
    { value: '45+', label: 'Data & automation systems shipped' },
    { value: '3-Tier', label: 'Bronze · Silver · Gold architecture' },
  ],
  links: {
    github: 'https://github.com/NIDNASSER-Abdelmajid',
    linkedin: 'https://www.linkedin.com/in/abdelmajid-nidnasser',
    freelancer: 'https://www.freelancer.com/u/NIDNASSER',
  },
}

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 'sources',
    step: '01',
    label: 'SOURCES',
    subtitle: 'OLTP · APIs · Crawlers',
    engines: ['PostgreSQL', 'REST APIs', 'Scrapy', 'Cloud Blob'],
    pattern: 'Incremental CDC & Distributed Scraping',
    contract: 'raw_events / cdc_batches',
    snippet: `SELECT txn_id, account_id, amount, txn_timestamp\nFROM alphapay.transactions\nWHERE created_at > :last_watermark;`,
  },
  {
    id: 'ingest',
    step: '02',
    label: 'INGEST & STREAM',
    subtitle: 'Kafka · Airflow · ETL',
    engines: ['Apache Kafka', 'Apache Airflow', 'Python', 'Docker'],
    pattern: 'Orchestrated Batch & Event Streaming',
    contract: 'validated_topic / dag_run',
    snippet: `dag_id: "ingest_operational_cdc"\nschedule: "*/15 * * * *"\nretries: 3\nidempotent_merge: true`,
  },
  {
    id: 'lakehouse',
    step: '03',
    label: 'MEDALLION LAKEHOUSE',
    subtitle: 'Databricks · Spark · Delta',
    engines: ['Databricks', 'Apache Spark', 'PySpark', 'Delta Lake'],
    pattern: 'Bronze -> Silver -> Gold Refinement',
    contract: 'gold.fct_transactions_daily',
    snippet: `MERGE INTO silver.transactions t\nUSING staging_cdc s ON t.txn_id = s.txn_id\nWHEN MATCHED THEN UPDATE SET *\nWHEN NOT MATCHED THEN INSERT *;`,
  },
  {
    id: 'serve',
    step: '04',
    label: 'SERVE & ANALYTICS',
    subtitle: 'Warehouse · BI · ML',
    engines: ['SQL Server', 'Power BI', 'Tableau', 'FastAPI'],
    pattern: 'Star Schema Marts & Inference APIs',
    contract: 'kpi_semantic_layer',
    snippet: `SELECT region, SUM(volume_mad) AS gmv,\n  AVG(latency_ms) AS gateway_p50\nFROM gold.mart_payment_gateways\nGROUP BY region;`,
  },
]

export const PROJECTS: ProjectItem[] = [
  {
    id: 'alphapay-lakehouse',
    code: 'PRJ-01',
    title: 'AlphaPay — Moroccan Financial Analytics Lakehouse',
    category: 'Lakehouse & ETL',
    year: '2025',
    context: 'Databricks Medallion Architecture (Temp Showcase)',
    summary:
      'Metadata-driven lakehouse consolidating PostgreSQL OLTP banking schemas and cloud gateway batch logs into Bronze, Silver, and Gold Delta tables for risk and payment analytics.',
    impact: [
      'Unified 6 normalized relational and flat-file entities across agencies, customers, accounts, transactions, credit bureau pulls, and gateway settlements (CMI, PayZone, Fatourati, CashPlus).',
      'Implemented historical baseline seeding plus incremental CDC merge pipelines across Moroccan regional hubs.',
      'Delivered curated Gold marts powering executive BI views and natural-language exploration.',
    ],
    stack: ['Databricks', 'PySpark', 'Delta Lake', 'PostgreSQL', 'SQL', 'Medallion'],
    architecture: [
      {
        layer: '01 // SOURCE',
        component: 'PostgreSQL OLTP + Cloud Storage',
        detail: 'alphapay DDL tables + CSV credit bureau & payment gateway batches',
      },
      {
        layer: '02 // BRONZE & SILVER',
        component: 'Metadata-Driven PySpark ETL',
        detail: 'Schema enforcement, deduplication, and incremental CDC upserts',
      },
      {
        layer: '03 // GOLD',
        component: 'Curated Analytical Marts',
        detail: 'Customer risk scoring, regional GMV, and gateway latency aggregations',
      },
      {
        layer: '04 // SERVING',
        component: 'BI Dashboards & Genie SQL',
        detail: 'Self-service operational reporting across 5 Moroccan hubs',
      },
    ],
    schemaNote: 'Entities: AGENCIES -> CUSTOMERS -> ACCOUNTS -> TRANSACTIONS <-> PAYMENT_GATEWAY_LOGS',
  },
  {
    id: 'web-privacy-pipeline',
    code: 'PRJ-02',
    title: 'Large-Scale Web Telemetry & Ad-Detection Pipeline',
    category: 'Crawling & Extraction',
    year: '2025',
    context: 'UM6P College of Computing',
    summary:
      'Scalable data collection, cleaning, and enrichment pipeline processing network-level and DOM-level signals across 100K+ Tranco websites.',
    impact: [
      'Engineered custom crawlers capturing network requests, DOM trees, and targeting metadata across 100K+ domains.',
      'Automated multi-taxonomy classification across 12 categories and 35 subcategories with OCR text extraction for image assets.',
      'Connected batch enrichment and real-time inference workflows to a browser-side classification prototype.',
    ],
    stack: ['Python', 'Apache Spark', 'ETL', 'OCR', 'Custom Crawlers', 'ML Pipelines'],
    repoUrl: 'https://github.com/NIDNASSER-Abdelmajid/crawler-addisclosure',
    architecture: [
      {
        layer: '01 // COLLECTION',
        component: 'Tranco-Seeded Crawlers',
        detail: 'Headless capture of DOM nodes, filter-list matches, and ad disclosure payloads',
      },
      {
        layer: '02 // ENRICHMENT',
        component: 'Semi-Automated Cleaning + OCR',
        detail: 'Noise filtering, schema normalization, and image-to-text extraction',
      },
      {
        layer: '03 // PROCESSING',
        component: 'Spark Batch & Inference',
        detail: 'Hierarchical feature generation across 12 top-level categories',
      },
      {
        layer: '04 // SERVING',
        component: 'Real-Time Classifier API',
        detail: 'Low-latency inference backing client-side detection',
      },
    ],
    schemaNote: 'Signal grain: (domain_rank, request_url, dom_selector, disclosure_payload, ocr_tokens)',
  },
  {
    id: 'leyton-financial-warehouse',
    code: 'PRJ-03',
    title: 'Multi-ERP Financial Data Warehouse & BI Platform',
    category: 'Lakehouse & ETL',
    year: '2024',
    context: 'Leyton',
    summary:
      'Automated Python and Apache Spark ETL workflows unifying Salesforce, Odoo, and SAP financial records into Star and Snowflake schema warehouses.',
    impact: [
      'Eliminated manual spreadsheet reconciliation by automating cross-ERP extraction, validation, and exception handling.',
      'Modeled Star and Snowflake data marts tuned with complex analytical SQL for revenue, CLV, churn, and margin tracking.',
      'Built governed semantic layers enabling self-service Power BI and Tableau dashboards for finance and operations.',
    ],
    stack: ['Python', 'Apache Spark', 'SQL', 'Star Schema', 'Power BI', 'Tableau'],
    repoUrl: 'https://github.com/NIDNASSER-Abdelmajid/SALES-ANALYTICS-DASHBOARD',
    architecture: [
      {
        layer: '01 // EXTRACT',
        component: 'Salesforce · Odoo · SAP',
        detail: 'Scheduled incremental connectors for invoices, CRM, and ledger tables',
      },
      {
        layer: '02 // TRANSFORM',
        component: 'Python & Spark Validation',
        detail: 'Currency alignment, governance checks, and slowly changing dimensions',
      },
      {
        layer: '03 // WAREHOUSE',
        component: 'Star & Snowflake Marts',
        detail: 'Indexed fact tables and conformed financial dimensions',
      },
      {
        layer: '04 // BI LAYER',
        component: 'Power BI & Tableau',
        detail: 'Self-service executive KPIs for CLV, churn, and profitability',
      },
    ],
    schemaNote: 'Fact tables: fct_revenue, fct_expenses -> dim_client, dim_contract, dim_calendar',
  },
  {
    id: 'kafka-realtime-streaming',
    code: 'PRJ-04',
    title: 'Distributed Real-Time Event Streaming Engine',
    category: 'Streaming',
    year: '2024',
    context: 'Distributed Systems (Temp Showcase)',
    summary:
      'Fault-tolerant event streaming architecture engineered with Apache Kafka and containerized consumers for high-throughput, low-latency state updates.',
    impact: [
      'Designed partitioned Kafka topics and idempotent consumer groups sustaining thousands of concurrent events per second.',
      'Decoupled ingestion producers from downstream aggregation and UI read projections using Dockerized services.',
    ],
    stack: ['Apache Kafka', 'Python', 'Java', 'Docker', 'Event Streaming'],
    repoUrl: 'https://github.com/NIDNASSER-Abdelmajid/Real-Time-Socket-Streaming',
    architecture: [
      {
        layer: '01 // PRODUCERS',
        component: 'Event Publishers',
        detail: 'Keyed event serialization ensuring per-partition ordering',
      },
      {
        layer: '02 // BROKER',
        component: 'Apache Kafka Cluster',
        detail: 'Replicated partitions, offset tracking, and backpressure buffering',
      },
      {
        layer: '03 // CONSUMERS',
        component: 'Containerized Workers',
        detail: 'Stateless validation and windowed state aggregation',
      },
      {
        layer: '04 // SINK',
        component: 'Real-Time Read Store',
        detail: 'Low-latency live telemetry stream',
      },
    ],
    schemaNote: 'Topic partitioning: key=entity_id | acks=all | retention=7d',
  },
  {
    id: 'onde-child-data-platform',
    code: 'PRJ-05',
    title: 'Heterogeneous Institutional Data Ingestion Platform',
    category: 'Lakehouse & ETL',
    year: '2025',
    context: "ONDE'Child",
    summary:
      'End-to-end ingestion, cleaning, and NLP enrichment pipelines standardizing structured and unstructured institutional case records.',
    impact: [
      'Consolidated heterogeneous institutional feeds into clean, analytics-ready schemas for risk prioritization.',
      'Built automated NLP classification workflows and RESTful scoring APIs embedded in the platform backend.',
    ],
    stack: ['Python', 'PostgreSQL', 'ETL', 'NLP', 'FastAPI', 'Scikit-learn'],
    architecture: [
      {
        layer: '01 // SOURCES',
        component: 'Institutional Case Records',
        detail: 'Mixed structured forms and unstructured text reports',
      },
      {
        layer: '02 // PIPELINE',
        component: 'Cleaning & NLP Enrichment',
        detail: 'Text normalization, entity extraction, and schema validation',
      },
      {
        layer: '03 // STORAGE',
        component: 'PostgreSQL Core Store',
        detail: 'Versioned case tables and feature snapshots',
      },
      {
        layer: '04 // SERVING',
        component: 'REST Scoring Endpoints',
        detail: 'Real-time risk triage for case officers',
      },
    ],
    schemaNote: 'Pipeline mode: hybrid batch backfill + synchronous API scoring',
  },
  {
    id: 'automated-extraction-suite',
    code: 'PRJ-06',
    title: 'Automated Web & Market Data Extraction Suite',
    category: 'Crawling & Extraction',
    year: '2025',
    context: 'Open Source & Client Pipelines',
    summary:
      'Production-grade Scrapy, Selenium, and Python extraction pipelines turning dynamic web catalogs, weather feeds, and equity datasets into clean tabular stores.',
    impact: [
      'Handled JavaScript-rendered views, pagination state, rate limiting, and anti-bot resilience cleanly.',
      'Automated schema checks and deduplication before loading into SQLite, PostgreSQL, and CSV/Parquet targets.',
    ],
    stack: ['Python', 'Scrapy', 'Selenium', 'BeautifulSoup', 'PostgreSQL', 'Pandas'],
    repoUrl: 'https://github.com/NIDNASSER-Abdelmajid/ScrapyGram',
    architecture: [
      {
        layer: '01 // DISCOVERY',
        component: 'Dynamic Crawl Schedulers',
        detail: 'Queue-managed URL frontier with retry & backoff policies',
      },
      {
        layer: '02 // PARSING',
        component: 'DOM & Network Extractors',
        detail: 'Structured field parsing from HTML and XHR JSON payloads',
      },
      {
        layer: '03 // QUALITY',
        component: 'Validation & Deduplication',
        detail: 'Null checks, type casting, and hash-based delta filtering',
      },
      {
        layer: '04 // OUTPUT',
        component: 'Relational & Parquet Sinks',
        detail: 'Analysis-ready snapshots for BI and forecasting',
      },
    ],
    schemaNote: 'Outputs: normalized relational tables + partitioned Parquet snapshots',
  },
]

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'um6p',
    role: 'Research Engineer (Data Pipelines)',
    organization: 'College of Computing — Mohammed VI Polytechnic University',
    location: 'Rabat, Morocco',
    period: 'Jan 2025 – Sep 2025',
    type: 'Research',
    highlights: [
      'Architected a scalable ETL and ingestion pipeline capturing network and DOM telemetry across 100K+ Tranco websites.',
      'Built a semi-automated data cleaning framework and OCR enrichment flow to structure ad metadata across 12 categories and 35 subcategories.',
      'Engineered batch and real-time inference pipelines feeding a live browser classification prototype.',
    ],
    stack: ['Python', 'Apache Spark', 'ETL', 'OCR', 'Custom Crawlers'],
  },
  {
    id: 'onde-child',
    role: 'Co-Founder & Data Engineer',
    organization: "ONDE'Child",
    location: 'Rabat, Morocco',
    period: 'Jan 2024 – Jul 2025',
    type: 'Startup',
    highlights: [
      'Designed ingestion, cleaning, and transformation pipelines unifying heterogeneous institutional datasets.',
      'Built NLP text-classification pipelines and RESTful backend APIs enabling automated case prioritization.',
    ],
    stack: ['Python', 'PostgreSQL', 'ETL', 'NLP', 'REST APIs'],
  },
  {
    id: 'leyton',
    role: 'Data Engineer & Business Intelligence Consultant',
    organization: 'Leyton',
    location: 'Casablanca, Morocco',
    period: 'Jun 2023 – Jan 2024',
    type: 'Industry',
    highlights: [
      'Built automated Python and Apache Spark ETL pipelines extracting financial data from Salesforce, Odoo, and SAP.',
      'Modeled Star and Snowflake schema data warehouses and tuned complex SQL transformations.',
      'Delivered governed semantic layers and executive dashboards in Power BI and Tableau for CLV, churn, and revenue.',
    ],
    stack: ['Python', 'Apache Spark', 'SQL', 'Star Schema', 'Power BI', 'Tableau'],
  },
  {
    id: 'freelancer',
    role: 'Freelance Data & AI Solutions Engineer',
    organization: 'Freelancer.com',
    location: 'Remote',
    period: 'Nov 2022 – Present',
    type: 'Freelance',
    highlights: [
      'Delivered 45+ client systems spanning data extraction, ETL automation, APIs, and ML workflows with a 5.0-star rating across 48 reviews.',
      'Maintained 100% on-time and on-budget delivery across international engineering engagements.',
    ],
    stack: ['Python', 'SQL', 'FastAPI', 'Docker', 'Web Scraping'],
  },
]

export const EDUCATION: EducationItem[] = [
  {
    id: 'inpt',
    degree: 'Engineering Degree in Innovation & AMOA — Data & Business Engineering',
    institution: 'National Institute of Posts and Telecommunications (INPT)',
    location: 'Rabat, Morocco',
    period: '2022 – 2025',
    details: [
      'Core focus: Data Engineering, Database Systems, Algorithms, Machine Learning, and Information Systems.',
      'General Affairs Leader of INPT Student Council (2024) and active member of CIT INPT.',
    ],
  },
  {
    id: 'cpge',
    degree: 'Preparatory Classes for Engineering Studies (CPGE)',
    institution: 'Lycée Reda Slaoui',
    location: 'Agadir, Morocco',
    period: '2020 – 2022',
    details: [
      'Intensive engineering track in Advanced Mathematics, Physics, and Computer Science.',
    ],
  },
]

export const CREDENTIALS: CredentialItem[] = [
  {
    id: 'huawei-ai',
    title: 'HCIA-AI V3.5 Certified',
    issuer: 'Huawei',
    year: '2025',
    category: 'Certification',
  },
  {
    id: 'voices-deep-tech',
    title: 'Voices of Deep Tech MEA',
    issuer: 'Regional Recognition',
    year: '2025',
    category: 'Recognition',
  },
  {
    id: 'oracle-genai',
    title: 'Oracle Cloud Infrastructure 2024 Generative AI Certified',
    issuer: 'Oracle',
    year: '2024',
    category: 'Certification',
  },
  {
    id: 'mckinsey-forward',
    title: 'McKinsey Forward Program',
    issuer: 'McKinsey & Company',
    year: '2023',
    category: 'Certification',
  },
  {
    id: 'google-pm',
    title: 'Foundations of Project Management',
    issuer: 'Google',
    year: '2023',
    category: 'Certification',
  },
  {
    id: 'hult-prize',
    title: '1st Place — Hult Prize Local Competition',
    issuer: 'ENSAM Rabat',
    year: '2024',
    category: 'Recognition',
  },
  {
    id: 'efset-c2',
    title: 'English Proficiency (C2 Mastery)',
    issuer: 'EF SET',
    year: '2022',
    category: 'Certification',
  },
]

export const STACK_MATRIX: StackRow[] = [
  {
    layer: 'lakehouse',
    layerLabel: 'Lakehouse & Compute',
    technology: 'Databricks · Delta Lake',
    role: 'Medallion architecture (Bronze / Silver / Gold) & lakehouse governance',
    workload: 'Batch + Incremental CDC',
  },
  {
    layer: 'lakehouse',
    layerLabel: 'Lakehouse & Compute',
    technology: 'Apache Spark · PySpark',
    role: 'Distributed transformations, joins, and schema enforcement at scale',
    workload: 'Distributed Compute',
  },
  {
    layer: 'lakehouse',
    layerLabel: 'Lakehouse & Compute',
    technology: 'Python · Pandas',
    role: 'Pipeline orchestration logic, data cleaning, and automated QA scripts',
    workload: 'Core Engineering',
  },
  {
    layer: 'pipelines',
    layerLabel: 'Orchestration & Streaming',
    technology: 'Apache Airflow',
    role: 'DAG scheduling, retries, SLA monitoring, and dependency graphs',
    workload: 'Workflow Orchestration',
  },
  {
    layer: 'pipelines',
    layerLabel: 'Orchestration & Streaming',
    technology: 'Apache Kafka',
    role: 'Partitioned event streaming and decoupled producer/consumer flows',
    workload: 'Real-Time Streaming',
  },
  {
    layer: 'pipelines',
    layerLabel: 'Orchestration & Streaming',
    technology: 'Scrapy · Selenium · BeautifulSoup',
    role: 'Resilient web telemetry extraction, network capture, and DOM parsing',
    workload: 'Data Acquisition',
  },
  {
    layer: 'pipelines',
    layerLabel: 'Orchestration & Streaming',
    technology: 'Docker · Linux · Git · Google Cloud',
    role: 'Containerized workers, reproducible environments, and cloud storage',
    workload: 'Platform & Infra',
  },
  {
    layer: 'storage',
    layerLabel: 'Databases & Modeling',
    technology: 'SQL (PostgreSQL · SQL Server · MySQL)',
    role: 'Complex analytical queries, indexing, query tuning, and transactional sources',
    workload: 'RDBMS & Tuning',
  },
  {
    layer: 'storage',
    layerLabel: 'Databases & Modeling',
    technology: 'Star & Snowflake Modeling',
    role: 'Dimensional data marts, SCD patterns, and conformed business keys',
    workload: 'Warehouse Architecture',
  },
  {
    layer: 'storage',
    layerLabel: 'Databases & Modeling',
    technology: 'MongoDB · SQLite',
    role: 'Semi-structured document staging and lightweight embedded pipelines',
    workload: 'NoSQL & Local Staging',
  },
  {
    layer: 'bi_ml',
    layerLabel: 'Analytics, BI & Serving',
    technology: 'Power BI · Tableau · Looker',
    role: 'Governed semantic layers, financial KPIs, and executive dashboards',
    workload: 'Business Intelligence',
  },
  {
    layer: 'bi_ml',
    layerLabel: 'Analytics, BI & Serving',
    technology: 'FastAPI · Scikit-learn · XGBoost · LightGBM',
    role: 'Operationalizing tabular ML & NLP enrichment behind REST inference APIs',
    workload: 'ML Data Serving',
  },
]
