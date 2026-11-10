interface ProfilePhotoProps {
  name: string
  photoUrl?: string
  size?: 'sidebar' | 'compact'
}

export function ProfilePhoto({ name, photoUrl, size = 'sidebar' }: ProfilePhotoProps) {
  const isCompact = size === 'compact'
  const frameClass = isCompact ? 'h-16 w-16 rounded-xl' : 'h-28 w-28 rounded-xl'

  if (photoUrl) {
    return (
      <div
        className={`relative overflow-hidden border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 ${frameClass}`}
      >
        <img src={photoUrl} alt={name} className="h-full w-full object-cover grayscale" />
      </div>
    )
  }

  return (
    <div
      aria-label={`${name} portrait placeholder`}
      className={`bg-blueprint-grid relative flex flex-col items-center justify-center overflow-hidden border border-dashed border-neutral-300 bg-neutral-100/80 text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900/90 dark:text-neutral-400 ${frameClass}`}
    >
      {/* Subtle monochrome viewfinder corner marks */}
      <span className="pointer-events-none absolute top-1.5 left-1.5 h-2 w-2 border-t border-l border-neutral-400 dark:border-neutral-500" />
      <span className="pointer-events-none absolute top-1.5 right-1.5 h-2 w-2 border-t border-r border-neutral-400 dark:border-neutral-500" />
      <span className="pointer-events-none absolute bottom-1.5 left-1.5 h-2 w-2 border-b border-l border-neutral-400 dark:border-neutral-500" />
      <span className="pointer-events-none absolute right-1.5 bottom-1.5 h-2 w-2 border-r border-b border-neutral-400 dark:border-neutral-500" />

      <svg
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={isCompact ? 'h-8 w-8' : 'h-11 w-11'}
      >
        <circle cx="32" cy="23" r="9.5" />
        <path d="M14 53c1.8-9.8 9-15.5 18-15.5s16.2 5.7 18 15.5" />
      </svg>

      {!isCompact && (
        <span className="mt-1.5 rounded bg-neutral-200/80 px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
          Photo
        </span>
      )}
    </div>
  )
}
