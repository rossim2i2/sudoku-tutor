export type TechniqueArticle = {
  slug: string
  title: string
  difficulty: 'Basic' | 'Intermediate' | 'Advanced' | 'Killer'
  summary: string
  whenToLook: string[]
  steps: string[]
  mistakes: string[]
}

export const techniques: TechniqueArticle[] = [
  {
    slug: 'naked-single',
    title: 'Naked single',
    difficulty: 'Basic',
    summary: 'A cell has only one possible candidate once its row, column, and box are considered.',
    whenToLook: [
      'After filling a digit that affects several neighboring cells.',
      'When a cell is surrounded by many solved peers.',
    ],
    steps: [
      'Pick an unsolved cell.',
      'List digits already used in its row, column, and box.',
      'If only one digit remains, that digit must go in the cell.',
    ],
    mistakes: [
      'Forgetting to check the box as well as the row and column.',
      'Treating a likely digit as a forced digit before all candidates are removed.',
    ],
  },
  {
    slug: 'hidden-single',
    title: 'Hidden single',
    difficulty: 'Basic',
    summary: 'A digit has only one possible location within a row, column, or box, even if that cell has other candidates.',
    whenToLook: [
      'When scanning a house for one missing digit at a time.',
      'When no cell has a single candidate but a row, column, or box is constrained.',
    ],
    steps: [
      'Choose a row, column, or box.',
      'Pick one digit that is not placed there yet.',
      'Check each empty cell in that house.',
      'If only one cell can accept the digit, place it there.',
    ],
    mistakes: [
      'Looking only for cells with one candidate and missing digits that are hidden among several candidates.',
      'Scanning all digits at once instead of one digit at a time.',
    ],
  },
  {
    slug: 'killer-rule-of-45',
    title: 'Killer Sudoku: rule of 45',
    difficulty: 'Killer',
    summary: 'Every row, column, and box sums to 45. Cages crossing a boundary can reveal innies, outies, or useful sub-totals.',
    whenToLook: [
      'When a row, column, or box is almost completely covered by whole cages.',
      'When exactly one cage crosses the boundary of a house.',
    ],
    steps: [
      'Add the cage totals fully inside the house.',
      'Compare that sum with 45.',
      'Use the difference to identify the inside or outside cell total.',
      'Apply Sudoku and cage-combination logic to narrow candidates.',
    ],
    mistakes: [
      'Mixing cage totals inside the house with cage totals crossing outside the house.',
      'Forgetting that a multi-cell outie gives a total, not necessarily individual digits.',
    ],
  },
]
