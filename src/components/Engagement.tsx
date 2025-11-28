import React, { useState } from 'react'
import SectionHeader from './SectionHeader'
import PortfolioRating from './PortfolioRating'
import ShareButtons from './ShareButtons'
import SnakeGame from './SnakeGame'
import MemoryGame from './MemoryGame'

const Engagement = () => {
  const [activeGame, setActiveGame] = useState<'snake' | 'memory' | null>(null)
  const [guestMessages, setGuestMessages] = useState<string[]>([])
  const [newMessage, setNewMessage] = useState('')

  const handleAddMessage = () => {
    if (newMessage.trim()) {
      setGuestMessages(prev => [...prev, newMessage.trim()])
      setNewMessage('')
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <SectionHeader title="Engage & Play" />
      
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <PortfolioRating />
        <ShareButtons />
      </div>
      
      {/* Mini Games Section */}
      <div className="bg-slate-800/30 rounded-lg p-8 border border-slate-700 mb-8">
        <h3 className="text-xl font-medium text-slate-200 mb-6 text-center">Mini Games</h3>
        
        {!activeGame ? (
          <div className="grid md:grid-cols-2 gap-4 text-center">
            <button 
              onClick={() => setActiveGame('snake')}
              className="bg-green-600 hover:bg-green-700 px-6 py-8 rounded-lg transition-colors"
            >
              <div className="text-3xl mb-2">🐍</div>
              <div className="font-medium">Snake Game</div>
              <div className="text-sm opacity-90 mt-1">Classic arcade fun</div>
            </button>
            <button 
              onClick={() => setActiveGame('memory')}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-8 rounded-lg transition-colors"
            >
              <div className="text-3xl mb-2">🧩</div>
              <div className="font-medium">Memory Game</div>
              <div className="text-sm opacity-90 mt-1">Test your memory</div>
            </button>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium text-slate-200">
                {activeGame === 'snake' ? 'Snake Game' : 'Memory Game'}
              </h4>
              <button
                onClick={() => setActiveGame(null)}
                className="text-slate-400 hover:text-slate-200 px-3 py-1 rounded transition-colors"
              >
                ← Back to Games
              </button>
            </div>
            
            {activeGame === 'snake' && <SnakeGame />}
            {activeGame === 'memory' && <MemoryGame />}
          </div>
        )}
      </div>
      
      {/* Guestbook Section */}
      <div className="bg-slate-800/30 rounded-lg p-8 border border-slate-700">
        <h3 className="text-xl font-medium text-slate-200 mb-6 text-center">Guestbook</h3>
        
        <div className="mb-6">
          <textarea 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-4 text-slate-200 placeholder-slate-400"
            placeholder="Leave a message for other visitors..."
            rows={3}
            maxLength={200}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-slate-500">{newMessage.length}/200</span>
            <button 
              onClick={handleAddMessage}
              disabled={!newMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed px-4 py-2 rounded transition-colors"
            >
              Sign Guestbook
            </button>
          </div>
        </div>
        
        {guestMessages.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-slate-300">Recent Messages:</h4>
            {guestMessages.slice(-5).reverse().map((message, index) => (
              <div key={index} className="bg-slate-700/50 rounded-lg p-3 text-slate-300 text-sm">
                "{message}"
              </div>
            ))}
          </div>
        )}
        
        {guestMessages.length === 0 && (
          <div className="text-center text-slate-500 py-8">
            Be the first to sign the guestbook!
          </div>
        )}
      </div>
    </div>
  )
}

export default Engagement