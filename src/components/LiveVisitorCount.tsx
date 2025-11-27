import React, { useState, useEffect } from 'react'

const LiveVisitorCount = () => {
  const [activeVisitors, setActiveVisitors] = useState(1)
  const [totalVisitors, setTotalVisitors] = useState(0)

  useEffect(() => {
    // Simulate live visitors (random between 1-5)
    const updateActiveVisitors = () => {
      setActiveVisitors(Math.floor(Math.random() * 5) + 1)
    }

    // Get total visitors
    const total = localStorage.getItem('portfolioVisitors')
    if (total) setTotalVisitors(parseInt(total))

    // Update active visitors every 10-30 seconds
    const interval = setInterval(updateActiveVisitors, Math.random() * 20000 + 10000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed bottom-4 left-4 bg-slate-800/90 text-slate-300 px-3 py-2 rounded-lg text-xs border border-slate-600 z-40">
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>{activeVisitors} online now</span>
        </div>
        <div className="text-slate-500 text-center">
          {totalVisitors.toLocaleString()} total visits
        </div>
      </div>
    </div>
  )
}

export default LiveVisitorCount