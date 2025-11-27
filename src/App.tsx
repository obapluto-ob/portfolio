import React from 'react'
import Hero from './components/Hero'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Contact from './components/Contact'

function App() {
  return (
    <div className="h-screen bg-slate-900 text-white overflow-x-auto overflow-y-hidden">
      <div className="flex h-full w-[400vw]">
        {/* Page 1 - Hero */}
        <div className="w-screen flex items-center justify-center">
          <Hero />
        </div>
        
        {/* Page 2 - Skills */}
        <div className="w-screen flex items-center justify-center">
          <Skills />
        </div>
        
        {/* Page 3 - Projects */}
        <div className="w-screen flex items-center justify-center">
          <Projects />
        </div>
        
        {/* Page 4 - Contact */}
        <div className="w-screen flex items-center justify-center">
          <Contact />
        </div>
      </div>
    </div>
  )
}

export default App