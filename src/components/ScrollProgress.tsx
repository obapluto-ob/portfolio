import React, { useState, useEffect } from 'react'

interface ScrollProgressProps {
  currentPage: number
  totalPages: number
}

const ScrollProgress: React.FC<ScrollProgressProps> = ({ currentPage, totalPages }) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const newProgress = ((currentPage + 1) / totalPages) * 100
    setProgress(newProgress)
  }, [currentPage, totalPages])

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-slate-800 z-50">
      <div 
        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export default ScrollProgress