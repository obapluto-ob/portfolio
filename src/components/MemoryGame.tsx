import React, { useState, useEffect } from 'react'

interface Card {
  id: number
  value: string
  isFlipped: boolean
  isMatched: boolean
}

const MemoryGame = () => {
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [isWon, setIsWon] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const cardValues = ['🚀', '💻', '🎯', '⚡', '🔥', '💎', '🎮', '🌟']

  const initializeGame = () => {
    const gameCards = [...cardValues, ...cardValues]
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        isFlipped: false,
        isMatched: false
      }))
    
    setCards(gameCards)
    setFlippedCards([])
    setMoves(0)
    setIsWon(false)
    setIsPlaying(true)
  }

  const handleCardClick = (cardId: number) => {
    if (!isPlaying || flippedCards.length === 2) return
    
    const card = cards.find(c => c.id === cardId)
    if (!card || card.isFlipped || card.isMatched) return

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ))

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1)
      
      const [firstId, secondId] = newFlippedCards
      const firstCard = cards.find(c => c.id === firstId)
      const secondCard = cards.find(c => c.id === secondId)

      if (firstCard?.value === secondCard?.value) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isMatched: true }
              : c
          ))
          setFlippedCards([])
        }, 500)
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isFlipped: false }
              : c
          ))
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
      setIsWon(true)
      setIsPlaying(false)
    }
  }, [cards])

  return (
    <div className="text-center">
      <div className="mb-4">
        <div className="text-lg font-medium text-slate-200 mb-2">Memory Game</div>
        <div className="text-sm text-slate-400">Moves: {moves}</div>
      </div>
      
      {cards.length > 0 ? (
        <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto mb-4">
          {cards.map(card => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`
                aspect-square text-2xl rounded-lg border-2 transition-all duration-300
                ${card.isFlipped || card.isMatched 
                  ? 'bg-blue-500 border-blue-400 text-white' 
                  : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                }
                ${card.isMatched ? 'opacity-75' : ''}
              `}
              disabled={!isPlaying || card.isFlipped || card.isMatched}
            >
              {card.isFlipped || card.isMatched ? card.value : '?'}
            </button>
          ))}
        </div>
      ) : (
        <div className="w-72 h-72 mx-auto mb-4 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center">
          <div className="text-slate-500">Click Start to begin</div>
        </div>
      )}
      
      {isWon && (
        <div className="mb-4 p-4 bg-green-900/30 border border-green-500/30 rounded-lg">
          <div className="text-green-400 font-bold">Congratulations!</div>
          <div className="text-slate-300">You won in {moves} moves!</div>
        </div>
      )}
      
      <button
        onClick={initializeGame}
        className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded transition-colors"
      >
        {cards.length === 0 ? 'Start Game' : 'New Game'}
      </button>
      
      <div className="text-xs text-slate-500 mt-2">
        Match all pairs to win!
      </div>
    </div>
  )
}

export default MemoryGame