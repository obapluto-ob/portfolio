import React from 'react'
import Hero from './components/Hero'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Contact from './components/Contact'

function App() {
  return (
    <div className="h-screen bg-slate-900 text-white overflow-hidden flex">
      {/* Left - Name & Title */}
      <div className="w-1/2 flex items-center justify-center">
        <Hero />
      </div>
      
      {/* Right - Everything Else */}
      <div className="w-1/2 flex flex-col justify-center space-y-12 pr-16">
        <Skills />
        <Projects />
        <Contact />
      </div>
    </div>
  )
}

export default App