import React, { useState, useEffect } from 'react'
import { collection, addDoc, getDocs, query, orderBy, limit, doc, runTransaction, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

interface Message {
  id: string
  text: string
  timestamp: { toDate?: () => Date } | null
  reactions?: Record<string, number>
}

interface RatingData {
  average: number
  total: number
  breakdown: Record<number, number>
}

const REACTIONS: { key: string; label: string; icon: React.ReactNode }[] = [
  {
    key: 'thumbs_up',
    label: 'Thumbs up',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
      </svg>
    )
  },
  {
    key: 'heart',
    label: 'Heart',
    icon: (
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    )
  },
  {
    key: 'smile',
    label: 'Smile',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    key: 'fire',
    label: 'Fire',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      </svg>
    )
  },
]

const Engagement = () => {
  const [rating, setRating] = useState(0)
  const [hasRated, setHasRated] = useState(false)
  const [ratingData, setRatingData] = useState<RatingData>({ average: 0, total: 0, breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } })
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [userReactions, setUserReactions] = useState<Record<string, string>>({})
  const [firebaseAvailable, setFirebaseAvailable] = useState(true)

  useEffect(() => {
    loadMessages()
    loadRatings()
    checkIfUserRated()
    const saved = localStorage.getItem('userReactions')
    if (saved) {
      try { setUserReactions(JSON.parse(saved)) } catch { /* ignore */ }
    }
  }, [])

  const loadRatings = async () => {
    try {
      const snap = await getDoc(doc(db, 'portfolio', 'ratings'))
      if (snap.exists()) {
        const d = snap.data() as RatingData
        setRatingData({ average: d.average ?? 0, total: d.total ?? 0, breakdown: d.breakdown ?? { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } })
      }
    } catch {
      setFirebaseAvailable(false)
    }
  }

  const checkIfUserRated = () => {
    const saved = localStorage.getItem('portfolioUserRating')
    if (saved) {
      setRating(parseInt(saved, 10))
      setHasRated(true)
    }
  }

  // Use a Firestore transaction to prevent concurrent overwrites
  const handleRating = async (stars: number) => {
    if (hasRated || !firebaseAvailable) return

    try {
      const ratingsRef = doc(db, 'portfolio', 'ratings')
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(ratingsRef)
        const current: RatingData = snap.exists()
          ? (snap.data() as RatingData)
          : { average: 0, total: 0, breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } }

        const breakdown = { ...current.breakdown }
        breakdown[stars] = (breakdown[stars] ?? 0) + 1
        const newTotal = current.total + 1
        const totalStars = Object.entries(breakdown).reduce((sum, [s, c]) => sum + parseInt(s) * (c as number), 0)
        const newAverage = totalStars / newTotal

        tx.set(ratingsRef, { average: newAverage, total: newTotal, breakdown, lastUpdated: new Date() })
      })

      localStorage.setItem('portfolioUserRating', stars.toString())
      setRating(stars)
      setHasRated(true)
      await loadRatings()
    } catch {
      // Silently fail — don't alert the user for a non-critical feature
    }
  }

  const loadMessages = async () => {
    try {
      const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'), limit(10))
      const snap = await getDocs(q)
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() } as Message)))
    } catch {
      setFirebaseAvailable(false)
    }
  }

  const addReaction = async (messageId: string, emoji: string) => {
    if (!firebaseAvailable) return
    const current = userReactions[messageId]

    try {
      const ref = doc(db, 'messages', messageId)
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(ref)
        if (!snap.exists()) return
        const reactions: Record<string, number> = { ...(snap.data().reactions ?? {}) }

        if (current === emoji) {
          reactions[emoji] = Math.max(0, (reactions[emoji] ?? 0) - 1)
          if (reactions[emoji] === 0) delete reactions[emoji]
        } else {
          if (current) {
            reactions[current] = Math.max(0, (reactions[current] ?? 0) - 1)
            if (reactions[current] === 0) delete reactions[current]
          }
          reactions[emoji] = (reactions[emoji] ?? 0) + 1
        }
        tx.update(ref, { reactions })
      })

      const next = { ...userReactions }
      if (current === emoji) {
        delete next[messageId]
      } else {
        next[messageId] = emoji
      }
      setUserReactions(next)
      localStorage.setItem('userReactions', JSON.stringify(next))
      await loadMessages()
    } catch { /* ignore */ }
  }

  const addMessage = async () => {
    const trimmed = message.trim()
    if (!trimmed || trimmed.length < 3 || !firebaseAvailable) return
    if (trimmed.length > 200) return

    setLoading(true)
    try {
      await addDoc(collection(db, 'messages'), { text: trimmed, timestamp: new Date() })
      setMessage('')
      await loadMessages()
    } catch { /* ignore */ }
    setLoading(false)
  }

  const copyPortfolioLink = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {})
  }

  const { average, total, breakdown } = ratingData

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-16 text-center">
        <h2 className="text-5xl font-bold mb-4 gradient-text" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Engage &amp; Connect
        </h2>
        <p className="text-slate-400 text-lg">Rate, share, and leave your thoughts</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Rating */}
        <div className="glass rounded-2xl p-6 text-center glow-hover">
          <h3 className="text-2xl font-semibold text-slate-200 mb-4">Rate This Portfolio</h3>

          {total > 0 && (
            <div className="mb-4">
              <div className="text-3xl font-bold text-yellow-400 mb-1">{average.toFixed(1)}</div>
              <div className="text-sm text-slate-400">Based on {total} rating{total !== 1 ? 's' : ''}</div>
              <div className="mt-3 space-y-1">
                {[5, 4, 3, 2, 1].map(star => {
                  const count = (breakdown[star] as number) ?? 0
                  const pct = total > 0 ? (count / total) * 100 : 0
                  return (
                    <div key={star} className="flex items-center text-xs gap-2">
                      <span className="w-3 text-slate-400">{star}</span>
                      <div className="flex-1 bg-slate-700 rounded-full h-1.5">
                        <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-6 text-slate-400 text-right">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="flex justify-center space-x-2 mb-4" role="group" aria-label="Rate this portfolio">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => handleRating(star)}
                disabled={hasRated || !firebaseAvailable}
                aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                className={`text-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded ${
                  star <= rating ? 'text-yellow-400' : 'text-slate-600'
                } ${!hasRated && firebaseAvailable ? 'hover:text-yellow-300' : 'cursor-default'}`}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>

          {hasRated ? (
            <p className="text-green-400 text-sm">Thanks for rating!</p>
          ) : !firebaseAvailable ? (
            <p className="text-slate-500 text-sm">Rating unavailable</p>
          ) : (
            <p className="text-slate-400 text-sm">Click to rate</p>
          )}
        </div>

        {/* Share */}
        <div className="glass rounded-2xl p-6 glow-hover">
          <h3 className="text-2xl font-semibold text-slate-200 mb-4 text-center">Share Portfolio</h3>
          <div className="space-y-3">
            <a
              href={`https://twitter.com/intent/tweet?text=Check out this developer portfolio!&url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-4 py-3 rounded-xl transition-all hover:scale-105 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Share on X / Twitter
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 px-4 py-3 rounded-xl transition-all hover:scale-105 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Share on LinkedIn
            </a>
            <button
              onClick={copyPortfolioLink}
              className="w-full glass hover:bg-slate-700/50 px-4 py-3 rounded-xl transition-all hover:scale-105 font-medium border border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              Copy Link
            </button>
          </div>
        </div>
      </div>

      {/* Guestbook */}
      {firebaseAvailable && (
        <div className="glass rounded-2xl p-6 glow">
          <h3 className="text-2xl font-semibold text-slate-200 mb-4">Leave a Message</h3>
          <div className="flex space-x-3 mb-4">
            <label htmlFor="guestbook-message" className="sr-only">Your message</label>
            <input
              id="guestbook-message"
              type="text"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Leave a quick message… (max 200 chars)"
              maxLength={200}
              className="flex-1 bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={e => e.key === 'Enter' && addMessage()}
            />
            <button
              onClick={addMessage}
              disabled={loading || message.trim().length < 3}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 px-6 py-3 rounded-xl transition-all hover:scale-105 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loading ? 'Adding…' : 'Add'}
            </button>
          </div>

          {messages.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-slate-300 font-medium">Recent Messages</h4>
              {messages.map(msg => (
                <div key={msg.id} className="glass rounded-xl p-4 card-hover">
                  <p className="text-slate-300 mb-2">{msg.text}</p>
                  <div className="flex items-center space-x-2">
                    {REACTIONS.map(({ key, label, icon }) => {
                      const isUser = userReactions[msg.id] === key
                      return (
                        <button
                          key={key}
                          onClick={() => addReaction(msg.id, key)}
                          aria-label={`React with ${label}`}
                          aria-pressed={isUser}
                          className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors focus:outline-none focus:ring-1 focus:ring-blue-400 ${
                            isUser ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-600 hover:bg-slate-500'
                          }`}
                        >
                          {icon}
                          <span className="text-slate-300">{msg.reactions?.[key] ?? 0}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Engagement
