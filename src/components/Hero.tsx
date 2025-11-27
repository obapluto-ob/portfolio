import React from 'react'

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="text-blue-400">Obed Emoni Lopeyok</span>
        </h1>
        <h2 className="text-2xl md:text-3xl text-gray-300 mb-8">
          Full-stack Web & Mobile Developer | Moringa School | Nairobi, Kenya
        </h2>
        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Full-stack Web & Mobile Developer at Moringa School, Nairobi. I specialize in building functional, 
          clean, and scalable web and mobile applications using modern technologies. I believe in learning by building.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="#projects" 
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            View My Work
          </a>
          <a 
            href="https://github.com/obapluto-ob" 
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gray-600 hover:border-gray-400 px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            GitHub Profile
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero