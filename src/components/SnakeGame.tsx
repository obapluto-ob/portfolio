import React, { useState, useEffect, useCallback } from 'react'

interface Position {
  x: number
  y: number
}

const SnakeGame = () => {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }])
  const [food, setFood] = useState<Position>({ x: 5, y: 5 })
  const [direction, setDirection] = useState<Position>({ x: 0, y: -1 })
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const gridSize = 20
  const gameAreaSize = 400

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    }
    setFood(newFood)
  }, [])

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }])
    setDirection({ x: 0, y: -1 })
    setGameOver(false)
    setScore(0)
    setIsPlaying(true)
    generateFood()
  }

  const moveSnake = useCallback(() => {
    if (!isPlaying || gameOver) return

    setSnake(currentSnake => {
      const newSnake = [...currentSnake]
      const head = { ...newSnake[0] }
      
      head.x += direction.x
      head.y += direction.y

      // Check wall collision
      if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
        setGameOver(true)
        setIsPlaying(false)
        return currentSnake
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true)
        setIsPlaying(false)
        return currentSnake
      }

      newSnake.unshift(head)

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10)
        generateFood()
      } else {
        newSnake.pop()
      }

      return newSnake
    })
  }, [direction, food, gameOver, isPlaying, generateFood])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying) return
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 })
          break
        case 'ArrowDown':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 })
          break
        case 'ArrowLeft':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 })
          break
        case 'ArrowRight':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 })
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [direction, isPlaying])

  useEffect(() => {
    if (!isPlaying) return
    
    const gameInterval = setInterval(moveSnake, 150)
    return () => clearInterval(gameInterval)
  }, [moveSnake, isPlaying])

  const cellSize = gameAreaSize / gridSize

  return (
    <div className="text-center">
      <div className="mb-4">
        <div className="text-lg font-medium text-slate-200 mb-2">Snake Game</div>
        <div className="text-sm text-slate-400">Score: {score}</div>
      </div>
      
      <div 
        className="relative mx-auto border-2 border-slate-600 bg-slate-800"
        style={{ width: gameAreaSize, height: gameAreaSize }}
      >
        {/* Snake */}
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`absolute ${index === 0 ? 'bg-green-400' : 'bg-green-600'}`}
            style={{
              left: segment.x * cellSize,
              top: segment.y * cellSize,
              width: cellSize - 1,
              height: cellSize - 1
            }}
          />
        ))}
        
        {/* Food */}
        <div
          className="absolute bg-red-500 rounded-full"
          style={{
            left: food.x * cellSize + 2,
            top: food.y * cellSize + 2,
            width: cellSize - 4,
            height: cellSize - 4
          }}
        />
        
        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xl font-bold text-red-400 mb-2">Game Over!</div>
              <div className="text-slate-300 mb-4">Final Score: {score}</div>
              <button
                onClick={resetGame}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4">
        {!isPlaying && !gameOver && (
          <button
            onClick={resetGame}
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded transition-colors"
          >
            Start Game
          </button>
        )}
        <div className="text-xs text-slate-500 mt-2">
          Use arrow keys to control the snake
        </div>
      </div>
    </div>
  )
}

export default SnakeGame