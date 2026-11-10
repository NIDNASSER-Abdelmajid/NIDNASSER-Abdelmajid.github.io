import {
  siApacheairflow,
  siApachekafka,
  siApachespark,
  siDatabricks,
  siDocker,
  siFastapi,
  siGit,
  siGooglecloud,
  siLinux,
  siLooker,
  siMongodb,
  siMysql,
  siPandas,
  siPostgresql,
  siPython,
  siScikitlearn,
  siScrapy,
  siSelenium,
  siSqlite,
} from 'simple-icons'

const SIMPLE_ICON_PATHS: Record<string, string> = {
  databricks: siDatabricks.path,
  'apache-spark': siApachespark.path,
  python: siPython.path,
  pandas: siPandas.path,
  'apache-airflow': siApacheairflow.path,
  'apache-kafka': siApachekafka.path,
  scrapy: siScrapy.path,
  selenium: siSelenium.path,
  docker: siDocker.path,
  linux: siLinux.path,
  git: siGit.path,
  'google-cloud': siGooglecloud.path,
  postgresql: siPostgresql.path,
  mysql: siMysql.path,
  mongodb: siMongodb.path,
  sqlite: siSqlite.path,
  looker: siLooker.path,
  fastapi: siFastapi.path,
  'scikit-learn': siScikitlearn.path,
}

export function StackLogo({ id, className = 'h-6 w-6' }: { id: string; className?: string }) {
  const path = SIMPLE_ICON_PATHS[id]
  if (path) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
        <path d={path} />
      </svg>
    )
  }

  switch (id) {
    case 'delta-lake':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true" className={className}>
          <path d="M12 3L21 19H3L12 3Z" strokeLinejoin="round" />
          <path d="M7.5 15.5C9.5 14 14.5 17 16.5 15.5" strokeLinecap="round" />
        </svg>
      )
    case 'sql':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className={className}>
          <ellipse cx="12" cy="6" rx="7" ry="2.8" />
          <path d="M5 6v6c0 1.55 3.13 2.8 7 2.8s7-1.25 7-2.8V6" />
          <path d="M5 12v6c0 1.55 3.13 2.8 7 2.8s7-1.25 7-2.8v-6" />
        </svg>
      )
    case 'sql-server':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className={className}>
          <rect x="4" y="4" width="16" height="6" rx="1.5" />
          <rect x="4" y="14" width="16" height="6" rx="1.5" />
          <circle cx="8" cy="7" r="0.9" fill="currentColor" />
          <circle cx="8" cy="17" r="0.9" fill="currentColor" />
          <path d="M12 7h4M12 17h4" strokeLinecap="round" />
        </svg>
      )
    case 'power-bi':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
          <rect x="4" y="13" width="4" height="8" rx="1" />
          <rect x="10" y="8" width="4" height="13" rx="1" />
          <rect x="16" y="3" width="4" height="18" rx="1" />
        </svg>
      )
    case 'tableau':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" className={className}>
          <path d="M12 3v6M9 6h6" />
          <path d="M12 15v6M9 18h6" />
          <path d="M6 9v6M3 12h6" />
          <path d="M18 9v6M15 12h6" />
        </svg>
      )
    case 'xgboost':
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
          <circle cx="12" cy="5" r="2.2" />
          <circle cx="6.5" cy="18" r="2.2" />
          <circle cx="17.5" cy="18" r="2.2" />
          <path d="M10.7 6.9L7.6 16M13.3 6.9L16.4 16M8.7 18h6.6" />
        </svg>
      )
  }
}
