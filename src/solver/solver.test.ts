import { describe, expect, it } from 'vitest'
import { techniques } from '../learn/techniques'
import { computeCandidates } from './candidates'
import { parseGridString } from './grid'
import { findHints } from './hints'
import { findSimpleColorings } from './techniques/simpleColoring'
import type { CandidateMap, Digit } from './types'

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

  it('adds color groups to Simple Coloring hints', () => {
    const candidates = candidateMap(5, [0, 1, 10])
    const hints = findSimpleColorings(candidates)
    const hint = hints.find((step) => step.targetCells.includes(0) && step.targetCells.includes(10))

    expect(hint).toBeDefined()
    expect(hint?.highlightGroups?.map((group) => group.role)).toEqual(['color-a', 'color-b', 'remove'])
    expect(hint?.reasoning.some((line) => line.includes('Same-color rule'))).toBe(true)
  })

  it('keeps Simple Coloring conflicts scoped to one connected component', () => {
    const candidates = candidateMap(5, [0, 1, 10, 60, 62])
    const hints = findSimpleColorings(candidates)

    expect(hints.some((hint) => hint.targetCells.includes(60) || hint.targetCells.includes(62))).toBe(false)
  })

  it('finds the advanced technique examples used by the study guide', () => {
    for (const techniqueName of ['Simple Coloring', 'Skyscraper', 'W-Wing']) {
      const technique = techniques.find((item) => item.title === techniqueName)
      if (!technique?.exampleGrid) throw new Error(`Missing example grid for ${techniqueName}`)

      const hints = findHints(parseGridString(technique.exampleGrid))
      expect(hints.some((hint) => hint.technique === technique.exampleTechniqueName)).toBe(true)
    }
  })
})

const candidateMap = (digit: Digit, cells: number[]): CandidateMap => new Map(cells.map((cell) => [cell, new Set([digit])]))
