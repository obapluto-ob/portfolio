import React from 'react'

interface BackToTopProps {
  currentPage: number
  onGoToTop: () => void
}

const BackToTop: React.FC<BackToTopProps> = ({ currentPage, onGoToTop }) => {
  if (currentPage === 0) return null

  return (
    <button
      onClick={onGoToTop}
      className="fixed bottom-20 right-8 p-3 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg transition-all hover:scale-110 z-40"
      aria-label="Back to top"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  )
}

export default BackToTop