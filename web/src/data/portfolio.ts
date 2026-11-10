import type {
  ArchitectureBlueprint,
  CredentialItem,
  EducationItem,
  ExperienceItem,
  ProjectItem,
  StackRow,
} from '../types/portfolio'

export const PROFILE = {
  name: 'Abdelmajid NIDNASSER',
  handle: 'JoyBoy',
  monogram: 'AN // DE',
  role: 'Data Engineer',
  location: 'Rabat, Morocco',
  availability: 'Open to Data Engineering Roles',
  email: 'abdelmajidnidnasser1@gmail.com',
  // To add your photo: save it in web/public/profile.jpg and set photoUrl: '/profile.jpg'
  photoUrl: '',
  headline: 'Designing reliable data pipelines across batch, streaming, and analytical systems.',
  summary:
    'From raw operational feeds, APIs, and distributed web crawlers to structured warehouses, analytics marts, and ML services.',
  metrics: [
    { value: '100K+', label: 'Domains Crawled' },
    { value: '45+', label: 'Systems Shipped' },
    { value: 'Batch · Stream', label: 'End-to-End Scope' },
  ],
  links: {
    github: 'https://github.com/NIDNASSER-Abdelmajid',
    linkedin: 'https://www.linkedin.com/in/abdelmajid-nidnasser',
    freelancer: 'https://www.freelancer.com/u/NIDNASSER',
  },
}

