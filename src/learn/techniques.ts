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
  {
    slug: 'naked-triple',
    title: 'Naked triple',
    difficulty: 'Intermediate',
    summary: 'Three cells in the same house collectively contain only three candidates, so those candidates cannot appear elsewhere in that house.',
    whenToLook: [
      'When three cells in a row, column, or box have candidate sets made from the same three digits.',
      'When naked pairs almost appear, but the pattern uses three cells instead of two.',
    ],
    steps: [
      'Find three cells in one house.',
      'Confirm their combined candidates are exactly three digits.',
      'Those three digits must occupy those three cells in some order.',
      'Remove those digits from other cells in the same house.',
    ],
    mistakes: [
      'Using three cells whose combined candidates include four or more digits.',
      'Applying eliminations outside the house where the triple exists.',
    ],
  },
  {
    slug: 'hidden-pair',
    title: 'Hidden pair',
    difficulty: 'Intermediate',
    summary: 'Two digits can only appear in the same two cells within a house, so other candidates can be removed from those cells.',
    whenToLook: [
      'When two digits seem restricted to the same two cells.',
      'When candidate grids are crowded and naked pairs are not obvious.',
    ],
    steps: [
      'Pick a row, column, or box.',
      'Track where two digits can appear.',
      'If both digits are confined to the same two cells, they form a hidden pair.',
      'Remove all other candidates from those two cells.',
    ],
    mistakes: [
      'Looking only at the cells instead of tracking the digits across the house.',
      'Forgetting that hidden pairs eliminate candidates inside the pair cells, not outside them.',
    ],
  },
  {
    slug: 'hidden-triple',
    title: 'Hidden triple',
    difficulty: 'Intermediate',
    summary: 'Three digits are confined to the same three cells within a house, even if those cells contain extra candidates.',
    whenToLook: [
      'When three digits have limited possible locations in a house.',
      'When crowded candidate grids hide a subset pattern.',
    ],
    steps: [
      'Pick three digits in one house.',
      'Find all cells that can contain those digits.',
      'If the possible cells are exactly three cells, the digits must occupy them.',
      'Remove all other candidates from those cells.',
    ],
    mistakes: [
      'Accepting four possible cells as a hidden triple.',
      'Removing the hidden digits instead of removing the other candidates.',
    ],
  },
  {
    slug: 'x-wing',
    title: 'X-Wing',
    difficulty: 'Advanced',
    summary: 'A candidate forms a rectangle across two rows and two columns, allowing eliminations from the crossing lines.',
    whenToLook: [
      'When a single candidate appears exactly twice in two different rows and lines up in the same columns.',
      'Or when it appears exactly twice in two columns and lines up in the same rows.',
    ],
    steps: [
      'Choose one candidate digit.',
      'Scan rows or columns where that digit appears exactly twice.',
      'Find two rows/columns whose candidate positions align.',
      'Remove that candidate from other cells in the crossing columns/rows.',
    ],
    mistakes: [
      'Using rows or columns where the candidate appears more than twice.',
      'Eliminating from the rectangle corners instead of the other cells in the crossing lines.',
    ],
  },
  {
    slug: 'naked-quad',
    title: 'Naked quad',
    difficulty: 'Intermediate',
    summary: 'Four cells in the same house collectively contain only four candidates, so those candidates cannot appear elsewhere in that house.',
    whenToLook: [
      'When four cells in one house have candidate sets drawn from the same four digits.',
      'After naked pairs and triples are exhausted and candidates still need reducing.',
    ],
    steps: [
      'Find four cells in one house.',
      'Confirm their combined candidates are exactly four digits.',
      'Those digits must occupy those four cells in some order.',
      'Remove those digits from every other cell in the house.',
    ],
    mistakes: [
      'Combining four cells whose candidates span more than four digits.',
      'Applying eliminations outside the house where the quad exists.',
    ],
  },
  {
    slug: 'hidden-quad',
    title: 'Hidden quad',
    difficulty: 'Intermediate',
    summary: 'Four digits are confined to the same four cells within a house, even if those cells contain other candidates.',
    whenToLook: [
      'When four digits have very limited placement options in a house.',
      'After hidden pairs and triples are exhausted.',
    ],
    steps: [
      'Pick four digits in one house.',
      'Find all cells that can contain those digits.',
      'If the possible cells are exactly four, those digits must occupy them.',
      'Remove all other candidates from those four cells.',
    ],
    mistakes: [
      'Accepting five or more possible cells — the pattern must be exact.',
      'Removing the hidden digits instead of removing the other candidates.',
    ],
  },
  {
    slug: 'swordfish',
    title: 'Swordfish',
    difficulty: 'Advanced',
    summary: 'Like an X-Wing but across three rows and three columns, allowing candidate eliminations from the crossing lines.',
    whenToLook: [
      'When X-Wing does not appear but a digit is restricted to two or three cells in exactly three rows.',
      'Those positions must all fall within the same three columns.',
    ],
    steps: [
      'Choose one candidate digit.',
      'Find three rows where that digit appears in two or three cells.',
      'Check whether all those cells fall within the same three columns.',
      'Remove the candidate from other cells in those three columns.',
    ],
    mistakes: [
      'Using rows where the candidate appears more than three times.',
      'Confusing the base rows with the crossing columns when eliminating.',
    ],
  },
  {
    slug: 'jellyfish',
    title: 'Jellyfish',
    difficulty: 'Advanced',
    summary: 'Like Swordfish but across four rows and four columns.',
    whenToLook: [
      'When Swordfish does not appear and a digit is restricted to two to four cells in exactly four rows.',
      'All those positions must fall within the same four columns.',
    ],
    steps: [
      'Choose one candidate digit.',
      'Find four rows where that digit appears in two to four cells.',
      'Confirm all those cells fall within the same four columns.',
      'Remove the candidate from other cells in those four columns.',
    ],
    mistakes: [
      'Using rows where the candidate appears more than four times.',
      'Jellyfish is rare — exhaust X-Wing and Swordfish first.',
    ],
  },
  {
    slug: 'xy-wing',
    title: 'XY-Wing',
    difficulty: 'Advanced',
    summary: 'A pivot cell with two candidates and two wing cells form a chain that forces a candidate out of cells seeing both wings.',
    whenToLook: [
      'When a bi-value cell (exactly two candidates) has two peers that are also bi-value.',
      'When those two peers share a candidate with each other but not both with the pivot.',
    ],
    steps: [
      'Find a pivot cell with exactly two candidates A and B.',
      'Find a wing sharing A with the pivot and containing a third candidate C.',
      'Find another wing sharing B with the pivot and also containing C.',
      'Remove C from every cell that sees both wings.',
    ],
    mistakes: [
      'Using a wing that shares both pivot candidates instead of just one.',
      'Eliminating from cells that only see one wing, not both.',
    ],
  },
]
