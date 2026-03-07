import React from 'react'
import { personalInfo } from '../data/portfolio'

const Sponsor = () => {
  return (
    <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 gradient-text" style={{fontFamily: 'Space Grotesk, sans-serif'}}>
            Support My Work
          </h2>
          <p className="text-slate-300 text-lg sm:text-xl mb-4">
            Help me continue building amazing projects
          </p>
        </div>

        {/* Main Card */}
        <div className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 glow mb-6 sm:mb-8">
          {/* GitHub Sponsor Icon */}
          <div className="mb-6 sm:mb-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full blur-2xl opacity-75 animate-pulse"></div>
              <div className="relative bg-slate-800 rounded-full p-6 sm:p-8">
                <svg className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mb-6 sm:mb-8 space-y-4">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-200 mb-4">
              Become a Sponsor
            </h3>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto px-2">
              Your sponsorship helps me dedicate more time to open source projects, 
              create educational content, and build tools that benefit the developer community.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
            <div className="glass rounded-xl p-4 sm:p-6">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400 mb-3 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h4 className="text-base sm:text-lg font-semibold text-slate-200 mb-2">Priority Support</h4>
              <p className="text-slate-400 text-xs sm:text-sm">Get faster responses to your questions and issues</p>
            </div>
            <div className="glass rounded-xl p-4 sm:p-6">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400 mb-3 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="text-base sm:text-lg font-semibold text-slate-200 mb-2">Feature Requests</h4>
              <p className="text-slate-400 text-xs sm:text-sm">Influence the direction of my projects</p>
            </div>
            <div className="glass rounded-xl p-4 sm:p-6">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-pink-400 mb-3 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <h4 className="text-base sm:text-lg font-semibold text-slate-200 mb-2">Exclusive Access</h4>
              <p className="text-slate-400 text-xs sm:text-sm">Early access to new projects and features</p>
            </div>
          </div>

          {/* CTA Button */}
          <a
            href={`https://github.com/sponsors/${personalInfo.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 hover:from-pink-700 hover:to-blue-700 px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl transition-all hover:scale-105 font-bold text-base sm:text-lg md:text-xl shadow-2xl glow-hover"
          >
            <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span>Sponsor on GitHub</span>
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          <p className="text-slate-500 text-xs sm:text-sm mt-4 sm:mt-6">
            One-time or monthly sponsorship available
          </p>
        </div>

        {/* Additional Info */}
        <div className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8">
          <h4 className="text-lg sm:text-xl font-semibold text-slate-200 mb-4 sm:mb-6">Other Ways to Support</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h5 className="font-medium text-slate-200 text-sm sm:text-base">Star My Repos</h5>
                <p className="text-slate-400 text-xs sm:text-sm">Show your appreciation by starring projects on GitHub</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h5 className="font-medium text-slate-200 text-sm sm:text-base">Share My Work</h5>
                <p className="text-slate-400 text-xs sm:text-sm">Help others discover my projects by sharing them</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h5 className="font-medium text-slate-200 text-sm sm:text-base">Contribute Code</h5>
                <p className="text-slate-400 text-xs sm:text-sm">Submit pull requests and help improve projects</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h5 className="font-medium text-slate-200 text-sm sm:text-base">Spread the Word</h5>
                <p className="text-slate-400 text-xs sm:text-sm">Tell your network about my work and projects</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sponsor
