import { describe, expect, it } from 'vitest'
import { computeCandidates } from './candidates'
import { parseGridString } from './grid'
import { findHints } from './hints'

const sample = '530070000600195000098000060800060003400803001700020006060000280000419005000080079'

describe('solver', () => {
  it('computes candidates for an empty cell', () => {
    const grid = parseGridString(sample)
    const candidates = computeCandidates(grid)
    expect([...candidates.get(2)!].sort()).toEqual([1, 2, 4])
  })

  it('finds basic hint options', () => {
    const grid = parseGridString(sample)
    const hints = findHints(grid)
    expect(hints.length).toBeGreaterThan(0)
    expect(hints[0].nudge.length).toBeGreaterThan(0)
  })
})
