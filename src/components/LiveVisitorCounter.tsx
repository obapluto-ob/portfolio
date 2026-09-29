import React, { useState, useEffect } from 'react'
import { doc, setDoc, getDoc, onSnapshot, collection, getDocs, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase'

// Honest visitor counter backed by Firestore.
// "Online" = sessions that sent a heartbeat in the last 2 minutes.
// "Views" = unique daily visits tracked server-side via Firestore.
// Falls back silently if Firebase is unavailable.

const LiveVisitorCounter = () => {
  const [currentVisitors, setCurrentVisitors] = useState<number | null>(null)
  const [totalViews, setTotalViews] = useState<number | null>(null)
  const [sessionId] = useState(() => Math.random().toString(36).substring(2, 11))
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let heartbeatInterval: ReturnType<typeof setInterval>
    let countInterval: ReturnType<typeof setInterval>
    let unsubscribeStats: (() => void) | undefined

    const init = async () => {
      try {
        // Register this session
        await setDoc(doc(db, 'visitors', sessionId), {
          lastSeen: new Date(),
          active: true
        })

        // Increment daily view count once per day per browser
        const today = new Date().toDateString()
        const lastVisit = localStorage.getItem('lastVisit')
        if (lastVisit !== today) {
          const statsRef = doc(db, 'portfolio', 'stats')
          const statsDoc = await getDoc(statsRef)
          const current = statsDoc.exists() ? (statsDoc.data().totalViews ?? 0) : 0
          await setDoc(statsRef, { totalViews: current + 1, lastUpdated: new Date() }, { merge: true })
          localStorage.setItem('lastVisit', today)
        }

        // Heartbeat
        heartbeatInterval = setInterval(async () => {
          try {
            await setDoc(doc(db, 'visitors', sessionId), { lastSeen: new Date(), active: true }, { merge: true })
          } catch { /* ignore */ }
        }, 30_000)

        // Count active sessions (heartbeat < 2 min ago)
        const countActive = async () => {
          try {
            const snap = await getDocs(collection(db, 'visitors'))
            const now = Date.now()
            let active = 0
            const stale: Promise<void>[] = []
            snap.forEach(d => {
              const last = d.data().lastSeen?.toDate?.()
              if (last && now - last.getTime() < 2 * 60_000) {
                active++
              } else {
                stale.push(deleteDoc(d.ref))
              }
            })
            await Promise.all(stale)
            setCurrentVisitors(active)
          } catch { /* ignore */ }
        }

        await countActive()
        countInterval = setInterval(countActive, 15_000)

        // Listen to total views
        unsubscribeStats = onSnapshot(doc(db, 'portfolio', 'stats'), snap => {
          if (snap.exists()) setTotalViews(snap.data().totalViews ?? null)
        })

        setVisible(true)
      } catch {
        // Firebase unavailable — hide the widget entirely
        setVisible(false)
      }
    }

    init()

    return () => {
      clearInterval(heartbeatInterval)
      clearInterval(countInterval)
      unsubscribeStats?.()
      deleteDoc(doc(db, 'visitors', sessionId)).catch(() => {})
    }
  }, [sessionId])

  if (!visible) return null

  return (
    <div
      className="fixed bottom-4 right-4 bg-slate-800/90 backdrop-blur-sm border border-slate-600 rounded-lg p-3 text-sm z-50"
      aria-label="Site visitor statistics"
    >
      <div className="flex items-center space-x-4">
        {currentVisitors !== null && (
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" aria-hidden="true"></span>
            <span className="text-slate-300">{currentVisitors} online</span>
          </div>
        )}
        {totalViews !== null && (
          <span className="text-slate-400">{totalViews.toLocaleString()} views</span>
        )}
      </div>
    </div>
  )
}

export default LiveVisitorCounter
