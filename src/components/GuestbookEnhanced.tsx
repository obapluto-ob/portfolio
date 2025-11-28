import React, { useState, useEffect } from 'react'
import { Send, MessageSquare, Heart, Star } from 'lucide-react'

interface GuestMessage {
  id: string
  message: string
  timestamp: number
  likes: number
  rating?: number
}

const GuestbookEnhanced: React.FC = () => {
  const [messages, setMessages] = useState<GuestMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [rating, setRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load messages from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('portfolio_guestbook')
    if (saved) {
      setMessages(JSON.parse(saved))
    }
  }, [])

  // Save messages to localStorage
  const saveMessages = (msgs: GuestMessage[]) => {
    localStorage.setItem('portfolio_guestbook', JSON.stringify(msgs))
    setMessages(msgs)
  }

  const handleSubmit = () => {
    if (!newMessage.trim()) return
    
    setIsSubmitting(true)
    
    const message: GuestMessage = {
      id: Date.now().toString(),
      message: newMessage.trim(),
      timestamp: Date.now(),
      likes: 0,
      rating: rating > 0 ? rating : undefined
    }
    
    const updated = [message, ...messages].slice(0, 50) // Keep last 50 messages
    saveMessages(updated)
    
    setNewMessage('')
    setRating(0)
    setIsSubmitting(false)
  }

  const likeMessage = (id: string) => {
    const updated = messages.map(msg => 
      msg.id === id ? { ...msg, likes: msg.likes + 1 } : msg
    )
    saveMessages(updated)
  }

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  return (
    <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-blue-400" />
        <h3 className="text-xl font-medium text-slate-200">Enhanced Guestbook</h3>
        <span className="text-sm text-slate-500">({messages.length} messages)</span>
      </div>
      
      {/* Message Input */}
      <div className="mb-6 space-y-4">
        <textarea 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 rounded-lg p-4 text-slate-200 placeholder-slate-400 resize-none"
          placeholder="Share your thoughts about this portfolio..."
          rows={3}
          maxLength={300}
        />
        
        {/* Rating */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400">Rate this portfolio:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`w-6 h-6 ${star <= rating ? 'text-yellow-400' : 'text-slate-600'} hover:text-yellow-300 transition-colors`}
              >
                <Star className="w-full h-full" fill={star <= rating ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <span className="text-sm text-slate-400">({rating}/5 stars)</span>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-500">{newMessage.length}/300</span>
          <button 
            onClick={handleSubmit}
            disabled={!newMessage.trim() || isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? 'Posting...' : 'Post Message'}
          </button>
        </div>
      </div>
      
      {/* Messages List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div key={msg.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {msg.message.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-slate-400">{formatTime(msg.timestamp)}</span>
                  {msg.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                      <span className="text-xs text-yellow-400">{msg.rating}/5</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => likeMessage(msg.id)}
                  className="flex items-center gap-1 text-slate-400 hover:text-red-400 transition-colors"
                >
                  <Heart className="w-4 h-4" />
                  <span className="text-xs">{msg.likes}</span>
                </button>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">"{msg.message}"</p>
            </div>
          ))
        ) : (
          <div className="text-center text-slate-500 py-12">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No messages yet. Be the first to leave a comment!</p>
          </div>
        )}
      </div>
      
      {messages.length > 0 && (
        <div className="mt-4 text-center">
          <div className="text-xs text-slate-500">
            Messages are stored locally and persist across visits
          </div>
        </div>
      )}
    </div>
  )
}

export default GuestbookEnhanced