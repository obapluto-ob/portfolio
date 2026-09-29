import { useState, useEffect } from 'react'

interface ScrollProgressProps {
  currentPage: number
  totalPages: number
}

const ScrollProgress = ({ currentPage, totalPages }: ScrollProgressProps) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setProgress(((currentPage + 1) / totalPages) * 100)
  }, [currentPage, totalPages])

  return (
    <div className="fixed top-0 left-0 w-full z-50" style={{ height: '2px', background: 'var(--text-muted)' }}>
      <div
        className="h-full transition-all duration-500 ease-out"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, var(--green-dark), var(--green), var(--green-bright))',
          boxShadow: '0 0 8px var(--green-glow), 0 0 20px var(--green-soft)',
        }}
      />
    </div>
  )
}

export default ScrollProgress
