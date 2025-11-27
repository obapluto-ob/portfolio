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
        <div className="text-4xl mb-4">🎉</div>
        <h3 className="text-xl font-bold text-blue-400 mb-2">Konami Code Activated!</h3>
        <p className="text-slate-300 mb-4">You found the secret! 🕹️</p>
        <p className="text-sm text-slate-400">
          Thanks for exploring my portfolio thoroughly!
        </p>
      </div>
    </div>
  )
}

export default EasterEgg