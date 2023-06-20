export type CellValue = number | string

export interface CellData {
  isOpen: boolean
  value: CellValue
  isBomb: boolean
}

export type GameMatrix = Array<Array<CellData>>
