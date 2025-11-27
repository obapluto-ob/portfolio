import React, { useState, useEffect } from 'react'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import ErrorBoundary from './components/ErrorBoundary'
import ThemeToggle from './components/ThemeToggle'
import ScrollProgress from './components/ScrollProgress'
import BackToTop from './components/BackToTop'
import analytics from './utils/analytics'

interface PageConfig {
  component: React.ComponentType
  name: string
  scrollable: boolean
}

const pages: PageConfig[] = [
  { component: Hero, name: 'Home', scrollable: false },
  { component: Skills, name: 'Skills', scrollable: true },
  { component: Projects, name: 'Projects', scrollable: true },
  { component: About, name: 'About', scrollable: true },
  { component: Contact, name: 'Contact', scrollable: false }
]

function App() {
  const [currentPage, setCurrentPage] = useState(0)

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      const newPage = currentPage + 1
      setCurrentPage(newPage)
      analytics.trackPageView(pages[newPage].name)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1
      setCurrentPage(newPage)
      analytics.trackPageView(pages[newPage].name)
    }
  }

  const goToPage = (index: number) => {
    setCurrentPage(index)
    analytics.trackPageView(pages[index].name)
  }

  const goToTop = () => {
    goToPage(0)
  }

  const currentPageConfig = pages[currentPage]
  const CurrentComponent = currentPageConfig.component

  useEffect(() => {
    analytics.trackPageView(pages[currentPage].name)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevPage()
      if (e.key === 'ArrowRight') nextPage()
      if (e.key === 'Escape') goToPage(0)
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentPage])

  return (
    <div className="h-screen bg-slate-900 text-white relative overflow-hidden">
      <ScrollProgress currentPage={currentPage} totalPages={pages.length} />
      <ThemeToggle />
      {/* Skip to content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50"
      >
        Skip to main content
      </a>
      
      {/* Current Page */}
      <main 
        id="main-content"
        className={`h-full ${
          currentPageConfig.scrollable ? 'overflow-y-auto p-8' : 'flex items-center justify-center'
        }`}
        role="main"
        aria-label={`${currentPageConfig.name} section`}
      >
        <ErrorBoundary>
          <CurrentComponent />
        </ErrorBoundary>
      </main>

      {/* Navigation Dots */}
      <nav 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3"
        role="navigation"
        aria-label="Page navigation"
      >
        {pages.map((page, index) => (
          <button
            key={page.name}
            onClick={() => goToPage(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentPage ? 'bg-blue-500' : 'bg-slate-600 hover:bg-slate-500'
            }`}
            aria-label={`Go to ${page.name} page`}
            aria-current={index === currentPage ? 'page' : undefined}
          />
        ))}
      </nav>

      {/* Navigation Arrows */}
      {currentPage > 0 && (
        <button
          onClick={prevPage}
          className="absolute left-8 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-2"
          aria-label="Previous page"
        >
          ←
        </button>
      )}
      
      {currentPage < pages.length - 1 && (
        <button
          onClick={nextPage}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-2"
          aria-label="Next page"
        >
          →
        </button>
      )}

      {/* Page Indicator */}
      <div className="absolute top-8 right-16 text-slate-500 text-sm">
        {currentPage + 1} / {pages.length}
      </div>
      
      <BackToTop currentPage={currentPage} onGoToTop={goToTop} />
    </div>
  )
}

export default App