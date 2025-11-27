import React from 'react'
import { personalInfo } from '../data/portfolio'
import SectionHeader from './SectionHeader'
import analytics from '../utils/analytics'

const Contact = () => {
  const handleContactClick = (method: string) => {
    analytics.trackClick(`contact_${method}`, 'contact')
  }
  const emailSubject = "Hiring Inquiry - Full-stack Developer Position"
  const emailBody = `Hi Obed,

I came across your portfolio and I'm impressed with your work. I would like to discuss potential opportunities for:

□ Full-stack Web Development
□ Mobile App Development
□ Project Collaboration
□ Other: ___________

Project Details:
- Timeline: 
- Budget Range: 
- Technology Requirements: 

Best regards,
[Your Name]
[Your Company]
[Your Contact]`

  const emailLink = `mailto:${personalInfo.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
  const phoneLink = "tel:+254729237059"

  return (
    <div className="text-center max-w-4xl mx-auto">
      <SectionHeader title="Let's Work Together" />
      
      <div className="mb-12">
        <p className="text-xl text-slate-300 mb-4">
          Ready to bring your ideas to life?
        </p>
        <p className="text-slate-400 max-w-2xl mx-auto">
          I'm available for freelance projects, full-time opportunities, and collaborations. 
          Let's discuss how we can build something amazing together.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Primary Contact */}
        <div className="bg-slate-800/30 rounded-lg p-8 border border-slate-700">
          <h3 className="text-xl font-medium text-slate-200 mb-6">Get In Touch</h3>
          <div className="space-y-4">
            <a 
              href={emailLink}
              onClick={() => handleContactClick('email')}
              className="flex items-center space-x-3 p-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all group"
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
              href={phoneLink}
              onClick={() => handleContactClick('phone')}
              className="flex items-center space-x-3 p-4 border border-slate-600 hover:border-slate-500 hover:bg-slate-800 rounded-lg transition-all"
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

        {/* Social Links */}
        <div className="bg-slate-800/30 rounded-lg p-8 border border-slate-700">
          <h3 className="text-xl font-medium text-slate-200 mb-6">Connect Online</h3>
          <div className="space-y-4">
            <a 
              href={`https://github.com/${personalInfo.github}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleContactClick('github')}
              className="flex items-center space-x-3 p-4 border border-slate-600 hover:border-slate-500 hover:bg-slate-800 rounded-lg transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
              <div className="text-left">
                <div className="font-medium text-slate-300">GitHub</div>
                <div className="text-sm text-slate-400">@{personalInfo.github}</div>
              </div>
            </a>
            
            <a 
              href={personalInfo.linkedin || "https://linkedin.com/in/obed-emoni"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleContactClick('linkedin')}
              className="flex items-center space-x-3 p-4 border border-slate-600 hover:border-slate-500 hover:bg-slate-800 rounded-lg transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" />
              </svg>
              <div className="text-left">
                <div className="font-medium text-slate-300">LinkedIn</div>
                <div className="text-sm text-slate-400">/in/obed-emoni</div>
              </div>
            </a>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-slate-500 text-sm">
          Based in {personalInfo.location} • Available for remote work worldwide
        </p>
      </div>
    </div>
  )
}

export default Contact