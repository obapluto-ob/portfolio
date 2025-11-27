import React, { useState, useEffect } from 'react'

const PortfolioRating = () => {
  const [rating, setRating] = useState(0)
  const [averageRating, setAverageRating] = useState(0)
  const [totalRatings, setTotalRatings] = useState(0)
  const [hasRated, setHasRated] = useState(false)

  useEffect(() => {
    const ratings = JSON.parse(localStorage.getItem('portfolioRatings') || '[]')
    const userRated = localStorage.getItem('userRated')
    
    if (ratings.length > 0) {
      const avg = ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length
      setAverageRating(avg)
      setTotalRatings(ratings.length)
    }
    
    if (userRated) {
      setHasRated(true)
      setRating(parseInt(userRated))
    }
  }, [])

  const handleRating = (stars: number) => {
    if (hasRated) return
    
    const ratings = JSON.parse(localStorage.getItem('portfolioRatings') || '[]')
    ratings.push(stars)
    localStorage.setItem('portfolioRatings', JSON.stringify(ratings))
    localStorage.setItem('userRated', stars.toString())
    
    const avg = ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length
    setAverageRating(avg)
    setTotalRatings(ratings.length)
    setRating(stars)
    setHasRated(true)
  }

  return (
    <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700 text-center">
      <h4 className="text-sm font-medium text-slate-200 mb-3">Rate This Portfolio</h4>
      <div className="flex justify-center space-x-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRating(star)}
            disabled={hasRated}
            className={`text-xl transition-colors ${
              star <= (rating || 0) ? 'text-yellow-400' : 'text-slate-600'
            } ${!hasRated ? 'hover:text-yellow-300' : 'cursor-default'}`}
          >
            ★
          </button>
        ))}
      </div>
      {totalRatings > 0 && (
        <div className="text-xs text-slate-400">
          {averageRating.toFixed(1)}/5 ({totalRatings} ratings)
        </div>
      )}
      {hasRated && (
        <div className="text-xs text-green-400 mt-1">Thanks for rating!</div>
      )}
    </div>
  )
}

export default PortfolioRating