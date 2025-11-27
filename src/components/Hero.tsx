import React from 'react'
import { personalInfo } from '../data/portfolio'
import TypingAnimation from './TypingAnimation'
import PortfolioRating from './PortfolioRating'
import ShareButtons from './ShareButtons'
import analytics from '../utils/analytics'

const Hero = () => {
  const handleContactClick = () => {
    analytics.trackClick('contact_cta', 'hero')
  }
  return (
    <div className="text-center space-y-8">
      <div className="mb-8">
        <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-blue-500/30 shadow-2xl">
          <img 
            src="/4992579386737363750_121.jpg" 
            alt={personalInfo.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(personalInfo.name)}&size=128&background=3b82f6&color=ffffff&bold=true`
            }}
          />
        </div>
        <h1 className="text-6xl font-light mb-6">
          {personalInfo.name}
        </h1>
        <p className="text-2xl mb-4">
          <span className="text-slate-400">Full-stack </span>
          <TypingAnimation 
            texts={[
              "Web Developer",
              "Mobile Developer", 
              "Python Developer",
              "React Specialist"
            ]}
          />
        </p>
        <p className="text-lg text-slate-500">
          Moringa School • {personalInfo.location}
        </p>
      </div>
      
      <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
        {personalInfo.bio}
      </p>
      
      <div className="flex justify-center mt-8">
        <a
          href={`mailto:${personalInfo.email}`}
          onClick={handleContactClick}
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-all hover:scale-105 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>Get In Touch</span>
        </a>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4 max-w-md mx-auto mt-8">
        <PortfolioRating />
        <ShareButtons />
      </div>
      
      <div className="text-sm text-slate-500 mt-6">
        Navigate: Arrows • Dots • Keyboard
      </div>
    </div>
  )
}

export default Hero