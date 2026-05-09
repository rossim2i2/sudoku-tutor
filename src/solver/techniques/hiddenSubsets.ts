import { candidatesText } from '../candidates'
import { combinations } from '../combinations'
import { formatCell } from '../grid'
import { allHouses, houseCells, houseLabel } from '../houses'
import type { CandidateMap, CellIndex, Digit, HintStep } from '../types'
import { DIGITS } from '../types'

export const findHiddenPairs = (candidates: CandidateMap): HintStep[] => findHiddenSubsets(candidates, 2, 'Hidden pair', 50)
export const findHiddenTriples = (candidates: CandidateMap): HintStep[] => findHiddenSubsets(candidates, 3, 'Hidden triple', 55)
export const findHiddenQuads = (candidates: CandidateMap): HintStep[] => findHiddenSubsets(candidates, 4, 'Hidden quad', 57)

const findHiddenSubsets = (candidates: CandidateMap, size: 2 | 3 | 4, technique: string, sortOrder: number): HintStep[] => {
  const steps: HintStep[] = []

  for (const house of allHouses()) {
    const cells = houseCells(house)
    const digitCells = new Map<Digit, CellIndex[]>()

    for (const digit of DIGITS) {
      const possibleCells = cells.filter((cell) => candidates.get(cell)?.has(digit))
      if (possibleCells.length >= 2 && possibleCells.length <= size) {
        digitCells.set(digit, possibleCells)
      }
    }

    for (const digits of combinations([...digitCells.keys()], size)) {
      const subsetCells = new Set<CellIndex>()
      for (const digit of digits) {
        for (const cell of digitCells.get(digit) ?? []) subsetCells.add(cell)
      }

      if (subsetCells.size !== size) continue

      const sortedCells = [...subsetCells].sort((a, b) => a - b)
      const eliminations = sortedCells.flatMap((cell) => [...(candidates.get(cell) ?? [])]
        .filter((digit) => !digits.includes(digit))
        .map((digit) => ({ cell, digit })))

      if (eliminations.length === 0) continue

      const key = digits.sort().join('')
      steps.push({
        id: `${technique}-${house.type}-${house.index}-${key}-${sortedCells.join('-')}`,
        type: 'elimination',
        technique,
        difficulty: 'intermediate',
        targetCells: sortedCells,
        supportCells: sortedCells,
        houses: [house],
        eliminateCandidates: eliminations,
        nudge: `Digits ${key} are hidden in ${sortedCells.map(formatCell).join(', ')} within ${houseLabel(house)}.`,
        reasoning: [
          `In ${houseLabel(house)}, digits ${key} can only appear in ${sortedCells.map(formatCell).join(', ')}.`,
          `Those ${size} digits must occupy those ${size} cells in some order.`,
          `Therefore, other candidates can be removed from those cells: ${sortedCells.map((cell) => `${formatCell(cell)} (${candidatesText(candidates.get(cell) ?? new Set<Digit>())})`).join(', ')}.`,
        ],
        reveal: `Remove ${eliminations.map((item) => `${item.digit} from ${formatCell(item.cell)}`).join('; ')}.`,
        sortOrder,
      })
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
