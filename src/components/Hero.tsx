import React from 'react'
import { personalInfo } from '../data/portfolio'
import TypingAnimation from './TypingAnimation'
import analytics from '../utils/analytics'

const Hero = () => {
  const handleContactClick = () => {
    analytics.trackClick('contact_cta', 'hero')
  }
  return (
    <div className="text-center space-y-8 relative">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="mb-8 relative z-10">
        {/* Profile image with glow */}
        <div className="relative w-40 h-40 mx-auto mb-8 group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity animate-pulse"></div>
          <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-slate-700 shadow-2xl">
            <img 
              src="/4992579386737363750_121.jpg" 
              alt={personalInfo.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(personalInfo.name)}&size=160&background=3b82f6&color=ffffff&bold=true`
              }}
            />
          </div>
        </div>

        {/* Name with gradient */}
        <h1 className="text-7xl font-bold mb-6 gradient-text" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
          {personalInfo.name}
        </h1>
        
        {/* Typing animation with better styling */}
        <div className="text-3xl mb-4 h-12">
          <span className="text-slate-300 font-light">Full-stack </span>
          <TypingAnimation 
            texts={[
              "Web Developer",
              "Mobile Developer", 
              "Python Developer",
              "React Specialist"
            ]}
          />
        </div>
        
        <p className="text-lg text-slate-400 flex items-center justify-center gap-2">
          <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          Moringa School • {personalInfo.location}
        </p>
      </div>
      
      {/* Bio with glass effect */}
      <div className="glass rounded-2xl p-8 max-w-2xl mx-auto relative z-10">
        <p className="text-slate-300 text-lg leading-relaxed">
          {personalInfo.bio}
        </p>
      </div>
      
      {/* CTA buttons */}
      <div className="flex justify-center gap-4 mt-8 relative z-10">
        <a
          href={`mailto:${personalInfo.email}`}
          onClick={handleContactClick}
          className="group relative inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-xl transition-all hover:scale-105 font-semibold text-lg shadow-lg glow-hover"
        >
          <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>Get In Touch</span>
        </a>
        
        <a
          href={`https://github.com/${personalInfo.github}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 glass hover:bg-slate-700/50 px-8 py-4 rounded-xl transition-all hover:scale-105 font-semibold text-lg border border-slate-600"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
          <span>View GitHub</span>
        </a>
      </div>
      
      {/* Navigation hint with animation */}
      <div className="text-sm text-slate-500 mt-12 flex items-center justify-center gap-2 animate-bounce relative z-10">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        <span>Navigate: Arrows • Dots • Keyboard</span>
      </div>
    </div>
  )
}

export default Hero