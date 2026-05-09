import { describe, expect, it } from 'vitest'
import type { CandidateMap, Digit } from '../types'
import { findHiddenPairs } from './hiddenSubsets'
import { findNakedTriples } from './nakedSubsets'
import { findXWings } from './xWing'

const candidateMap = (entries: Array<[number, Digit[]]>): CandidateMap => {
  const map: CandidateMap = new Map()
  for (let index = 0; index < 81; index += 1) map.set(index, new Set<Digit>())
  for (const [index, digits] of entries) map.set(index, new Set(digits))
  return map
}

describe('subset techniques', () => {
  it('finds naked triples with eliminations', () => {
    const candidates = candidateMap([
      [0, [1, 2]],
      [1, [1, 3]],
      [2, [2, 3]],
      [3, [1, 2, 3, 4]],
    ])

    const hints = findNakedTriples(candidates)
    expect(hints[0].technique).toBe('Naked triple')
    expect(hints[0].eliminateCandidates).toEqual([
      { cell: 3, digit: 1 },
      { cell: 3, digit: 2 },
      { cell: 3, digit: 3 },
    ])
  })

  it('finds hidden pairs with eliminations', () => {
    const candidates = candidateMap([
      [0, [1, 2, 3]],
      [1, [1, 2, 4]],
      [2, [3, 4, 5]],
    ])

    const hints = findHiddenPairs(candidates)
    const hiddenPair = hints.find((hint) => hint.eliminateCandidates.some((item) => item.cell === 0 && item.digit === 3))
    expect(hiddenPair?.technique).toBe('Hidden pair')
    expect(hiddenPair?.eliminateCandidates).toEqual(expect.arrayContaining([
      { cell: 0, digit: 3 },
      { cell: 1, digit: 4 },
    ]))
  })

  it('finds row-based X-Wings with eliminations', () => {
    const candidates = candidateMap([
      [1, [7]],
      [5, [7]],
      [19, [7]],
      [23, [7]],
      [28, [7]],
      [46, [7]],
    ])

    const hints = findXWings(candidates)
    const xWing = hints.find((hint) => hint.technique === 'X-Wing')
    expect(xWing?.eliminateCandidates).toEqual(expect.arrayContaining([
      { cell: 28, digit: 7 },
      { cell: 46, digit: 7 },
    ]))
  })
})
