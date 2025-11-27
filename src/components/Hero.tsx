import React from 'react'

const Hero = () => {
  return (
    <div className="text-center">
      <h1 className="text-3xl lg:text-4xl font-bold mb-4">
        <span className="text-blue-400">Obed Emoni Lopeyok</span>
      </h1>
      <h2 className="text-lg lg:text-xl text-gray-300 mb-4">
        Full-stack Web & Mobile Developer
      </h2>
      <p className="text-sm lg:text-base text-gray-400 mb-6">
        Moringa School | Nairobi, Kenya
      </p>
      <p className="text-xs lg:text-sm text-gray-500 mb-6">
        Building functional, scalable web and mobile applications with modern technologies.
      </p>
      <div className="flex flex-col gap-3">
        <a 
          href="https://github.com/obapluto-ob" 
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-semibold transition-colors"
        >
          GitHub Profile
        </a>
        <a 
          href="mailto:obedemoni@gmail.com"
          className="border border-gray-600 hover:border-gray-400 px-4 py-2 rounded text-sm font-semibold transition-colors"
        >
          Contact Me
        </a>
      </div>
    </div>
  )
}

export default Hero