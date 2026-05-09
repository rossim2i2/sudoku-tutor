import { columnCells, rowCells, boxCells } from './houses'
import type { CandidateMap, CellIndex, Digit, HouseRef } from './types'
import { DIGITS } from './types'

export type StrongLink = {
  digit: Digit
  cells: [CellIndex, CellIndex]
  house: HouseRef
}

const houseCellsFor = (house: HouseRef): CellIndex[] => {
  if (house.type === 'row') return rowCells(house.index)
  if (house.type === 'column') return columnCells(house.index)
  return boxCells(house.index)
}

export const findStrongLinks = (candidates: CandidateMap): StrongLink[] => {
  const links: StrongLink[] = []

  for (const digit of DIGITS) {
    for (const house of allHouses()) {
      const cells = houseCellsFor(house).filter((cell) => candidates.get(cell)?.has(digit))
      if (cells.length === 2) {
        links.push({ digit, cells: [cells[0], cells[1]], house })
      }
    }
  }

  return links
}

const allHouses = (): HouseRef[] => [
  ...Array.from({ length: 9 }, (_, index) => ({ type: 'row' as const, index })),
  ...Array.from({ length: 9 }, (_, index) => ({ type: 'column' as const, index })),
  ...Array.from({ length: 9 }, (_, index) => ({ type: 'box' as const, index })),
]
