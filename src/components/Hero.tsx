import React from 'react'
import { personalInfo } from '../data/portfolio'
import analytics from '../utils/analytics'

const Hero = () => {
  const handleResumeDownload = () => {
    analytics.trackClick('resume_download', 'hero')
  }

  const handleContactClick = () => {
    analytics.trackClick('contact_cta', 'hero')
  }
  return (
    <div className="text-center space-y-8">
      <div>
        <h1 className="text-6xl font-light mb-6">
          {personalInfo.name}
        </h1>
        <p className="text-2xl text-slate-400 mb-4">
          {personalInfo.title}
        </p>
        <p className="text-lg text-slate-500">
          Moringa School • {personalInfo.location}
        </p>
      </div>
      
      <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
        {personalInfo.bio}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
        <a
          href={personalInfo.resume}
          download="Obed_Emoni_Lopeyok_Resume.pdf"
          onClick={handleResumeDownload}
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-all hover:scale-105 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Download Resume</span>
        </a>
        
        <a
          href={`mailto:${personalInfo.email}`}
          onClick={handleContactClick}
          className="inline-flex items-center space-x-2 border border-slate-600 hover:border-slate-500 px-6 py-3 rounded-lg transition-all hover:bg-slate-800"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>Get In Touch</span>
        </a>
      </div>
      
      <div className="text-sm text-slate-500 mt-8">
        Navigate: Arrows • Dots • Keyboard
      </div>
    </div>
  )
}

export default Hero