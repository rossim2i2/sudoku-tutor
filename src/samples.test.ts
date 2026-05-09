import { describe, expect, it } from 'vitest'
import { parseGridString } from './solver/grid'
import { DIFFICULTIES, getRandomSample, samplePuzzles } from './samples'

describe('sample puzzles', () => {
  it('all sample puzzles parse as valid 81-character grids', () => {
    for (const sample of samplePuzzles) {
      expect(() => parseGridString(sample.grid), sample.name).not.toThrow()
      expect(sample.grid).toHaveLength(81)
    }
  })

  it('has at least 2 puzzles per difficulty level', () => {
    for (const difficulty of DIFFICULTIES) {
      const count = samplePuzzles.filter((s) => s.difficulty === difficulty).length
      expect(count, `${difficulty} pool size`).toBeGreaterThanOrEqual(2)
    }
  })

  it('getRandomSample returns a puzzle at the requested difficulty', () => {
    for (const difficulty of DIFFICULTIES) {
      const sample = getRandomSample(difficulty)
      expect(sample.difficulty).toBe(difficulty)
    }
  })
})
