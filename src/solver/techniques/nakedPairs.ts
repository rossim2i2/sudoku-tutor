import { candidatesText } from '../candidates'
import { formatCell } from '../grid'
import { allHouses, houseCells, houseLabel } from '../houses'
import type { CandidateMap, CellIndex, Digit, HintStep } from '../types'

export const findNakedPairs = (candidates: CandidateMap): HintStep[] => {
  const steps: HintStep[] = []

  for (const house of allHouses()) {
    const pairGroups = new Map<string, CellIndex[]>()

    for (const cell of houseCells(house)) {
      const digits = candidates.get(cell)
      if (!digits || digits.size !== 2) continue
      const key = candidatesText(digits)
      pairGroups.set(key, [...(pairGroups.get(key) ?? []), cell])
    }

    for (const [key, pairCells] of pairGroups.entries()) {
      if (pairCells.length !== 2) continue
      const pairDigits = [...key].map(Number) as Digit[]
      const eliminations = houseCells(house)
        .filter((cell) => !pairCells.includes(cell))
        .flatMap((cell) => pairDigits
          .filter((digit) => candidates.get(cell)?.has(digit))
          .map((digit) => ({ cell, digit })))

      if (eliminations.length === 0) continue

      steps.push({
        id: `naked-pair-${house.type}-${house.index}-${key}-${pairCells.join('-')}`,
        type: 'elimination',
        technique: 'Naked pair',
        difficulty: 'intermediate',
        targetCells: [...new Set(eliminations.map((item) => item.cell))],
        supportCells: pairCells,
        houses: [house],
        eliminateCandidates: eliminations,
        nudge: `${formatCell(pairCells[0])} and ${formatCell(pairCells[1])} form a naked pair in ${houseLabel(house)}.`,
        reasoning: [
          `${formatCell(pairCells[0])} and ${formatCell(pairCells[1])} each contain only candidates ${key}.`,
          `Because both cells are in ${houseLabel(house)}, those two digits must occupy those two cells in some order.`,
          `No other cell in ${houseLabel(house)} can use ${pairDigits.join(' or ')}.`,
        ],
        reveal: `Remove ${eliminations.map((item) => `${item.digit} from ${formatCell(item.cell)}`).join('; ')}.`,
        sortOrder: 40,
      })
    }
  }

  return steps
}
