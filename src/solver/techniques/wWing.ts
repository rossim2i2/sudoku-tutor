import { formatCell } from '../grid'
import { peersOf } from '../houses'
import { findStrongLinks } from '../strongLinks'
import type { CandidateMap, CellIndex, Digit, HintStep } from '../types'

export const findWWings = (candidates: CandidateMap): HintStep[] => {
  const steps: HintStep[] = []
  const links = findStrongLinks(candidates)

  // Find all bivalue cells
  const biValueCells: CellIndex[] = []
  for (const [cell, digits] of candidates.entries()) {
    if (digits.size === 2) biValueCells.push(cell)
  }

  // Group strong links by digit for quick lookup
  const linksByDigit = new Map<Digit, Array<{ cells: [CellIndex, CellIndex]; house: { type: string; index: number } }>>()
  for (const link of links) {
    const existing = linksByDigit.get(link.digit) ?? []
    existing.push(link)
    linksByDigit.set(link.digit, existing)
  }

  // For each pair of bivalue cells sharing a candidate
  for (let i = 0; i < biValueCells.length; i += 1) {
    for (let j = i + 1; j < biValueCells.length; j += 1) {
      const cellA = biValueCells[i]
      const cellB = biValueCells[j]
      const digitsA = candidates.get(cellA)!
      const digitsB = candidates.get(cellB)!

      // Find shared candidate(s)
      const shared = [...digitsA].filter((d) => digitsB.has(d))
      if (shared.length === 0) continue

      for (const x of shared) {
        // Find strong links on X where cellA sees one end and cellB sees the other
        const xLinks = linksByDigit.get(x) ?? []

        for (const link of xLinks) {
          const [end1, end2] = link.cells

          // cellA must see one end, cellB must see the other (or vice versa)
          const aSees1 = peersOf(cellA).has(end1)
          const aSees2 = peersOf(cellA).has(end2)
          const bSees1 = peersOf(cellB).has(end1)
          const bSees2 = peersOf(cellB).has(end2)

          if (!((aSees1 && bSees2) || (aSees2 && bSees1))) continue

          // Find cells that see both cellA and cellB and contain X
          const peersA = peersOf(cellA)
          const peersB = peersOf(cellB)

          const eliminations = [...peersA]
            .filter((cell) => cell !== cellA && cell !== cellB && cell !== end1 && cell !== end2
              && peersB.has(cell)
              && candidates.get(cell)?.has(x))
            .map((cell) => ({ cell, digit: x }))

          if (eliminations.length === 0) continue

          const otherA = [...digitsA].find((d) => d !== x)!

          steps.push({
            id: `w-wing-${x}-${cellA}-${cellB}-${end1}-${end2}`,
            type: 'elimination',
            technique: 'W-Wing',
            difficulty: 'advanced',
            targetCells: eliminations.map((e) => e.cell),
            supportCells: [cellA, cellB, end1, end2],
            houses: [{ type: link.house.type as 'row' | 'column' | 'box', index: link.house.index }],
            eliminateCandidates: eliminations,
            nudge: `Bivalue cells ${formatCell(cellA)} and ${formatCell(cellB)} share candidate ${x}, connected by a strong link.`,
            reasoning: [
              `${formatCell(cellA)} contains candidates {${[...digitsA].join('')}} and ${formatCell(cellB)} contains {${[...digitsB].join('')}}.`,
              `Both share candidate ${x}. A strong link on ${x} exists between ${formatCell(end1)} and ${formatCell(end2)}.`,
              `One end of the strong link must be ${x}. If ${formatCell(cellA)} is not ${x} (it is ${otherA}), then the strong link forces ${x} at the end ${formatCell(cellA)} sees, which forces ${formatCell(cellB)} to be ${x}.`,
              `Either way, one of the two bivalue cells must be ${x}. Any cell seeing both cannot contain ${x}.`,
            ],
            reveal: `Remove ${x} from ${eliminations.map((e) => formatCell(e.cell)).join(', ')}.`,
            sortOrder: 88,
          })
        }
      }
    }
  }

  return dedupeSteps(steps)
}

const dedupeSteps = (steps: HintStep[]): HintStep[] => {
  const seen = new Set<string>()
  return steps.filter((step) => {
    if (seen.has(step.id)) return false
    seen.add(step.id)
    return true
  })
}
