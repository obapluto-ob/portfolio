import React, { useState, useEffect } from 'react'

const EasterEgg = () => {
  const [showEgg, setShowEgg] = useState(false)
  const [sequence, setSequence] = useState<string[]>([])
  const targetSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight']

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        setSequence(prev => {
          const newSequence = [...prev, e.key].slice(-8)
          
          if (JSON.stringify(newSequence) === JSON.stringify(targetSequence)) {
            setShowEgg(true)
            setTimeout(() => setShowEgg(false), 3000)
            return []
          }
          
          return newSequence
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!showEgg) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-slate-800 border border-blue-500 rounded-lg p-8 text-center animate-bounce">
        <div className="w-12 h-12 mb-4 mx-auto text-blue-400">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-blue-400 mb-2">Konami Code Activated!</h3>
        <p className="text-slate-300 mb-4">You found the secret!</p>
        <p className="text-sm text-slate-400">
          Thanks for exploring my portfolio thoroughly!
        </p>
      </div>
    </div>
  )
}

export default EasterEgg