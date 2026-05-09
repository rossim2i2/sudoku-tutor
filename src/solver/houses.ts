import { boxOf, cellIndex, columnOf, rowOf } from './grid'
import type { CellIndex, Digit, Grid, HouseRef, HouseType } from './types'

export const rowCells = (row: number): CellIndex[] => Array.from({ length: 9 }, (_, column) => cellIndex(row, column))
export const columnCells = (column: number): CellIndex[] => Array.from({ length: 9 }, (_, row) => cellIndex(row, column))
export const boxCells = (box: number): CellIndex[] => {
  const startRow = Math.floor(box / 3) * 3
  const startColumn = (box % 3) * 3
  const cells: CellIndex[] = []
  for (let row = startRow; row < startRow + 3; row += 1) {
    for (let column = startColumn; column < startColumn + 3; column += 1) {
      cells.push(cellIndex(row, column))
    }
  }
  return cells
}

export const houseCells = (house: HouseRef): CellIndex[] => {
  if (house.type === 'row') return rowCells(house.index)
  if (house.type === 'column') return columnCells(house.index)
  return boxCells(house.index)
}

export const allHouses = (): HouseRef[] => [
  ...Array.from({ length: 9 }, (_, index) => ({ type: 'row' as HouseType, index })),
  ...Array.from({ length: 9 }, (_, index) => ({ type: 'column' as HouseType, index })),
  ...Array.from({ length: 9 }, (_, index) => ({ type: 'box' as HouseType, index })),
]

export const peersOf = (index: CellIndex): Set<CellIndex> => {
  const peers = new Set<CellIndex>([
    ...rowCells(rowOf(index)),
    ...columnCells(columnOf(index)),
    ...boxCells(boxOf(index)),
  ])
  peers.delete(index)
  return peers
}

export const usedDigitsInHouse = (grid: Grid, house: HouseRef): Set<Digit> => {
  const used = new Set<Digit>()
  for (const index of houseCells(house)) {
    const value = grid[index].value
    if (value !== null) used.add(value)
  }
  return used
}

export const validateGrid = (grid: Grid): string[] => {
  const errors: string[] = []
  for (const house of allHouses()) {
    const seen = new Map<Digit, CellIndex>()
    for (const index of houseCells(house)) {
      const value = grid[index].value
      if (value === null) continue
      const existing = seen.get(value)
      if (existing !== undefined) {
        errors.push(`${house.type} ${house.index + 1} has duplicate ${value}`)
      }
      seen.set(value, index)
    }
  }
  return errors
}

export const findConflictCells = (grid: Grid): Set<CellIndex> => {
  const conflicts = new Set<CellIndex>()
  for (const house of allHouses()) {
    const seen = new Map<Digit, CellIndex>()
    for (const index of houseCells(house)) {
      const value = grid[index].value
      if (value === null) continue
      const existing = seen.get(value)
      if (existing !== undefined) {
        conflicts.add(index)
        conflicts.add(existing)
      } else {
        seen.set(value, index)
      }
    }
  }
  return conflicts
}

export const houseLabel = (house: HouseRef): string => {
  if (house.type === 'row') return `row ${house.index + 1}`
  if (house.type === 'column') return `column ${house.index + 1}`
  return `box ${house.index + 1}`
}
