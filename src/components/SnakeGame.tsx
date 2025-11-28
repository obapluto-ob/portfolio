import React, { useState, useEffect, useCallback } from 'react'

interface Position {
  x: number
  y: number
}

const SnakeGame = () => {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }])
  const [food, setFood] = useState<Position>({ x: 15, y: 15 })
  const [direction, setDirection] = useState<Position>({ x: 1, y: 0 })
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const gridSize = 25
  const cellSize = 16

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    }
    setFood(newFood)
  }, [])

  const resetGame = () => {
    setSnake([{ x: 12, y: 12 }])
    setDirection({ x: 1, y: 0 })
    setGameOver(false)
    setScore(0)
    setIsPlaying(true)
    setIsPaused(false)
    generateFood()
  }

  const togglePause = () => {
    if (isPlaying && !gameOver) {
      setIsPaused(!isPaused)
    }
  }

  const moveSnake = useCallback(() => {
    if (!isPlaying || gameOver || isPaused) return

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
      e.preventDefault()
      
      if (!isPlaying) return
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 })
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 })
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 })
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 })
          break
        case ' ':
        case 'Escape':
          togglePause()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [direction, isPlaying, isPaused])

  useEffect(() => {
    if (!isPlaying || isPaused) return
    
    const gameSpeed = Math.max(80, 200 - score * 2) // Speed increases with score
    const gameInterval = setInterval(moveSnake, gameSpeed)
    return () => clearInterval(gameInterval)
  }, [moveSnake, isPlaying, isPaused, score])

  return (
    <div className="text-center max-w-lg mx-auto">
      {/* Game Header */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-lg font-bold text-green-400">SNAKE GAME</div>
          <div className="text-lg font-mono text-yellow-400">Score: {score}</div>
        </div>
        
        {isPaused && isPlaying && (
          <div className="text-yellow-400 text-sm font-medium">PAUSED - Press SPACE to continue</div>
        )}
      </div>
      
      {/* Game Board */}
      <div className="relative mx-auto bg-black border-4 border-green-500 rounded-lg overflow-hidden shadow-2xl" 
           style={{ width: gridSize * cellSize, height: gridSize * cellSize }}>
        
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: gridSize }).map((_, row) => (
            Array.from({ length: gridSize }).map((_, col) => (
              <div
                key={`${row}-${col}`}
                className="absolute border border-green-800"
                style={{
                  left: col * cellSize,
                  top: row * cellSize,
                  width: cellSize,
                  height: cellSize
                }}
              />
            ))
          ))}
        </div>
        
        {/* Snake Body */}
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`absolute rounded-sm ${
              index === 0 
                ? 'bg-green-300 border-2 border-green-100 shadow-lg' // Head
                : 'bg-green-500 border border-green-400' // Body
            }`}
            style={{
              left: segment.x * cellSize + 1,
              top: segment.y * cellSize + 1,
              width: cellSize - 2,
              height: cellSize - 2,
              zIndex: 10
            }}
          >
            {/* Snake Head Eyes */}
            {index === 0 && (
              <div className="relative w-full h-full">
                <div className="absolute w-1 h-1 bg-black rounded-full" 
                     style={{ top: '3px', left: '3px' }} />
                <div className="absolute w-1 h-1 bg-black rounded-full" 
                     style={{ top: '3px', right: '3px' }} />
              </div>
            )}
          </div>
        ))}
        
        {/* Food */}
        <div
          className="absolute bg-red-500 rounded-full border-2 border-red-300 animate-pulse shadow-lg"
          style={{
            left: food.x * cellSize + 2,
            top: food.y * cellSize + 2,
            width: cellSize - 4,
            height: cellSize - 4,
            zIndex: 5
          }}
        />
        
        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-50">
            <div className="text-center bg-slate-800 p-6 rounded-lg border-2 border-red-500">
              <div className="text-2xl font-bold text-red-400 mb-2">GAME OVER!</div>
              <div className="text-green-400 text-lg mb-1">Final Score: {score}</div>
              <div className="text-slate-400 text-sm mb-4">Length: {snake.length}</div>
              <button
                onClick={resetGame}
                className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg transition-colors font-medium"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
        
        {/* Pause Overlay */}
        {isPaused && isPlaying && !gameOver && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-40">
            <div className="text-4xl font-bold text-yellow-400 animate-pulse">PAUSED</div>
          </div>
        )}
      </div>
      
      {/* Game Controls */}
      <div className="mt-6 space-y-3">
        <div className="flex justify-center space-x-4">
          {!isPlaying && !gameOver && (
            <button
              onClick={resetGame}
              className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg transition-colors font-medium text-lg"
            >
              START GAME
            </button>
          )}
          
          {isPlaying && !gameOver && (
            <button
              onClick={togglePause}
              className="bg-yellow-600 hover:bg-yellow-700 px-6 py-2 rounded-lg transition-colors font-medium"
            >
              {isPaused ? 'RESUME' : 'PAUSE'}
            </button>
          )}
        </div>
        
        {/* Instructions */}
        <div className="text-xs text-slate-400 space-y-1">
          <div>Use Arrow Keys or WASD to move</div>
          <div>SPACE or ESC to pause • Eat red food to grow</div>
          <div>Avoid walls and your own tail!</div>
        </div>
      </div>
    </div>
  )
}

export default SnakeGame