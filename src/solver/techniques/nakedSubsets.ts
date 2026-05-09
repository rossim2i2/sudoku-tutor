import { combinations } from '../combinations'
import { formatCell } from '../grid'
import { allHouses, houseCells, houseLabel } from '../houses'
import type { CandidateMap, CellIndex, Digit, HintStep } from '../types'

export const findNakedTriples = (candidates: CandidateMap): HintStep[] => {
  const steps: HintStep[] = []

  for (const house of allHouses()) {
    const unsolvedCells = houseCells(house).filter((cell) => {
      const size = candidates.get(cell)?.size ?? 0
      return size >= 2 && size <= 3
    })

    for (const subsetCells of combinations(unsolvedCells, 3)) {
      const subsetDigits = unionCandidates(candidates, subsetCells)
      if (subsetDigits.size !== 3) continue

      const eliminations = houseCells(house)
        .filter((cell) => !subsetCells.includes(cell))
        .flatMap((cell) => [...subsetDigits]
          .filter((digit) => candidates.get(cell)?.has(digit))
          .map((digit) => ({ cell, digit })))

      if (eliminations.length === 0) continue

      const key = [...subsetDigits].sort().join('')
      steps.push({
        id: `naked-triple-${house.type}-${house.index}-${key}-${subsetCells.join('-')}`,
        type: 'elimination',
        technique: 'Naked triple',
        difficulty: 'intermediate',
        targetCells: [...new Set(eliminations.map((item) => item.cell))],
        supportCells: subsetCells,
        houses: [house],
        eliminateCandidates: eliminations,
        nudge: `${subsetCells.map(formatCell).join(', ')} form a naked triple in ${houseLabel(house)}.`,
        reasoning: [
          `The three cells ${subsetCells.map(formatCell).join(', ')} collectively contain only candidates ${key}.`,
          `Because those three cells are all in ${houseLabel(house)}, those three digits must occupy those three cells in some order.`,
          `No other cell in ${houseLabel(house)} can use ${[...subsetDigits].sort().join(', ')}.`,
        ],
        reveal: `Remove ${eliminations.map((item) => `${item.digit} from ${formatCell(item.cell)}`).join('; ')}.`,
        sortOrder: 45,
      })
    }
  }

  return dedupeSteps(steps)
}

const unionCandidates = (candidates: CandidateMap, cells: CellIndex[]): Set<Digit> => {
  const digits = new Set<Digit>()
  for (const cell of cells) {
    for (const digit of candidates.get(cell) ?? []) digits.add(digit)
  }
  return digits
}

const dedupeSteps = (steps: HintStep[]): HintStep[] => {
  const seen = new Set<string>()
  return steps.filter((step) => {
    if (seen.has(step.id)) return false
    seen.add(step.id)
    return true
  })
}
