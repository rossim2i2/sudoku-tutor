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
      const componentCells: CellIndex[] = []
      color.set(start, 0)
      visited.add(start)

      while (queue.length > 0) {
        const current = queue.shift()!
        componentCells.push(current)
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
      const color0Cells = componentCells.filter((cell) => color.get(cell) === 0).sort((a, b) => a - b)
      const color1Cells = componentCells.filter((cell) => color.get(cell) === 1).sort((a, b) => a - b)

      // Same-color conflict: two cells of the same color see each other
      const color0Conflict = findPeerConflict(color0Cells)
      if (color0Conflict) {
        const eliminations = color0Cells
          .filter((cell) => candidates.get(cell)?.has(digit))
          .map((cell) => ({ cell, digit }))
        if (eliminations.length > 0) {
          steps.push(makeColoringStep(digit, color0Cells, color1Cells, color0Cells, eliminations, 'same-color', color0Conflict))
        }
      }

      const color1Conflict = findPeerConflict(color1Cells)
      if (color1Conflict) {
        const eliminations = color1Cells
          .filter((cell) => candidates.get(cell)?.has(digit))
          .map((cell) => ({ cell, digit }))
        if (eliminations.length > 0) {
          steps.push(makeColoringStep(digit, color0Cells, color1Cells, color1Cells, eliminations, 'same-color', color1Conflict))
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
          steps.push(makeColoringStep(
            digit,
            color0Cells,
            color1Cells,
            [cell],
            [{ cell, digit }],
            'both-colors',
            [color0Cells.find((c) => cellPeers.has(c))!, color1Cells.find((c) => cellPeers.has(c))!],
          ))
        }
      }
    }
  }

  return dedupeSteps(steps)
}

const makeColoringStep = (
  digit: Digit,
  color0Cells: CellIndex[],
  color1Cells: CellIndex[],
  targetCells: CellIndex[],
  eliminations: Array<{ cell: CellIndex; digit: Digit }>,
  conflictType: 'same-color' | 'both-colors',
  conflictCells: [CellIndex, CellIndex],
): HintStep => {
  const chainCells = [...color0Cells, ...color1Cells].sort((a, b) => a - b)
  const sortedTargets = [...targetCells].sort((a, b) => a - b)
  const invalidColor = sortedTargets.every((cell) => color0Cells.includes(cell)) ? 'A' : 'B'
  const [conflictA, conflictB] = conflictCells
  const id = `simple-coloring-${digit}-${conflictType}-${sortedTargets.join('-')}`

  return {
    id,
    type: 'elimination',
    technique: 'Simple Coloring',
    difficulty: 'advanced',
    targetCells: sortedTargets,
    supportCells: chainCells,
    houses: [],
    eliminateCandidates: eliminations,
    highlightGroups: [
      { label: `Color A (${digit} chain)`, role: 'color-a', cells: color0Cells },
      { label: `Color B (${digit} chain)`, role: 'color-b', cells: color1Cells },
      { label: `Remove ${digit}`, role: 'remove', cells: sortedTargets },
    ],
    nudge: `Candidate ${digit} has a coloring chain with a ${conflictType === 'same-color' ? 'same-color cells see each other' : 'cell sees both colors'} conflict.`,
    reasoning: conflictType === 'same-color'
      ? [
          `Follow strong links on candidate ${digit} to build a chain of alternating colors.`,
          `Same-color rule: ${formatCell(conflictA)} and ${formatCell(conflictB)} are both color ${invalidColor}, and they see each other.`,
          `That means color ${invalidColor} cannot be the true color for ${digit}.`,
          `Remove ${digit} from every color-${invalidColor} cell in this chain.`,
        ]
      : [
          `Follow strong links on candidate ${digit} to build a chain of alternating colors.`,
          `Both-colors rule: ${formatCell(sortedTargets[0])} sees color A at ${formatCell(conflictA)} and color B at ${formatCell(conflictB)}.`,
          `One of those two colors must be true, so ${formatCell(sortedTargets[0])} cannot contain ${digit}.`,
        ],
    reveal: `Remove ${digit} from ${eliminations.map((e) => formatCell(e.cell)).join(', ')}.`,
    sortOrder: 86,
  }
}

const findPeerConflict = (cells: CellIndex[]): [CellIndex, CellIndex] | null => {
  for (let i = 0; i < cells.length; i += 1) {
    for (let j = i + 1; j < cells.length; j += 1) {
      const a = cells[i]
      const b = cells[j]
      if (peersOf(a).has(b)) return [a, b]
    }
  }
  return null
}

const dedupeSteps = (steps: HintStep[]): HintStep[] => {
  const seen = new Set<string>()
  return steps.filter((step) => {
    if (seen.has(step.id)) return false
    seen.add(step.id)
    return true
  })
}