export const ARCHITECTURE_BLUEPRINTS: ArchitectureBlueprint[] = [
  {
    id: 'batch',
    label: 'Batch & Warehousing',
    shortLabel: 'Batch ETL',
    headline: 'Incremental extraction, deterministic merges, and dimensional marts across heterogeneous ERPs and OLTP sources.',
    inputs: ['OLTP DBs', 'ERP APIs', 'Cloud Blob'],
    guardLabel: 'Schema + Quarantine',
    outputs: ['Warehouse', 'BI Marts', 'Audit Log'],
    stages: [
      {
        id: 'extract',
        step: '01',
        role: 'Capture',
        label: 'Watermarked Extract',
        tools: ['Python', 'SQL', 'Airflow', 'REST Connectors'],
        guarantee: 'Resumable watermarks & zero silent drops',
        description:
          'Pulls incremental slices from PostgreSQL, SQL Server, Salesforce, or SAP without overloading source transactions.',
      },
      {
        id: 'land',
        step: '02',
        role: 'Staging',
        label: 'Immutable Landing',
        tools: ['Parquet', 'Delta Lake', 'Cloud Storage'],
        guarantee: 'Append-only replayability per batch',
        description:
          'Preserves raw source snapshots stamped with batch metadata so downstream transforms can replay any window cleanly.',
      },
      {
        id: 'shape',
        step: '03',
        role: 'Transform',
        label: 'Conformed Modeling',
        tools: ['Apache Spark', 'Databricks', 'SQL', 'Pandas'],
        guarantee: 'Idempotent upserts & FK integrity',
        description:
          'Deduplicates records, resolves entity crosswalks, and enforces automated reconciliation assertions before promotion.',
      },
      {
        id: 'serve',
        step: '04',
        role: 'Consume',
        label: 'Semantic & BI Marts',
        tools: ['Power BI', 'Tableau', 'Looker', 'SQL Views'],
        guarantee: 'Consistent KPI definitions across teams',
        description:
          'Exposes star-schema facts and dimensions tuned for fast executive dashboards and self-service SQL exploration.',
      },
    ],
  },
  {
    id: 'streaming',
    label: 'Real-Time Streaming',
    shortLabel: 'Streaming',
    headline: 'Partitioned event logs with schema validation, dead-letter routing, and low-latency state projections.',
    inputs: ['Telemetry', 'Webhooks', 'App Events'],
    guardLabel: 'Dead-Letter Queue',
    outputs: ['Live UI', 'Event Store', 'Alerts'],
    stages: [
      {
        id: 'produce',
        step: '01',
        role: 'Emit',
        label: 'Keyed Event Producers',
        tools: ['Python', 'Java', 'REST / WebSockets'],
        guarantee: 'Per-entity ordering via partition keys',
        description:
          'Publishes structured events partitioned by entity identifier so causal sequences stay intact across worker nodes.',
      },
      {
        id: 'broker',
        step: '02',
        role: 'Transport',
        label: 'Durable Commit Log',
        tools: ['Apache Kafka', 'Docker', 'Topics'],
        guarantee: 'Configurable retention & consumer replay',
        description:
          'Buffers traffic spikes cleanly and decouples event producers from independent downstream consumer groups.',
      },
      {
        id: 'process',
        step: '03',
        role: 'Process',
        label: 'Stateful Workers',
        tools: ['Consumer Groups', 'Schema Validation', 'DLQ'],
        guarantee: 'Manual offset commits post-write',
        description:
          'Routes malformed payloads to dead-letter topics while advancing consumer offsets only after sink durability succeeds.',
      },
      {
        id: 'project',
        step: '04',
        role: 'Serve',
        label: 'Live State & Alerts',
        tools: ['FastAPI', 'Read Stores', 'Sockets'],
        guarantee: 'Idempotent state materialization',
        description:
          'Updates real-time projections and live monitoring surfaces without blocking upstream event throughput.',
      },
    ],
  },
  {
    id: 'extraction',
    label: 'Crawling & Unstructured',
    shortLabel: 'Extraction',
    headline: 'Fault-tolerant web acquisition separated from deduplication, OCR, and structured enrichment.',
    inputs: ['Web DOM', 'HAR Logs', 'Assets'],
    guardLabel: 'Rate & Drift Guard',
    outputs: ['Parquet', 'Search', 'APIs'],
    stages: [
      {
        id: 'crawl',
        step: '01',
        role: 'Acquire',
        label: 'Distributed Crawlers',
        tools: ['Scrapy', 'Selenium', 'Headless Workers'],
        guarantee: 'Exponential backoff & shard isolation',
        description:
          'Captures dynamic DOM snapshots, request headers, and pagination state across large domain cohorts reliably.',
      },
      {
        id: 'checkpoint',
        step: '02',
        role: 'Buffer',
        label: 'Staged Raw Checkpoints',
        tools: ['Parquet', 'JSONL', 'Linux / Cron'],
        guarantee: 'Zero tight coupling to compute jobs',
        description:
          'Flushes captured payloads immediately to disk checkpoints so network retries never stall CPU-heavy enrichment stages.',
      },
      {
        id: 'enrich',
        step: '03',
        role: 'Enrich',
        label: 'Hash Dedupe & OCR',
        tools: ['Apache Spark', 'Python', 'OCR / NLP'],
        guarantee: 'Asset hashing cuts redundant compute',
        description:
          'Hashes repeating media before OCR and classifies unstructured text into hierarchical analytical taxonomies.',
      },
      {
        id: 'publish',
        step: '04',
        role: 'Deliver',
        label: 'Typed Analytical Feeds',
        tools: ['PostgreSQL', 'Parquet', 'REST APIs'],
        guarantee: 'Row-count & drift checks pre-load',
        description:
          'Loads validated historical snapshots with batched upserts into queryable SQL tables and client endpoints.',
      },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics & ML Serving',
    shortLabel: 'BI & ML',
    headline: 'Reproducible feature engineering and governed KPI layers bridging analytical warehouses to operational APIs.',
    inputs: ['Clean Facts', 'Free Text', 'APIs'],
    guardLabel: 'PII & Drift Guard',
    outputs: ['Scoring API', 'BI Suite', 'Audit Trail'],
    stages: [
      {
        id: 'features',
        step: '01',
        role: 'Assemble',
        label: 'Feature & Metric Layer',
        tools: ['SQL', 'Python', 'Pandas'],
        guarantee: 'PII stripping before model exports',
        description:
          'Combines behavioral history with normalized attributes into deterministic datasets free of training-serving skew.',
      },
      {
        id: 'train',
        step: '02',
        role: 'Model',
        label: 'NLP & Tabular Scoring',
        tools: ['Scikit-learn', 'XGBoost', 'NLP Pipelines'],
        guarantee: 'Tracked artifact & model versioning',
        description:
          'Trains and evaluates classification or prioritization models directly on curated institutional and behavioral inputs.',
      },
      {
        id: 'api',
        step: '03',
        role: 'Expose',
        label: 'Operational Serving',
        tools: ['FastAPI', 'Docker', 'PostgreSQL'],
        guarantee: 'Append-only prediction audit trail',
        description:
          'Exposes real-time inference and triage endpoints while writing every versioned verdict back to warehouse storage.',
      },
      {
        id: 'bi',
        step: '04',
        role: 'Decision',
        label: 'Executive Telemetry',
        tools: ['Power BI', 'Tableau', 'Looker'],
        guarantee: 'Single reconciled metric taxonomy',
        description:
          'Pairs model outputs with historical cohort KPIs so stakeholders track both outcomes and operational latency.',
      },
    ],
  },
]

export const PROJECTS: ProjectItem[] = [
  {
    id: 'alphapay-lakehouse',
    code: 'PRJ-01',
    title: 'Financial Payment Lakehouse',
    category: 'Lakehouse & ETL',
    year: '2025',
    context: 'Databricks Medallion (Temp Showcase)',
    summary:
      'Metadata-driven Databricks pipeline unifying operational banking databases and payment gateway logs into governed analytical layers.',
    articleSlug: 'idempotent-cdc-medallion-lakehouse',
    // To attach screenshots later: place files in web/public/projects/ and uncomment:
    // images: [{ src: '/projects/alphapay-1.png', alt: '...', title: '...', context: '...' }],
    wiki: {
      problem:
        'Payment telemetry across card networks, cash agencies, and credit bureau feeds arrived on different schedules and formats, causing duplicate records and brittle manual reconciliation.',
      solution:
        'Designed a config-driven three-stage lakehouse pipeline that separates immutable raw ingestion from cleaned, deduplicated core tables and self-service risk marts.',
      workflow: [
        {
          step: '01',
          title: 'Metadata-Driven Source Pull',
          summary:
            'Reads source schedules and watermark tracking configs so onboarding a new banking feed takes a configuration entry rather than duplicating jobs.',
          tools: ['PostgreSQL', 'Cloud CSV', 'Config Metadata'],
        },
        {
          step: '02',
          title: 'Append-Only Raw Landing',
          summary:
            'Stores every incoming transaction and gateway settlement untouched with batch stamps so broken downstream transforms can safely replay.',
          tools: ['Delta Lake', 'Databricks'],
        },
        {
          step: '03',
          title: 'Standardization & Deduplication',
          summary:
            'Cleans customer identifiers, joins gateway latency metrics onto transactions, and routes malformed records to an isolated review table.',
          tools: ['PySpark', 'SQL'],
        },
        {
          step: '04',
          title: 'Business Marts & Q&A Analytics',
          summary:
            'Publishes customer risk profiles and regional gateway KPIs ready for BI dashboards and natural-language SQL exploration.',
          tools: ['Delta Marts', 'BI Views'],
        },
      ],
    },
    impact: [
      'Unified 6 core banking and gateway entities (CMI, PayZone, Fatourati, CashPlus) into a single analytical platform.',
      'Guaranteed idempotent incremental updates so job retries never duplicate financial totals.',
      'Delivered risk and latency marts tailored for non-technical risk teams.',
    ],
    stack: ['Databricks', 'PySpark', 'Delta Lake', 'PostgreSQL', 'SQL'],
    decisions: [
      {
        choice: 'Configuration-driven ingestion over per-table scripts',
        rationale: 'Allowed new banking feeds and gateway partners to be onboarded consistently without copy-pasting pipelines.',
      },
      {
        choice: 'Immutable landing layer before transformations',
        rationale: 'Made recovery from upstream formatting bugs repeatable without re-querying operational databases.',
      },
    ],
  },
  {
    id: 'web-privacy-pipeline',
    code: 'PRJ-02',
    title: 'Web Telemetry & Ad-Detection Pipeline',
    category: 'Crawling & Extraction',
    year: '2025',
    context: 'UM6P College of Computing',
    summary:
      'Distributed crawling and enrichment platform processing DOM trees, network telemetry, and OCR signals across 100K+ websites.',
    repoUrl: 'https://github.com/NIDNASSER-Abdelmajid/crawler-addisclosure',
    articleSlug: 'crawling-100k-domains-clean-etl',
    wiki: {
      problem:
        'Large-scale web measurement studies generate noisy DOM trees, repeating third-party creatives, and slow OCR workloads that easily stall if coupled tightly to headless crawlers.',
      solution:
        'Decoupled parallel browser capture from Spark-based deduplication and OCR enrichment using staged Parquet checkpoints and perceptual asset hashing.',
      workflow: [
        {
          step: '01',
          title: 'Parallel Web Acquisition',
          summary:
            'Distributed worker pools crawl top Tranco domains to capture page markup, network logs, and disclosure markers.',
          tools: ['Python', 'Headless Crawlers'],
        },
        {
          step: '02',
          title: 'Parquet Checkpoint Buffering',
          summary:
            'Flushes raw captures continuously into partitioned storage so site timeouts never derail heavy enrichment jobs.',
          tools: ['Parquet', 'Linux'],
        },
        {
          step: '03',
          title: 'Hash Deduplication & OCR',
          summary:
            'Deduplicates identical ad banners across thousands of domains before running OCR and categorizing disclosures across a 12-class taxonomy.',
          tools: ['Apache Spark', 'PySpark', 'OCR'],
        },
        {
          step: '04',
          title: 'Real-Time Classifier Support',
          summary:
            'Feeds curated features into downstream classification workflows and browser-side detection prototypes.',
          tools: ['ML Features', 'API'],
        },
      ],
    },
    impact: [
      'Processed telemetry across 100K+ Tranco websites into clean, reproducible research datasets.',
      'Organized noisy web signals into 12 top categories and 35 fine-grained disclosure subcategories.',
      'Cut duplicate OCR computation dramatically by hashing identical third-party CDN assets upstream.',
    ],
    stack: ['Python', 'Apache Spark', 'ETL', 'OCR', 'Crawlers'],
    decisions: [
      {
        choice: 'Checkpointing raw captures before Spark processing',
        rationale: 'Kept flaky network I/O isolated from distributed compute clusters.',
      },
      {
        choice: 'Pre-OCR cryptographic hashing of creative assets',
        rationale: 'Eliminated repeated OCR passes on shared third-party ad creatives across domains.',
      },
    ],
  },
  {
    id: 'leyton-financial-warehouse',
    code: 'PRJ-03',
    title: 'Multi-ERP Financial Warehouse',
    category: 'Lakehouse & ETL',
    year: '2024',
    context: 'Leyton',
    summary:
      'Automated ETL platform unifying Salesforce, Odoo, and SAP financial feeds into a governed Star Schema warehouse for executive BI.',
    repoUrl: 'https://github.com/NIDNASSER-Abdelmajid/SALES-ANALYTICS-DASHBOARD',
    articleSlug: 'star-schema-multi-erp-warehouses',
    wiki: {
      problem:
        'Customer, billing, and accounting metrics lived in separate Salesforce, Odoo, and SAP silos, forcing analysts into slow, error-prone spreadsheet reconciliations before reporting.',
      solution:
        'Built automated extraction workflows feeding a conformed Star and Snowflake warehouse with customer identity crosswalks and strict ledger balance checks.',
      workflow: [
        {
          step: '01',
          title: 'Cross-System Extraction',
          summary:
            'Scheduled incremental pulls from CRM, billing, and general ledger exports into a central staging area.',
          tools: ['Python', 'Apache Spark'],
        },
        {
          step: '02',
          title: 'Client Crosswalk Resolution',
          summary:
            'Maps fragmented account IDs across Salesforce, Odoo, and SAP onto unified client records while preserving original keys for audits.',
          tools: ['SQL', 'ETL'],
        },
        {
          step: '03',
          title: 'Dimensional Modeling',
          summary:
            'Structures invoice and contract data into clean fact and dimension models tailored for churn, retention, and lifetime value queries.',
          tools: ['Star Schema', 'SQL Server'],
        },
        {
          step: '04',
          title: 'Governed BI Delivery',
          summary:
            'Powers interactive finance and operations dashboards after passing automated variance checks against SAP period totals.',
          tools: ['Power BI', 'Tableau'],
        },
      ],
    },
    impact: [
      'Replaced recurring manual CSV reconciliations with automated daily pipeline runs.',
      'Delivered trusted CLV, margin, and retention metrics shared across finance and leadership teams.',
      'Preserved full invoice-level traceability back to native ERP identifiers.',
    ],
    stack: ['Python', 'Apache Spark', 'SQL', 'Star Schema', 'Power BI'],
    decisions: [
      {
        choice: 'Crosswalk identity table over overwriting native ERP IDs',
        rationale: 'Protected auditability across finance teams working in different source tools.',
      },
      {
        choice: 'Warehouse KPI computation before BI dashboards',
        rationale: 'Prevented diverging numbers between Power BI and Tableau reports.',
      },
    ],
  },
  {
    id: 'kafka-realtime-streaming',
    code: 'PRJ-04',
    title: 'Real-Time Kafka Event Engine',
    category: 'Streaming',
    year: '2024',
    context: 'Distributed Systems (Temp Showcase)',
    summary:
      'Partitioned Apache Kafka event pipeline with dead-letter recovery, containerized consumers, and real-time read projections.',
    repoUrl: 'https://github.com/NIDNASSER-Abdelmajid/Real-Time-Socket-Streaming',
    wiki: {
      problem:
        'Direct point-to-point webhooks broke easily during traffic bursts, dropped malformed payloads silently, and struggled to keep real-time client dashboards synchronized.',
      solution:
        'Introduced Apache Kafka as a durable event backbone with entity-keyed partitions, isolated dead-letter topics, and Dockerized workers feeding live views.',
      workflow: [
        {
          step: '01',
          title: 'Entity-Keyed Publishing',
          summary:
            'Routes all events for a given entity into the same Kafka partition to keep updates strictly in order.',
          tools: ['Python', 'Java', 'Apache Kafka'],
        },
        {
          step: '02',
          title: 'Broker Buffering & Dead-Letter Routing',
          summary:
            'Decouples bursty producers from downstream processors and shunts invalid messages into a replayable quarantine topic.',
          tools: ['Apache Kafka', 'Docker'],
        },
        {
          step: '03',
          title: 'Safe Worker Processing',
          summary:
            'Consumer groups acknowledge message offsets only after state updates are safely written downstream.',
          tools: ['Consumer Groups', 'Python'],
        },
        {
          step: '04',
          title: 'Real-Time Projections',
          summary:
            'Streams live state transitions straight to active socket and dashboard subscribers.',
          tools: ['Streaming Views', 'Sockets'],
        },
      ],
    },
    impact: [
      'Maintained sub-second delivery under bursty producer workloads without blocking client threads.',
      'Guaranteed zero silent message loss via manual offset control and dead-letter inspection.',
    ],
    stack: ['Apache Kafka', 'Python', 'Java', 'Docker'],
    decisions: [
      {
        choice: 'Partitioning by entity key over round-robin',
        rationale: 'Avoided out-of-order state overwrites during rapid updates.',
      },
      {
        choice: 'Manual post-write consumer commits',
        rationale: 'Ensured crashed workers cleanly replay uncommitted events on restart.',
      },
    ],
  },
  {
    id: 'onde-child-data-platform',
    code: 'PRJ-05',
    title: 'Institutional Case Data Platform',
    category: 'Lakehouse & ETL',
    year: '2025',
    context: "ONDE'Child",
    summary:
      'Case ingestion, privacy-safe standardization, and NLP triage pipeline powering prioritized operational workflows in PostgreSQL.',
    wiki: {
      problem:
        'Case reports from institutional partners arrived with inconsistent schemas and unstructured narrative notes, slowing urgent prioritization decisions.',
      solution:
        'Built an end-to-end standardization pipeline in PostgreSQL paired with automated NLP tagging and a REST scoring service.',
      workflow: [
        {
          step: '01',
          title: 'Heterogeneous Record Ingestion',
          summary:
            'Normalizes mixed institutional spreadsheets and form feeds into unified case structures.',
          tools: ['Python', 'PostgreSQL'],
        },
        {
          step: '02',
          title: 'Privacy-First Feature Prep',
          summary:
            'Separates direct identifiers before extracting signals from narrative case summaries.',
          tools: ['Python', 'NLP'],
        },
        {
          step: '03',
          title: 'Automated Triage Scoring',
          summary:
            'Scores incoming dossiers with versioned NLP models and logs every prediction alongside timestamps.',
          tools: ['Scikit-learn', 'FastAPI'],
        },
      ],
    },
    impact: [
      'Consolidated fragmented case records into clean PostgreSQL structures.',
      'Shortened triage turnaround through automated narrative tagging and prioritization scoring.',
    ],
    stack: ['Python', 'PostgreSQL', 'ETL', 'NLP', 'FastAPI'],
    decisions: [
      {
        choice: 'Append-only prediction history over overwriting priority scores',
        rationale: 'Gave case officers full visibility into how assessments changed over time.',
      },
    ],
  },
  {
    id: 'automated-extraction-suite',
    code: 'PRJ-06',
    title: 'Automated Web & Market Extractors',
    category: 'Crawling & Extraction',
    year: '2025',
    context: 'Open Source & Client Pipelines',
    summary:
      'Production Scrapy and Selenium extraction pipelines delivering validated market feeds and dynamic web catalogs to SQL and Parquet.',
    repoUrl: 'https://github.com/NIDNASSER-Abdelmajid/ScrapyGram',
    wiki: {
      problem:
        'Client market feeds and dynamic JavaScript storefronts frequently changed markup or throttled naive requests, breaking downstream pricing models.',
      solution:
        'Engineered modular Scrapy/Selenium extractors with strict runtime item validation, baseline row-count guards, and batched PostgreSQL loading.',
      workflow: [
        {
          step: '01',
          title: 'Resilient Traversal',
          summary:
            'Handles pagination cursors, dynamic rendering, and adaptive throttling gracefully across targets.',
          tools: ['Scrapy', 'Selenium'],
        },
        {
          step: '02',
          title: 'Validation & Drift Guard',
          summary:
            'Verifies extracted field types and compares batch counts against historical baselines before overwriting snapshots.',
          tools: ['Python', 'Pandas'],
        },
        {
          step: '03',
          title: 'Batched Historical Loading',
          summary:
            'Streams clean records in multi-hundred-row batches into PostgreSQL and archive Parquet files.',
          tools: ['PostgreSQL', 'Docker'],
        },
      ],
    },
    impact: [
      'Delivered 45+ client extraction and automation workflows with high reliability.',
      'Cut database write overhead dramatically through batched SQL upserts and pre-load checks.',
    ],
    stack: ['Python', 'Scrapy', 'Selenium', 'PostgreSQL', 'Pandas'],
    decisions: [
      {
        choice: 'Pre-load row-count drift guard',
        rationale: 'Stopped broken layout changes from wiping valid historical snapshots.',
      },
    ],
  },
]

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'um6p',
    role: 'Research Engineer (Data Pipelines)',
    organization: 'UM6P College of Computing',
    location: 'Rabat, Morocco',
    period: 'Jan 2025 - Sep 2025',
    type: 'Research',
    highlights: [
      'Engineered distributed crawlers across 100K+ Tranco domains capturing DOM trees, network headers, and ad disclosure metadata.',
      'Built PySpark enrichment pipelines with OCR extraction, structuring telemetry across 12 categories and 35 subcategories.',
    ],
    stack: ['Python', 'Apache Spark', 'ETL', 'OCR', 'Crawlers'],
  },
  {
    id: 'onde-child',
    role: 'Co-Founder & Data Engineer',
    organization: "ONDE'Child",
    location: 'Rabat, Morocco',
    period: 'Jan 2024 - Jul 2025',
    type: 'Startup',
    highlights: [
      'Constructed Python and PostgreSQL ingestion pipelines unifying heterogeneous institutional case datasets.',
      'Shipped automated NLP triage pipelines and REST scoring endpoints for real-time case prioritization.',
    ],
    stack: ['Python', 'PostgreSQL', 'ETL', 'NLP', 'FastAPI'],
  },
  {
    id: 'leyton',
    role: 'Data Engineer & BI Consultant',
    organization: 'Leyton',
    location: 'Casablanca, Morocco',
    period: 'Jun 2023 - Jan 2024',
    type: 'Industry',
    highlights: [
      'Automated Python and PySpark ETL workflows unifying Salesforce, Odoo, and SAP data into Star and Snowflake schemas.',
      'Designed conformed client crosswalks and tuned analytical SQL marts powering Power BI and Tableau dashboards.',
    ],
    stack: ['Python', 'Apache Spark', 'SQL', 'Star Schema', 'Power BI'],
  },
  {
    id: 'freelancer',
    role: 'Freelance Data & AI Engineer',
    organization: 'Freelancer.com',
    location: 'Remote',
    period: 'Nov 2022 - Present',
    type: 'Freelance',
    highlights: [
      'Delivered 45+ production data extraction, ETL automation, and backend API systems with a 5.0 rating across 48 reviews.',
    ],
    stack: ['Python', 'SQL', 'FastAPI', 'Docker', 'Scraping'],
  },
]

