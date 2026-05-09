import { candidatesText } from '../candidates'
import { formatCell } from '../grid'
import type { CandidateMap, HintStep } from '../types'

export const findNakedSingles = (candidates: CandidateMap): HintStep[] => {
  const steps: HintStep[] = []

  for (const [cell, digits] of candidates.entries()) {
    if (digits.size !== 1) continue
    const digit = [...digits][0]
    steps.push({
      id: `naked-single-${cell}-${digit}`,
      type: 'placement',
      technique: 'Naked single',
      difficulty: 'basic',
      targetCells: [cell],
      supportCells: [],
      houses: [],
      eliminateCandidates: [],
      nudge: `${formatCell(cell)} has only one possible candidate left.`,
      reasoning: [
        `${formatCell(cell)} can currently contain only ${candidatesText(digits)}.`,
        'Every other digit is already blocked by its row, column, or box.',
      ],
      reveal: `${formatCell(cell)} = ${digit}`,
      sortOrder: 10,
    })
  }

  return steps
}
