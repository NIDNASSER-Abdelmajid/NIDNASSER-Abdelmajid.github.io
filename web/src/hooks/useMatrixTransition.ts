import { useCallback, useRef, useState } from 'react'
import {
  playMatrixEntry,
  playMatrixExit,
  type TransitionCanceler,
} from '../utils/matrixScramble'

export type TransitionPhase = 'idle' | 'exiting' | 'entering'

interface UseMatrixTransitionOptions {
  getSectionElement: (index: number) => HTMLElement | null
  getActiveIndex: () => number
  getTargetIndex: (path: string) => number
  onRouteSwitch: (targetPath: string) => void
}

export function useMatrixTransition({
  getSectionElement,
  getActiveIndex,
  getTargetIndex,
  onRouteSwitch,
}: UseMatrixTransitionOptions) {
  const [phase, setPhase] = useState<TransitionPhase>('idle')
  const cancelerRef = useRef<TransitionCanceler | null>(null)
  const isTransitioningRef = useRef(false)

  const startTransition = useCallback(
    (targetPath: string) => {
      if (isTransitioningRef.current) return

      const currentIndex = getActiveIndex()
      const targetIndex = getTargetIndex(targetPath)

      // If targeting the same section, just switch or scroll to top
      if (currentIndex === targetIndex) {
        onRouteSwitch(targetPath)
        return
      }

      // Respect prefers-reduced-motion: simple fast crossfade
      const prefersReduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (prefersReduced) {
        isTransitioningRef.current = true
        setPhase('exiting')
        window.setTimeout(() => {
          onRouteSwitch(targetPath)
          setPhase('entering')
          window.setTimeout(() => {
            setPhase('idle')
            isTransitioningRef.current = false
          }, 140)
        }, 140)
        return
      }

      const currentEl = getSectionElement(currentIndex)
      if (!currentEl) {
        onRouteSwitch(targetPath)
        return
      }

      isTransitioningRef.current = true
      setPhase('exiting')

      // Exit Phase: Scramble & Delete characters (260ms)
      cancelerRef.current = playMatrixExit(currentEl, 260, () => {
        // Route Switch: activate target section
        onRouteSwitch(targetPath)
        setPhase('entering')

        // Allow DOM to settle for target section, then begin Entry Phase
        requestAnimationFrame(() => {
          const nextEl = getSectionElement(targetIndex)
          if (!nextEl) {
            setPhase('idle')
            isTransitioningRef.current = false
            return
          }

          // Entry Phase: Types in and decodes characters from Matrix symbols (280ms)
          cancelerRef.current = playMatrixEntry(nextEl, 280, () => {
            setPhase('idle')
            isTransitioningRef.current = false
          })
        })
      })
    },
    [getActiveIndex, getSectionElement, getTargetIndex, onRouteSwitch]
  )

  return {
    phase,
    isTransitioning: phase !== 'idle',
    startTransition,
  }
}
