import type { CellIndex, Digit, Grid } from './types'

export const cellIndex = (row: number, column: number): CellIndex => row * 9 + column
export const rowOf = (index: CellIndex) => Math.floor(index / 9)
export const columnOf = (index: CellIndex) => index % 9
export const boxOf = (index: CellIndex) => Math.floor(rowOf(index) / 3) * 3 + Math.floor(columnOf(index) / 3)

export const emptyGrid = (): Grid =>
  Array.from({ length: 81 }, () => ({ value: null, given: false }))

export const parseGridString = (input: string): Grid => {
  const normalized = input.replace(/\s/g, '')
  if (normalized.length !== 81) {
    throw new Error('A Sudoku string must contain exactly 81 characters.')
  }

  return [...normalized].map((char) => {
    if (char === '.' || char === '0') return { value: null, given: false }
    const value = Number(char)
    if (value < 1 || value > 9 || !Number.isInteger(value)) {
      throw new Error('Sudoku strings can only contain digits 1-9, 0, or .')
    }
    return { value: value as Digit, given: true }
  })
}

export const gridToString = (grid: Grid, givensOnly = false): string =>
  grid.map((cell) => {
    if (givensOnly && !cell.given) return '.'
    return cell.value ?? '.'
  }).join('')

export const setCellValue = (grid: Grid, index: CellIndex, value: Digit | null, given = false): Grid =>
  grid.map((cell, cellIndex) => {
    if (cellIndex !== index) return cell
    return {
      value,
      given: value === null ? false : given || cell.given,
    }
  })

export const clearNonGivens = (grid: Grid): Grid =>
  grid.map((cell) => (cell.given ? cell : { value: null, given: false }))

export const formatCell = (index: CellIndex): string => `r${rowOf(index) + 1}c${columnOf(index) + 1}`
