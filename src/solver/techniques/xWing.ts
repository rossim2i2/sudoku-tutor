import { formatCell } from '../grid'
import { columnCells, houseLabel, rowCells } from '../houses'
import type { CandidateMap, CellIndex, Digit, HintStep } from '../types'
import { DIGITS } from '../types'

export const findXWings = (candidates: CandidateMap): HintStep[] => [
  ...findRowBasedXWings(candidates),
  ...findColumnBasedXWings(candidates),
]

const findRowBasedXWings = (candidates: CandidateMap): HintStep[] => {
  const steps: HintStep[] = []

  for (const digit of DIGITS) {
    const rowPatterns: Array<{ row: number; cells: CellIndex[]; columns: number[] }> = []

    for (let row = 0; row < 9; row += 1) {
      const cells = rowCells(row).filter((cell) => candidates.get(cell)?.has(digit))
      if (cells.length === 2) {
        rowPatterns.push({ row, cells, columns: cells.map((cell) => cell % 9) })
      }
    }

    for (let first = 0; first < rowPatterns.length; first += 1) {
      for (let second = first + 1; second < rowPatterns.length; second += 1) {
        const a = rowPatterns[first]
        const b = rowPatterns[second]
        if (a.columns.join(',') !== b.columns.join(',')) continue

        const eliminations = a.columns
          .flatMap((column) => columnCells(column))
          .filter((cell) => ![...a.cells, ...b.cells].includes(cell) && candidates.get(cell)?.has(digit))
          .map((cell) => ({ cell, digit }))

        if (eliminations.length === 0) continue
        steps.push(makeXWingStep(digit, [...a.cells, ...b.cells], eliminations, [
          { type: 'row', index: a.row },
          { type: 'row', index: b.row },
          { type: 'column', index: a.columns[0] },
          { type: 'column', index: a.columns[1] },
        ], 'rows'))
      }
    }
  }

  return steps
}

const findColumnBasedXWings = (candidates: CandidateMap): HintStep[] => {
  const steps: HintStep[] = []

  for (const digit of DIGITS) {
    const columnPatterns: Array<{ column: number; cells: CellIndex[]; rows: number[] }> = []

    for (let column = 0; column < 9; column += 1) {
      const cells = columnCells(column).filter((cell) => candidates.get(cell)?.has(digit))
      if (cells.length === 2) {
        columnPatterns.push({ column, cells, rows: cells.map((cell) => Math.floor(cell / 9)) })
      }
    }

    for (let first = 0; first < columnPatterns.length; first += 1) {
      for (let second = first + 1; second < columnPatterns.length; second += 1) {
        const a = columnPatterns[first]
        const b = columnPatterns[second]
        if (a.rows.join(',') !== b.rows.join(',')) continue

        const eliminations = a.rows
          .flatMap((row) => rowCells(row))
          .filter((cell) => ![...a.cells, ...b.cells].includes(cell) && candidates.get(cell)?.has(digit))
          .map((cell) => ({ cell, digit }))

        if (eliminations.length === 0) continue
        steps.push(makeXWingStep(digit, [...a.cells, ...b.cells], eliminations, [
          { type: 'column', index: a.column },
          { type: 'column', index: b.column },
          { type: 'row', index: a.rows[0] },
          { type: 'row', index: a.rows[1] },
        ], 'columns'))
      }
    }
  }

  return steps
}

const makeXWingStep = (
  digit: Digit,
  supportCells: CellIndex[],
  eliminations: Array<{ cell: CellIndex; digit: Digit }>,
  houses: Array<{ type: 'row' | 'column' | 'box'; index: number }>,
  orientation: 'rows' | 'columns',
): HintStep => ({
  id: `x-wing-${digit}-${orientation}-${supportCells.join('-')}-${eliminations.map((item) => item.cell).join('-')}`,
  type: 'elimination',
  technique: 'X-Wing',
  difficulty: 'advanced',
  targetCells: eliminations.map((item) => item.cell),
  supportCells,
  houses,
  eliminateCandidates: eliminations,
  nudge: `Candidate ${digit} forms an X-Wing across ${orientation}.`,
  reasoning: [
    `Candidate ${digit} appears in exactly two positions in each of the paired ${orientation}.`,
    `Those positions align to form a rectangle: ${supportCells.map(formatCell).join(', ')}.`,
    `One corner in each paired row/column must contain ${digit}, so ${digit} can be removed from other cells in the crossing houses (${houses.map(houseLabel).join(', ')}).`,
  ],
  reveal: `Remove ${digit} from ${eliminations.map((item) => formatCell(item.cell)).join(', ')}.`,
  sortOrder: 70,
})
