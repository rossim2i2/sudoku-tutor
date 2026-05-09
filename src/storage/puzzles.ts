import { emptyGrid, gridToString, parseGridString } from '../solver/grid'
import type { Grid, SavedPuzzle } from '../solver/types'

const STORAGE_KEY = 'sudoku-tutor:puzzles'

export const loadSavedPuzzles = (): SavedPuzzle[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const persistSavedPuzzles = (puzzles: SavedPuzzle[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(puzzles))
}

export const makeSavedPuzzle = (name: string, grid: Grid): SavedPuzzle => {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    name,
    createdAt: now,
    updatedAt: now,
    type: 'standard',
    givens: gridToString(grid, true),
    values: gridToString(grid),
  }
}

export const gridFromSavedPuzzle = (puzzle: SavedPuzzle): Grid => {
  const givens = parseGridString(puzzle.givens)
  const values = parseGridString(puzzle.values)
  return values.map((cell, index) => ({
    value: cell.value,
    given: givens[index]?.value !== null,
  }))
}

export const emptySavedGrid = emptyGrid
