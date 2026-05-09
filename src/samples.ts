export type SampleDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert'

export type SamplePuzzle = {
  id: string
  name: string
  difficulty: SampleDifficulty
  grid: string
  note: string
}

export const samplePuzzles: SamplePuzzle[] = [
  // Easy — solvable primarily with naked and hidden singles
  {
    id: 'easy-1',
    name: 'Easy 1',
    difficulty: 'Easy',
    grid: '530070000600195000098000060800060003400803001700020006060000280000419005000080079',
    note: 'Classic easy puzzle with immediate singles after candidate computation.',
  },
  {
    id: 'easy-2',
    name: 'Easy 2',
    difficulty: 'Easy',
    grid: '003020600900305001001806400008102900700000008006708200002609500800203009005010300',
    note: 'Well-distributed givens; rows and columns unlock quickly.',
  },
  {
    id: 'easy-3',
    name: 'Easy 3',
    difficulty: 'Easy',
    grid: '200080300060070084030500209000105408000000000402706000301007040720040060004010003',
    note: 'Moderate density; good for practising single-digit scanning.',
  },
  {
    id: 'easy-4',
    name: 'Easy 4',
    difficulty: 'Easy',
    grid: '000000907000420180000705026100904000050000040000507009920108000034059000507000000',
    note: 'Box-rich starting position; singles resolve most of the grid.',
  },

  // Medium — requires locked candidates or naked/hidden pairs
  {
    id: 'medium-1',
    name: 'Medium 1',
    difficulty: 'Medium',
    grid: '000260701680070090190004500820100040004602900050003028009300074040050036703018000',
    note: 'Good for scanning rows, columns, and boxes for hidden singles.',
  },
  {
    id: 'medium-2',
    name: 'Medium 2',
    difficulty: 'Medium',
    grid: '010020300002003040400500016000600070300040005020007000900008004060100200007090050',
    note: 'Requires locked candidates and naked pairs to resolve fully.',
  },
  {
    id: 'medium-3',
    name: 'Medium 3',
    difficulty: 'Medium',
    grid: '402000000000400700060008050007005000010040030000800200090300010008002000000000905',
    note: 'Sparse boxes; candidate pressure builds across rows.',
  },
  {
    id: 'medium-4',
    name: 'Medium 4',
    difficulty: 'Medium',
    grid: '070000043040009610800634900094052000358460020000800530080070091902100005007040802',
    note: 'Higher density; hidden singles and box-line reductions feature.',
  },

  // Hard — requires subset techniques and multiple elimination passes
  {
    id: 'hard-1',
    name: 'Hard 1',
    difficulty: 'Hard',
    grid: '100007090030020008009600500005300900010080002600004000300000010040000007007000300',
    note: 'Sparse puzzle that quickly shows the need for candidate management.',
  },
  {
    id: 'hard-2',
    name: 'Hard 2',
    difficulty: 'Hard',
    grid: '000000000904607000076804100309701080008000300050308702007502610000403208000000000',
    note: 'Empty corners; naked and hidden subsets required throughout.',
  },
  {
    id: 'hard-3',
    name: 'Hard 3',
    difficulty: 'Hard',
    grid: '480006902002008001900370060840010200300040007009060053030900800700800600201500049',
    note: 'Dense center; requires multiple locked candidate passes.',
  },
  {
    id: 'hard-4',
    name: 'Hard 4',
    difficulty: 'Hard',
    grid: '000030086000020049009648200003070900000804000008030400001482700470060000960010000',
    note: 'Strong row and column constraints; hidden pairs unlock the middle.',
  },

  // Expert — requires fish techniques, XY-Wing, or advanced patterns
  {
    id: 'expert-1',
    name: 'Expert 1',
    difficulty: 'Expert',
    grid: '000000010400000000020000000000050407008000300001090000300400200050100000000806000',
    note: 'Very sparse; advanced techniques needed after candidates are computed.',
  },
  {
    id: 'expert-2',
    name: 'Expert 2',
    difficulty: 'Expert',
    grid: '800000000003600000070090200060005030000403000050100006000080006000020000419000008',
    note: 'AI Escargot by Arto Inkala — one of the most challenging puzzles ever published.',
  },
  {
    id: 'expert-3',
    name: 'Expert 3',
    difficulty: 'Expert',
    grid: '000000000000003085001020000000507000004000100090000000500000073002010000000040009',
    note: 'Minimal givens; X-Wing and Swordfish patterns emerge under candidate analysis.',
  },
  {
    id: 'expert-4',
    name: 'Expert 4',
    difficulty: 'Expert',
    grid: '120400300300010050006000100700090000040601020000080007005000600090020004003007098',
    note: 'Near-expert density; XY-Wing and fish techniques required to close.',
  },
]

export const DIFFICULTIES: SampleDifficulty[] = ['Easy', 'Medium', 'Hard', 'Expert']

export const getRandomSample = (difficulty: SampleDifficulty): SamplePuzzle => {
  const pool = samplePuzzles.filter((puzzle) => puzzle.difficulty === difficulty)
  return pool[Math.floor(Math.random() * pool.length)]
}
