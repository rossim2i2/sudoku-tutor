import { computeCandidates } from './candidates'
import { findHiddenPairs, findHiddenTriples } from './techniques/hiddenSubsets'
import { findHiddenSingles } from './techniques/hiddenSingles'
import { findLockedCandidates } from './techniques/lockedCandidates'
import { findNakedPairs } from './techniques/nakedPairs'
import { findNakedSingles } from './techniques/nakedSingles'
import { findNakedTriples } from './techniques/nakedSubsets'
import { findXWings } from './techniques/xWing'
import type { Grid, HintStep } from './types'

export const findHints = (grid: Grid): HintStep[] => {
  const candidates = computeCandidates(grid)
  return [
    ...findNakedSingles(candidates),
    ...findHiddenSingles(grid, candidates),
    ...findLockedCandidates(candidates),
    ...findNakedPairs(candidates),
    ...findNakedTriples(candidates),
    ...findHiddenPairs(candidates),
    ...findHiddenTriples(candidates),
    ...findXWings(candidates),
  ].sort((a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id))
}
