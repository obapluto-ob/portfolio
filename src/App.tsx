import React, { useState } from 'react'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'

function App() {
  const [currentPage, setCurrentPage] = useState(0)
  const pages = [Hero, About, Skills, Projects, Contact]

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const CurrentComponent = pages[currentPage]

  return (
    <div className="h-screen bg-slate-900 text-white relative overflow-hidden">
      {/* Current Page */}
      <div className={`h-full ${
        currentPage === 1 || currentPage === 3 ? 'overflow-y-auto p-8' : 'flex items-center justify-center'
      }`}>
        <CurrentComponent />
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {pages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentPage ? 'bg-blue-500' : 'bg-slate-600 hover:bg-slate-500'
            }`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      {currentPage > 0 && (
        <button
          onClick={prevPage}
          className="absolute left-8 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white text-2xl"
        >
          ←
        </button>
      )}
      
      {currentPage < pages.length - 1 && (
        <button
          onClick={nextPage}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white text-2xl"
        >
          →
        </button>
      )}

      {/* Page Indicator */}
      <div className="absolute top-8 right-8 text-slate-500 text-sm">
        {currentPage + 1} / {pages.length}
      </div>
    </div>
  )
}

export default App