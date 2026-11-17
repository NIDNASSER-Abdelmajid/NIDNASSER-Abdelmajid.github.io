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
    images: [
      {
        src: '/projects/alphapay-medallion.svg',
        alt: 'Financial Payment Lakehouse Medallion Architecture temp blueprint',
        title: 'Medallion Lakehouse Flow (Temp Visual)',
        context:
          'Temp placeholder showing the Bronze, Silver, and Gold Databricks Medallion layers. Replace web/public/projects/alphapay-medallion.svg with your actual Databricks workflow or lineage screenshot.',
      },
      {
        src: '/projects/alphapay-reconciliation.svg',
        alt: 'Payment gateway settlement and latency monitoring temp visual',
        title: 'Gateway Reconciliation Telemetry (Temp Visual)',
        context:
          'Temp placeholder representing the reconciliation dashboard across CMI, PayZone, Fatourati, and CashPlus. Replace with a screenshot of your BI or Delta audit view.',
      },
    ],
    diagram: {
      title: 'Medallion Ingestion & Idempotent Merge Topology',
      caption: 'Watermark-driven extraction feeding immutable Bronze landing, deduplicated Silver core, and governed Gold risk marts.',
      nodes: [
        { id: 'n1', step: '01', label: 'Banking & Gateways', sublabel: 'PostgreSQL / CSV Feeds', layer: 'Source' },
        { id: 'n2', step: '02', label: 'Bronze Delta Layer', sublabel: 'Append-Only + Batch ID', layer: 'Storage' },
        { id: 'n3', step: '03', label: 'Silver Core Engine', sublabel: 'PySpark Dedup + Quarantine', layer: 'Process' },
        { id: 'n4', step: '04', label: 'Gold Risk Marts', sublabel: 'Delta Views + BI Layer', layer: 'Serve' },
      ],
      edgeLabels: ['Watermark Pull', 'Schema Guard', 'Idempotent MERGE'],
    },
    codeParts: [
      {
        title: 'Metadata-Driven Watermark Extractor',
        language: 'python',
        filename: 'ingest/watermark_loader.py',
        description: 'Reads per-entity watermark state from the control table and loads incremental slices into Bronze Delta with batch audit metadata.',
        content: `from pyspark.sql import SparkSession, functions as F

def load_incremental_bronze(spark: SparkSession, cfg: dict, batch_id: str) -> int:
    last_wm = get_watermark(spark, cfg["table_name"])

    query = (
        f"(SELECT * FROM {cfg['source_table']} "
        f"WHERE {cfg['watermark_col']} > '{last_wm}') AS src"
    )

    df = (
        spark.read.format("jdbc")
        .option("url", cfg["jdbc_url"])
        .option("dbtable", query)
        .load()
        .withColumn("_batch_id", F.lit(batch_id))
        .withColumn("_ingested_at", F.current_timestamp())
    )

    count = df.count()
    if count > 0:
        df.write.format("delta").mode("append").saveAsTable(cfg["bronze_table"])
        max_wm = df.agg(F.max(cfg["watermark_col"])).first()[0]
        commit_watermark(spark, cfg["table_name"], max_wm, batch_id)
    return count`,
      },
    ],
    sqlParts: [
      {
        title: 'Idempotent Silver Deduplication & Merge',
        language: 'sql',
        filename: 'models/silver_payments_merge.sql',
        description: 'Keeps the latest settled event per transaction_id using a window function and upserts atomically into Silver Delta.',
        content: `WITH ranked_events AS (
  SELECT
    transaction_id,
    customer_id,
    gateway_code,
    CAST(amount_mad AS DECIMAL(18, 2)) AS amount_mad,
    settlement_status,
    event_ts,
    ROW_NUMBER() OVER (
      PARTITION BY transaction_id
      ORDER BY event_ts DESC, _ingested_at DESC
    ) AS rn
  FROM bronze.gateway_transactions
  WHERE transaction_id IS NOT NULL
    AND amount_mad >= 0
)
MERGE INTO silver.fact_payments AS target
USING (SELECT * FROM ranked_events WHERE rn = 1) AS src
ON target.transaction_id = src.transaction_id
WHEN MATCHED AND src.event_ts >= target.event_ts THEN
  UPDATE SET
    target.amount_mad = src.amount_mad,
    target.settlement_status = src.settlement_status,
    target.event_ts = src.event_ts
WHEN NOT MATCHED THEN
  INSERT (transaction_id, customer_id, gateway_code, amount_mad, settlement_status, event_ts)
  VALUES (src.transaction_id, src.customer_id, src.gateway_code, src.amount_mad, src.settlement_status, src.event_ts);`,
      },
    ],
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
    images: [
      {
        src: '/projects/web-privacy-crawler.svg',
        alt: 'Distributed crawler and Parquet checkpoint temp blueprint',
        title: 'Crawler & Parquet Checkpoint Topology (Temp Visual)',
        context:
          'Temp placeholder showing the decoupled headless crawler pool writing partitioned Parquet checkpoints for Spark enrichment across 100K+ Tranco domains.',
      },
      {
        src: '/projects/web-privacy-ocr.svg',
        alt: 'Asset hash deduplication and OCR taxonomy temp blueprint',
        title: 'Hash Deduplication & OCR Taxonomy (Temp Visual)',
        context:
          'Temp placeholder illustrating SHA-256 creative deduplication prior to OCR and 12-class ad disclosure classification. Replace with your pipeline or taxonomy visual.',
      },
    ],
    diagram: {
      title: 'Decoupled Web Capture & Spark OCR Enrichment Flow',
      caption: 'Isolates flaky network crawling from distributed Spark compute via partitioned Parquet checkpoints and cryptographic creative hashing.',
      nodes: [
        { id: 'n1', step: '01', label: 'Tranco Domain Queue', sublabel: '100K+ Targets', layer: 'Source' },
        { id: 'n2', step: '02', label: 'Parquet Checkpoints', sublabel: 'DOM + Network Logs', layer: 'Storage' },
        { id: 'n3', step: '03', label: 'Spark Hash & OCR', sublabel: 'SHA-256 Dedup + Text', layer: 'Process' },
        { id: 'n4', step: '04', label: 'Disclosure Dataset', sublabel: '12 Classes / 35 Subclasses', layer: 'Serve' },
      ],
      edgeLabels: ['Async Flush', 'Hash Dedup', 'Feature Export'],
    },
    codeParts: [
      {
        title: 'Pre-OCR Creative Hash Deduplication in PySpark',
        language: 'python',
        filename: 'enrichment/dedup_ocr_pipeline.py',
        description: 'Hashes third-party ad creative binaries across domains so OCR executes once per unique asset instead of repeating across thousands of sites.',
        content: `from pyspark.sql import DataFrame, functions as F

def extract_unique_creatives_for_ocr(raw_assets: DataFrame) -> DataFrame:
    hashed = (
        raw_assets
        .filter(F.col("image_bytes").isNotNull())
        .withColumn("asset_sha256", F.sha2(F.col("image_bytes"), 256))
    )

    unique_assets = (
        hashed
        .groupBy("asset_sha256")
        .agg(
            F.first("image_bytes").alias("image_bytes"),
            F.countDistinct("domain").alias("domain_reach"),
            F.collect_set("ad_network").alias("networks"),
        )
    )
    return unique_assets`,
      },
    ],
    sqlParts: [
      {
        title: 'Disclosure Taxonomy Coverage Aggregation',
        language: 'sql',
        filename: 'analytics/disclosure_taxonomy_rollup.sql',
        description: 'Summarizes ad disclosure compliance rates across Tranco rank tiers and the 12-class disclosure taxonomy.',
        content: `SELECT
  CASE
    WHEN tranco_rank <= 1000 THEN 'Top 1K'
    WHEN tranco_rank <= 10000 THEN '1K - 10K'
    ELSE '10K - 100K'
  END AS rank_tier,
  top_category,
  COUNT(DISTINCT domain) AS domains_observed,
  COUNT(*) AS total_ad_slots,
  ROUND(100.0 * SUM(CASE WHEN has_explicit_disclosure THEN 1 ELSE 0 END) / COUNT(*), 2)
    AS disclosure_rate_pct
FROM curated.web_ad_disclosures
GROUP BY 1, 2
ORDER BY 1, total_ad_slots DESC;`,
      },
    ],
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
    images: [
      {
        src: '/projects/leyton-star-schema.svg',
        alt: 'Multi-ERP Star Schema and Client Crosswalk temp blueprint',
        title: 'Conformed Star Schema & Crosswalk (Temp Visual)',
        context:
          'Temp placeholder showing the Star Schema dimensional model unifying Salesforce, Odoo, and SAP through an auditable client identity crosswalk.',
      },
      {
        src: '/projects/leyton-bi-reconciliation.svg',
        alt: 'Finance ledger variance and BI KPI layer temp blueprint',
        title: 'SAP Balance Gate & Executive BI (Temp Visual)',
        context:
          'Temp placeholder illustrating automated SAP ledger reconciliation before publishing CLV, margin, and retention KPIs to Power BI and Tableau.',
      },
    ],
    diagram: {
      title: 'Multi-ERP Dimensional Modeling & Reconciliation Pipeline',
      caption: 'Conforms Salesforce, Odoo, and SAP feeds into a unified Star Schema protected by automated SAP period variance gates.',
      nodes: [
        { id: 'n1', step: '01', label: 'SFDC / Odoo / SAP', sublabel: 'CRM, Billing & Ledger', layer: 'Source' },
        { id: 'n2', step: '02', label: 'Identity Crosswalk', sublabel: 'Unified Client Keys', layer: 'Process' },
        { id: 'n3', step: '03', label: 'Star Schema DW', sublabel: 'Facts & Dimensions', layer: 'Storage' },
        { id: 'n4', step: '04', label: 'Executive BI Suite', sublabel: 'Power BI & Tableau', layer: 'Serve' },
      ],
      edgeLabels: ['Incremental Pull', 'Crosswalk Join', 'Variance Gate'],
    },
    codeParts: [
      {
        title: 'Automated SAP Period Variance Gate',
        language: 'python',
        filename: 'quality/sap_reconciliation_check.py',
        description: 'Blocks BI refresh if the warehouse invoice totals diverge from SAP general ledger period totals beyond tolerance.',
        content: `from decimal import Decimal

def verify_ledger_parity(dw_conn, period_key: str, tolerance: Decimal = Decimal("0.01")) -> None:
    sql = """
        SELECT
            COALESCE(dw.total_eur, 0) AS dw_total,
            COALESCE(sap.ledger_eur, 0) AS sap_total
        FROM mart.monthly_invoice_summary dw
        FULL OUTER JOIN staging.sap_gl_period_totals sap
          ON dw.period_key = sap.period_key
        WHERE COALESCE(dw.period_key, sap.period_key) = %s
    """
    dw_total, sap_total = dw_conn.fetch_one(sql, (period_key,))
    variance = abs(Decimal(str(dw_total)) - Decimal(str(sap_total)))
    if variance > tolerance:
        raise RuntimeError(
            f"Ledger reconciliation failed for {period_key}: variance={variance} EUR"
        )`,
      },
    ],
    sqlParts: [
      {
        title: 'Conformed Client Crosswalk & Cohort Retention Mart',
        language: 'sql',
        filename: 'warehouse/fact_client_revenue_mart.sql',
        description: 'Resolves fragmented ERP identifiers onto a canonical client key and computes annual net revenue retention.',
        content: `WITH conformed_invoices AS (
  SELECT
    xwalk.canonical_client_id,
    DATE_TRUNC('month', inv.invoice_date) AS billing_month,
    inv.source_system,
    inv.native_invoice_id,
    inv.net_amount_eur
  FROM staging.all_erp_invoices inv
  INNER JOIN core.dim_client_crosswalk xwalk
    ON inv.source_system = xwalk.source_system
   AND inv.native_client_id = xwalk.native_client_id
)
SELECT
  canonical_client_id,
  billing_month,
  SUM(net_amount_eur) AS monthly_revenue_eur,
  SUM(SUM(net_amount_eur)) OVER (
    PARTITION BY canonical_client_id
    ORDER BY billing_month
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS cumulative_clv_eur
FROM conformed_invoices
GROUP BY canonical_client_id, billing_month;`,
      },
    ],
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
    images: [
      {
        src: '/projects/kafka-partitions.svg',
        alt: 'Entity-keyed Kafka partitioning and dead-letter queue temp blueprint',
        title: 'Kafka Partitioning & DLQ Flow (Temp Visual)',
        context:
          'Temp placeholder showing entity-keyed Kafka topics, consumer group offset commits, and isolated dead-letter routing for malformed payloads.',
      },
      {
        src: '/projects/kafka-projections.svg',
        alt: 'Real-time socket projection and Dockerized worker temp blueprint',
        title: 'Live Socket Projections (Temp Visual)',
        context:
          'Temp placeholder illustrating Dockerized workers pushing low-latency state projections to live dashboards. Replace with your monitoring or Kafka UI screenshot.',
      },
    ],
    diagram: {
      title: 'Ordered Kafka Event Backbone & Dead-Letter Recovery',
      caption: 'Guarantees per-entity ordering through keyed partitions and zero silent drops through manual offset commits and DLQ quarantine.',
      nodes: [
        { id: 'n1', step: '01', label: 'Event Producers', sublabel: 'Python / Java Services', layer: 'Source' },
        { id: 'n2', step: '02', label: 'Keyed Kafka Topics', sublabel: 'Partitioned by entity_id', layer: 'Storage' },
        { id: 'n3', step: '03', label: 'Worker Consumers', sublabel: 'Manual Offset + DLQ', layer: 'Process' },
        { id: 'n4', step: '04', label: 'Live Projections', sublabel: 'WebSocket + Read Store', layer: 'Serve' },
      ],
      edgeLabels: ['Keyed Produce', 'At-Least-Once Poll', 'Push Projection'],
    },
    codeParts: [
      {
        title: 'Manual-Commit Kafka Consumer with Dead-Letter Routing',
        language: 'python',
        filename: 'streaming/event_consumer.py',
        description: 'Validates each incoming event, routes malformed records to a replayable DLQ topic, and commits offsets only after downstream writes succeed.',
        content: `import json

def consume_with_dlq(consumer, dlq_producer, sink_writer):
    for msg in consumer:
        try:
            payload = validate_event(json.loads(msg.value.decode("utf-8")))
            sink_writer.apply_idempotent(
                entity_id=payload["entity_id"],
                event_seq=payload["seq"],
                state=payload["state"],
            )
            consumer.commit()
        except ValueError as err:
            dlq_producer.send(
                "events.dlq",
                key=msg.key,
                value=json.dumps({
                    "raw": msg.value.decode("utf-8", errors="replace"),
                    "error": str(err),
                    "partition": msg.partition,
                    "offset": msg.offset,
                }).encode("utf-8"),
            )
            dlq_producer.flush()
            consumer.commit()`,
      },
    ],
    sqlParts: [
      {
        title: 'Idempotent Sequence-Guarded Projection Upsert',
        language: 'sql',
        filename: 'projections/upsert_entity_state.sql',
        description: 'Prevents replayed or stale Kafka events from overwriting newer state by guarding updates with event_seq.',
        content: `INSERT INTO realtime.entity_projections (
  entity_id,
  event_seq,
  current_state,
  updated_at
)
VALUES ($1, $2, $3, NOW())
ON CONFLICT (entity_id) DO UPDATE
SET
  event_seq = EXCLUDED.event_seq,
  current_state = EXCLUDED.current_state,
  updated_at = EXCLUDED.updated_at
WHERE EXCLUDED.event_seq > realtime.entity_projections.event_seq;`,
      },
    ],
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
    images: [
      {
        src: '/projects/onde-triage-flow.svg',
        alt: 'Privacy-first case standardization pipeline temp blueprint',
        title: 'PII Vault & Case Standardization (Temp Visual)',
        context:
          'Temp placeholder showing institutional record normalization with strict PII separation prior to analytics and model scoring.',
      },
      {
        src: '/projects/onde-nlp-scoring.svg',
        alt: 'NLP triage scoring API and append-only history temp blueprint',
        title: 'NLP Triage API & Audit History (Temp Visual)',
        context:
          'Temp placeholder depicting the FastAPI scoring endpoint and append-only prediction audit log in PostgreSQL. Replace with your schema or workflow screenshot.',
      },
    ],
    diagram: {
      title: 'Privacy-First Case Ingestion & NLP Triage Architecture',
      caption: 'Strips direct identifiers into an isolated vault before NLP feature extraction, versioned FastAPI scoring, and append-only audit storage.',
      nodes: [
        { id: 'n1', step: '01', label: 'Partner Case Feeds', sublabel: 'Forms & Spreadsheets', layer: 'Source' },
        { id: 'n2', step: '02', label: 'PII Vault Separator', sublabel: 'De-Identified Text', layer: 'Process' },
        { id: 'n3', step: '03', label: 'NLP Triage Service', sublabel: 'Scikit-learn + FastAPI', layer: 'Serve' },
        { id: 'n4', step: '04', label: 'PostgreSQL Audit', sublabel: 'Append-Only Verdicts', layer: 'Storage' },
      ],
      edgeLabels: ['Normalize Schema', 'Strip PII', 'Versioned Verdict'],
    },
    codeParts: [
      {
        title: 'FastAPI Versioned Triage Scoring Endpoint',
        language: 'python',
        filename: 'serving/triage_api.py',
        description: 'Scores de-identified case narratives using a versioned NLP pipeline and writes an immutable audit row back to PostgreSQL.',
        content: `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class CasePayload(BaseModel):
    case_token: str
    narrative_clean: str

@app.post("/v1/triage/score")
def score_case(payload: CasePayload):
    priority_prob = float(model.predict_proba([payload.narrative_clean])[0][1])
    tier = "HIGH" if priority_prob >= 0.75 else "MEDIUM" if priority_prob >= 0.4 else "STANDARD"

    db.execute(
        """
        INSERT INTO triage.prediction_history (case_token, model_version, score, priority_tier)
        VALUES (%s, %s, %s, %s)
        """,
        (payload.case_token, MODEL_VERSION, round(priority_prob, 4), tier),
    )
    return {"case_token": payload.case_token, "priority_tier": tier, "model_version": MODEL_VERSION}`,
      },
    ],
    sqlParts: [
      {
        title: 'Latest Case Priority View Over Append-Only Audit Log',
        language: 'sql',
        filename: 'db/vw_active_case_queue.sql',
        description: 'Surfaces the latest triage verdict per case while preserving full historical model assessment lineage for case officers.',
        content: `CREATE OR REPLACE VIEW triage.vw_active_case_queue AS
SELECT DISTINCT ON (c.case_token)
  c.case_token,
  c.region_code,
  c.opened_at,
  p.priority_tier,
  p.score,
  p.model_version,
  p.scored_at
FROM core.cases c
LEFT JOIN triage.prediction_history p
  ON p.case_token = c.case_token
WHERE c.status = 'OPEN'
ORDER BY c.case_token, p.scored_at DESC;`,
      },
    ],
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
    images: [
      {
        src: '/projects/extractors-pipeline.svg',
        alt: 'Resilient Scrapy and Selenium extraction engine temp blueprint',
        title: 'Modular Extraction Engine (Temp Visual)',
        context:
          'Temp placeholder showing adaptive Scrapy and Selenium workers with runtime item validation and batched loading.',
      },
      {
        src: '/projects/extractors-drift.svg',
        alt: 'Pre-load row-count drift guard and archive snapshots temp blueprint',
        title: 'Row-Count Drift Guard & Archives (Temp Visual)',
        context:
          'Temp placeholder illustrating baseline row-count verification that blocks broken DOM scrapes from overwriting valid historical snapshots.',
      },
    ],
    diagram: {
      title: 'Drift-Protected Web Extraction & Batched Loading Flow',
      caption: 'Validates scraped fields and checks batch row counts against 7-day rolling baselines before committing batched SQL upserts and Parquet archives.',
      nodes: [
        { id: 'n1', step: '01', label: 'Dynamic Web Targets', sublabel: 'APIs & JS Storefronts', layer: 'Source' },
        { id: 'n2', step: '02', label: 'Scrapy / Selenium', sublabel: 'Throttled Workers', layer: 'Process' },
        { id: 'n3', step: '03', label: 'Schema & Drift Gate', sublabel: 'Baseline Row Checks', layer: 'Process' },
        { id: 'n4', step: '04', label: 'Postgres & Parquet', sublabel: 'Batched Snapshots', layer: 'Storage' },
      ],
      edgeLabels: ['Cursor Crawl', 'Validate Items', 'Batched Upsert'],
    },
    codeParts: [
      {
        title: 'Pre-Load Row-Count Drift Guard & Batched Writer',
        language: 'python',
        filename: 'pipelines/drift_guarded_loader.py',
        description: 'Compares extracted batch volume against the 7-day baseline before flushing multi-hundred-row chunks into PostgreSQL.',
        content: `from psycopg2.extras import execute_values

def commit_validated_snapshot(conn, source_id: str, rows: list[tuple]) -> int:
    baseline = fetch_seven_day_avg_count(conn, source_id)
    if baseline > 0 and len(rows) < baseline * 0.65:
        raise ValueError(
            f"Drift guard tripped for {source_id}: got {len(rows)} vs baseline {baseline:.0f}"
        )

    upsert_sql = """
        INSERT INTO market.catalog_snapshots (source_id, sku_id, price_usd, captured_date)
        VALUES %s
        ON CONFLICT (source_id, sku_id, captured_date)
        DO UPDATE SET price_usd = EXCLUDED.price_usd
    """
    with conn.cursor() as cur:
        execute_values(cur, upsert_sql, rows, page_size=500)
    conn.commit()
    return len(rows)`,
      },
    ],
    sqlParts: [
      {
        title: '7-Day Rolling Baseline & Daily Price Delta Query',
        language: 'sql',
        filename: 'monitoring/snapshot_drift_and_deltas.sql',
        description: 'Detects sudden catalog volume drops and computes day-over-day price changes across scraped SKUs.',
        content: `WITH daily_counts AS (
  SELECT
    source_id,
    captured_date,
    COUNT(*) AS row_count,
    AVG(COUNT(*)) OVER (
      PARTITION BY source_id
      ORDER BY captured_date
      ROWS BETWEEN 7 PRECEDING AND 1 PRECEDING
    ) AS rolling_7d_baseline
  FROM market.catalog_snapshots
  GROUP BY source_id, captured_date
)
SELECT
  source_id,
  captured_date,
  row_count,
  ROUND(rolling_7d_baseline, 1) AS baseline_7d,
  ROUND(100.0 * (row_count - rolling_7d_baseline) / NULLIF(rolling_7d_baseline, 0), 2)
    AS variance_pct
FROM daily_counts
ORDER BY captured_date DESC, source_id;`,
      },
    ],
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
