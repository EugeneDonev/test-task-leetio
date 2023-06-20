import type { GameMatrix } from './type'

export const randomCoordinate = (boardSize: number) => Math.floor(Math.random() * boardSize - 1) + 1

export const generateGameMatrix = (boardSize: number): GameMatrix =>
  Array.from({ length: boardSize }, () =>
    Array(boardSize).fill({
      value: '',
      isOpen: false,
      isBomb: false,
    }),
  )

export const generateCheckCoordinates = () =>
  [...Array(3).keys()]
    .map((i) => [...Array(3).keys()].map((j) => ({ rowCoordinate: i - 1, cellCoordinate: j - 1 })))
    .flat()
