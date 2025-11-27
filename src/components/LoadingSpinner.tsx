import React from 'react'

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-slate-900 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-500 rounded-full animate-spin animation-delay-150"></div>
        </div>
        <p className="mt-4 text-slate-400 animate-pulse">Loading Portfolio...</p>
      </div>
    </div>
  )
}

export default LoadingSpinner