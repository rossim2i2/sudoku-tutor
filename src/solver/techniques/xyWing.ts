import { formatCell, boxOf, columnOf, rowOf } from '../grid'
import { peersOf } from '../houses'
import type { CandidateMap, CellIndex, Digit, HintStep } from '../types'

export const findXYWings = (candidates: CandidateMap): HintStep[] => {
  const steps: HintStep[] = []
  const biValueCells: CellIndex[] = []

  for (const [cell, digits] of candidates.entries()) {
    if (digits.size === 2) biValueCells.push(cell)
  }

  for (const pivot of biValueCells) {
    const [a, b] = [...candidates.get(pivot)!] as [Digit, Digit]
    const pivotPeers = peersOf(pivot)

    const wingCandidates = biValueCells.filter((cell) => cell !== pivot && pivotPeers.has(cell))

    for (let i = 0; i < wingCandidates.length; i += 1) {
      for (let j = i + 1; j < wingCandidates.length; j += 1) {
        const wing1 = wingCandidates[i]
        const wing2 = wingCandidates[j]

        const d1 = candidates.get(wing1)!
        const d2 = candidates.get(wing2)!

        // wing1 must share exactly one candidate with pivot, wing2 the other
        // and both wings share a third candidate C
        let wing1A: Digit | null = null
        let wing2B: Digit | null = null
        let sharedC: Digit | null = null

        // Try pivot sharing A with wing1 and B with wing2
        if (d1.has(a) && d2.has(b)) {
          const c1 = [...d1].find((d) => d !== a)
          const c2 = [...d2].find((d) => d !== b)
          if (c1 !== undefined && c2 !== undefined && c1 === c2) {
            wing1A = a; wing2B = b; sharedC = c1
          }
        }
        // Try pivot sharing B with wing1 and A with wing2
        if (sharedC === null && d1.has(b) && d2.has(a)) {
          const c1 = [...d1].find((d) => d !== b)
          const c2 = [...d2].find((d) => d !== a)
          if (c1 !== undefined && c2 !== undefined && c1 === c2) {
            wing1A = b; wing2B = a; sharedC = c1
          }
        }

        if (sharedC === null) continue

        // Wings must not see each other (otherwise it degenerates)
        // Actually wings CAN see each other; eliminations are valid either way.
        // Find cells that see BOTH wings and contain sharedC
        const wing1Peers = peersOf(wing1)
        const wing2Peers = peersOf(wing2)

        const eliminations = [...wing1Peers]
          .filter((cell) => cell !== pivot && cell !== wing1 && cell !== wing2
            && wing2Peers.has(cell)
            && candidates.get(cell)?.has(sharedC!))
          .map((cell) => ({ cell, digit: sharedC! }))

        if (eliminations.length === 0) continue

        const houses = [
          { type: sharedHouseType(pivot, wing1), index: sharedHouseIndex(pivot, wing1) },
          { type: sharedHouseType(pivot, wing2), index: sharedHouseIndex(pivot, wing2) },
        ].filter((h) => h.type !== null) as Array<{ type: 'row' | 'column' | 'box'; index: number }>

        steps.push({
          id: `xy-wing-${pivot}-${wing1}-${wing2}-${sharedC}`,
          type: 'elimination',
          technique: 'XY-Wing',
          difficulty: 'advanced',
          targetCells: [...new Set(eliminations.map((item) => item.cell))],
          supportCells: [pivot, wing1, wing2],
          houses,
          eliminateCandidates: eliminations,
          nudge: `${formatCell(pivot)} is the pivot of an XY-Wing with wings at ${formatCell(wing1)} and ${formatCell(wing2)}.`,
          reasoning: [
            `Pivot ${formatCell(pivot)} contains candidates ${[...candidates.get(pivot)!].join('')}.`,
            `Wing ${formatCell(wing1)} shares ${wing1A} with the pivot and also contains ${sharedC}.`,
            `Wing ${formatCell(wing2)} shares ${wing2B} with the pivot and also contains ${sharedC}.`,
            `One of the two wings must contain ${sharedC}. Any cell that sees both wings cannot contain ${sharedC}.`,
          ],
          reveal: `Remove ${sharedC} from ${eliminations.map((item) => formatCell(item.cell)).join(', ')}.`,
          sortOrder: 85,
        })
      }
    }
  }

  return dedupeSteps(steps)
}

const sharedHouseType = (a: CellIndex, b: CellIndex): 'row' | 'column' | 'box' | null => {
  if (rowOf(a) === rowOf(b)) return 'row'
  if (columnOf(a) === columnOf(b)) return 'column'
  if (boxOf(a) === boxOf(b)) return 'box'
  return null
}

const sharedHouseIndex = (a: CellIndex, b: CellIndex): number => {
  if (rowOf(a) === rowOf(b)) return rowOf(a)
  if (columnOf(a) === columnOf(b)) return columnOf(a)
  return boxOf(a)
}

const dedupeSteps = (steps: HintStep[]): HintStep[] => {
  const seen = new Set<string>()
  return steps.filter((step) => {
    if (seen.has(step.id)) return false
    seen.add(step.id)
    return true
  })
}