export const EDUCATION: EducationItem[] = [
  {
    id: 'inpt',
    degree: 'Engineering Degree in Innovation & AMOA (Data Engineering Track)',
    institution: 'INPT (National Institute of Posts & Telecommunications)',
    location: 'Rabat, Morocco',
    period: '2022 - 2025',
    details: [
      'Focus on Data Engineering, Database Systems, Algorithms, and Machine Learning.',
      'General Affairs Leader of INPT Student Council (2024) and CIT INPT member.',
    ],
  },
  {
    id: 'cpge',
    degree: 'Preparatory Classes for Engineering Studies (CPGE)',
    institution: 'Lycée Reda Slaoui',
    location: 'Agadir, Morocco',
    period: '2020 - 2022',
    details: [
      'Intensive engineering track in Advanced Mathematics, Physics, and Computer Science.',
    ],
  },
]

// To enable "Verify Link" or "View Image" buttons on any credential, set credentialUrl and/or imageUrl.
export const CREDENTIALS: CredentialItem[] = [
  {
    id: 'huawei-ai',
    title: 'HCIA-AI V3.5 Certified',
    issuer: 'Huawei',
    year: '2025',
    category: 'Certification',
    summary: 'Core machine learning, neural networks, and AI deployment foundations on Huawei Cloud.',
  },
  {
    id: 'voices-deep-tech',
    title: 'Voices of Deep Tech MEA',
    issuer: 'Regional Honor',
    year: '2025',
    category: 'Recognition',
    summary: 'Selected across Middle East and Africa regional deep-tech innovation initiatives.',
  },
  {
    id: 'oracle-genai',
    title: 'OCI 2024 Generative AI Certified',
    issuer: 'Oracle',
    year: '2024',
    category: 'Certification',
    summary: 'Large language models, vector retrieval pipelines, and managed OCI generative AI deployment.',
  },
  {
    id: 'hult-prize',
    title: '1st Place: Hult Prize Local',
    issuer: 'ENSAM Rabat',
    year: '2024',
    category: 'Recognition',
    summary: 'First-place award for social impact entrepreneurship and applied technical execution.',
  },
  {
    id: 'mckinsey-forward',
    title: 'McKinsey Forward Program',
    issuer: 'McKinsey & Company',
    year: '2023',
    category: 'Certification',
    summary: 'Structured problem-solving, analytical communication, and digital delivery practices.',
  },
  {
    id: 'google-pm',
    title: 'Project Management',
    issuer: 'Google',
    year: '2023',
    category: 'Certification',
    summary: 'Iterative delivery planning, stakeholder alignment, and risk mitigation across technical teams.',
  },
  {
    id: 'efset-c2',
    title: 'English Proficiency (C2)',
    issuer: 'EF SET',
    year: '2022',
    category: 'Certification',
    summary: 'C2 Proficient level across reading and listening comprehension.',
  },
]

