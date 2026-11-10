import type { BlogPost } from '../types/portfolio'

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'idempotent-cdc-medallion-lakehouse',
    code: 'LOG-01',
    title: 'Designing Idempotent CDC Pipelines in a Medallion Lakehouse',
    topic: 'Lakehouse',
    publishedAt: '2026-10-18',
    readTime: '6 min read',
    excerpt:
      'Why naive incremental loads break during retries, and how watermark contracts plus QUALIFY deduplication keep Bronze-to-Silver Delta merges deterministic.',
    tags: ['Databricks', 'Delta Lake', 'CDC', 'SQL'],
    takeaways: [
      'Always treat Bronze as append-only raw truth with batch audit columns.',
      'Deduplicate inside the staging subquery before MERGE INTO so duplicate CDC events never fail Spark merges.',
      'Persist watermarks only after the downstream Delta commit succeeds.',
    ],
    sections: [
      {
        heading: 'The Retry Trap in Incremental Ingestion',
        paragraphs: [
          'Most batch pipelines look simple on day one: query rows where updated_at > last_run, append them to a warehouse table, and advance the bookmark. Everything breaks the first time a job fails halfway through or an upstream OLTP database replays duplicate change events.',
          'Without idempotency, every retry silently doubles financial metrics or throws primary-key conflicts during MERGE INTO operations.',
        ],
      },
      {
        heading: 'Separating Landing Truth from Conformed State',
        paragraphs: [
          'In a three-tier Medallion setup (such as unifying PostgreSQL transaction tables and payment gateway CSV drops), keeping Bronze strictly append-only gives engineers an exact replay buffer. When business rules change in Silver, you can rebuild Silver cleanly without touching production OLTP databases.',
        ],
        bullets: [
          'Bronze stores source payloads verbatim plus _batch_id and _ingested_at metadata.',
          'Silver enforces strict schema types, deduplication windows, and foreign-key checks.',
          'Gold serves pre-joined analytical marts optimized for BI query latency.',
        ],
      },
      {
        heading: 'Deterministic Deduplication Before MERGE',
        paragraphs: [
          'If a single CDC micro-batch contains two updates for the same transaction ID, Delta MERGE throws an ambiguous match error. Ranking within the batch window by ingestion timestamp before merging guarantees deterministic, re-runnable execution.',
        ],
        code: {
          label: 'Deterministic Silver Upsert Pattern',
          content: `MERGE INTO silver.fct_transactions AS t
USING (
  SELECT *
  FROM bronze.pg_transactions
  WHERE _batch_id = :batch_id
  QUALIFY ROW_NUMBER() OVER (
    PARTITION BY txn_id
    ORDER BY updated_at DESC, _ingested_at DESC
  ) = 1
) AS s
ON t.txn_id = s.txn_id
WHEN MATCHED THEN UPDATE SET *
WHEN NOT MATCHED THEN INSERT *;`,
        },
      },
    ],
  },
  {
    slug: 'crawling-100k-domains-clean-etl',
    code: 'LOG-02',
    title: 'Crawling 100K+ Domains Without Breaking Downstream ETL',
    topic: 'ETL & Ingestion',
    publishedAt: '2026-09-29',
    readTime: '5 min read',
    excerpt:
      'Lessons from separating noisy web acquisition from heavy OCR and Spark feature pipelines so crawler failures never stall analytical processing.',
    tags: ['Apache Spark', 'Python', 'Web Extraction', 'Data Quality'],
    takeaways: [
      'Separate fast network/DOM capture from CPU-intensive enrichment like OCR.',
      'Use content hashes early to collapse duplicate third-party CDN assets.',
      'Validate row-count stability before promoting a crawl shard into analytical tables.',
    ],
    sections: [
      {
        heading: 'Why Monolithic Scrapers Fail at Scale',
        paragraphs: [
          'When collecting web telemetry across 100K+ domains, network flakiness, dynamic DOM timeouts, and anti-bot rate limits are normal operating conditions. Coupling headless browser workers directly to OCR models or downstream database writes turns every timeout into lost partial state.',
        ],
      },
      {
        heading: 'Checkpointing Between Collection and Enrichment',
        paragraphs: [
          'By flushing raw DOM and network captures into sharded JSONL/Parquet checkpoints first, downstream PySpark jobs can independently deduplicate URLs, compute SHA-256 asset hashes, and batch OCR extraction only across unique creatives.',
        ],
        code: {
          label: 'Asset Hash Deduplication',
          content: `unique_creatives = (
    raw_captures
    .withColumn("asset_hash", F.sha2(F.col("image_bytes"), 256))
    .dropDuplicates(["asset_hash"])
    .select("asset_hash", "image_bytes")
)`,
        },
      },
      {
        heading: 'Catching Silent Extraction Drift',
        paragraphs: [
          'Websites change markup silently. A scraper can return HTTP 200 while extracting empty fields. Adding automated null-rate assertions and 7-day rolling row-count guards prevents empty crawl batches from poisoning downstream training datasets.',
        ],
      },
    ],
  },
  {
    slug: 'star-schema-multi-erp-warehouses',
    code: 'LOG-03',
    title: 'Star Schema Discipline for Multi-ERP Financial Warehouses',
    topic: 'Data Modeling',
    publishedAt: '2026-08-14',
    readTime: '5 min read',
    excerpt:
      'Unifying Salesforce, Odoo, and SAP starts with agreeing on grain and conformed dimensions long before opening Power BI or Tableau.',
    tags: ['SQL', 'Star Schema', 'Data Modeling', 'BI'],
    takeaways: [
      'Declare the exact grain of every fact table before writing a single JOIN.',
      'Use conformed client crosswalk dimensions instead of mutating upstream ERP keys.',
      'Reconcile aggregated warehouse totals directly against source general ledgers.',
    ],
    sections: [
      {
        heading: 'When Three Systems Disagree on What a Customer Is',
        paragraphs: [
          'In corporate analytics, revenue data rarely lives in one database. Opportunities live in Salesforce, operational billing in Odoo, and audited accounting entries in SAP. Without a conformed client dimension, finance and sales dashboards report conflicting totals for the exact same customer.',
        ],
      },
      {
        heading: 'Crosswalk Dimensions and Explicit Grain',
        paragraphs: [
          'Rather than forcing teams into brittle flat tables, modeling a conformed dim_client backed by an ERP ID crosswalk table keeps every fact table cleanly tied to one atomic grain (for example, one row per invoice line).',
        ],
        bullets: [
          'Keep raw source IDs as attributes for auditability.',
          'Generate deterministic integer surrogate keys for fast BI joins.',
          'Centralize KPI calculations like CLV and net retention in governed SQL marts.',
        ],
      },
      {
        heading: 'Automated Financial Reconciliation Checks',
        paragraphs: [
          'Executive trust depends on exact numbers. Running an automated reconciliation query comparing SUM(recognized_amount) in the warehouse against SAP period control totals catches FX rounding or missing batch errors before any user opens a dashboard.',
        ],
        code: {
          label: 'GL Reconciliation Assertion',
          content: `SELECT
  ABS(dw_total - sap_gl_total) AS variance
FROM (
  SELECT
    (SELECT SUM(recognized_amount) FROM dw.fct_revenue WHERE fiscal_period = :period) AS dw_total,
    (SELECT SUM(net_amount) FROM stg_sap_gl WHERE fiscal_period = :period) AS sap_gl_total
) checks
HAVING ABS(dw_total - sap_gl_total) > 0.01;`,
        },
      },
    ],
  },
]
