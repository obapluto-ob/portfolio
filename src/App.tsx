import React from 'react'
import Hero from './components/Hero'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Contact from './components/Contact'

function App() {
  return (
    <div className="h-screen bg-gray-900 text-white overflow-hidden">
      <div className="flex h-full">
        {/* Left Panel - Hero */}
        <div className="w-1/3 flex items-center justify-center p-8">
          <Hero />
        </div>
        
        {/* Right Panel - Content */}
        <div className="w-2/3 flex flex-col">
          {/* Top Row */}
          <div className="h-1/2 flex">
            <div className="w-1/2 p-4">
              <Skills />
            </div>
            <div className="w-1/2 p-4">
              <Contact />
            </div>
          </div>
          
          {/* Bottom Row - Projects */}
          <div className="h-1/2 p-4">
            <Projects />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App