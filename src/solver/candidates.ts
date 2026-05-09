import { peersOf } from './houses'
import type { CandidateMap, CellIndex, Digit, Grid } from './types'
import { DIGITS } from './types'

export const computeCandidatesForCell = (grid: Grid, index: CellIndex): Set<Digit> => {
  if (grid[index].value !== null) return new Set<Digit>()

  const blocked = new Set<Digit>()
  for (const peer of peersOf(index)) {
    const value = grid[peer].value
    if (value !== null) blocked.add(value)
  }

  return new Set(DIGITS.filter((digit) => !blocked.has(digit)))
}

export const computeCandidates = (grid: Grid): CandidateMap => {
  const candidates: CandidateMap = new Map()
  for (let index = 0; index < 81; index += 1) {
    candidates.set(index, computeCandidatesForCell(grid, index))
  }
  return candidates
}

export const candidatesText = (digits: Set<Digit>): string => [...digits].sort().join('')
