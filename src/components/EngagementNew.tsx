import React, { useState, useEffect } from 'react'
import { collection, addDoc, getDocs, query, orderBy, limit, doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import SectionHeader from './SectionHeader'

const Engagement = () => {
  const [rating, setRating] = useState(0)
  const [hasRated, setHasRated] = useState(false)
  const [averageRating, setAverageRating] = useState(0)
  const [totalRatings, setTotalRatings] = useState(0)
  const [ratingBreakdown, setRatingBreakdown] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Array<{id: string, text: string, timestamp: any}>>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadMessages()
    loadRatings()
    checkIfUserRated()
  }, [])

  const loadRatings = async () => {
    try {
      const ratingsDoc = await getDoc(doc(db, 'portfolio', 'ratings'))
      if (ratingsDoc.exists()) {
        const data = ratingsDoc.data()
        setAverageRating(data.average || 0)
        setTotalRatings(data.total || 0)
        setRatingBreakdown(data.breakdown || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })
      }
    } catch (error) {
      console.error('Error loading ratings:', error)
    }
  }

  const checkIfUserRated = () => {
    const userRating = localStorage.getItem('portfolioUserRating')
    if (userRating) {
      setRating(parseInt(userRating))
      setHasRated(true)
    }
  }

  const handleRating = async (stars: number) => {
    if (hasRated) return
    
    try {
      const ratingsDoc = await getDoc(doc(db, 'portfolio', 'ratings'))
      let currentData = { average: 0, total: 0, breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } }
      
      if (ratingsDoc.exists()) {
        currentData = ratingsDoc.data() as any
      }
      
      const newBreakdown = { ...currentData.breakdown }
      newBreakdown[stars as keyof typeof newBreakdown] = (newBreakdown[stars as keyof typeof newBreakdown] || 0) + 1
      
      const newTotal = currentData.total + 1
      const totalStars = Object.entries(newBreakdown).reduce((sum, [star, count]) => {
        return sum + (parseInt(star) * count)
      }, 0)
      const newAverage = totalStars / newTotal
      
      await setDoc(doc(db, 'portfolio', 'ratings'), {
        average: newAverage,
        total: newTotal,
        breakdown: newBreakdown,
        lastUpdated: new Date()
      })
      
      localStorage.setItem('portfolioUserRating', stars.toString())
      
      setRating(stars)
      setHasRated(true)
      setAverageRating(newAverage)
      setTotalRatings(newTotal)
      setRatingBreakdown(newBreakdown)
      
    } catch (error) {
      console.error('Error saving rating:', error)
      alert('Failed to save rating')
    }
  }

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

  const addMessage = async () => {
    const trimmed = message.trim()
    
    if (!trimmed || trimmed.length < 3) return
    if (trimmed.length > 200) {
      alert('Message too long (max 200 characters)')
      return
    }
    
    const spamWords = ['spam', 'buy now', 'click here', 'free money', 'viagra']
    const hasSpam = spamWords.some(word => trimmed.toLowerCase().includes(word.toLowerCase()))
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
          
          {/* Average Rating Display */}
          {totalRatings > 0 && (
            <div className="mb-4">
              <div className="text-3xl font-bold text-yellow-400 mb-1">
                {averageRating.toFixed(1)} ⭐
              </div>
              <div className="text-sm text-slate-400">
                Based on {totalRatings} rating{totalRatings !== 1 ? 's' : ''}
              </div>
              
              {/* Rating Breakdown */}
              <div className="mt-3 space-y-1">
                {[5, 4, 3, 2, 1].map(star => {
                  const count = ratingBreakdown[star as keyof typeof ratingBreakdown] || 0
                  const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0
                  return (
                    <div key={star} className="flex items-center text-xs">
                      <span className="w-3">{star}</span>
                      <div className="flex-1 mx-2 bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-8 text-slate-400">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          
          {/* Rating Stars */}
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
                ⭐
              </button>
            ))}
          </div>
          
          {hasRated ? (
            <div className="text-green-400">Thanks for rating! 🌟</div>
          ) : (
            <div className="text-slate-400 text-sm">Click to rate</div>
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