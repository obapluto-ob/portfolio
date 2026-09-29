import React, { useState, useEffect, useRef } from 'react'
import Hero from './components/Hero'
import AboutEnhanced from './components/AboutEnhanced'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Professional from './components/Professional'
import EngagementNew from './components/EngagementNew'
import Sponsor from './components/Sponsor'
import ErrorBoundary from './components/ErrorBoundary'
import ScrollProgress from './components/ScrollProgress'
import BackToTop from './components/BackToTop'
import LoadingSpinner from './components/LoadingSpinner'
import LiveVisitorCounter from './components/LiveVisitorCounter'
import EasterEgg from './components/EasterEgg'
import PerformanceMonitor from './components/PerformanceMonitor'
import MatrixRain from './components/MatrixRain'
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
  { component: Professional, name: 'Professional', scrollable: true },
  { component: EngagementNew, name: 'Engage', scrollable: true },
  { component: Sponsor, name: 'Sponsor', scrollable: true },
  { component: AboutEnhanced, name: 'About & Contact', scrollable: true }
]

function App() {
  const [currentPage, setCurrentPage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const currentPageRef = useRef(currentPage)

  useEffect(() => {
    currentPageRef.current = currentPage
  }, [currentPage])

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

  // Track initial page view
  useEffect(() => {
    analytics.trackPageView(pages[currentPage].name)
  }, [currentPage])

  // Handle keyboard navigation — use ref to avoid stale closure
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const page = currentPageRef.current
      if (e.key === 'ArrowLeft' && page > 0) {
        const newPage = page - 1
        setCurrentPage(newPage)
        analytics.trackPageView(pages[newPage].name)
      }
      if (e.key === 'ArrowRight' && page < pages.length - 1) {
        const newPage = page + 1
        setCurrentPage(newPage)
        analytics.trackPageView(pages[newPage].name)
      }
      if (e.key === 'Escape') {
        setCurrentPage(0)
        analytics.trackPageView(pages[0].name)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (isLoading) {
    return <LoadingSpinner onDone={() => setIsLoading(false)} />
  }

  return (
    <div className="min-h-screen text-white relative" style={{ background: 'var(--bg)' }}>
      <MatrixRain />
      <ScrollProgress currentPage={currentPage} totalPages={pages.length} />
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
        className={`min-h-screen relative z-10 ${
          currentPageConfig.scrollable ? 'overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 pb-20' : 'flex items-center justify-center p-4'
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
        className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 sm:space-x-3 z-50"
        role="navigation"
        aria-label="Page navigation"
      >
        {pages.map((page, index) => (
          <button
            key={page.name}
            onClick={() => goToPage(index)}
            className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all"
            style={{
              background: index === currentPage ? 'var(--green)' : 'var(--text-muted)',
              boxShadow: index === currentPage ? '0 0 8px var(--green-glow)' : 'none'
            }}
            aria-label={`Go to ${page.name} page`}
            aria-current={index === currentPage ? 'page' : undefined}
          />
        ))}
      </nav>

      {/* Navigation Arrows — z-50 so they sit above main content */}
      {currentPage > 0 && (
        <button
          onClick={prevPage}
          className="fixed left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-50 focus:outline-none rounded p-3 transition-all hover:scale-110"
          style={{ color: 'var(--green)', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border)' }}
          aria-label="Previous page"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      
      {currentPage < pages.length - 1 && (
        <button
          onClick={nextPage}
          className="fixed right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-50 focus:outline-none rounded p-3 transition-all hover:scale-110"
          style={{ color: 'var(--green)', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border)' }}
          aria-label="Next page"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Page Indicator */}
      <div className="fixed top-4 right-4 sm:right-8 text-xs sm:text-sm font-mono z-50" style={{ color: 'var(--text-dim)' }}>
        {currentPage + 1} / {pages.length}
      </div>
      
      <BackToTop currentPage={currentPage} onGoToTop={goToTop} />
      <LiveVisitorCounter />
      <EasterEgg />
      <PerformanceMonitor />
    </div>
  )
}

export default App