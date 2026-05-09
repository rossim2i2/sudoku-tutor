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
  {
    slug: 'locked-candidates',
    title: 'Locked candidates',
    difficulty: 'Intermediate',
    summary: 'A candidate is restricted to the overlap of a box and a row or column, allowing eliminations outside that overlap.',
    whenToLook: [
      'When all possible locations for a digit in a box line up in one row or column.',
      'When all possible locations for a digit in a row or column fall inside one box.',
    ],
    steps: [
      'Choose one candidate digit.',
      'Look at a box and see whether that digit only appears in one row or column.',
      'Or look at a row/column and see whether the digit only appears inside one box.',
      'Remove that digit from the rest of the affected row, column, or box.',
    ],
    mistakes: [
      'Eliminating from the support cells instead of from the rest of the affected house.',
      'Forgetting that the candidate must be fully locked to the intersection.',
    ],
  },
  {
    slug: 'naked-pair',
    title: 'Naked pair',
    difficulty: 'Intermediate',
    summary: 'Two cells in the same house contain the same two candidates, so those candidates can be removed from other cells in that house.',
    whenToLook: [
      'When candidate notation shows two cells with identical two-digit candidate sets.',
      'When a row, column, or box has several unsolved cells but two are tightly constrained.',
    ],
    steps: [
      'Find two cells in the same row, column, or box.',
      'Confirm both cells contain exactly the same two candidates.',
      'Those two digits must occupy those two cells in some order.',
      'Remove both digits from every other cell in the house.',
    ],
    mistakes: [
      'Using cells that share candidates but have extra candidates too.',
      'Applying the elimination outside the house where the pair exists.',
    ],
  },
]
