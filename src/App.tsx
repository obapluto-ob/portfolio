import React from 'react'
import Hero from './components/Hero'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Contact from './components/Contact'

function App() {
  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden">
      <div className="flex h-full">
        {/* Left Panel - Hero */}
        <div className="w-2/5 flex items-center justify-center p-12 border-r border-slate-700">
          <Hero />
        </div>
        
        {/* Right Panel - Content */}
        <div className="w-3/5 p-8 space-y-6">
          <Skills />
          <Projects />
          <Contact />
        </div>
      </div>
    </div>
  )
}

export default App