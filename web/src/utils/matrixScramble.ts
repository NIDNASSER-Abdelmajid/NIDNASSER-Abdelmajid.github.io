const MATRIX_CHARS = '0123456789ABCDEF$#_<>[]/*+=~^!?:;{}'

function getRandomChar(): string {
  const idx = Math.floor(Math.random() * MATRIX_CHARS.length)
  return MATRIX_CHARS[idx]
}

interface TextNodeRecord {
  node: Text
  original: string
}

function getTextNodes(root: HTMLElement): TextNodeRecord[] {
  const records: TextNodeRecord[] = []
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement
      if (!parent) return NodeFilter.FILTER_REJECT
      const tag = parent.tagName.toLowerCase()
      if (tag === 'script' || tag === 'style' || tag === 'svg' || tag === 'path') {
        return NodeFilter.FILTER_REJECT
      }
      const val = node.nodeValue?.trim()
      if (!val || val.length === 0) return NodeFilter.FILTER_REJECT
      return NodeFilter.FILTER_ACCEPT
    },
  })

  let currentNode = walker.nextNode()
  while (currentNode) {
    const textNode = currentNode as Text
    const val = textNode.nodeValue || ''
    records.push({
      node: textNode,
      original: val,
    })
    currentNode = walker.nextNode()
  }

  return records
}

export interface TransitionCanceler {
  cancel: () => void
}

/**
 * Exit phase: Rapidly scrambles visible characters into Matrix glyphs,
 * then clears characters from end to beginning using non-breaking spaces
 * to preserve bounding box dimensions and prevent layout reflow.
 */
export function playMatrixExit(
  container: HTMLElement,
  durationMs: number,
  onComplete: () => void
): TransitionCanceler {
  const records = getTextNodes(container)
  if (records.length === 0) {
    onComplete()
    return { cancel: () => {} }
  }

  const startTime = performance.now()
  let animationFrameId: number | null = null
  let isCancelled = false

  const frame = (now: number) => {
    if (isCancelled) return

    const elapsed = now - startTime
    const progress = Math.min(1, elapsed / durationMs)

    for (let i = 0; i < records.length; i++) {
      const rec = records[i]
      const len = rec.original.length
      if (len === 0) continue

      if (progress < 0.35) {
        // Scramble phase: characters rapidly randomize
        let scrambled = ''
        for (let j = 0; j < len; j++) {
          const ch = rec.original[j]
          scrambled += ch === ' ' ? ' ' : getRandomChar()
        }
        rec.node.nodeValue = scrambled
      } else {
        // Deletion phase: characters delete from end to start, replaced with non-breaking space
        const deleteProgress = (progress - 0.35) / 0.65
        const remainingChars = Math.max(0, Math.floor(len * (1 - deleteProgress)))
        let scrambled = ''
        for (let j = 0; j < len; j++) {
          if (j < remainingChars) {
            const ch = rec.original[j]
            scrambled += ch === ' ' ? ' ' : getRandomChar()
          } else {
            scrambled += '\u00A0'
          }
        }
        rec.node.nodeValue = scrambled
      }
    }

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(frame)
    } else {
      // Restore original text content before calling onComplete
      for (let i = 0; i < records.length; i++) {
        records[i].node.nodeValue = records[i].original
      }
      onComplete()
    }
  }

  animationFrameId = requestAnimationFrame(frame)

  return {
    cancel: () => {
      isCancelled = true
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
      }
      for (let i = 0; i < records.length; i++) {
        records[i].node.nodeValue = records[i].original
      }
    },
  }
}

/**
 * Entry phase: Reconstructs text character-by-character from scrambled Matrix glyphs
 * into readable text. Starts with scrambled glyphs of exact target length so dimensions
 * are stable throughout.
 */
export function playMatrixEntry(
  container: HTMLElement,
  durationMs: number,
  onComplete?: () => void
): TransitionCanceler {
  const records = getTextNodes(container)
  if (records.length === 0) {
    if (onComplete) onComplete()
    return { cancel: () => {} }
  }

  const startTime = performance.now()
  let animationFrameId: number | null = null
  let isCancelled = false

  const frame = (now: number) => {
    if (isCancelled) return

    const elapsed = now - startTime
    const progress = Math.min(1, elapsed / durationMs)

    for (let i = 0; i < records.length; i++) {
      const rec = records[i]
      const len = rec.original.length
      if (len === 0) continue

      // Resolved characters from left to right
      const resolvedCount = Math.floor(len * progress)
      let current = ''

      for (let j = 0; j < len; j++) {
        if (j < resolvedCount) {
          current += rec.original[j]
        } else {
          const ch = rec.original[j]
          current += ch === ' ' ? ' ' : getRandomChar()
        }
      }

      rec.node.nodeValue = current
    }

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(frame)
    } else {
      // Ensure exact original strings are restored
      for (let i = 0; i < records.length; i++) {
        records[i].node.nodeValue = records[i].original
      }
      if (onComplete) onComplete()
    }
  }

  animationFrameId = requestAnimationFrame(frame)

  return {
    cancel: () => {
      isCancelled = true
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
      }
      for (let i = 0; i < records.length; i++) {
        records[i].node.nodeValue = records[i].original
      }
    },
  }
}
