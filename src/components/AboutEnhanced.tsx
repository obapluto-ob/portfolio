import React, { useState, useEffect } from 'react'
import { personalInfo } from '../data/portfolio'
import SectionHeader from './SectionHeader'
import LazyImage from './LazyImage'
import ContactForm from './ContactForm'
import ResumeDownload from './ResumeDownload'
import Testimonials from './Testimonials'
import SocialLinks from './SocialLinks'
import analytics from '../utils/analytics'

const AboutEnhanced = () => {
  const [readme, setReadme] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReadme = async () => {
      try {
        const readmeResponse = await fetch('https://raw.githubusercontent.com/obapluto-ob/obapluto-ob/main/README.md')
        if (readmeResponse.ok) {
          const readmeText = await readmeResponse.text()
          setReadme(readmeText)
        }
      } catch (error) {
        console.log('No profile README found')
      }
      setLoading(false)
    }

    fetchReadme()
  }, [])

  if (loading) {
    return (
      <div className="text-center max-w-4xl mx-auto">
        <h2 className="text-4xl font-light mb-12 text-slate-300">About Me</h2>
        <div className="text-slate-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <LazyImage
          src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg"
          alt="Python"
          className="w-16 h-16 mx-auto animate-bounce opacity-80"
        />
      </div>
      
      <SectionHeader title="About Me" className="mb-8" />
      
      {readme ? (
        <div className="bg-slate-800/30 rounded-lg p-8 border border-slate-700">
          <div className="text-left text-slate-400 space-y-4">
            {readme.split('\n').map((line, index) => {
              if (line.includes('<img') || line.includes('<p align') || line.includes('</p>') || line.includes('<h1') || line.includes('</h1>') || line.includes('<h3') || line.includes('</h3>')) {
                return null
              }
              
              if (line.toLowerCase().includes('project') || line.toLowerCase().includes('repository') || line.toLowerCase().includes('repo') || line.toLowerCase().includes('crypto') || line.toLowerCase().includes('sms-control') || line.toLowerCase().includes('portfolio') || line.toLowerCase().includes('dashboard') || line.toLowerCase().includes('cms')) {
                return null
              }
              
              if (line.startsWith('## ')) {
                const headerText = line.replace('## ', '')
                if (headerText.toLowerCase().includes('project')) return null
                return <h4 key={index} className="text-xl font-medium text-slate-200 mt-6 mb-3">{headerText}</h4>
              }
              if (line.startsWith('### ')) {
                return <h5 key={index} className="text-lg font-medium text-slate-300 mt-4 mb-2">{line.replace('### ', '')}</h5>
              }
              
              if (line.startsWith('- ')) {
                return <li key={index} className="ml-4 mb-1 text-slate-300">{line.replace('- ', '• ')}</li>
              }
              
              if (line.trim() === '---') {
                return <hr key={index} className="border-slate-600 my-6" />
              }
              
              if (line.startsWith('> ')) {
                return <blockquote key={index} className="border-l-4 border-blue-500 pl-4 italic text-slate-300 my-4 text-lg">{line.replace('> ', '').replace(/[*"]/g, '')}</blockquote>
              }
              
              if (line.includes('![') || line.includes('https://img.shields.io') || !line.trim()) {
                return null
              }
              
              if (line.trim()) {
                return <p key={index} className="leading-relaxed text-slate-300">{line}</p>
              }
              
              return null
            }).filter(Boolean)}
          </div>
        </div>
      ) : (
        <div className="bg-slate-800/30 rounded-lg p-8 border border-slate-700 text-center">
          <h3 className="text-xl font-medium text-slate-200 mb-4">My Journey</h3>
          <p className="text-slate-400 leading-relaxed">
            Currently pursuing Full-stack Development at Moringa School in Nairobi. 
            Passionate about creating solutions that bridge the gap between complex problems 
            and elegant code. I believe in continuous learning and building projects that matter.
          </p>
        </div>
      )}
      
      <div className="text-center mt-8">
        <a 
          href={`https://github.com/${personalInfo.github}?tab=repositories`}
          target="_blank" 
          rel="noopener noreferrer"
          onClick={() => analytics.trackClick('github_repositories', 'about')}
          className="inline-flex items-center px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors border border-slate-600"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
          </svg>
          View My Repositories
        </a>
      </div>
      
      <div className="mt-16 border-t border-slate-700 pt-12">
        <SectionHeader title="Let's Work Together" />
        
        <div className="mb-12">
          <p className="text-xl text-slate-300 mb-4 text-center">
            Ready to bring your ideas to life?
          </p>
          <p className="text-slate-400 max-w-2xl mx-auto text-center">
            I'm available for freelance projects, full-time opportunities, and collaborations. 
            Let's discuss how we can build something amazing together.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-800/30 rounded-lg p-8 border border-slate-700">
            <h3 className="text-xl font-medium text-slate-200 mb-6">Get In Touch</h3>
            <div className="space-y-4">
              <ResumeDownload />
              
              <div className="pt-4">
                <h4 className="text-sm font-medium text-slate-300 mb-3">Connect with me</h4>
                <SocialLinks />
              </div>
              
              <a 
                href={`mailto:${personalInfo.email}?subject=${encodeURIComponent("Hiring Inquiry - Full-stack Developer Position")}&body=${encodeURIComponent(`Hi Obed,\n\nI came across your portfolio and I'm impressed with your work. I would like to discuss potential opportunities for:\n\n□ Full-stack Web Development\n□ Mobile App Development\n□ Project Collaboration\n□ Other: ___________\n\nProject Details:\n- Timeline: \n- Budget Range: \n- Technology Requirements: \n\nBest regards,\n[Your Name]\n[Your Company]\n[Your Contact]`)}`}
                onClick={() => analytics.trackClick('contact_email', 'contact')}
                className="flex items-center space-x-3 p-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all group w-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div className="text-left">
                  <div className="font-medium">Email Me</div>
                  <div className="text-sm opacity-90">{personalInfo.email}</div>
                </div>
              </a>
              
              <a 
                href="tel:+254729237059"
                onClick={() => analytics.trackClick('contact_phone', 'contact')}
                className="flex items-center space-x-3 p-4 border border-slate-600 hover:border-slate-500 hover:bg-slate-800 rounded-lg transition-all w-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div className="text-left">
                  <div className="font-medium text-slate-300">Call Me</div>
                  <div className="text-sm text-slate-400">+254 729 237 059</div>
                </div>
              </a>
            </div>
          </div>

          <ContactForm />
        </div>
        
        <div className="mb-12">
          <Testimonials />
        </div>

        <div className="text-center mb-20">
          <p className="text-slate-500 text-sm">
            Based in {personalInfo.location} • Available for remote work worldwide
          </p>
        </div>
      </div>
    </div>
  )
}

export default AboutEnhanced