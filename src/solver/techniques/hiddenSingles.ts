import { candidatesText } from '../candidates'
import { formatCell } from '../grid'
import { allHouses, houseCells, houseLabel } from '../houses'
import type { CandidateMap, Digit, Grid, HintStep } from '../types'
import { DIGITS } from '../types'

export const findHiddenSingles = (grid: Grid, candidates: CandidateMap): HintStep[] => {
  const steps: HintStep[] = []

  for (const house of allHouses()) {
    const cells = houseCells(house)
    for (const digit of DIGITS) {
      if (cells.some((cell) => grid[cell].value === digit)) continue

      const possibleCells = cells.filter((cell) => candidates.get(cell)?.has(digit))
      if (possibleCells.length !== 1) continue

      const target = possibleCells[0]
      const supportCells = cells.filter((cell) => cell !== target)
      steps.push({
        id: `hidden-single-${house.type}-${house.index}-${digit}-${target}`,
        type: 'placement',
        technique: 'Hidden single',
        difficulty: 'basic',
        targetCells: [target],
        supportCells,
        houses: [house],
        eliminateCandidates: [],
        nudge: `Look for where ${digit} can go in ${houseLabel(house)}.`,
        reasoning: [
          `${houseLabel(house)} still needs a ${digit}.`,
          `${formatCell(target)} is the only unsolved cell in that ${house.type} whose candidates include ${digit}.`,
          `Its current candidates are ${candidatesText(candidates.get(target) ?? new Set<Digit>())}.`,
        ],
        reveal: `${formatCell(target)} = ${digit}`,
        sortOrder: 20,
      })
    }
  }

  return steps
}
