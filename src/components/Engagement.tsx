import React, { useState, useEffect } from 'react'
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase'
import SectionHeader from './SectionHeader'

const Engagement = () => {
  const [rating, setRating] = useState(0)
  const [hasRated, setHasRated] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Array<{id: string, text: string, timestamp: any}>>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadMessages()
    console.log('Firebase connected:', db ? 'YES' : 'NO')
  }, [])

  const loadMessages = async () => {
    try {
      const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'), limit(10))
      const snapshot = await getDocs(q)
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setMessages(msgs)
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const handleRating = (stars: number) => {
    if (hasRated) return
    setRating(stars)
    setHasRated(true)
  }

  const addMessage = async () => {
    const trimmed = message.trim()
    
    if (!trimmed || trimmed.length < 3) return
    if (trimmed.length > 200) {
      alert('Message too long (max 200 characters)')
      return
    }
    
    const spamWords = ['spam', 'buy now', 'click here', 'free money', 'viagra']
    const hasSpam = spamWords.some(word => trimmed.toLowerCase().includes(word))
    if (hasSpam) {
      alert('Message contains inappropriate content')
      return
    }
    
    setLoading(true)
    try {
      await addDoc(collection(db, 'messages'), {
        text: trimmed,
        timestamp: new Date()
      })
      setMessage('')
      loadMessages()
    } catch (error) {
      console.error('Error adding message:', error)
      alert('Failed to add message')
    }
    setLoading(false)
  }

  const copyPortfolioLink = () => {
    navigator.clipboard.writeText(window.location.href)
    alert('Portfolio link copied!')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <SectionHeader title="Engage & Connect" />
      
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Portfolio Rating */}
        <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700 text-center">
          <h3 className="text-xl font-medium text-slate-200 mb-4">Rate This Portfolio</h3>
          <div className="flex justify-center space-x-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(star)}
                disabled={hasRated}
                className={`text-2xl transition-colors ${
                  star <= rating ? 'text-yellow-400' : 'text-slate-600'
                } ${!hasRated ? 'hover:text-yellow-300' : 'cursor-default'}`}
              >
                ★
              </button>
            ))}
          </div>
          {hasRated && (
            <div className="text-green-400">Thanks for rating! ⭐</div>
          )}
        </div>

        {/* Share Portfolio */}
        <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700">
          <h3 className="text-xl font-medium text-slate-200 mb-4 text-center">Share Portfolio</h3>
          <div className="space-y-3">
            <a
              href={`https://twitter.com/intent/tweet?text=Check out this amazing developer portfolio!&url=${window.location.href}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded transition-colors"
            >
              <span>Share on Twitter</span>
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition-colors"
            >
              <span>Share on LinkedIn</span>
            </a>
            <button
              onClick={copyPortfolioLink}
              className="w-full bg-slate-600 hover:bg-slate-700 px-4 py-2 rounded transition-colors"
            >
              Copy Portfolio Link
            </button>
          </div>
        </div>
      </div>
      
      {/* Quick Guestbook */}
      <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700">
        <h3 className="text-xl font-medium text-slate-200 mb-4">Leave a Message</h3>
        <div className="flex space-x-3 mb-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Leave a quick message..."
            className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400"
            onKeyPress={(e) => e.key === 'Enter' && addMessage()}
          />
          <button
            onClick={addMessage}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 px-4 py-2 rounded transition-colors"
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>
        
        {messages.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-slate-300 font-medium">Recent Messages:</h4>
            {messages.map((msg) => (
              <div key={msg.id} className="bg-slate-700/50 p-3 rounded text-slate-300">
                {msg.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Engagement