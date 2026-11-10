import type {
  CredentialItem,
  EducationItem,
  ExperienceItem,
  PipelineStage,
  ProjectItem,
  StackRow,
} from '../types/portfolio'

export const PROFILE = {
  name: 'Abdelmajid NIDNASSER',
  handle: 'JoyBoy',
  monogram: 'AN // DE',
  role: 'Data Engineer',
  location: 'Rabat, Morocco',
  availability: 'Available for Data Engineering Roles',
  email: 'abdelmajidnidnasser1@gmail.com',
  // To add your photo: save it in web/public/profile.jpg and set photoUrl: '/profile.jpg'
  photoUrl: '',
  headline: 'Building resilient lakehouses, streaming topologies, and distributed data pipelines.',
  summary:
    'Turning fragmented databases, event streams, and web telemetry into reliable analytical platforms with Python, SQL, Databricks, Spark, Airflow, and Kafka.',
  metrics: [
    { value: '100K+', label: 'Domains Crawled' },
    { value: '45+', label: 'Systems Shipped' },
    { value: '3-Tier', label: 'Medallion Lakehouse' },
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
    pattern: 'Incremental CDC & Distributed Crawl',
    contract: 'raw_events / cdc_batches',
    snippet: `SELECT txn_id, account_id, amount, txn_timestamp\nFROM alphapay.transactions\nWHERE created_at > :last_watermark;`,
  },
  {
    id: 'ingest',
    step: '02',
    label: 'INGEST',
    subtitle: 'Kafka · Airflow · ETL',
    engines: ['Apache Kafka', 'Apache Airflow', 'Python', 'Docker'],
    pattern: 'Orchestrated Batch & Event Stream',
    contract: 'validated_topic / dag_run',
    snippet: `dag_id: "ingest_operational_cdc"\nschedule: "*/15 * * * *"\nretries: 3\nidempotent_merge: true`,
  },
  {
    id: 'lakehouse',
    step: '03',
    label: 'MEDALLION',
    subtitle: 'Databricks · Spark · Delta',
    engines: ['Databricks', 'Apache Spark', 'PySpark', 'Delta Lake'],
    pattern: 'Bronze -> Silver -> Gold Refinement',
    contract: 'gold.fct_transactions_daily',
    snippet: `MERGE INTO silver.transactions t\nUSING staging_cdc s ON t.txn_id = s.txn_id\nWHEN MATCHED THEN UPDATE SET *\nWHEN NOT MATCHED THEN INSERT *;`,
  },
  {
    id: 'serve',
    step: '04',
    label: 'SERVE',
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
    title: 'AlphaPay Financial Lakehouse',
    category: 'Lakehouse & ETL',
    year: '2025',
    context: 'Databricks Medallion (Temp Showcase)',
    summary:
      'Metadata-driven Databricks lakehouse unifying PostgreSQL OLTP banking schemas and payment gateway logs into Delta marts.',
    ingestionMode: 'Historical Seed + CDC',
    computeEngine: 'Databricks / PySpark',
    orchestration: 'Config-Driven Jobs',
    storageSink: 'Delta Lake (Unity Catalog)',
    grain: '1 row / transaction',
    sla: '< 15 min micro-batch',
    impact: [
      'Unified 6 core banking and gateway entities (CMI, PayZone, Fatourati, CashPlus) into governed Delta tables.',
      'Built watermark-driven CDC merges guaranteeing deterministic upserts across regional feeds.',
      'Delivered Gold risk marts for self-service BI and natural-language SQL querying.',
    ],
    stack: ['Databricks', 'PySpark', 'Delta Lake', 'PostgreSQL', 'SQL'],
    architecture: [
      {
        layer: '01 // SOURCE',
        component: 'PostgreSQL + Blob CSV',
        format: 'RDBMS + CSV',
        tablesOrTopics: ['alphapay.transactions', 'credit_bureau_batch', 'gateway_logs'],
        detail: 'OLTP accounts, KYC records, credit bureau pulls, and gateway settlements.',
      },
      {
        layer: '02 // BRONZE',
        component: 'Raw Append Landing',
        format: 'Delta (Append)',
        tablesOrTopics: ['bronze.pg_transactions', 'bronze.gateway_logs'],
        detail: 'Immutable raw payloads tagged with _batch_id and _ingested_at.',
      },
      {
        layer: '03 // SILVER',
        component: 'Conformed Entities',
        format: 'Delta (MERGE)',
        tablesOrTopics: ['silver.dim_accounts', 'silver.fct_transactions'],
        detail: 'CIN normalization, MAD validation, and idempotent CDC merges.',
      },
      {
        layer: '04 // GOLD',
        component: 'Risk & Gateway Marts',
        format: 'Delta Marts',
        tablesOrTopics: ['gold.mart_customer_risk', 'gold.mart_gateway_sla'],
        detail: 'Pre-joined regional KPIs powering dashboards and Genie SQL.',
      },
    ],
    schemas: [
      {
        tableName: 'silver.dim_accounts',
        layer: 'Silver',
        primaryKey: 'account_id',
        partitionOrCluster: 'CLUSTER BY (agency_code)',
        updateMode: 'Delta MERGE (SCD1)',
        columns: [
          { name: 'account_id', type: 'BIGINT', keyFlag: 'PK' },
          { name: 'customer_id', type: 'INT', keyFlag: 'FK' },
          { name: 'agency_code', type: 'STRING', keyFlag: 'CLUSTER' },
          { name: 'currency', type: 'STRING' },
          { name: 'status', type: 'STRING' },
        ],
      },
      {
        tableName: 'silver.fct_transactions',
        layer: 'Silver',
        primaryKey: 'txn_id',
        partitionOrCluster: 'CLUSTER BY (txn_date, channel)',
        updateMode: 'Idempotent MERGE',
        columns: [
          { name: 'txn_id', type: 'BIGINT', keyFlag: 'PK' },
          { name: 'account_id', type: 'BIGINT', keyFlag: 'FK' },
          { name: 'amount_mad', type: 'DECIMAL(18,2)' },
          { name: 'channel', type: 'STRING', keyFlag: 'CLUSTER' },
          { name: 'gateway_latency_ms', type: 'INT' },
          { name: 'txn_timestamp', type: 'TIMESTAMP' },
        ],
      },
      {
        tableName: 'gold.mart_customer_risk',
        layer: 'Gold',
        primaryKey: 'customer_id',
        partitionOrCluster: 'CLUSTER BY (region)',
        updateMode: 'Batch Rebuild',
        columns: [
          { name: 'customer_id', type: 'INT', keyFlag: 'PK' },
          { name: 'region', type: 'STRING', keyFlag: 'CLUSTER' },
          { name: 'credit_score', type: 'INT' },
          { name: 'overdue_amount_mad', type: 'DECIMAL(18,2)' },
          { name: 'txn_volume_30d', type: 'DECIMAL(18,2)' },
        ],
      },
    ],
    relations: [
      {
        fromTable: 'silver.fct_transactions',
        fromColumn: 'account_id',
        toTable: 'silver.dim_accounts',
        toColumn: 'account_id',
        cardinality: 'N : 1',
      },
      {
        fromTable: 'silver.dim_accounts',
        fromColumn: 'customer_id',
        toTable: 'gold.mart_customer_risk',
        toColumn: 'customer_id',
        cardinality: 'N : 1',
      },
    ],
    qualityGates: [
      {
        boundary: 'Bronze -> Silver',
        contract: 'txn_id IS NOT NULL AND UNIQUE',
        enforcement: 'Route invalid rows to _dead_letter',
      },
      {
        boundary: 'Silver',
        contract: 'account_id IN dim_accounts',
        enforcement: 'Flag orphan keys + batch alert',
      },
      {
        boundary: 'Silver -> Gold',
        contract: 'amount_mad > 0 AND valid gateway',
        enforcement: 'Abort if violation rate > 0.5%',
      },
    ],
    codeSnippet: {
      filename: 'silver_merge_transactions.sql',
      language: 'SQL',
      content: `MERGE INTO silver.fct_transactions AS t
USING (
  SELECT
    tr.txn_id, tr.account_id,
    CAST(tr.amount AS DECIMAL(18,2)) AS amount_mad,
    tr.channel, g.processing_time_ms AS gateway_latency_ms, tr.txn_timestamp
  FROM bronze.pg_transactions tr
  LEFT JOIN bronze.gateway_logs g ON tr.txn_id = g.txn_id
  WHERE tr._batch_id = :batch_id
  QUALIFY ROW_NUMBER() OVER (PARTITION BY tr.txn_id ORDER BY tr._ingested_at DESC) = 1
) AS s
ON t.txn_id = s.txn_id
WHEN MATCHED THEN UPDATE SET *
WHEN NOT MATCHED THEN INSERT *;`,
    },
    decisions: [
      {
        choice: 'Config-driven ingestion over per-table notebooks',
        rationale: 'Onboards new bank feeds via metadata rows with zero pipeline duplication.',
      },
      {
        choice: 'Delta Liquid Clustering over static date partitions',
        rationale: 'Prevents small-file skew across uneven Moroccan city transaction volumes.',
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
      'Distributed ETL pipeline capturing DOM, network headers, and OCR features across 100K+ Tranco websites.',
    ingestionMode: 'Sharded Parallel Crawl',
    computeEngine: 'Python / Apache Spark',
    orchestration: 'Worker Queues + Spark',
    storageSink: 'Partitioned Parquet',
    grain: '1 row / ad signal',
    sla: 'Full Tranco sweep + live API',
    impact: [
      'Crawled 100K+ domains capturing DOM trees, network signals, and ad disclosure metadata.',
      'Structured telemetry across 12 categories and 35 subcategories with automated OCR extraction.',
      'Connected Spark feature enrichment to real-time client inference workflows.',
    ],
    stack: ['Python', 'Apache Spark', 'ETL', 'OCR', 'Crawlers'],
    repoUrl: 'https://github.com/NIDNASSER-Abdelmajid/crawler-addisclosure',
    architecture: [
      {
        layer: '01 // CRAWL',
        component: 'Tranco Worker Pool',
        format: 'JSONL + HAR',
        tablesOrTopics: ['raw_dom_snapshots', 'network_logs'],
        detail: 'Headless capture of DOM elements and request metadata.',
      },
      {
        layer: '02 // CLEAN',
        component: 'Hash Deduplication',
        format: 'Parquet',
        tablesOrTopics: ['clean_ad_candidates'],
        detail: 'URL normalization and SHA-256 creative deduplication.',
      },
      {
        layer: '03 // ENRICH',
        component: 'Spark + OCR Pipeline',
        format: 'Feature Parquet',
        tablesOrTopics: ['silver.web_ad_signals'],
        detail: 'Banner text extraction and 12-category taxonomy mapping.',
      },
      {
        layer: '04 // SERVE',
        component: 'Inference Endpoint',
        format: 'JSON API',
        tablesOrTopics: ['inference_cache'],
        detail: 'Low-latency verdicts for browser extension prototype.',
      },
    ],
    schemas: [
      {
        tableName: 'raw.dom_captures',
        layer: 'Bronze',
        primaryKey: 'capture_id',
        partitionOrCluster: 'PARTITION BY (crawl_date)',
        updateMode: 'Append',
        columns: [
          { name: 'capture_id', type: 'STRING', keyFlag: 'PK' },
          { name: 'domain', type: 'STRING' },
          { name: 'asset_url', type: 'STRING' },
          { name: 'status_code', type: 'INT' },
        ],
      },
      {
        tableName: 'silver.web_ad_signals',
        layer: 'Silver',
        primaryKey: 'signal_hash',
        partitionOrCluster: 'PARTITION BY (crawl_date, taxonomy_l1)',
        updateMode: 'Hash-Deduplicated Append',
        columns: [
          { name: 'signal_hash', type: 'STRING', keyFlag: 'PK' },
          { name: 'capture_id', type: 'STRING', keyFlag: 'FK' },
          { name: 'tranco_rank', type: 'INT' },
          { name: 'taxonomy_l1', type: 'STRING', keyFlag: 'CLUSTER' },
          { name: 'ocr_tokens', type: 'ARRAY<STRING>' },
          { name: 'is_targeted_ad', type: 'BOOLEAN' },
        ],
      },
    ],
    relations: [
      {
        fromTable: 'silver.web_ad_signals',
        fromColumn: 'capture_id',
        toTable: 'raw.dom_captures',
        toColumn: 'capture_id',
        cardinality: 'N : 1',
      },
    ],
    qualityGates: [
      {
        boundary: 'Bronze -> Silver',
        contract: 'SHA-256 signal_hash UNIQUE',
        enforcement: 'Collapse duplicate CDN banners',
      },
      {
        boundary: 'Silver',
        contract: 'status_code BETWEEN 200 AND 399',
        enforcement: 'Drop failed HTTP captures',
      },
    ],
    codeSnippet: {
      filename: 'enrich_signals_spark.py',
      language: 'PySpark',
      content: `df_clean = (
    spark.read.parquet(raw_path)
    .filter(F.col("status_code").between(200, 399))
    .withColumn("signal_hash", F.sha2(F.concat_ws("|", "domain", "dom_selector", "asset_url"), 256))
    .dropDuplicates(["signal_hash"])
    .withColumn("ocr_tokens", ocr_extract_udf(F.col("image_bytes")))
)
df_clean.write.mode("append").partitionBy("crawl_date").parquet(silver_path)`,
    },
    decisions: [
      {
        choice: 'Staged Parquet checkpoints before OCR enrichment',
        rationale: 'Prevents crawler network timeouts from stalling CPU-heavy Spark jobs.',
      },
      {
        choice: 'SHA-256 asset hashing pre-OCR',
        rationale: 'Avoids running OCR repeatedly on identical third-party CDN creatives.',
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
      'Automated Python and Spark ETL unifying Salesforce, Odoo, and SAP into Star and Snowflake schema marts.',
    ingestionMode: 'Daily Incremental ERP',
    computeEngine: 'Python / Apache Spark',
    orchestration: 'Scheduled Batch Pipelines',
    storageSink: 'SQL Data Warehouse',
    grain: '1 row / invoice line',
    sla: 'Daily close (06:00 UTC)',
    impact: [
      'Automated cross-ERP ingestion eliminating manual financial spreadsheet reconciliation.',
      'Modeled Star and Snowflake marts with conformed client crosswalks and SQL tuning.',
      'Powered governed Power BI and Tableau dashboards for CLV, churn, and margin.',
    ],
    stack: ['Python', 'Apache Spark', 'SQL', 'Star Schema', 'Power BI'],
    repoUrl: 'https://github.com/NIDNASSER-Abdelmajid/SALES-ANALYTICS-DASHBOARD',
    architecture: [
      {
        layer: '01 // EXTRACT',
        component: 'ERP Connectors',
        format: 'API + SQL',
        tablesOrTopics: ['stg_salesforce', 'stg_odoo', 'stg_sap'],
        detail: 'Incremental pulls from CRM, billing, and accounting ledgers.',
      },
      {
        layer: '02 // CONFORM',
        component: 'Entity Crosswalk',
        format: 'Staging SQL',
        tablesOrTopics: ['int_client_crosswalk'],
        detail: 'Resolves disparate customer keys and FX rates.',
      },
      {
        layer: '03 // MODEL',
        component: 'Star Schema Marts',
        format: 'Indexed RDBMS',
        tablesOrTopics: ['dw.fct_revenue', 'dw.dim_client'],
        detail: 'Indexed fact tables and conformed financial dimensions.',
      },
      {
        layer: '04 // BI',
        component: 'Semantic Layer',
        format: 'Power BI / Tableau',
        tablesOrTopics: ['kpi_clv', 'kpi_retention'],
        detail: 'Single source of truth for finance and operations.',
      },
    ],
    schemas: [
      {
        tableName: 'dw.dim_client',
        layer: 'Serving',
        primaryKey: 'client_sk',
        partitionOrCluster: 'INDEXED (client_sk)',
        updateMode: 'SCD Type 1',
        columns: [
          { name: 'client_sk', type: 'INT', keyFlag: 'PK' },
          { name: 'salesforce_id', type: 'VARCHAR(32)' },
          { name: 'sap_account_id', type: 'VARCHAR(32)' },
          { name: 'segment', type: 'VARCHAR(32)' },
        ],
      },
      {
        tableName: 'dw.fct_revenue',
        layer: 'Serving',
        primaryKey: 'invoice_line_sk',
        partitionOrCluster: 'INDEXED (date_key, client_sk)',
        updateMode: 'Period Upsert',
        columns: [
          { name: 'invoice_line_sk', type: 'BIGINT', keyFlag: 'PK' },
          { name: 'client_sk', type: 'INT', keyFlag: 'FK' },
          { name: 'date_key', type: 'INT', keyFlag: 'CLUSTER' },
          { name: 'source_erp', type: 'VARCHAR(16)' },
          { name: 'recognized_amount', type: 'DECIMAL(18,2)' },
        ],
      },
    ],
    relations: [
      {
        fromTable: 'dw.fct_revenue',
        fromColumn: 'client_sk',
        toTable: 'dw.dim_client',
        toColumn: 'client_sk',
        cardinality: 'N : 1',
      },
    ],
    qualityGates: [
      {
        boundary: 'Staging -> DW',
        contract: 'ABS(dw_total - sap_gl_total) <= 0.01',
        enforcement: 'Block BI refresh on variance',
      },
      {
        boundary: 'DW',
        contract: 'client_sk IS NOT NULL',
        enforcement: 'Route unmapped IDs to audit queue',
      },
    ],
    codeSnippet: {
      filename: 'mart_clv_churn.sql',
      language: 'SQL',
      content: `WITH monthly_rev AS (
  SELECT c.client_sk, d.year_month, SUM(f.recognized_amount) AS mrr
  FROM dw.fct_revenue f
  JOIN dw.dim_client c ON f.client_sk = c.client_sk
  JOIN dw.dim_calendar d ON f.date_key = d.date_key
  GROUP BY c.client_sk, d.year_month
)
SELECT
  client_sk, year_month, mrr,
  LAG(mrr) OVER (PARTITION BY client_sk ORDER BY year_month) AS prev_mrr,
  SUM(mrr) OVER (PARTITION BY client_sk) AS cumulative_clv
FROM monthly_rev;`,
    },
    decisions: [
      {
        choice: 'Conformed crosswalk keys over mutating ERP IDs',
        rationale: 'Maintains complete audit traceability back to source SAP and Odoo invoices.',
      },
      {
        choice: 'Monthly pre-aggregated BI views + atomic fact table',
        rationale: 'Delivers fast executive dashboards without losing invoice-line drill-through.',
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
      'Partitioned Apache Kafka event pipeline with idempotent consumers, dead-letter queues, and live projections.',
    ingestionMode: 'Continuous Event Stream',
    computeEngine: 'Apache Kafka / Python / Java',
    orchestration: 'Docker Compose Mesh',
    storageSink: 'Kafka Log + Read Store',
    grain: '1 immutable event / offset',
    sla: 'Sub-second delivery',
    impact: [
      'Engineered partitioned Kafka topics and consumer groups sustaining high event throughput.',
      'Decoupled event producers from live socket projections via Dockerized worker pools.',
    ],
    stack: ['Apache Kafka', 'Python', 'Java', 'Docker'],
    repoUrl: 'https://github.com/NIDNASSER-Abdelmajid/Real-Time-Socket-Streaming',
    architecture: [
      {
        layer: '01 // PRODUCER',
        component: 'Keyed Publishers',
        format: 'JSON Events',
        tablesOrTopics: ['events.raw.stream'],
        detail: 'Publishes keyed records with acks=all durability.',
      },
      {
        layer: '02 // BROKER',
        component: 'Kafka Partitions',
        format: 'Commit Log',
        tablesOrTopics: ['events.validated.v1', 'events.dlq.v1'],
        detail: 'Per-entity ordering and isolated dead-letter routing.',
      },
      {
        layer: '03 // WORKER',
        component: 'Consumer Group',
        format: 'Manual Offsets',
        tablesOrTopics: ['worker-agg-group'],
        detail: 'Validates schemas and commits offsets post-write.',
      },
      {
        layer: '04 // SINK',
        component: 'Live Read View',
        format: 'Materialized State',
        tablesOrTopics: ['live_state_view'],
        detail: 'Streams real-time state updates to clients.',
      },
    ],
    schemas: [
      {
        tableName: 'topic://events.validated.v1',
        layer: 'Stream',
        primaryKey: 'event_id',
        partitionOrCluster: 'KEY = entity_id (12 partitions)',
        updateMode: 'Append-Only Log',
        columns: [
          { name: 'event_id', type: 'UUID', keyFlag: 'PK' },
          { name: 'entity_id', type: 'STRING', keyFlag: 'CLUSTER' },
          { name: 'event_type', type: 'STRING' },
          { name: 'emitted_at', type: 'EPOCH_MS' },
        ],
      },
      {
        tableName: 'store.live_state_view',
        layer: 'Serving',
        primaryKey: 'entity_id',
        partitionOrCluster: 'KEY = entity_id',
        updateMode: 'Idempotent Upsert',
        columns: [
          { name: 'entity_id', type: 'STRING', keyFlag: 'PK' },
          { name: 'last_event_id', type: 'UUID', keyFlag: 'FK' },
          { name: 'event_count', type: 'BIGINT' },
        ],
      },
    ],
    relations: [
      {
        fromTable: 'store.live_state_view',
        fromColumn: 'last_event_id',
        toTable: 'topic://events.validated.v1',
        toColumn: 'event_id',
        cardinality: '1 : 1',
      },
    ],
    qualityGates: [
      {
        boundary: 'Consumer Entry',
        contract: 'Valid JSON schema',
        enforcement: 'Route malformed payloads to events.dlq.v1',
      },
      {
        boundary: 'Sink Write',
        contract: 'Unique event_id',
        enforcement: 'Skip replayed offsets safely',
      },
    ],
    codeSnippet: {
      filename: 'kafka_consumer_worker.py',
      language: 'Python',
      content: `for msg in consumer:
    payload = validate_schema(msg.value)
    if payload is None:
        dlq_producer.send("events.dlq.v1", value=msg.value)
        consumer.commit()
        continue

    apply_idempotent_upsert(state_store, payload)
    consumer.commit()`,
    },
    decisions: [
      {
        choice: 'Partitioning by entity_id over round-robin',
        rationale: 'Preserves strict causal ordering per entity across parallel consumers.',
      },
      {
        choice: 'Manual post-write offset commits',
        rationale: 'Prevents silent message loss if a worker crashes mid-processing.',
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
      'ETL and NLP enrichment pipelines standardizing structured and free-text institutional records in PostgreSQL.',
    ingestionMode: 'Hybrid Batch + Scoring API',
    computeEngine: 'Python / Scikit-learn',
    orchestration: 'Scheduled ETL + FastAPI',
    storageSink: 'PostgreSQL Core',
    grain: '1 row / case dossier',
    sla: 'Daily sync + sync triage API',
    impact: [
      'Unified heterogeneous institutional feeds into clean PostgreSQL schemas.',
      'Operationalized NLP classification pipelines behind REST scoring endpoints.',
    ],
    stack: ['Python', 'PostgreSQL', 'ETL', 'NLP', 'FastAPI'],
    architecture: [
      {
        layer: '01 // INGEST',
        component: 'Institutional Adapters',
        format: 'CSV + JSON',
        tablesOrTopics: ['raw_case_reports'],
        detail: 'Normalizes encodings, dates, and institutional codes.',
      },
      {
        layer: '02 // ENRICH',
        component: 'NLP Triage Pipeline',
        format: 'Feature Matrix',
        tablesOrTopics: ['nlp_case_tags'],
        detail: 'Extracts severity tags from unstructured narratives.',
      },
      {
        layer: '03 // CORE',
        component: 'PostgreSQL Warehouse',
        format: 'Normalized Tables',
        tablesOrTopics: ['core.cases', 'core.risk_assessments'],
        detail: 'Stores versioned predictions with full audit timestamps.',
      },
      {
        layer: '04 // API',
        component: 'FastAPI Scoring',
        format: 'REST JSON',
        tablesOrTopics: ['/api/v1/cases/score'],
        detail: 'Real-time case prioritization for officers.',
      },
    ],
    schemas: [
      {
        tableName: 'core.cases',
        layer: 'Source',
        primaryKey: 'case_id',
        partitionOrCluster: 'INDEXED (created_at)',
        updateMode: 'Upsert',
        columns: [
          { name: 'case_id', type: 'BIGINT', keyFlag: 'PK' },
          { name: 'region_code', type: 'VARCHAR(16)' },
          { name: 'created_at', type: 'TIMESTAMPTZ', keyFlag: 'CLUSTER' },
        ],
      },
      {
        tableName: 'core.risk_assessments',
        layer: 'Serving',
        primaryKey: 'assessment_id',
        partitionOrCluster: 'INDEXED (case_id)',
        updateMode: 'Append-Only History',
        columns: [
          { name: 'assessment_id', type: 'UUID', keyFlag: 'PK' },
          { name: 'case_id', type: 'BIGINT', keyFlag: 'FK' },
          { name: 'priority_tier', type: 'SMALLINT' },
          { name: 'model_version', type: 'VARCHAR(32)' },
        ],
      },
    ],
    relations: [
      {
        fromTable: 'core.risk_assessments',
        fromColumn: 'case_id',
        toTable: 'core.cases',
        toColumn: 'case_id',
        cardinality: 'N : 1',
      },
    ],
    qualityGates: [
      {
        boundary: 'Ingest -> Training',
        contract: 'Zero direct PII in ML export',
        enforcement: 'Hash identifiers pre-export',
      },
      {
        boundary: 'Serving',
        contract: 'model_version IS NOT NULL',
        enforcement: 'PostgreSQL NOT NULL constraint',
      },
    ],
    codeSnippet: {
      filename: 'case_pipeline.py',
      language: 'Python',
      content: `def transform_case_record(raw: dict) -> CleanCase:
    text = normalize_whitespace(raw.get("narrative", ""))
    tokens = nlp_pipeline.extract_features(text)
    priority = risk_model.predict_tier(structured=raw["metadata"], text_features=tokens)
    return CleanCase(
        case_id=raw["case_id"],
        priority_tier=priority,
        model_version=risk_model.version,
    )`,
    },
    decisions: [
      {
        choice: 'Append-only risk_assessments over in-place updates',
        rationale: 'Preserves full historical auditability of every model scoring run.',
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
      'Resilient Scrapy and Selenium extraction pipelines loading dynamic catalogs and market feeds into SQL and Parquet.',
    ingestionMode: 'Scheduled Incremental Crawl',
    computeEngine: 'Python / Scrapy / Pandas',
    orchestration: 'Containerized Cron',
    storageSink: 'PostgreSQL + Parquet',
    grain: '1 row / SKU or OHLCV bar',
    sla: 'Hourly / daily snapshots',
    impact: [
      'Solved dynamic JS rendering, pagination state, and anti-bot rate limits cleanly.',
      'Built automated schema validation and batched upserts cutting DB round-trips by 95%.',
    ],
    stack: ['Python', 'Scrapy', 'Selenium', 'PostgreSQL', 'Pandas'],
    repoUrl: 'https://github.com/NIDNASSER-Abdelmajid/ScrapyGram',
    architecture: [
      {
        layer: '01 // DISCOVERY',
        component: 'Scrapy Spiders',
        format: 'HTTP / DOM',
        tablesOrTopics: ['frontier_urls'],
        detail: 'Exponential backoff and pagination cursors.',
      },
      {
        layer: '02 // PARSE',
        component: 'Pydantic Validators',
        format: 'Typed Items',
        tablesOrTopics: ['parsed_records'],
        detail: 'Strict type casting at extraction time.',
      },
      {
        layer: '03 // GUARD',
        component: 'Drift Thresholds',
        format: 'Staging Frame',
        tablesOrTopics: ['validated_batch'],
        detail: 'Checks row counts against 7-day baseline.',
      },
      {
        layer: '04 // LOAD',
        component: 'Batched Upserts',
        format: 'SQL + Parquet',
        tablesOrTopics: ['market.catalog_snapshots'],
        detail: '500-row batch merges into historical tables.',
      },
    ],
    schemas: [
      {
        tableName: 'market.catalog_snapshots',
        layer: 'Serving',
        primaryKey: '(item_sku, snapshot_date)',
        partitionOrCluster: 'PARTITION BY snapshot_date',
        updateMode: 'Snapshot Upsert',
        columns: [
          { name: 'item_sku', type: 'VARCHAR(64)', keyFlag: 'PK' },
          { name: 'snapshot_date', type: 'DATE', keyFlag: 'CLUSTER' },
          { name: 'price_numeric', type: 'DECIMAL(12,2)' },
          { name: 'availability', type: 'BOOLEAN' },
        ],
      },
    ],
    relations: [],
    qualityGates: [
      {
        boundary: 'Parse -> Load',
        contract: 'row_count >= 0.80 * 7d_avg',
        enforcement: 'Halt overwrite and retain last valid snapshot',
      },
    ],
    codeSnippet: {
      filename: 'item_validation_pipeline.py',
      language: 'Python',
      content: `class PostgresUpsertPipeline:
    def process_item(self, item, spider):
        record = CatalogItemModel.model_validate(dict(item))
        self.buffer.append(record.model_dump())
        if len(self.buffer) >= 500:
            self.flush_upsert()
        return item`,
    },
    decisions: [
      {
        choice: '500-row batched upserts over per-item writes',
        rationale: 'Cuts database network overhead by 95%+ during full catalog sweeps.',
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

export const CREDENTIALS: CredentialItem[] = [
  { id: 'huawei-ai', title: 'HCIA-AI V3.5 Certified', issuer: 'Huawei', year: '2025', category: 'Certification' },
  { id: 'voices-deep-tech', title: 'Voices of Deep Tech MEA', issuer: 'Regional Honor', year: '2025', category: 'Recognition' },
  { id: 'oracle-genai', title: 'OCI 2024 Generative AI Certified', issuer: 'Oracle', year: '2024', category: 'Certification' },
  { id: 'hult-prize', title: '1st Place: Hult Prize Local', issuer: 'ENSAM Rabat', year: '2024', category: 'Recognition' },
  { id: 'mckinsey-forward', title: 'McKinsey Forward Program', issuer: 'McKinsey', year: '2023', category: 'Certification' },
  { id: 'google-pm', title: 'Project Management', issuer: 'Google', year: '2023', category: 'Certification' },
  { id: 'efset-c2', title: 'English Proficiency (C2)', issuer: 'EF SET', year: '2022', category: 'Certification' },
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
