import React, { useState, useEffect } from 'react'
import { doc, setDoc, getDoc, onSnapshot, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase'

const LiveVisitorCounter = () => {
  const [currentVisitors, setCurrentVisitors] = useState(0)
  const [totalViews, setTotalViews] = useState(0)
  const [sessionId] = useState(() => Math.random().toString(36).substring(2, 11))

  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // Check if user already visited today
        const today = new Date().toDateString()
        const lastVisit = localStorage.getItem('lastVisit')
        
        // Add current visitor
        await setDoc(doc(db, 'visitors', sessionId), {
          timestamp: new Date(),
          lastSeen: new Date(),
          active: true
        })

        // Only increment views if new visitor today
        if (lastVisit !== today) {
          const statsRef = doc(db, 'portfolio', 'stats')
          const statsDoc = await getDoc(statsRef)
          const currentStats = statsDoc.exists() ? statsDoc.data() : { totalViews: 0 }
          
          await setDoc(statsRef, {
            ...currentStats,
            totalViews: (currentStats.totalViews || 0) + 1,
            lastUpdated: new Date()
          }, { merge: true })
          
          localStorage.setItem('lastVisit', today)
        }

      } catch (error) {
        console.error('Error tracking visitor:', error)
      }
    }

    const updateHeartbeat = async () => {
      try {
        await setDoc(doc(db, 'visitors', sessionId), {
          lastSeen: new Date(),
          active: true
        }, { merge: true })
      } catch (error) {
        console.error('Error updating heartbeat:', error)
      }
    }

    const countActiveVisitors = async () => {
      try {
        const visitorsSnapshot = await getDocs(collection(db, 'visitors'))
        const now = new Date()
        let activeCount = 0
        const cleanupPromises: Promise<void>[] = []
        
        visitorsSnapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data()
          const lastSeen = data.lastSeen?.toDate()
          
          if (lastSeen) {
            const timeDiff = now.getTime() - lastSeen.getTime()
            const minutesDiff = timeDiff / (1000 * 60)
            
            if (minutesDiff < 2) {
              activeCount++
            } else {
              cleanupPromises.push(deleteDoc(docSnapshot.ref))
            }
          }
        })
        
        // Execute cleanup
        await Promise.all(cleanupPromises)
        setCurrentVisitors(activeCount)
      } catch (error) {
        console.error('Error counting visitors:', error)
      }
    }

    // Track initial visit
    trackVisitor()

    // Update heartbeat every 30 seconds
    const heartbeatInterval = setInterval(updateHeartbeat, 30000)
    
    // Count active visitors every 10 seconds
    const countInterval = setInterval(countActiveVisitors, 10000)
    
    // Initial count
    countActiveVisitors()

    // Listen to stats changes
    const unsubscribeStats = onSnapshot(doc(db, 'portfolio', 'stats'), (doc) => {
      if (doc.exists()) {
        setTotalViews(doc.data().totalViews || 0)
      }
    })

    // Cleanup on unmount
    return () => {
      clearInterval(heartbeatInterval)
      clearInterval(countInterval)
      unsubscribeStats()
      
      // Remove visitor on leave
      deleteDoc(doc(db, 'visitors', sessionId)).catch(() => {})
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