export type Digit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export type CellIndex = number
export type HouseType = 'row' | 'column' | 'box'

export type Cell = {
  value: Digit | null
  given: boolean
}

export type Grid = Cell[]

export type HouseRef = {
  type: HouseType
  index: number
}

export type CandidateMap = Map<CellIndex, Set<Digit>>

export type Difficulty = 'basic' | 'intermediate' | 'advanced' | 'killer'

export type HintHighlightRole = 'pattern' | 'remove' | 'answer' | 'context' | 'color-a' | 'color-b'

export type HintHighlightGroup = {
  label: string
  role: HintHighlightRole
  cells: CellIndex[]
}

export type HintStep = {
  id: string
  type: 'placement' | 'elimination'
  technique: string
  difficulty: Difficulty
  targetCells: CellIndex[]
  supportCells: CellIndex[]
  houses: HouseRef[]
  eliminateCandidates: Array<{ cell: CellIndex; digit: Digit }>
  highlightGroups?: HintHighlightGroup[]
  nudge: string
  reasoning: string[]
  reveal: string
  sortOrder: number
}

export type SavedPuzzle = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  type: 'standard' | 'killer'
  givens: string
  values: string
}

export const DIGITS: Digit[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]
