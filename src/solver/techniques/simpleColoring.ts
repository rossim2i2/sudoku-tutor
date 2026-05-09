import { formatCell } from '../grid'
import { peersOf } from '../houses'
import { findStrongLinks, type StrongLink } from '../strongLinks'
import type { CandidateMap, CellIndex, Digit, HintStep } from '../types'

export const findSimpleColorings = (candidates: CandidateMap): HintStep[] => {
  const steps: HintStep[] = []
  const links = findStrongLinks(candidates)

  // Group links by digit
  const byDigit = new Map<Digit, StrongLink[]>()
  for (const link of links) {
    const existing = byDigit.get(link.digit) ?? []
    existing.push(link)
    byDigit.set(link.digit, existing)
  }

  for (const [digit, digitLinks] of byDigit) {
    // Build adjacency graph: cell → set of cells connected by strong links
    const adj = new Map<CellIndex, Set<CellIndex>>()
    for (const link of digitLinks) {
      const [a, b] = link.cells
      if (!adj.has(a)) adj.set(a, new Set())
      if (!adj.has(b)) adj.set(b, new Set())
      adj.get(a)!.add(b)
      adj.get(b)!.add(a)
    }

    // Find connected components and assign alternating colors
    const color = new Map<CellIndex, 0 | 1>()
    const visited = new Set<CellIndex>()

    for (const start of adj.keys()) {
      if (visited.has(start)) continue

      // BFS to assign colors
      const queue: CellIndex[] = [start]
      color.set(start, 0)
      visited.add(start)

      while (queue.length > 0) {
        const current = queue.shift()!
        const currentColor = color.get(current)!
        const neighbors = adj.get(current) ?? new Set()

        for (const neighbor of neighbors) {
          if (visited.has(neighbor)) continue
          color.set(neighbor, currentColor === 0 ? 1 : 0)
          visited.add(neighbor)
          queue.push(neighbor)
        }
      }

      // Check for same-color conflicts
      const color0Cells = [...color.entries()].filter(([, c]) => c === 0).map(([cell]) => cell)
      const color1Cells = [...color.entries()].filter(([, c]) => c === 1).map(([cell]) => cell)

      // Same-color conflict: two cells of the same color see each other
      for (let i = 0; i < color0Cells.length; i += 1) {
        for (let j = i + 1; j < color0Cells.length; j += 1) {
          const a = color0Cells[i]
          const b = color0Cells[j]
          if (peersOf(a).has(b)) {
            // Color 0 is invalid — remove digit from all color-0 cells
            const eliminations = color0Cells
              .filter((cell) => candidates.get(cell)?.has(digit))
              .map((cell) => ({ cell, digit }))
            if (eliminations.length > 0) {
              steps.push(makeColoringStep(digit, [...color.entries()], color0Cells, eliminations, 'same-color'))
            }
            // Only report one conflict per component
            break
          }
        }
      }

      for (let i = 0; i < color1Cells.length; i += 1) {
        for (let j = i + 1; j < color1Cells.length; j += 1) {
          const a = color1Cells[i]
          const b = color1Cells[j]
          if (peersOf(a).has(b)) {
            const eliminations = color1Cells
              .filter((cell) => candidates.get(cell)?.has(digit))
              .map((cell) => ({ cell, digit }))
            if (eliminations.length > 0) {
              steps.push(makeColoringStep(digit, [...color.entries()], color1Cells, eliminations, 'same-color'))
            }
            break
          }
        }
      }

      // Both-colors conflict: a cell outside the chain sees both a color-0 and color-1 cell
      const allChainCells = new Set([...color0Cells, ...color1Cells])
      for (let cell = 0; cell < 81; cell += 1) {
        if (allChainCells.has(cell)) continue
        if (!candidates.get(cell)?.has(digit)) continue

        const cellPeers = peersOf(cell)
        const seesColor0 = color0Cells.some((c) => cellPeers.has(c))
        const seesColor1 = color1Cells.some((c) => cellPeers.has(c))

        if (seesColor0 && seesColor1) {
          steps.push(makeColoringStep(digit, [...color.entries()], [cell], [{ cell, digit }], 'both-colors'))
        }
      }
    }
  }

  return dedupeSteps(steps)
}

const makeColoringStep = (
  digit: Digit,
  chain: Array<[CellIndex, 0 | 1]>,
  targetCells: CellIndex[],
  eliminations: Array<{ cell: CellIndex; digit: Digit }>,
  conflictType: 'same-color' | 'both-colors',
): HintStep => {
  const chainCells = chain.map(([cell]) => cell)
  const id = `simple-coloring-${digit}-${conflictType}-${targetCells.join('-')}`

  return {
    id,
    type: 'elimination',
    technique: 'Simple Coloring',
    difficulty: 'advanced',
    targetCells,
    supportCells: chainCells,
    houses: [],
    eliminateCandidates: eliminations,
    nudge: `Candidate ${digit} has a coloring chain with a ${conflictType === 'same-color' ? 'same-color' : 'both-colors'} conflict.`,
    reasoning: conflictType === 'same-color'
      ? [
          `Follow strong links on candidate ${digit} to build a chain of alternating colors.`,
          `Two cells of the same color see each other, which is impossible.`,
          `That color is invalid — remove ${digit} from all same-color cells.`,
        ]
      : [
          `Follow strong links on candidate ${digit} to build a chain of alternating colors.`,
          `${formatCell(targetCells[0])} sees cells of both colors in the chain.`,
          `One color must be true, so ${digit} can be removed from ${formatCell(targetCells[0])}.`,
        ],
    reveal: `Remove ${digit} from ${eliminations.map((e) => formatCell(e.cell)).join(', ')}.`,
    sortOrder: 86,
  }
}

const dedupeSteps = (steps: HintStep[]): HintStep[] => {
  const seen = new Set<string>()
  return steps.filter((step) => {
    if (seen.has(step.id)) return false
    seen.add(step.id)
    return true
  })
}
