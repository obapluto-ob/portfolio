import React, { useState, useEffect } from 'react'
import SmartStorage from '../utils/smartStorage'

const LiveVisitorCount = () => {
  const [stats, setStats] = useState({ total: 0, today: 0, online: 1 })

  useEffect(() => {
    // Track this visitor
    SmartStorage.trackVisitor()
    
    // Get real stats
    const updateStats = () => {
      const visitorStats = SmartStorage.getVisitorStats()
      setStats(visitorStats)
    }
    
    updateStats()
    
    // Update stats every 30 seconds
    const interval = setInterval(updateStats, 30000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed bottom-4 left-4 bg-slate-800/90 text-slate-300 px-3 py-2 rounded-lg text-xs border border-slate-600 z-40">
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>{stats.online} online now</span>
        </div>
        <div className="text-slate-500 text-center">
          {stats.total.toLocaleString()} total visits
        </div>
      </div>
    </div>
  )
}

export default LiveVisitorCount