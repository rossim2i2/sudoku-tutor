import { computeCandidates } from './candidates'
import { findHiddenPairs, findHiddenTriples, findHiddenQuads } from './techniques/hiddenSubsets'
import { findHiddenSingles } from './techniques/hiddenSingles'
import { findLockedCandidates } from './techniques/lockedCandidates'
import { findNakedPairs } from './techniques/nakedPairs'
import { findNakedSingles } from './techniques/nakedSingles'
import { findNakedTriples, findNakedQuads } from './techniques/nakedSubsets'
import { findXWings, findSwordfish, findJellyfish } from './techniques/fish'
import { findXYWings } from './techniques/xyWing'
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
    ...findNakedQuads(candidates),
    ...findHiddenQuads(candidates),
    ...findXWings(candidates),
    ...findSwordfish(candidates),
    ...findJellyfish(candidates),
    ...findXYWings(candidates),
  ].sort((a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id))
}
