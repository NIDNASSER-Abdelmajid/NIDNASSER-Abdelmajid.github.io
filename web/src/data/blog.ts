import type { BlogPost } from '../types/portfolio'

// Blog sections support: paragraphs, bullets, code, images (src, alt, caption, context),
// and embeds (type: 'iframe' | 'link' | 'callout').
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'idempotent-cdc-medallion-lakehouse',
    code: 'LOG-01',
    title: 'Idempotent CDC Pipelines in a Medallion Lakehouse',
    topic: 'Lakehouse',
    publishedAt: '2026-10-18',
    readTime: '4 min read',
    excerpt:
      'Keeping Bronze-to-Silver Delta merges deterministic across retries using batch watermarks and QUALIFY ranking.',
    tags: ['Databricks', 'Delta Lake', 'CDC', 'SQL'],
    sections: [
      {
        heading: 'Why Incremental Retries Break Warehouses',
        paragraphs: [
          'Naive incremental loads fail when a pipeline restarts mid-batch or upstream OLTP replays duplicate events, causing double-counted metrics or Delta MERGE conflicts.',
        ],
        embeds: [
          {
            type: 'callout',
            label: 'Invariant',
            title: 'Advance Watermarks Post-Commit Only',
            body: 'Never update ingestion state before the target transaction commits. Separating Bronze raw append from Silver MERGE lets failed runs replay safely without duplicates.',
          },
        ],
      },
      {
        heading: 'Bronze Append vs. Silver Deterministic Merge',
        paragraphs: [
          'Keeping Bronze strictly append-only gives a clean replay buffer, while ranking each batch by ingestion timestamp before MERGE guarantees idempotent Silver state.',
        ],
        bullets: [
          'Bronze: Raw payload + _batch_id + _ingested_at',
          'Silver: QUALIFY deduplication + FK constraints',
          'Watermark: Advance only after Delta commit succeeds',
        ],
        code: {
          label: 'Deterministic Silver Upsert',
          content: `MERGE INTO silver.fct_transactions AS t
USING (
  SELECT * FROM bronze.pg_transactions
  WHERE _batch_id = :batch_id
  QUALIFY ROW_NUMBER() OVER (
    PARTITION BY txn_id ORDER BY updated_at DESC, _ingested_at DESC
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
    title: 'Crawling 100K+ Domains Without Stalling Spark ETL',
    topic: 'ETL & Ingestion',
    publishedAt: '2026-09-29',
    readTime: '4 min read',
    excerpt:
      'Decoupling noisy headless web capture from CPU-heavy OCR and PySpark deduplication via Parquet checkpoints.',
    tags: ['Apache Spark', 'Python', 'Crawlers', 'Data Quality'],
    sections: [
      {
        heading: 'Decouple Acquisition from Heavy Enrichment',
        paragraphs: [
          'Network timeouts and rate limits are normal across 100K+ domains. Flushing raw DOM and HAR captures to sharded Parquet checkpoints isolates crawler retries from downstream Spark jobs.',
        ],
        embeds: [
          {
            type: 'link',
            source: 'GitHub Repository',
            title: 'crawler-addisclosure',
            url: 'https://github.com/NIDNASSER-Abdelmajid/crawler-addisclosure',
            description:
              'Crawler and pipeline implementation capturing DOM trees, network headers, and disclosure telemetry.',
          },
        ],
      },
      {
        heading: 'Hash Deduplication Pre-OCR',
        paragraphs: [
          'Third-party CDN ad creatives repeat heavily across domains. Computing SHA-256 asset hashes before OCR cuts compute volume dramatically.',
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
    ],
  },
  {
    slug: 'star-schema-multi-erp-warehouses',
    code: 'LOG-03',
    title: 'Star Schema Discipline for Multi-ERP Warehouses',
    topic: 'Data Modeling',
    publishedAt: '2026-08-14',
    readTime: '3 min read',
    excerpt:
      'Unifying Salesforce, Odoo, and SAP starts with conformed client crosswalks and automated GL reconciliation.',
    tags: ['SQL', 'Star Schema', 'Modeling', 'BI'],
    sections: [
      {
        heading: 'Crosswalk Dimensions Over Raw ERP IDs',
        paragraphs: [
          'CRM, billing, and accounting systems rarely share customer keys. A conformed dim_client crosswalk preserves source lineage while unifying downstream revenue and CLV metrics.',
        ],
        bullets: [
          'Declare exact fact grain first (1 row per invoice line)',
          'Retain native ERP keys alongside surrogate keys for audits',
          'Centralize KPI logic in SQL marts rather than scattered BI formulas',
        ],
        embeds: [
          {
            type: 'link',
            source: 'GitHub Repository',
            title: 'SALES-ANALYTICS-DASHBOARD',
            url: 'https://github.com/NIDNASSER-Abdelmajid/SALES-ANALYTICS-DASHBOARD',
            description: 'Analytical warehousing models and revenue KPIs across sales dimensions.',
          },
        ],
      },
      {
        heading: 'Automated GL Reconciliation Gate',
        paragraphs: [
          'Verify warehouse totals directly against SAP period control totals before refreshing executive semantic layers.',
        ],
        code: {
          label: 'GL Reconciliation Assertion',
          content: `SELECT ABS(dw_total - sap_gl_total) AS variance
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
