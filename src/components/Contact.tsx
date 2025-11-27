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
    <div className="text-center">
      <SectionHeader title="Let's Connect" />
      <div className="space-y-6 max-w-md mx-auto">
        <div>
          <p className="text-slate-500 mb-2">Email</p>
          <a 
            href={emailLink}
            onClick={() => handleContactClick('email')}
            className="text-xl text-slate-300 hover:text-white transition-colors"
          >
            {personalInfo.email}
          </a>
        </div>
        <div>
          <p className="text-slate-500 mb-2">Phone</p>
          <a 
            href={phoneLink}
            onClick={() => handleContactClick('phone')}
            className="text-xl text-slate-300 hover:text-white transition-colors"
          >
            0729237059
          </a>
        </div>
        <div>
          <p className="text-slate-500 mb-2">LinkedIn</p>
          <a 
            href={personalInfo.linkedin || "https://linkedin.com/in/obed-emoni"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleContactClick('linkedin')}
            className="text-xl text-slate-300 hover:text-white transition-colors"
          >
            /in/obed-emoni
          </a>
        </div>
        <div>
          <p className="text-slate-500 mb-2">GitHub</p>
          <a 
            href={`https://github.com/${personalInfo.github}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleContactClick('github')}
            className="text-xl text-slate-300 hover:text-white transition-colors"
          >
            @{personalInfo.github}
          </a>
        </div>
      </div>
    </div>
  )
}

export default Contact