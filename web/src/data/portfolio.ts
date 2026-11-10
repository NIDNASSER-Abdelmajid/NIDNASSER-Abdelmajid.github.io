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
    title: 'AlphaPay: Moroccan Financial Analytics Lakehouse',
    category: 'Lakehouse & ETL',
    year: '2025',
    context: 'Databricks Medallion Architecture (Temp Showcase)',
    summary:
      'Metadata-driven lakehouse consolidating PostgreSQL OLTP banking schemas and cloud gateway batch logs into Bronze, Silver, and Gold Delta tables for risk and payment analytics.',
    ingestionMode: 'Historical Seed + Incremental CDC',
    computeEngine: 'Databricks / PySpark / Delta Lake',
    orchestration: 'Metadata-Driven Parameterized Jobs',
    storageSink: 'Unity Catalog Delta Tables',
    grain: '1 row per transaction / account / bureau pull',
    sla: 'Batch micro-increment (< 15 min)',
    impact: [
      'Unified 6 normalized relational and flat-file entities across agencies, customers, accounts, transactions, credit bureau pulls, and gateway settlements (CMI, PayZone, Fatourati, CashPlus).',
      'Implemented historical baseline seeding plus incremental CDC merge pipelines across Moroccan regional hubs.',
      'Delivered curated Gold marts powering executive BI views and natural-language SQL exploration.',
    ],
    stack: ['Databricks', 'PySpark', 'Delta Lake', 'PostgreSQL', 'SQL', 'Medallion'],
    architecture: [
      {
        layer: '01 // SOURCE',
        component: 'PostgreSQL OLTP + Cloud Object Storage',
        format: 'RDBMS + CSV Batches',
        tablesOrTopics: ['alphapay.transactions', 'credit_bureau_batch_*.csv', 'payment_gateway_batch_*.csv'],
        detail: 'Extracts transactional accounts, KYC customer records, credit bureau pulls, and gateway settlement logs.',
      },
      {
        layer: '02 // BRONZE',
        component: 'Metadata-Driven Raw Landing',
        format: 'Delta (Append-Only)',
        tablesOrTopics: ['bronze.pg_customers', 'bronze.pg_transactions', 'bronze.gateway_logs'],
        detail: 'Preserves raw source payloads with _ingested_at, _batch_id, and _source_file audit columns.',
      },
      {
        layer: '03 // SILVER',
        component: 'Deduplicated Conformed Entities',
        format: 'Delta (MERGE / SCD)',
        tablesOrTopics: ['silver.dim_customers', 'silver.fct_transactions', 'silver.credit_bureau'],
        detail: 'Applies CIN normalization, MAD currency checks, null filtering, and watermark-driven idempotent upserts.',
      },
      {
        layer: '04 // GOLD',
        component: 'Risk & Gateway Performance Marts',
        format: 'Delta Aggregated Marts',
        tablesOrTopics: ['gold.mart_regional_gmv', 'gold.mart_gateway_sla', 'gold.customer_risk_profile'],
        detail: 'Pre-joined analytical views serving BI dashboards and Genie AI natural-language queries.',
      },
    ],
    schemas: [
      {
        tableName: 'silver.fct_transactions',
        layer: 'Silver',
        primaryKey: 'txn_id',
        partitionOrCluster: 'CLUSTER BY (txn_date, channel)',
        updateMode: 'Delta MERGE (Idempotent Upsert)',
        columns: [
          { name: 'txn_id', type: 'BIGINT', note: 'Primary transaction identifier' },
          { name: 'account_id', type: 'BIGINT', note: 'Foreign key to silver.dim_accounts' },
          { name: 'amount_mad', type: 'DECIMAL(18,2)', note: 'Standardized in Moroccan Dirham' },
          { name: 'channel', type: 'STRING', note: 'CMI | Virement | ATM | POS' },
          { name: 'gateway_latency_ms', type: 'INT', note: 'Joined from payment_gateway_logs' },
          { name: 'txn_timestamp', type: 'TIMESTAMP', note: 'UTC normalized event timestamp' },
        ],
      },
      {
        tableName: 'gold.mart_customer_risk',
        layer: 'Gold',
        primaryKey: 'customer_id',
        partitionOrCluster: 'CLUSTER BY (region, risk_grade)',
        updateMode: 'Incremental Rebuild per Batch',
        columns: [
          { name: 'customer_id', type: 'INT', note: 'Surrogate / natural customer key' },
          { name: 'region', type: 'STRING', note: 'Casablanca, Rabat, Tangier, Marrakech, Fes' },
          { name: 'credit_score', type: 'INT', note: 'Latest credit bureau score' },
          { name: 'overdue_amount_mad', type: 'DECIMAL(18,2)', note: 'External overdue balance' },
          { name: 'txn_volume_30d', type: 'DECIMAL(18,2)', note: 'Rolling 30-day transaction sum' },
        ],
      },
    ],
    qualityGates: [
      {
        rule: 'Primary key uniqueness & non-null txn_id before Silver merge',
        layer: 'Bronze -> Silver',
        enforcement: 'Quarantine invalid rows to _dead_letter table',
      },
      {
        rule: 'Referential check: transactions.account_id exists in dim_accounts',
        layer: 'Silver',
        enforcement: 'Flag orphan records and emit batch metric alert',
      },
      {
        rule: 'Positive amount_mad and valid ISO/Moroccan gateway code enum',
        layer: 'Silver -> Gold',
        enforcement: 'Fail pipeline gate if violation rate > 0.5%',
      },
    ],
    codeSnippet: {
      filename: 'silver_merge_transactions.sql',
      language: 'SQL',
      content: `MERGE INTO silver.fct_transactions AS target
USING (
  SELECT
    t.txn_id,
    t.account_id,
    CAST(t.amount AS DECIMAL(18,2)) AS amount_mad,
    t.channel,
    g.processing_time_ms AS gateway_latency_ms,
    t.txn_timestamp
  FROM bronze.pg_transactions t
  LEFT JOIN bronze.payment_gateway_logs g
    ON t.txn_id = g.txn_id
  WHERE t._batch_id = :batch_id
  QUALIFY ROW_NUMBER() OVER (PARTITION BY t.txn_id ORDER BY t._ingested_at DESC) = 1
) AS src
ON target.txn_id = src.txn_id
WHEN MATCHED THEN UPDATE SET *
WHEN NOT MATCHED THEN INSERT *;`,
    },
    tradeoffs: [
      'Used metadata-driven configuration tables rather than hardcoding 1 notebook per source table, reducing onboarding time for new CSV/SQL feeds.',
      'Chose Liquid Clustering over static directory partitioning to prevent small-file skew across uneven Moroccan city transaction volumes.',
    ],
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
    ingestionMode: 'Distributed Parallel Crawling',
    computeEngine: 'Python / Apache Spark / OCR',
    orchestration: 'Sharded Worker Queues + Batch ETL',
    storageSink: 'Partitioned Parquet + Feature Store',
    grain: '1 row per captured DOM/network ad signal',
    sla: 'Full Tranco shard sweep + real-time inference',
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
        component: 'Tranco-Seeded Distributed Crawlers',
        format: 'JSONL + HAR Streams',
        tablesOrTopics: ['raw_dom_snapshots', 'network_request_logs', 'why_this_ad_disclosures'],
        detail: 'Captures live network headers, filter-list hits, and ad disclosure overlays in headless browser workers.',
      },
      {
        layer: '02 // CLEANING',
        component: 'Semi-Automated Deduplication & Hygiene',
        format: 'Parquet (Snappy)',
        tablesOrTopics: ['clean_ad_candidates', 'normalized_urls'],
        detail: 'Strips tracking query params, resolves canonical hosts, and drops malformed asset captures.',
      },
      {
        layer: '03 // ENRICHMENT',
        component: 'Spark Feature Builder + OCR',
        format: 'Columnar Feature Parquet',
        tablesOrTopics: ['enriched_ad_features', 'ocr_extracted_text'],
        detail: 'Extracts visual text from ad creatives and assigns 12-category / 35-subcategory taxonomy labels.',
      },
      {
        layer: '04 // SERVING',
        component: 'Real-Time Inference Pipeline',
        format: 'REST API + Extension Payload',
        tablesOrTopics: ['inference_cache', 'telemetry_feedback'],
        detail: 'Serves low-latency classification verdicts to the Chrome extension prototype.',
      },
    ],
    schemas: [
      {
        tableName: 'silver.web_ad_signals',
        layer: 'Silver',
        primaryKey: 'signal_hash',
        partitionOrCluster: 'PARTITION BY (crawl_date, taxonomy_l1)',
        updateMode: 'Hash-Deduplicated Append',
        columns: [
          { name: 'signal_hash', type: 'STRING', note: 'SHA-256 of (domain, selector, asset_url)' },
          { name: 'tranco_rank', type: 'INT', note: 'Domain popularity rank at crawl time' },
          { name: 'request_domain', type: 'STRING', note: 'Normalized third-party host' },
          { name: 'disclosure_text', type: 'STRING', note: 'Extracted Why This Ad explanation' },
          { name: 'ocr_tokens', type: 'ARRAY<STRING>', note: 'Extracted tokens from banner image' },
          { name: 'is_targeted_ad', type: 'BOOLEAN', note: 'Ground-truth / classifier label' },
        ],
      },
    ],
    qualityGates: [
      {
        rule: 'Content-hash deduplication to prevent repeated CDN banner inflation',
        layer: 'Bronze -> Silver',
        enforcement: 'Drop duplicate hashes per crawl epoch',
      },
      {
        rule: 'OCR confidence threshold & non-empty DOM selector contract',
        layer: 'Silver',
        enforcement: 'Route low-confidence captures to fallback metadata features',
      },
    ],
    codeSnippet: {
      filename: 'enrich_signals_spark.py',
      language: 'Python (PySpark)',
      content: `df_clean = (
    spark.read.parquet(raw_path)
    .filter(F.col("status_code").between(200, 399))
    .withColumn("signal_hash", F.sha2(F.concat_ws("|", "domain", "dom_selector", "asset_url"), 256))
    .dropDuplicates(["signal_hash"])
    .withColumn("ocr_tokens", ocr_extract_udf(F.col("image_bytes")))
)
df_clean.write.mode("append").partitionBy("crawl_date").parquet(silver_path)`,
    },
    tradeoffs: [
      'Decoupled headless browser crawling from heavy OCR extraction via staged Parquet checkpoints so crawler timeouts never block downstream Spark jobs.',
      'Stored raw HAR/DOM metadata separately from binary creative snapshots to keep analytical scans fast.',
    ],
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
    ingestionMode: 'Scheduled Incremental ERP Extracts',
    computeEngine: 'Python / Apache Spark / SQL',
    orchestration: 'Automated Batch Workflows',
    storageSink: 'Relational Data Warehouse (Star/Snowflake)',
    grain: '1 row per invoice line / contract milestone',
    sla: 'Daily financial close refresh (06:00 UTC)',
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
        component: 'Multi-ERP Connectors',
        format: 'API + SQL Staging',
        tablesOrTopics: ['stg_salesforce_opps', 'stg_odoo_invoices', 'stg_sap_ledger'],
        detail: 'Extracts CRM pipelines, billing entries, and general ledger postings across disparate ERP schemas.',
      },
      {
        layer: '02 // CONFORM',
        component: 'Spark Validation & Entity Resolution',
        format: 'Staging Tables',
        tablesOrTopics: ['int_client_crosswalk', 'int_fx_rates'],
        detail: 'Matches client entities across CRM and ERP IDs and standardizes multi-currency amounts.',
      },
      {
        layer: '03 // WAREHOUSE',
        component: 'Dimensional Star & Snowflake Marts',
        format: 'Indexed SQL Tables',
        tablesOrTopics: ['fct_revenue', 'fct_expenses', 'dim_client', 'dim_calendar'],
        detail: 'Supports fast slice-and-dice aggregations for finance, compliance, and executive leadership.',
      },
      {
        layer: '04 // BI SEMANTIC',
        component: 'Power BI & Tableau Datasets',
        format: 'Governed Semantic Layer',
        tablesOrTopics: ['kpi_clv', 'kpi_net_retention', 'kpi_gross_margin'],
        detail: 'Standardized DAX/calculated measures eliminating conflicting definitions across departments.',
      },
    ],
    schemas: [
      {
        tableName: 'dw.fct_revenue',
        layer: 'Serving',
        primaryKey: 'invoice_line_sk',
        partitionOrCluster: 'INDEXED BY (date_key, client_sk)',
        updateMode: 'Incremental Upsert on Fiscal Period',
        columns: [
          { name: 'invoice_line_sk', type: 'BIGINT', note: 'Surrogate fact key' },
          { name: 'client_sk', type: 'INT', note: 'FK -> dw.dim_client (conformed across ERPs)' },
          { name: 'date_key', type: 'INT', note: 'FK -> dw.dim_calendar (YYYYMMDD)' },
          { name: 'source_erp', type: 'VARCHAR(16)', note: 'SALESFORCE | ODOO | SAP' },
          { name: 'recognized_amount', type: 'DECIMAL(18,2)', note: 'FX-normalized revenue' },
        ],
      },
    ],
    qualityGates: [
      {
        rule: 'Cross-ERP revenue reconciliation tolerance == 0.00 against SAP GL control totals',
        layer: 'Staging -> Warehouse',
        enforcement: 'Block semantic refresh and notify finance ops on mismatch',
      },
      {
        rule: 'Zero unmapped client_sk before publishing BI views',
        layer: 'Warehouse',
        enforcement: 'Auto-assign unknown sentinel key and log crosswalk exception',
      },
    ],
    codeSnippet: {
      filename: 'mart_clv_churn.sql',
      language: 'SQL',
      content: `WITH monthly_rev AS (
  SELECT
    c.client_sk,
    d.year_month,
    SUM(f.recognized_amount) AS mrr
  FROM dw.fct_revenue f
  JOIN dw.dim_client c ON f.client_sk = c.client_sk
  JOIN dw.dim_calendar d ON f.date_key = d.date_key
  GROUP BY c.client_sk, d.year_month
)
SELECT
  client_sk,
  year_month,
  mrr,
  LAG(mrr) OVER (PARTITION BY client_sk ORDER BY year_month) AS prev_mrr,
  SUM(mrr) OVER (PARTITION BY client_sk) AS cumulative_clv
FROM monthly_rev;`,
    },
    tradeoffs: [
      'Used conformed client crosswalk tables instead of rewriting upstream ERP IDs, preserving audit lineage back to source invoices.',
      'Pre-aggregated monthly KPI snapshots for BI tools while keeping invoice-line granularity available for drill-through audits.',
    ],
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
    ingestionMode: 'Continuous Event Streaming',
    computeEngine: 'Apache Kafka / Python / Java',
    orchestration: 'Docker Compose Service Mesh',
    storageSink: 'Kafka Log + Real-Time Read Store',
    grain: '1 immutable event payload per partition offset',
    sla: 'Sub-second end-to-end delivery',
    impact: [
      'Designed partitioned Kafka topics and idempotent consumer groups sustaining thousands of concurrent events per second.',
      'Decoupled ingestion producers from downstream aggregation and live read projections using Dockerized workers.',
    ],
    stack: ['Apache Kafka', 'Python', 'Java', 'Docker', 'Event Streaming'],
    repoUrl: 'https://github.com/NIDNASSER-Abdelmajid/Real-Time-Socket-Streaming',
    architecture: [
      {
        layer: '01 // PRODUCERS',
        component: 'Keyed Event Publishers',
        format: 'JSON / Schema-Validated Events',
        tablesOrTopics: ['events.raw.stream'],
        detail: 'Publishes events keyed by entity_id with acks=all durability guarantees.',
      },
      {
        layer: '02 // BROKER',
        component: 'Apache Kafka Topic Partitions',
        format: 'Commit Log (Replicated)',
        tablesOrTopics: ['events.validated.v1', 'events.dlq.v1'],
        detail: 'Buffers traffic spikes, enforces ordering per partition key, and routes malformed payloads to DLQ.',
      },
      {
        layer: '03 // CONSUMERS',
        component: 'Idempotent Worker Group',
        format: 'Consumer Group Offsets',
        tablesOrTopics: ['worker-agg-group'],
        detail: 'Computes sliding counts and commits offsets only after sink persistence succeeds.',
      },
      {
        layer: '04 // PROJECTION',
        component: 'Live Socket / Read Store',
        format: 'Materialized State',
        tablesOrTopics: ['live_state_view'],
        detail: 'Feeds connected clients without blocking producer ingestion.',
      },
    ],
    schemas: [
      {
        tableName: 'topic://events.validated.v1',
        layer: 'Stream',
        primaryKey: 'event_id',
        partitionOrCluster: 'PARTITION KEY = entity_id (12 partitions)',
        updateMode: 'Append-Only Immutable Log',
        columns: [
          { name: 'event_id', type: 'UUID', note: 'Idempotency deduplication key' },
          { name: 'entity_id', type: 'STRING', note: 'Partition routing key' },
          { name: 'event_type', type: 'STRING', note: 'Event classification tag' },
          { name: 'emitted_at', type: 'EPOCH_MS', note: 'Producer event timestamp' },
        ],
      },
    ],
    qualityGates: [
      {
        rule: 'Idempotent producer + consumer deduplication window by event_id',
        layer: 'Broker -> Consumer',
        enforcement: 'Ignore replayed offsets safely on worker restart',
      },
      {
        rule: 'Schema validation prior to deserialization',
        layer: 'Consumer Entry',
        enforcement: 'Route invalid payloads to events.dlq.v1 with error metadata',
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
    tradeoffs: [
      'Partitioned by entity_id rather than round-robin to guarantee causal ordering per entity while scaling consumer parallelism.',
      'Committed offsets manually post-write (at-least-once + idempotent upsert) to eliminate silent data loss during worker crashes.',
    ],
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
    ingestionMode: 'Hybrid Batch Ingestion + Sync Scoring API',
    computeEngine: 'Python / Scikit-learn / NLP',
    orchestration: 'Scheduled ETL Jobs + FastAPI',
    storageSink: 'PostgreSQL Relational Core',
    grain: '1 row per institutional case dossier',
    sla: 'Daily institutional sync + sub-second case triage',
    impact: [
      'Consolidated heterogeneous institutional feeds into clean, analytics-ready schemas for risk prioritization.',
      'Built automated NLP classification workflows and RESTful scoring APIs embedded in the platform backend.',
    ],
    stack: ['Python', 'PostgreSQL', 'ETL', 'NLP', 'FastAPI', 'Scikit-learn'],
    architecture: [
      {
        layer: '01 // INGEST',
        component: 'Multi-Format Institutional Adapters',
        format: 'CSV / JSON / Free Text',
        tablesOrTopics: ['raw_case_reports', 'institutional_feeds'],
        detail: 'Normalizes varied source encodings, dates, and institutional identifiers.',
      },
      {
        layer: '02 // ENRICH',
        component: 'Text Cleaning & NLP Classifier',
        format: 'Tokenized Feature Vectors',
        tablesOrTopics: ['nlp_case_tags', 'risk_signals'],
        detail: 'Extracts severity indicators and categorizes unstructured narrative case reports.',
      },
      {
        layer: '03 // CORE DB',
        component: 'PostgreSQL Operational Warehouse',
        format: 'Normalized Tables',
        tablesOrTopics: ['cases', 'risk_assessments', 'audit_trail'],
        detail: 'Stores versioned predictions alongside source timestamps for full explainability.',
      },
      {
        layer: '04 // SERVING',
        component: 'REST Triage Endpoints',
        format: 'JSON API',
        tablesOrTopics: ['/api/v1/cases/score'],
        detail: 'Surfaces prioritized risk scores directly inside officer workflows.',
      },
    ],
    schemas: [
      {
        tableName: 'core.risk_assessments',
        layer: 'Serving',
        primaryKey: 'assessment_id',
        partitionOrCluster: 'INDEXED BY (case_id, created_at DESC)',
        updateMode: 'Append-Only Versioned History',
        columns: [
          { name: 'assessment_id', type: 'UUID', note: 'Unique scoring run ID' },
          { name: 'case_id', type: 'BIGINT', note: 'FK -> core.cases' },
          { name: 'priority_tier', type: 'SMALLINT', note: '1 (Critical) to 4 (Standard)' },
          { name: 'model_version', type: 'VARCHAR(32)', note: 'Tracks reproducibility' },
          { name: 'assessed_at', type: 'TIMESTAMPTZ', note: 'Inference timestamp' },
        ],
      },
    ],
    qualityGates: [
      {
        rule: 'PII stripping / field-level access control before analytical model training',
        layer: 'Ingest -> Training',
        enforcement: 'Hash direct identifiers prior to feature matrix export',
      },
      {
        rule: 'Mandatory model_version logging on every risk prediction row',
        layer: 'Serving',
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
    tradeoffs: [
      'Persisted risk assessments as append-only versioned rows rather than overwriting in place so historical triage decisions remain auditable.',
    ],
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
    ingestionMode: 'Scheduled Incremental Extraction',
    computeEngine: 'Python / Scrapy / Selenium / Pandas',
    orchestration: 'Cron / Containerized Runners',
    storageSink: 'PostgreSQL / SQLite / Parquet',
    grain: '1 row per catalog SKU / OHLCV bar / observation',
    sla: 'Hourly to daily automated refreshes',
    impact: [
      'Handled JavaScript-rendered views, pagination state, rate limiting, and anti-bot resilience cleanly.',
      'Automated schema checks and deduplication before loading into SQLite, PostgreSQL, and CSV/Parquet targets.',
    ],
    stack: ['Python', 'Scrapy', 'Selenium', 'BeautifulSoup', 'PostgreSQL', 'Pandas'],
    repoUrl: 'https://github.com/NIDNASSER-Abdelmajid/ScrapyGram',
    architecture: [
      {
        layer: '01 // DISCOVERY',
        component: 'Queue-Managed Scrapy Spiders',
        format: 'HTTP / Headless DOM',
        tablesOrTopics: ['frontier_urls', 'retry_queue'],
        detail: 'Handles exponential backoff, rotating headers, and stateful pagination cursors.',
      },
      {
        layer: '02 // PARSING',
        component: 'Typed Item Extractors',
        format: 'Pydantic / Item Pipelines',
        tablesOrTopics: ['parsed_records'],
        detail: 'Casts prices, timestamps, and categories immediately at parse time.',
      },
      {
        layer: '03 // QUALITY',
        component: 'Delta & Anomaly Filtering',
        format: 'Staging Frame',
        tablesOrTopics: ['validated_batch'],
        detail: 'Verifies row-count stability against historical crawl baselines.',
      },
      {
        layer: '04 // SINK',
        component: 'PostgreSQL & Parquet Exports',
        format: 'Relational + Columnar',
        tablesOrTopics: ['catalog_snapshots', 'market_bars'],
        detail: 'Loads clean historical time-series for downstream analytics.',
      },
    ],
    schemas: [
      {
        tableName: 'market.catalog_snapshots',
        layer: 'Serving',
        primaryKey: '(item_sku, snapshot_date)',
        partitionOrCluster: 'PARTITION BY snapshot_date',
        updateMode: 'Daily Snapshot Upsert',
        columns: [
          { name: 'item_sku', type: 'VARCHAR(64)', note: 'Source product or ticker key' },
          { name: 'snapshot_date', type: 'DATE', note: 'Capture date' },
          { name: 'price_numeric', type: 'DECIMAL(12,2)', note: 'Parsed currency value' },
          { name: 'availability', type: 'BOOLEAN', note: 'Stock / active status flag' },
        ],
      },
    ],
    qualityGates: [
      {
        rule: 'Row-count drop guard: alert if extracted items < 80% of 7-day rolling mean',
        layer: 'Parse -> Load',
        enforcement: 'Halt overwrite and retain previous snapshot',
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
    tradeoffs: [
      'Used batched upserts (500-row chunks) instead of row-by-row inserts, cutting database round-trips by over 95% on large catalog crawls.',
    ],
  },
]

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'um6p',
    role: 'Research Engineer (Data Pipelines)',
    organization: 'College of Computing - Mohammed VI Polytechnic University',
    location: 'Rabat, Morocco',
    period: 'Jan 2025 - Sep 2025',
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
    period: 'Jan 2024 - Jul 2025',
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
    period: 'Jun 2023 - Jan 2024',
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
    period: 'Nov 2022 - Present',
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
    degree: 'Engineering Degree in Innovation & AMOA (Data & Business Engineering)',
    institution: 'National Institute of Posts and Telecommunications (INPT)',
    location: 'Rabat, Morocco',
    period: '2022 - 2025',
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
    period: '2020 - 2022',
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
    title: '1st Place: Hult Prize Local Competition',
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
