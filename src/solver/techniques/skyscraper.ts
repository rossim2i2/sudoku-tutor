import { boxOf, columnOf, formatCell, rowOf } from '../grid'
import { peersOf } from '../houses'
import { findStrongLinks, type StrongLink } from '../strongLinks'
import type { CandidateMap, CellIndex, Digit, HintStep } from '../types'

export const findSkyscrapers = (candidates: CandidateMap): HintStep[] => {
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
    for (let i = 0; i < digitLinks.length; i += 1) {
      for (let j = i + 1; j < digitLinks.length; j += 1) {
        const linkA = digitLinks[i]
        const linkB = digitLinks[j]

        // Both links must be in the same house type (both rows or both columns)
        if (linkA.house.type !== linkB.house.type) continue

        // Try both orientations: A[0] as base with B[0], A[0] with B[1], etc.
        const orientations = [
          { base1: linkA.cells[0], top1: linkA.cells[1], base2: linkB.cells[0], top2: linkB.cells[1] },
          { base1: linkA.cells[0], top1: linkA.cells[1], base2: linkB.cells[1], top2: linkB.cells[0] },
          { base1: linkA.cells[1], top1: linkA.cells[0], base2: linkB.cells[0], top2: linkB.cells[1] },
          { base1: linkA.cells[1], top1: linkA.cells[0], base2: linkB.cells[1], top2: linkB.cells[0] },
        ]

        for (const { base1, top1, base2, top2 } of orientations) {
          // Bases must share a house (the "floor" of the skyscraper)
          if (!peersOf(base1).has(base2)) continue

          // Tops must NOT share a house (otherwise it's a fish pattern)
          if (peersOf(top1).has(top2)) continue

          // Find cells that see both tops and contain the digit
          const top1Peers = peersOf(top1)
          const top2Peers = peersOf(top2)

          const eliminations = [...top1Peers]
            .filter((cell) => cell !== base1 && cell !== base2
              && top2Peers.has(cell)
              && candidates.get(cell)?.has(digit))
            .map((cell) => ({ cell, digit }))

          if (eliminations.length === 0) continue

          steps.push({
            id: `skyscraper-${digit}-${base1}-${top1}-${base2}-${top2}`,
            type: 'elimination',
            technique: 'Skyscraper',
            difficulty: 'advanced',
            targetCells: eliminations.map((e) => e.cell),
            supportCells: [base1, top1, base2, top2],
            houses: [
              linkA.house,
              linkB.house,
              { type: sharedHouseType(base1, base2), index: sharedHouseIndex(base1, base2) },
            ],
            eliminateCandidates: eliminations,
            nudge: `Candidate ${digit} forms a Skyscraper with bases at ${formatCell(base1)} and ${formatCell(base2)}.`,
            reasoning: [
              `Strong link on ${digit}: ${formatCell(base1)} and ${formatCell(top1)} in ${houseName(linkA.house)}.`,
              `Strong link on ${digit}: ${formatCell(base2)} and ${formatCell(top2)} in ${houseName(linkB.house)}.`,
              `Bases ${formatCell(base1)} and ${formatCell(base2)} share a house — one of them must be ${digit}.`,
              `Therefore one of the tops must also be ${digit}. Any cell seeing both tops cannot contain ${digit}.`,
            ],
            reveal: `Remove ${digit} from ${eliminations.map((e) => formatCell(e.cell)).join(', ')}.`,
            sortOrder: 87,
          })
        }
      }
    }
  }

  return dedupeSteps(steps)
}

const sharedHouseType = (a: CellIndex, b: CellIndex): 'row' | 'column' | 'box' => {
  if (rowOf(a) === rowOf(b)) return 'row'
  if (columnOf(a) === columnOf(b)) return 'column'
  return 'box'
}

const sharedHouseIndex = (a: CellIndex, b: CellIndex): number => {
  if (rowOf(a) === rowOf(b)) return rowOf(a)
  if (columnOf(a) === columnOf(b)) return columnOf(a)
  return boxOf(a)
}

const houseName = (house: { type: string; index: number }): string => {
  if (house.type === 'row') return `row ${house.index + 1}`
  if (house.type === 'column') return `column ${house.index + 1}`
  return `box ${house.index + 1}`
}

const dedupeSteps = (steps: HintStep[]): HintStep[] => {
  const seen = new Set<string>()
  return steps.filter((step) => {
    if (seen.has(step.id)) return false
    seen.add(step.id)
    return true
  })
}
