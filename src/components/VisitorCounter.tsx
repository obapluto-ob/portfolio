import React, { useState, useEffect } from 'react'

const VisitorCounter = () => {
  const [visitors, setVisitors] = useState(0)

  useEffect(() => {
    // Get current count from localStorage
    const currentCount = localStorage.getItem('portfolioVisitors')
    const count = currentCount ? parseInt(currentCount) : 0
    
    // Increment and save
    const newCount = count + 1
    localStorage.setItem('portfolioVisitors', newCount.toString())
    setVisitors(newCount)
  }, [])

  return (
    <div className="fixed bottom-4 left-4 bg-slate-800/80 text-slate-300 px-3 py-2 rounded-lg text-xs border border-slate-600 z-40">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span>{visitors.toLocaleString()} visitors</span>
      </div>
    </div>
  )
}

export default VisitorCounter