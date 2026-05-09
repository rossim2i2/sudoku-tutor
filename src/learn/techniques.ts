export type TechniqueArticle = {
  slug: string
  title: string
  difficulty: 'Basic' | 'Intermediate' | 'Advanced' | 'Killer'
  summary: string
  example: string
  exampleGrid?: string        // 81-char grid string to load as a live demo
  exampleTechniqueName?: string // matches HintStep.technique for auto-selection
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
    example: 'r7c3 is empty. Its row already contains 2, 3, 5, 7, 8. Its column contains 1, 4, 6. Its box contains 9. Every digit 1–9 is accounted for by peers except 9 — wait, the box already has 9. Recount: row gives {2,3,5,7,8}, column gives {1,4,6}, box gives {9}. Union = {1,2,3,4,5,6,7,8,9}. No candidates remain except the one not yet placed — whichever digit the union is missing is forced. When candidates are computed and a cell shows exactly one, that digit must go there.',
    exampleGrid: '530070000600195000098000060800060003400803001700020006060000280000419005000080079',
    exampleTechniqueName: 'Naked single',
    whenToLook: [
      'After filling any digit that reduces neighbors — recheck affected cells immediately.',
      'When a cell is surrounded by many solved peers in its row, column, and box.',
    ],
    steps: [
      'Pick an unsolved cell.',
      'List every digit already placed in its row, column, and box.',
      'If only one digit from 1–9 is missing from that combined list, place it.',
    ],
    mistakes: [
      'Forgetting to check all three houses (row, column, and box).',
      'Treating a likely digit as forced before all candidates are properly eliminated.',
    ],
  },
  {
    slug: 'hidden-single',
    title: 'Hidden single',
    difficulty: 'Basic',
    summary: 'A digit has only one possible location within a row, column, or box, even if that cell has other candidates.',
    example: 'In column 7, digit 4 has been eliminated from eight of the nine cells by peers in rows and boxes. Only r3c7 still allows a 4. Even though r3c7 shows candidates {4, 6, 9}, the 4 is hidden among them — it is the only cell in column 7 where 4 can go. Place 4 in r3c7 and remove the other candidates.',
    exampleGrid: '000260701680070090190004500820100040004602900050003028009300074040050036703018000',
    exampleTechniqueName: 'Hidden single',
    whenToLook: [
      'When scanning a house for one missing digit at a time.',
      'When no naked singles remain but the grid can still be advanced.',
    ],
    steps: [
      'Choose a house (row, column, or box).',
      'Pick one digit not yet placed in that house.',
      'Check each unsolved cell — can it accept that digit given its other peers?',
      'If exactly one cell can accept it, place the digit there.',
    ],
    mistakes: [
      'Looking only for cells with one candidate and missing digits hidden among several.',
      'Scanning all digits at once — work through them one at a time.',
    ],
  },
  {
    slug: 'locked-candidates',
    title: 'Locked candidates',
    difficulty: 'Intermediate',
    summary: 'A candidate is restricted to the overlap of a box and a row or column, allowing eliminations outside that overlap.',
    example: 'In box 1 (top-left 3×3), all cells that could hold a 7 are r3c1, r3c2, and r3c3 — every option falls in row 3. Since 7 must go somewhere in box 1, and all those options are in row 3, no other cell in row 3 can hold a 7. Remove 7 from r3c4 through r3c9. This is called a "pointing" pattern. The reverse also works: if a digit in a row is confined to one box, remove it from the rest of that box.',
    exampleGrid: '530070000600195000098000060800060003400803001700020006060000280000419005000080079',
    exampleTechniqueName: 'Pointing candidates',
    whenToLook: [
      'When all possible locations for a digit in a box line up in one row or column.',
      'When all possible locations for a digit in a row or column fall inside one box.',
    ],
    steps: [
      'Choose one candidate digit.',
      'Look at a box — does that digit only appear in one row or column within the box?',
      'If yes, remove that digit from all cells in that row or column outside the box.',
      'Alternatively, check a row or column — if the digit is confined to one box, remove it from the rest of that box.',
    ],
    mistakes: [
      'Eliminating from the support cells (the locked intersection) instead of the cells outside it.',
      'Applying the elimination when the candidate is not fully locked — it must appear in only one row or column within the box.',
    ],
  },
  {
    slug: 'naked-pair',
    title: 'Naked pair',
    difficulty: 'Intermediate',
    summary: 'Two cells in the same house contain the same two candidates, so those candidates can be removed from other cells in that house.',
    example: 'r1c2 has candidates {3, 8} and r1c5 also has exactly {3, 8}. Both cells are in row 1. One of them must be 3 and the other must be 8 — no other arrangement is possible. Therefore, 3 and 8 cannot go anywhere else in row 1. Remove 3 from r1c1, r1c3, r1c4, r1c6, r1c7, r1c8, r1c9. Remove 8 from the same cells.',
    exampleGrid: '070000043040009610800634900094052000358460020000800530080070091902100005007040802',
    exampleTechniqueName: 'Naked pair',
    whenToLook: [
      'When candidate notation shows two cells with identical two-digit sets in the same house.',
      'When a row, column, or box is still crowded after singles are exhausted.',
    ],
    steps: [
      'Find two cells in the same row, column, or box.',
      'Confirm both cells contain exactly the same two candidates — no more, no less.',
      'Those two digits must occupy those two cells in some order.',
      'Remove both digits from every other unsolved cell in that house.',
    ],
    mistakes: [
      'Using cells that share candidates but also have extra candidates — the pair must be exact.',
      'Applying the elimination outside the house where the pair was found.',
    ],
  },
  {
    slug: 'naked-triple',
    title: 'Naked triple',
    difficulty: 'Intermediate',
    summary: 'Three cells in the same house collectively contain only three candidates, so those candidates cannot appear elsewhere in that house.',
    example: 'In row 9: r9c1 shows {1, 5}, r9c4 shows {1, 7}, r9c8 shows {5, 7}. No single cell has all three digits, but their union is exactly {1, 5, 7}. Those three digits must land in those three cells in some order. Remove 1, 5, and 7 from every other unsolved cell in row 9.',
    exampleGrid: '070000043040009610800634900094052000358460020000800530080070091902100005007040802',
    exampleTechniqueName: 'Naked triple',
    whenToLook: [
      'When three cells in one house have candidate sets drawn from the same three digits.',
      'After naked pairs are exhausted — look for the same pattern at size three.',
    ],
    steps: [
      'Find three cells in one house.',
      'Take the union of all their candidates.',
      'If the union contains exactly three digits, you have a naked triple.',
      'Remove those three digits from every other cell in the house.',
    ],
    mistakes: [
      'Combining three cells whose candidates span four or more digits.',
      'Each cell in the triple can have two or three candidates — they do not all need the same set.',
    ],
  },
  {
    slug: 'hidden-pair',
    title: 'Hidden pair',
    difficulty: 'Intermediate',
    summary: 'Two digits can only appear in the same two cells within a house, so other candidates can be removed from those cells.',
    example: 'In box 5, digits 2 and 6 can each appear in only two cells: r5c4 and r5c6. Even though r5c4 shows {1, 2, 7} and r5c6 shows {2, 6, 9}, the 2 and 6 are locked to those two cells. No other cell in box 5 can hold either digit. Remove all candidates except 2 and 6 from r5c4 and r5c6.',
    exampleGrid: '800000000003600000070090200060005030000403000050100006000080006000020000419000008',
    exampleTechniqueName: 'Hidden pair',
    whenToLook: [
      'When two digits in a house are each limited to the same two cells.',
      'When naked pairs are not visible but candidate grids are crowded.',
    ],
    steps: [
      'Choose a house.',
      'For each digit, find all cells in that house where it can appear.',
      'If two digits each appear in exactly the same two cells, they form a hidden pair.',
      'Remove all other candidates from those two cells.',
    ],
    mistakes: [
      'Scanning cells instead of scanning digits — you must track where each digit can go.',
      'Hidden pairs eliminate candidates inside the pair cells, not outside them.',
    ],
  },
  {
    slug: 'hidden-triple',
    title: 'Hidden triple',
    difficulty: 'Intermediate',
    summary: 'Three digits are confined to the same three cells within a house, even if those cells contain extra candidates.',
    example: 'In column 3, scan where digits 2, 4, and 8 can appear. Digit 2 fits in r2c3 and r5c3. Digit 4 fits in r2c3 and r8c3. Digit 8 fits in r5c3 and r8c3. Every option for all three digits falls within {r2c3, r5c3, r8c3}. Those three cells must collectively hold 2, 4, and 8. Remove all other candidates from those three cells.',
    exampleGrid: '800000000003600000070090200060005030000403000050100006000080006000020000419000008',
    exampleTechniqueName: 'Hidden triple',
    whenToLook: [
      'When three digits in a house are each limited to cells within the same set of three.',
      'When hidden pairs are exhausted and candidate grids are still crowded.',
    ],
    steps: [
      'Pick three digits in one house.',
      'Find all cells in that house where each digit can appear.',
      'If all three digits are confined to the same three cells (and only those), you have a hidden triple.',
      'Remove all other candidates from those three cells.',
    ],
    mistakes: [
      'Accepting a pattern where one of the three digits can appear in a fourth cell.',
      'Removing the hidden digits themselves instead of the other candidates in those cells.',
    ],
  },
  {
    slug: 'naked-quad',
    title: 'Naked quad',
    difficulty: 'Intermediate',
    summary: 'Four cells in the same house collectively contain only four candidates, so those candidates cannot appear elsewhere in that house.',
    example: 'In box 3, four unsolved cells show candidates drawn entirely from {2, 4, 6, 9}: one shows {2, 4}, another {4, 6}, another {2, 9}, another {6, 9}. Their union is exactly {2, 4, 6, 9}. Those four digits are claimed by those four cells. Remove 2, 4, 6, and 9 from every other cell in box 3.',
    exampleGrid: '070000043040009610800634900094052000358460020000800530080070091902100005007040802',
    exampleTechniqueName: 'Naked quad',
    whenToLook: [
      'When four cells in one house have candidate sets drawn from the same four digits.',
      'After naked pairs and triples — the same logic extended to four cells.',
    ],
    steps: [
      'Find four cells in one house.',
      'Take the union of all their candidates.',
      'If the union contains exactly four digits, you have a naked quad.',
      'Remove those four digits from every other cell in the house.',
    ],
    mistakes: [
      'Including a cell whose candidates add a fifth digit to the union.',
      'Naked quads are rare — exhaust pairs and triples first.',
    ],
  },
  {
    slug: 'hidden-quad',
    title: 'Hidden quad',
    difficulty: 'Intermediate',
    summary: 'Four digits are confined to the same four cells within a house, even if those cells contain other candidates.',
    example: 'In row 4, digits 1, 3, 5, and 7 can each only appear in four specific cells: r4c2, r4c5, r4c7, r4c9. Even though those cells show many other candidates, 1, 3, 5, and 7 are locked to them. Remove all candidates except 1, 3, 5, and 7 from those four cells.',
    exampleGrid: '800000000003600000070090200060005030000403000050100006000080006000020000419000008',
    exampleTechniqueName: 'Hidden quad',
    whenToLook: [
      'When four digits in a house are each limited to cells within the same set of four.',
      'After hidden pairs and triples are exhausted.',
    ],
    steps: [
      'Pick four digits in one house.',
      'Find all cells in that house where each digit can appear.',
      'If all four digits are confined to the same four cells, you have a hidden quad.',
      'Remove all other candidates from those four cells.',
    ],
    mistakes: [
      'Accepting the pattern when one digit can appear in a fifth cell — it must be exact.',
      'Removing the hidden digits instead of clearing the other candidates.',
    ],
  },
  {
    slug: 'x-wing',
    title: 'X-Wing',
    difficulty: 'Advanced',
    summary: 'A candidate forms a rectangle across two rows and two columns, allowing eliminations from the crossing lines.',
    example: 'Digit 6 appears in exactly two positions in row 1: r1c3 and r1c8. It also appears in exactly two positions in row 7: r7c3 and r7c8. The positions align — both rows use columns 3 and 8. One of r1c3/r1c8 holds a 6, and one of r7c3/r7c8 holds a 6. Either way, columns 3 and 8 each have their 6 accounted for by these two rows. Remove 6 from every other cell in column 3 and column 8.',
    exampleGrid: '000260701680070090190004500820100040004602900050003028009300074040050036703018000',
    exampleTechniqueName: 'X-Wing',
    whenToLook: [
      'When a single digit appears in exactly two cells across two different rows, and both rows share the same two columns.',
      'Or the same pattern across two columns sharing the same two rows.',
    ],
    steps: [
      'Choose one candidate digit.',
      'Find rows where that digit appears in exactly two cells.',
      'Check whether two such rows share the same pair of columns.',
      'Remove the digit from all other cells in those two columns.',
    ],
    mistakes: [
      'Using a row where the digit appears three or more times.',
      'Eliminating from the rectangle corners — the corners are the support cells, not the elimination targets.',
    ],
  },
  {
    slug: 'swordfish',
    title: 'Swordfish',
    difficulty: 'Advanced',
    summary: 'Like an X-Wing but across three rows and three columns, allowing candidate eliminations from the crossing lines.',
    example: 'Digit 3 appears in at most three positions across rows 2, 5, and 8. Checking those rows: r2 has 3 in c1 and c4; r5 has 3 in c1, c4, and c9; r8 has 3 in c4 and c9. All positions fall within columns 1, 4, and 9. Since 3 in each row must land in one of those three columns, the three rows collectively claim one 3 per column in {c1, c4, c9}. Remove 3 from every other cell in columns 1, 4, and 9.',
    exampleGrid: '000260701680070090190004500820100040004602900050003028009300074040050036703018000',
    exampleTechniqueName: 'Swordfish',
    whenToLook: [
      'When X-Wing does not appear but a digit is confined to two or three cells in each of three rows.',
      'All those cells must fall within the same three columns.',
    ],
    steps: [
      'Choose one candidate digit.',
      'Find three rows where the digit appears in two or three cells each.',
      'Check whether all those cells fall within the same three columns.',
      'Remove the digit from all other cells in those three columns.',
    ],
    mistakes: [
      'Using a row where the digit appears more than three times.',
      'Confusing base rows with crossing columns — eliminations go in the crossing lines, not the base rows.',
    ],
  },
  {
    slug: 'jellyfish',
    title: 'Jellyfish',
    difficulty: 'Advanced',
    summary: 'Like Swordfish but across four rows and four columns.',
    example: 'Digit 8 appears in two to four positions across rows 1, 3, 6, and 9. All those positions fall within columns 2, 5, 7, and 8. Those four rows collectively account for one 8 per column in {c2, c5, c7, c8}. Remove 8 from all other cells in columns 2, 5, 7, and 8.',
    exampleGrid: '070000043040009610800634900094052000358460020000800530080070091902100005007040802',
    exampleTechniqueName: 'Jellyfish',
    whenToLook: [
      'When Swordfish does not appear and a digit is confined to two to four cells in each of four rows.',
      'All those positions must fall within the same four columns.',
    ],
    steps: [
      'Choose one candidate digit.',
      'Find four rows where the digit appears in two to four cells each.',
      'Confirm all those cells fall within the same four columns.',
      'Remove the digit from all other cells in those four columns.',
    ],
    mistakes: [
      'Using a row where the digit appears more than four times.',
      'Jellyfish is rare — exhaust X-Wing and Swordfish before looking for it.',
    ],
  },
  {
    slug: 'xy-wing',
    title: 'XY-Wing',
    difficulty: 'Advanced',
    summary: 'A pivot cell with two candidates and two wing cells form a chain that forces a candidate out of cells seeing both wings.',
    example: 'r4c4 shows {3, 7}. r4c9 shows {3, 5} — it shares 3 with the pivot and sees it (same row). r1c4 shows {7, 5} — it shares 7 with the pivot and sees it (same column). Both wings contain 5. Now: if r4c4 is 3, then r4c9 must be 5. If r4c4 is 7, then r1c4 must be 5. Either way, one of the wings holds a 5. Any cell that sees both wings (r1c9, which shares row 1 with r1c4 and column 9 with r4c9) cannot be 5. Remove 5 from r1c9.',
    exampleGrid: '070000043040009610800634900094052000358460020000800530080070091902100005007040802',
    exampleTechniqueName: 'XY-Wing',
    whenToLook: [
      'When a bi-value cell (exactly two candidates) has two peers that are also bi-value.',
      'When each wing shares exactly one candidate with the pivot, and both wings share a third candidate with each other.',
    ],
    steps: [
      'Find a pivot cell with exactly two candidates A and B.',
      'Find a wing that sees the pivot, contains A, and has one other candidate C.',
      'Find another wing that sees the pivot, contains B, and also has candidate C.',
      'Remove C from every cell that sees both wings.',
    ],
    mistakes: [
      'Using a wing that shares both pivot candidates instead of just one.',
      'Eliminating from cells that see only one wing — the target must see both.',
      'Confusing which candidate (C) is eliminated — it is the one shared between the two wings, not the pivot.',
    ],
  },
  {
    slug: 'killer-rule-of-45',
    title: 'Killer Sudoku: rule of 45',
    difficulty: 'Killer',
    summary: 'Every row, column, and box sums to 45. Cages crossing a boundary can reveal innies, outies, or useful sub-totals.',
    example: 'Box 1 must sum to 45. Three cages are entirely inside box 1, totalling 38. One cage crosses the box boundary, with one cell inside and two cells outside. The inside cell = 45 − 38 = 7. This is an "innie" — a single cell inside the house that is determined by the difference between 45 and the sum of the complete cages.',
    whenToLook: [
      'When a row, column, or box is almost completely covered by whole cages.',
      'When exactly one cage partially crosses the boundary of a house.',
    ],
    steps: [
      'Add the totals of cages fully inside the house.',
      'Subtract from 45 to find the total of cells that cross the boundary from outside.',
      'If only one cell crosses in (innie), its value is determined directly.',
      'If only one cell crosses out (outie), its value equals the sum of those crossing cells.',
    ],
    mistakes: [
      'Mixing cage totals inside the house with cage totals that cross outside.',
      'Forgetting that a multi-cell innie or outie gives a sum, not individual digit values.',
    ],
  },
]
