import { describe, expect, it } from 'vitest'
import { parseGridString } from './solver/grid'
import { samplePuzzles } from './samples'

describe('sample puzzles', () => {
  it('all sample puzzles parse as valid 81-character grids', () => {
    for (const sample of samplePuzzles) {
      expect(() => parseGridString(sample.grid), sample.name).not.toThrow()
      expect(sample.grid).toHaveLength(81)
    }
  })

  it('includes expected difficulty levels', () => {
    expect(samplePuzzles.map((sample) => sample.difficulty)).toEqual(['Easy', 'Medium', 'Hard', 'Expert'])
  })
})
