import { computeCandidates } from './candidates'
import { findHiddenSingles } from './techniques/hiddenSingles'
import { findNakedSingles } from './techniques/nakedSingles'
import type { Grid, HintStep } from './types'

export const findHints = (grid: Grid): HintStep[] => {
  const candidates = computeCandidates(grid)
  return [
    ...findNakedSingles(candidates),
    ...findHiddenSingles(grid, candidates),
  ].sort((a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id))
}
