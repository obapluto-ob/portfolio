import React, { useState, useEffect } from 'react'
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

const LiveVisitorCounter = () => {
  const [currentVisitors, setCurrentVisitors] = useState(0)
  const [totalViews, setTotalViews] = useState(0)
  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 9))

  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // Add current visitor
        await setDoc(doc(db, 'visitors', sessionId), {
          timestamp: new Date(),
          lastSeen: new Date()
        })

        // Update total views
        const statsRef = doc(db, 'portfolio', 'stats')
        const statsDoc = await getDoc(statsRef)
        const currentStats = statsDoc.exists() ? statsDoc.data() : { totalViews: 0 }
        
        await setDoc(statsRef, {
          ...currentStats,
          totalViews: (currentStats.totalViews || 0) + 1,
          lastUpdated: new Date()
        }, { merge: true })

      } catch (error) {
        console.error('Error tracking visitor:', error)
      }
    }

    const updateHeartbeat = async () => {
      try {
        await setDoc(doc(db, 'visitors', sessionId), {
          timestamp: new Date(),
          lastSeen: new Date()
        }, { merge: true })
      } catch (error) {
        console.error('Error updating heartbeat:', error)
      }
    }

    // Track initial visit
    trackVisitor()

    // Update heartbeat every 30 seconds
    const heartbeatInterval = setInterval(updateHeartbeat, 30000)

    // Listen to visitor count changes
    const unsubscribeVisitors = onSnapshot(doc(db, 'portfolio', 'visitors'), (doc) => {
      if (doc.exists()) {
        setCurrentVisitors(doc.data().count || 0)
      }
    })

    // Listen to stats changes
    const unsubscribeStats = onSnapshot(doc(db, 'portfolio', 'stats'), (doc) => {
      if (doc.exists()) {
        setTotalViews(doc.data().totalViews || 0)
      }
    })

    // Cleanup on unmount
    return () => {
      clearInterval(heartbeatInterval)
      unsubscribeVisitors()
      unsubscribeStats()
      
      // Remove visitor on leave
      setDoc(doc(db, 'visitors', sessionId), {
        timestamp: new Date(),
        lastSeen: new Date(),
        left: true
      }, { merge: true }).catch(() => {})
    }
  }, [sessionId])

  return (
    <div className="fixed bottom-4 right-4 bg-slate-800/90 backdrop-blur-sm border border-slate-600 rounded-lg p-3 text-sm z-50">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-slate-300">{currentVisitors} online</span>
        </div>
        <div className="text-slate-400">
          {totalViews.toLocaleString()} views
        </div>
      </div>
    </div>
  )
}

export default LiveVisitorCounter