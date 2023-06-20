import { useEffect, useRef, useState } from 'react'
import { generateCheckCoordinates, randomCoordinate, generateGameMatrix } from './utils'
import type { GameMatrix } from './type'

const BOARD_SIZE = 10
const NUMBER_OF_HOLES = 10
const CHECK_COORDINATES = generateCheckCoordinates()

function App() {
  const mount = useRef<boolean>(false)
  const stat = useRef({
    click: 0,
    addedHoles: 0,
  })
  const [gameMatrix, setGameMatrix] = useState<GameMatrix>([])
  const [isGameOver, setGameOver] = useState<boolean>(false)

  useEffect(() => {
    if (mount.current) {
      return
    }

    mount.current = true
    initGame()
  }, [])

  const initGame = () => {
    setGameOver(false)
    stat.current.addedHoles = 0
    stat.current.click = 0
    const newMatrix: GameMatrix = generateGameMatrix(BOARD_SIZE)
    generateHoles(newMatrix)
  }

  const generateHoles = (newMatrix: GameMatrix) => {
    if (stat.current.addedHoles >= NUMBER_OF_HOLES) {
      setGameMatrix(newMatrix)
      return
    }

    const rowIdx = randomCoordinate(BOARD_SIZE)
    const cellIdx = randomCoordinate(BOARD_SIZE)

    if (newMatrix[rowIdx][cellIdx]?.isBomb) {
      generateHoles(newMatrix)
      return
    }

    newMatrix[rowIdx][cellIdx] = {
      value: 'BOOM',
      isBomb: true,
      isOpen: false,
    }
    generateNumbers(rowIdx, cellIdx, newMatrix)
    stat.current.addedHoles++
    generateHoles(newMatrix)
  }

  const generateNumbers = (rowIdx: number, cellIdx: number, newMatrix: GameMatrix) => {
    CHECK_COORDINATES.forEach(({ cellCoordinate, rowCoordinate }) => {
      const row = rowIdx + rowCoordinate
      const cell = cellIdx + cellCoordinate
      const field = newMatrix?.[row]?.[cell]

      if (typeof field === 'undefined' || field.value === 'BOOM') {
        return
      }

      newMatrix[row][cell] = {
        value: Number(newMatrix[row][cell].value) + 1,
        isBomb: false,
        isOpen: false,
      }
    })
  }

  const handleClick = ({ rowIdx, cellIdx }: { rowIdx: number; cellIdx: number }) => {
    stat.current.click++
    const newMatrix = [...gameMatrix]
    newMatrix[rowIdx][cellIdx] = {
      ...newMatrix[rowIdx][cellIdx],
      isOpen: true,
    }

    if (newMatrix[rowIdx][cellIdx].isBomb) {
      handleBoom()
      return
    }

    if (!newMatrix[rowIdx][cellIdx].value) {
      checkEmpty(rowIdx, cellIdx, newMatrix)
    }

    setGameMatrix(newMatrix)
  }

  const checkEmpty = (rowIdx: number, cellIdx: number, newMatrix: GameMatrix) => {
    CHECK_COORDINATES.forEach(({ cellCoordinate, rowCoordinate }) => {
      const row = rowIdx + rowCoordinate
      const cell = cellIdx + cellCoordinate
      const field = newMatrix?.[row]?.[cell]

      if (!field || field?.value || field?.isOpen) {
        return
      }

      newMatrix[row][cell] = {
        ...newMatrix[row][cell],
        isOpen: true,
      }
      checkEmpty(row, cell, newMatrix)
    })
  }

  const handleBoom = () => {
    const newMatrix = gameMatrix.map((rowArray) => rowArray.map((cellData) => ({ ...cellData, isOpen: true })))
    setGameMatrix(newMatrix)
    setGameOver(true)
  }

  return (
    <div className='game'>
      <h2 className='title'>Minesweeper</h2>
      <div className='board'>
        {isGameOver && (
          <div className='game-over'>
            GAME OVER
            <br />
            <button onClick={initGame}>RESET</button>
          </div>
        )}
        {gameMatrix.map((rowArray, rowIdx) => {
          return (
            <div key={rowIdx} className='row'>
              {rowArray.map(({ value, isOpen, isBomb }, cellIdx) => {
                return (
                  <div
                    key={cellIdx}
                    onClick={() => handleClick({ rowIdx, cellIdx })}
                    className={`cell ${isBomb && 'bomb'} ${!isOpen && 'hidden'}`}
                  >
                    {value}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
      <div>
        <div>Clicked: {stat.current.click}</div>
      </div>
    </div>
  )
}

export default App
