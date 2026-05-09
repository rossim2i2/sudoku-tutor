export type SampleDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert'

export type SamplePuzzle = {
  id: string
  name: string
  difficulty: SampleDifficulty
  grid: string
  note: string
}

export const samplePuzzles: SamplePuzzle[] = [
  {
    id: 'easy-warmup',
    name: 'Easy warmup',
    difficulty: 'Easy',
    grid: '530070000600195000098000060800060003400803001700020006060000280000419005000080079',
    note: 'Classic sample with immediate singles after candidate computation.',
  },
  {
    id: 'medium-scan',
    name: 'Medium scan practice',
    difficulty: 'Medium',
    grid: '000260701680070090190004500820100040004602900050003028009300074040050036703018000',
    note: 'Good for scanning rows, columns, and boxes for hidden singles.',
  },
  {
    id: 'hard-candidates',
    name: 'Hard candidate pressure',
    difficulty: 'Hard',
    grid: '100007090030020008009600500005300900010080002600004000300000010040000007007000300',
    note: 'Sparse puzzle that quickly shows the need for candidate management.',
  },
  {
    id: 'expert-open-grid',
    name: 'Expert open grid',
    difficulty: 'Expert',
    grid: '000000010400000000020000000000050407008000300001090000300400200050100000000806000',
    note: 'Very sparse sample for testing harder workflows as techniques expand.',
  },
]
