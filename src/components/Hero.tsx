import React from 'react'

const Hero = () => {
  return (
    <div className="text-center space-y-8">
      <div>
        <h1 className="text-4xl font-light mb-3 tracking-wide">
          Obed Emoni Lopeyok
        </h1>
        <div className="w-16 h-0.5 bg-blue-500 mx-auto mb-6"></div>
        <h2 className="text-xl text-slate-300 font-light">
          Full-stack Developer
        </h2>
        <p className="text-slate-400 mt-2">
          Moringa School • Nairobi
        </p>
      </div>
      
      <p className="text-slate-400 leading-relaxed max-w-sm mx-auto">
        Building scalable web and mobile applications with modern technologies
      </p>
      
      <a 
        href="https://github.com/obapluto-ob" 
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-sm font-medium transition-all duration-200 hover:scale-105"
      >
        View Work
      </a>
    </div>
  )
}

export default Hero