export const STACK_MATRIX: StackRow[] = [
  { id: 'databricks', layer: 'lakehouse', layerLabel: 'Lakehouse & Compute', technology: 'Databricks' },
  { id: 'delta-lake', layer: 'lakehouse', layerLabel: 'Lakehouse & Compute', technology: 'Delta Lake' },
  { id: 'apache-spark', layer: 'lakehouse', layerLabel: 'Lakehouse & Compute', technology: 'Apache Spark' },
  { id: 'python', layer: 'lakehouse', layerLabel: 'Lakehouse & Compute', technology: 'Python' },
  { id: 'pandas', layer: 'lakehouse', layerLabel: 'Lakehouse & Compute', technology: 'Pandas' },

  { id: 'apache-airflow', layer: 'pipelines', layerLabel: 'Orchestration & Streaming', technology: 'Apache Airflow' },
  { id: 'apache-kafka', layer: 'pipelines', layerLabel: 'Orchestration & Streaming', technology: 'Apache Kafka' },
  { id: 'scrapy', layer: 'pipelines', layerLabel: 'Orchestration & Streaming', technology: 'Scrapy' },
  { id: 'selenium', layer: 'pipelines', layerLabel: 'Orchestration & Streaming', technology: 'Selenium' },
  { id: 'docker', layer: 'pipelines', layerLabel: 'Orchestration & Streaming', technology: 'Docker' },
  { id: 'linux', layer: 'pipelines', layerLabel: 'Orchestration & Streaming', technology: 'Linux' },
  { id: 'git', layer: 'pipelines', layerLabel: 'Orchestration & Streaming', technology: 'Git' },
  { id: 'google-cloud', layer: 'pipelines', layerLabel: 'Orchestration & Streaming', technology: 'Google Cloud' },

  { id: 'sql', layer: 'storage', layerLabel: 'Storage & Modeling', technology: 'SQL' },
  { id: 'postgresql', layer: 'storage', layerLabel: 'Storage & Modeling', technology: 'PostgreSQL' },
  { id: 'sql-server', layer: 'storage', layerLabel: 'Storage & Modeling', technology: 'SQL Server' },
  { id: 'mysql', layer: 'storage', layerLabel: 'Storage & Modeling', technology: 'MySQL' },
  { id: 'mongodb', layer: 'storage', layerLabel: 'Storage & Modeling', technology: 'MongoDB' },
  { id: 'sqlite', layer: 'storage', layerLabel: 'Storage & Modeling', technology: 'SQLite' },

  { id: 'power-bi', layer: 'bi_ml', layerLabel: 'BI & Serving', technology: 'Power BI' },
  { id: 'tableau', layer: 'bi_ml', layerLabel: 'BI & Serving', technology: 'Tableau' },
  { id: 'looker', layer: 'bi_ml', layerLabel: 'BI & Serving', technology: 'Looker' },
  { id: 'fastapi', layer: 'bi_ml', layerLabel: 'BI & Serving', technology: 'FastAPI' },
  { id: 'scikit-learn', layer: 'bi_ml', layerLabel: 'BI & Serving', technology: 'Scikit-learn' },
  { id: 'xgboost', layer: 'bi_ml', layerLabel: 'BI & Serving', technology: 'XGBoost' },
]
