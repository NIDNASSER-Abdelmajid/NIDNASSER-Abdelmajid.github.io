import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CanvasIdentityHeader } from './components/CanvasIdentityHeader'
import { CommandPalette } from './components/CommandPalette'
import { Footer } from './components/Footer'
import { MobilePipelineOverview } from './components/MobilePipelineOverview'
import { PipelineEdges } from './components/PipelineEdges'
import { Sidebar } from './components/Sidebar'
import { CANVAS_NODES, type CanvasNodeConfig } from './data/canvasData'
import { PROFILE } from './data/portfolio'
import { parseRoute, useRouter } from './hooks/useRouter'
import { useTheme } from './hooks/useTheme'
import { BlogPage } from './pages/BlogPage'
import { ContactPage } from './pages/ContactPage'
import { CredentialsPage } from './pages/CredentialsPage'
import { ExperiencePage } from './pages/ExperiencePage'
import { HomePage } from './pages/HomePage'
import { ProjectsPage } from './pages/ProjectsPage'
import { StackPage } from './pages/StackPage'

export function App() {
  const { route, navigate } = useRouter()
  const { preference, resolvedTheme, setPreference, toggleTheme } = useTheme()
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [windowSize, setWindowSize] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1440,
    height: typeof window !== 'undefined' ? window.innerHeight : 900,
  }))

  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])

  const viewMode: 'canvas' | 'section' = route.page === 'canvas' ? 'canvas' : 'section'
  const isMobile = windowSize.width < 768

  // Window resize listener
  useEffect(() => {
    const onResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const activeIndex = useMemo(() => {
    if (route.page === 'canvas') return -1
    const idx = CANVAS_NODES.findIndex((n) => n.id === route.page)
    return idx >= 0 ? idx : 0
  }, [route.page])

  const handleCopyEmail = useCallback(() => {
    navigator.clipboard?.writeText(PROFILE.email).catch(() => {})
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }, [])

  const handleNavigate = useCallback(
    (nextPath: string) => {
      const targetPage = parseRoute(nextPath).page
      if (route.page === targetPage && targetPage !== 'canvas') {
        const idx = CANVAS_NODES.findIndex((s) => s.id === targetPage)
        if (idx !== -1 && sectionRefs.current[idx]) {
          sectionRefs.current[idx]?.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }
      navigate(nextPath)
    },
    [navigate, route.page]
  )

  const handleZoomOut = useCallback(() => {
    navigate('/canvas')
  }, [navigate])

  // Reset scroll to top when sliding into an active section or entering canvas
  useEffect(() => {
    if (viewMode === 'canvas') {
      sectionRefs.current.forEach((el) => {
        if (el && el.scrollTop > 0) {
          el.scrollTo({ top: 0, behavior: 'auto' })
        }
      })
    } else if (activeIndex >= 0) {
      const el = sectionRefs.current[activeIndex]
      if (el && el.scrollTop > 0) {
        el.scrollTo({ top: 0, behavior: 'auto' })
      }
    }
  }, [viewMode, activeIndex])

  // Keyboard navigation: Cmd/Ctrl+K for palette, ArrowLeft/ArrowRight to slide, Escape to zoom out
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((prev) => !prev)
        return
      }

      if (paletteOpen) return

      const activeEl = document.activeElement
      if (activeEl) {
        const tag = activeEl.tagName.toLowerCase()
        if (
          tag === 'input' ||
          tag === 'textarea' ||
          tag === 'select' ||
          (activeEl as HTMLElement).isContentEditable
        ) {
          return
        }
      }

      // Do not navigate between sections if a modal dialog is open
      if (document.querySelector('[role="dialog"]')) return

      if (e.key === 'Escape') {
        if (viewMode === 'section') {
          e.preventDefault()
          handleZoomOut()
        }
        return
      }

      if (viewMode === 'section') {
        if (e.key === 'ArrowRight') {
          e.preventDefault()
          if (activeIndex < CANVAS_NODES.length - 1) {
            navigate(CANVAS_NODES[activeIndex + 1].path)
          }
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault()
          if (activeIndex > 0) {
            navigate(CANVAS_NODES[activeIndex - 1].path)
          }
        } else if (e.key === 'Home') {
          e.preventDefault()
          navigate(CANVAS_NODES[0].path)
        } else if (e.key === 'End') {
          e.preventDefault()
          navigate(CANVAS_NODES[CANVAS_NODES.length - 1].path)
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeIndex, handleZoomOut, navigate, paletteOpen, viewMode])

  // Calculate overview transform to fit and center all 7 scattered nodes
  const overviewTransform = useMemo(() => {
    // Total bounds: nodes range from 20vw to 525vw wide, -25vh to 190vh tall
    const totalW = 5.25 * windowSize.width
    const totalH = 2.25 * windowSize.height
    const scaleX = (windowSize.width * 0.94) / totalW
    const scaleY = (windowSize.height * 0.72) / totalH
    const scale = Math.min(scaleX, scaleY, 0.22)

    const centerX = 2.725 * windowSize.width
    const panX = windowSize.width * 0.5 - centerX * scale

    const centerY = 0.825 * windowSize.height
    const panY = (windowSize.height + 65) * 0.5 - centerY * scale

    return { scale, panX, panY }
  }, [windowSize])

  // Camera transform: overview scale/pan when in canvas mode; 1:1 translate when in section mode
  const cameraTransform = useMemo(() => {
    if (viewMode === 'canvas') {
      return `translate3d(${overviewTransform.panX}px, ${overviewTransform.panY}px, 0) scale(${overviewTransform.scale})`
    }

    const activeNode =
      CANVAS_NODES.find((n) => n.id === route.page) || CANVAS_NODES[0]
    return `translate3d(-${activeNode.x}vw, -${activeNode.y}vh, 0) scale(1)`
  }, [viewMode, route.page, overviewTransform])

  const renderSectionContent = (node: CanvasNodeConfig) => {
    switch (node.id) {
      case 'home':
        return (
          <HomePage
            copied={copied}
            onCopyEmail={handleCopyEmail}
            onNavigate={handleNavigate}
          />
        )
      case 'projects':
        return (
          <ProjectsPage
            activeProjectId={route.page === 'projects' ? route.projectId : null}
            onNavigate={handleNavigate}
          />
        )
      case 'experience':
        return <ExperiencePage />
      case 'credentials':
        return <CredentialsPage />
      case 'stack':
        return <StackPage />
      case 'blog':
        return (
          <BlogPage
            activeSlug={route.page === 'blog' ? route.slug : null}
            onNavigate={handleNavigate}
          />
        )
      case 'contact':
        return <ContactPage copied={copied} onCopyEmail={handleCopyEmail} />
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-neutral-50 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      {/* Persistent Left Sidebar (Revealed when zoomed into a section) */}
      <Sidebar
        route={route}
        viewMode={viewMode}
        onNavigate={handleNavigate}
        onZoomOut={handleZoomOut}
        resolvedTheme={resolvedTheme}
        preference={preference}
        onToggleTheme={toggleTheme}
        onResetSystem={() => setPreference('system')}
        onOpenPalette={() => setPaletteOpen(true)}
      />

      {/* Persistent Canvas Identity Header (Shown on desktop in canvas mode) */}
      {viewMode === 'canvas' && (
        <CanvasIdentityHeader
          resolvedTheme={resolvedTheme}
          onToggleTheme={toggleTheme}
          onOpenPalette={() => setPaletteOpen(true)}
        />
      )}

      {/* Mobile-optimized Vertical Pipeline Flow (Shown on small screens in canvas mode) */}
      {isMobile && viewMode === 'canvas' ? (
        <MobilePipelineOverview onSelectNode={handleNavigate} />
      ) : (
        /* The Spatial 2D Pipeline Node Canvas Camera Wrapper */
        <div
          className="spatial-canvas-camera bg-blueprint-grid"
          style={{
            width: '560vw',
            height: '250vh',
            transform: cameraTransform,
          }}
        >
          {/* Animated Connecting Vector Edges and Directional Arrows */}
          <PipelineEdges
            windowWidth={windowSize.width}
            windowHeight={windowSize.height}
          />

          {/* The 7 Non-Uniformly Scattered Pipeline Section Containers */}
          {CANVAS_NODES.map((node, index) => {
            const isActive = activeIndex === index && viewMode === 'section'
            const isAdjacent =
              Math.abs(activeIndex - index) <= 1 || viewMode === 'canvas'

            return (
              <div
                key={node.id}
                className="canvas-node-container"
                style={{
                  left: `${node.x}vw`,
                  top: `${node.y}vh`,
                }}
              >
                <div
                  ref={(el) => {
                    sectionRefs.current[index] = el
                  }}
                  tabIndex={isActive ? 0 : -1}
                  aria-hidden={!isActive && viewMode === 'section'}
                  className={`relative h-screen w-screen min-w-[100vw] shrink-0 md:pl-60 lg:pl-64 pt-14 md:pt-0 flex flex-col justify-between outline-none transition-shadow duration-300 @container ${
                    viewMode === 'canvas'
                      ? 'overflow-hidden rounded-3xl border-2 border-neutral-300/80 bg-neutral-50/90 shadow-2xl backdrop-blur-sm dark:border-neutral-800/80 dark:bg-neutral-950/90'
                      : 'overflow-y-auto overflow-x-hidden'
                  } ${isAdjacent ? '' : 'is-dormant'}`}
                >
                  {/* Pipeline Stage Header Banner on each node container */}
                  <div className="flex items-center justify-between border-b border-neutral-200/80 bg-neutral-100/90 px-6 py-3 font-mono text-xs backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-900/90">
                    <div className="flex items-center gap-2.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                        {node.stage}
                      </span>
                      <span className="text-neutral-400 dark:text-neutral-600">
                        //
                      </span>
                      <span className="text-neutral-600 dark:text-neutral-400">
                        {node.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="rounded bg-neutral-200/80 px-2 py-0.5 text-[10px] font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                        {node.tag}
                      </span>
                      <span className="rounded border border-neutral-300 px-2 py-0.5 text-[10px] uppercase text-neutral-600 dark:border-neutral-700 dark:text-neutral-400">
                        {node.status}
                      </span>
                    </div>
                  </div>

                  {/* Section Page Content */}
                  <div className="flex-1">
                    {renderSectionContent(node)}
                  </div>

                  <Footer />

                  {/* Clickable Overlay in Canvas Overview Mode to Prevent Accidental Inner Clicks */}
                  {viewMode === 'canvas' && (
                    <button
                      type="button"
                      onClick={() => handleNavigate(node.path)}
                      className="group absolute inset-0 z-30 flex cursor-pointer flex-col items-end justify-end p-8 outline-none"
                      aria-label={`Zoom into ${node.title}`}
                    >
                      <div className="absolute inset-0 rounded-3xl border-4 border-transparent transition-all duration-300 group-hover:border-neutral-950/70 group-hover:bg-neutral-950/5 dark:group-hover:border-neutral-100/70 dark:group-hover:bg-neutral-50/5" />
                      <div className="relative z-40 rounded-xl border border-neutral-950 bg-neutral-950 px-4 py-2 font-mono text-xs font-semibold text-neutral-50 shadow-2xl transition-all group-hover:scale-105 dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-950">
                        Click to Zoom // {node.code}
                      </div>
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Command Palette */}
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNavigate={handleNavigate}
        onSelectTheme={setPreference}
        onCopyEmail={handleCopyEmail}
      />
    </div>
  )
}

export default App
