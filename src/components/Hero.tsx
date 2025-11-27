import React from 'react'

const Hero = () => {
  return (
    <div className="text-center space-y-8">
      <div>
        <h1 className="text-6xl font-light mb-6">
          Obed Emoni Lopeyok
        </h1>
        <p className="text-2xl text-slate-400 mb-4">
          Full-stack Web & Mobile Developer
        </p>
        <p className="text-lg text-slate-500">
          Moringa School • Nairobi, Kenya
        </p>
      </div>
      
      <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
        Building scalable web and mobile applications with modern technologies. 
        Passionate about solving real-world problems through code.
      </p>
      
      <div className="flex items-center justify-center space-x-6 mt-8">
        <div className="text-sm text-slate-500">
          Navigate: Arrows • Dots • Keyboard
        </div>
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
          <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
          <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
          <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}

export default Hero