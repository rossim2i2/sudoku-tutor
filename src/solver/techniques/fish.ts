import { combinations } from '../combinations'
import { formatCell, columnOf, rowOf } from '../grid'
import { columnCells, houseLabel, rowCells } from '../houses'
import type { CandidateMap, CellIndex, Digit, HintStep } from '../types'
import { DIGITS } from '../types'

export const findXWings = (candidates: CandidateMap): HintStep[] => findFish(candidates, 2, 'X-Wing', 70)
export const findSwordfish = (candidates: CandidateMap): HintStep[] => findFish(candidates, 3, 'Swordfish', 75)
export const findJellyfish = (candidates: CandidateMap): HintStep[] => findFish(candidates, 4, 'Jellyfish', 80)

const findFish = (candidates: CandidateMap, size: number, technique: string, sortOrder: number): HintStep[] => [
  ...findRowFish(candidates, size, technique, sortOrder),
  ...findColumnFish(candidates, size, technique, sortOrder),
]

const findRowFish = (candidates: CandidateMap, size: number, technique: string, sortOrder: number): HintStep[] => {
  const steps: HintStep[] = []

  for (const digit of DIGITS) {
    const eligibleRows: Array<{ row: number; cells: CellIndex[]; columns: number[] }> = []

    for (let row = 0; row < 9; row += 1) {
      const cells = rowCells(row).filter((cell) => candidates.get(cell)?.has(digit))
      if (cells.length >= 2 && cells.length <= size) {
        eligibleRows.push({ row, cells, columns: cells.map(columnOf) })
      }
    }

    for (const rowGroup of combinations(eligibleRows, size)) {
      const usedColumns = [...new Set(rowGroup.flatMap((r) => r.columns))]
      if (usedColumns.length !== size) continue

      const supportCells = rowGroup.flatMap((r) => r.cells)
      const eliminations = usedColumns
        .flatMap((column) => columnCells(column))
        .filter((cell) => !supportCells.includes(cell) && candidates.get(cell)?.has(digit))
        .map((cell) => ({ cell, digit }))

      if (eliminations.length === 0) continue

      const houses = [
        ...rowGroup.map((r) => ({ type: 'row' as const, index: r.row })),
        ...usedColumns.map((c) => ({ type: 'column' as const, index: c })),
      ]

      steps.push(makeFishStep(technique, digit, supportCells, eliminations, houses, 'rows', size, sortOrder))
    }
  }

  return steps
}

const findColumnFish = (candidates: CandidateMap, size: number, technique: string, sortOrder: number): HintStep[] => {
  const steps: HintStep[] = []

  for (const digit of DIGITS) {
    const eligibleColumns: Array<{ column: number; cells: CellIndex[]; rows: number[] }> = []

    for (let column = 0; column < 9; column += 1) {
      const cells = columnCells(column).filter((cell) => candidates.get(cell)?.has(digit))
      if (cells.length >= 2 && cells.length <= size) {
        eligibleColumns.push({ column, cells, rows: cells.map(rowOf) })
      }
    }

    for (const columnGroup of combinations(eligibleColumns, size)) {
      const usedRows = [...new Set(columnGroup.flatMap((c) => c.rows))]
      if (usedRows.length !== size) continue

      const supportCells = columnGroup.flatMap((c) => c.cells)
      const eliminations = usedRows
        .flatMap((row) => rowCells(row))
        .filter((cell) => !supportCells.includes(cell) && candidates.get(cell)?.has(digit))
        .map((cell) => ({ cell, digit }))

      if (eliminations.length === 0) continue

      const houses = [
        ...columnGroup.map((c) => ({ type: 'column' as const, index: c.column })),
        ...usedRows.map((r) => ({ type: 'row' as const, index: r })),
      ]

      steps.push(makeFishStep(technique, digit, supportCells, eliminations, houses, 'columns', size, sortOrder))
    }
  }

  return steps
}

const makeFishStep = (
  technique: string,
  digit: Digit,
  supportCells: CellIndex[],
  eliminations: Array<{ cell: CellIndex; digit: Digit }>,
  houses: Array<{ type: 'row' | 'column' | 'box'; index: number }>,
  orientation: 'rows' | 'columns',
  size: number,
  sortOrder: number,
): HintStep => ({
  id: `${technique.toLowerCase()}-${digit}-${orientation}-${supportCells.sort().join('-')}-${eliminations.map((item) => item.cell).join('-')}`,
  type: 'elimination',
  technique,
  difficulty: 'advanced',
  targetCells: [...new Set(eliminations.map((item) => item.cell))],
  supportCells,
  houses,
  eliminateCandidates: eliminations,
  nudge: `Candidate ${digit} forms a ${technique} across ${size} ${orientation}.`,
  reasoning: [
    `Candidate ${digit} appears in at most ${size} positions across ${size} ${orientation}.`,
    `The positions all align within the same ${size} crossing ${orientation === 'rows' ? 'columns' : 'rows'}: ${houses.filter((h) => h.type === (orientation === 'rows' ? 'column' : 'row')).map(houseLabel).join(', ')}.`,
    `Since ${digit} must occupy one of those ${size} positions in each base ${orientation.slice(0, -1)}, it cannot appear in any other cell in those crossing ${orientation === 'rows' ? 'columns' : 'rows'}.`,
  ],
  reveal: `Remove ${digit} from ${eliminations.map((item) => formatCell(item.cell)).join(', ')}.`,
  sortOrder,
})
