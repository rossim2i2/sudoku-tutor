import { formatCell, boxOf, rowOf, columnOf } from '../grid'
import { boxCells, columnCells, houseLabel, rowCells } from '../houses'
import type { CandidateMap, CellIndex, Digit, HintStep } from '../types'
import { DIGITS } from '../types'

const sameRow = (cells: CellIndex[]) => cells.every((cell) => rowOf(cell) === rowOf(cells[0]))
const sameColumn = (cells: CellIndex[]) => cells.every((cell) => columnOf(cell) === columnOf(cells[0]))

export const findLockedCandidates = (candidates: CandidateMap): HintStep[] => {
  const steps: HintStep[] = []

  steps.push(...findPointingCandidates(candidates))
  steps.push(...findClaimingCandidates(candidates))

  return steps
}

const findPointingCandidates = (candidates: CandidateMap): HintStep[] => {
  const steps: HintStep[] = []

  for (let box = 0; box < 9; box += 1) {
    const cells = boxCells(box)
    for (const digit of DIGITS) {
      const digitCells = cells.filter((cell) => candidates.get(cell)?.has(digit))
      if (digitCells.length < 2) continue

      if (sameRow(digitCells)) {
        const row = rowOf(digitCells[0])
        const eliminations = rowCells(row)
          .filter((cell) => boxOf(cell) !== box && candidates.get(cell)?.has(digit))
          .map((cell) => ({ cell, digit }))

        if (eliminations.length > 0) {
          steps.push(makeLockedStep('Pointing candidates', digit, digitCells, eliminations, { type: 'box', index: box }, { type: 'row', index: row }, 30))
        }
      }

      if (sameColumn(digitCells)) {
        const column = columnOf(digitCells[0])
        const eliminations = columnCells(column)
          .filter((cell) => boxOf(cell) !== box && candidates.get(cell)?.has(digit))
          .map((cell) => ({ cell, digit }))

        if (eliminations.length > 0) {
          steps.push(makeLockedStep('Pointing candidates', digit, digitCells, eliminations, { type: 'box', index: box }, { type: 'column', index: column }, 30))
        }
      }
    }
  }

  return steps
}

const findClaimingCandidates = (candidates: CandidateMap): HintStep[] => {
  const steps: HintStep[] = []

  for (let row = 0; row < 9; row += 1) {
    for (const digit of DIGITS) {
      const digitCells = rowCells(row).filter((cell) => candidates.get(cell)?.has(digit))
      if (digitCells.length < 2) continue
      const box = boxOf(digitCells[0])
      if (!digitCells.every((cell) => boxOf(cell) === box)) continue

      const eliminations = boxCells(box)
        .filter((cell) => rowOf(cell) !== row && candidates.get(cell)?.has(digit))
        .map((cell) => ({ cell, digit }))

      if (eliminations.length > 0) {
        steps.push(makeLockedStep('Box-line reduction', digit, digitCells, eliminations, { type: 'row', index: row }, { type: 'box', index: box }, 35))
      }
    }
  }

  for (let column = 0; column < 9; column += 1) {
    for (const digit of DIGITS) {
      const digitCells = columnCells(column).filter((cell) => candidates.get(cell)?.has(digit))
      if (digitCells.length < 2) continue
      const box = boxOf(digitCells[0])
      if (!digitCells.every((cell) => boxOf(cell) === box)) continue

      const eliminations = boxCells(box)
        .filter((cell) => columnOf(cell) !== column && candidates.get(cell)?.has(digit))
        .map((cell) => ({ cell, digit }))

      if (eliminations.length > 0) {
        steps.push(makeLockedStep('Box-line reduction', digit, digitCells, eliminations, { type: 'column', index: column }, { type: 'box', index: box }, 35))
      }
    }
  }

  return steps
}

const makeLockedStep = (
  technique: string,
  digit: Digit,
  supportCells: CellIndex[],
  eliminations: Array<{ cell: CellIndex; digit: Digit }>,
  sourceHouse: { type: 'row' | 'column' | 'box'; index: number },
  targetHouse: { type: 'row' | 'column' | 'box'; index: number },
  sortOrder: number,
): HintStep => ({
  id: `${technique}-${digit}-${sourceHouse.type}-${sourceHouse.index}-${targetHouse.type}-${targetHouse.index}-${eliminations.map((item) => item.cell).join('-')}`,
  type: 'elimination',
  technique,
  difficulty: 'intermediate',
  targetCells: eliminations.map((item) => item.cell),
  supportCells,
  houses: [sourceHouse, targetHouse],
  eliminateCandidates: eliminations,
  nudge: `Candidate ${digit} is locked between ${houseLabel(sourceHouse)} and ${houseLabel(targetHouse)}.`,
  reasoning: [
    `In ${houseLabel(sourceHouse)}, candidate ${digit} can only appear in ${supportCells.map(formatCell).join(', ')}.`,
    `Those cells all sit inside ${houseLabel(targetHouse)}, so ${digit} must land there within that intersection.`,
    `That means ${digit} cannot appear elsewhere in ${houseLabel(targetHouse)}.`,
  ],
  reveal: `Remove ${digit} from ${eliminations.map((item) => formatCell(item.cell)).join(', ')}.`,
  sortOrder,
})
