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
      
      <div className="text-sm text-slate-500">
        Scroll right to explore →
      </div>
    </div>
  )
}

export default Hero