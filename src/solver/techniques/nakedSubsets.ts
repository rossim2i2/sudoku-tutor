import { combinations } from '../combinations'
import { formatCell } from '../grid'
import { allHouses, houseCells, houseLabel } from '../houses'
import type { CandidateMap, CellIndex, Digit, HintStep } from '../types'

export const findNakedTriples = (candidates: CandidateMap): HintStep[] => findNakedSubsets(candidates, 3, 'Naked triple', 45)
export const findNakedQuads = (candidates: CandidateMap): HintStep[] => findNakedSubsets(candidates, 4, 'Naked quad', 47)

const findNakedSubsets = (candidates: CandidateMap, size: number, technique: string, sortOrder: number): HintStep[] => {
  const steps: HintStep[] = []

  for (const house of allHouses()) {
    const unsolvedCells = houseCells(house).filter((cell) => {
      const count = candidates.get(cell)?.size ?? 0
      return count >= 2 && count <= size
    })

    for (const subsetCells of combinations(unsolvedCells, size)) {
      const subsetDigits = unionCandidates(candidates, subsetCells)
      if (subsetDigits.size !== size) continue

      const eliminations = houseCells(house)
        .filter((cell) => !subsetCells.includes(cell))
        .flatMap((cell) => [...subsetDigits]
          .filter((digit) => candidates.get(cell)?.has(digit))
          .map((digit) => ({ cell, digit })))

      if (eliminations.length === 0) continue

      const key = [...subsetDigits].sort().join('')
      steps.push({
        id: `${technique.toLowerCase().replace(' ', '-')}-${house.type}-${house.index}-${key}-${subsetCells.join('-')}`,
        type: 'elimination',
        technique,
        difficulty: 'intermediate',
        targetCells: [...new Set(eliminations.map((item) => item.cell))],
        supportCells: subsetCells,
        houses: [house],
        eliminateCandidates: eliminations,
        nudge: `${subsetCells.map(formatCell).join(', ')} form a ${technique.toLowerCase()} in ${houseLabel(house)}.`,
        reasoning: [
          `The ${size} cells ${subsetCells.map(formatCell).join(', ')} collectively contain only candidates ${key}.`,
          `Because those ${size} cells are all in ${houseLabel(house)}, those digits must occupy those cells in some order.`,
          `No other cell in ${houseLabel(house)} can use ${[...subsetDigits].sort().join(', ')}.`,
        ],
        reveal: `Remove ${eliminations.map((item) => `${item.digit} from ${formatCell(item.cell)}`).join('; ')}.`,
        sortOrder,
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
