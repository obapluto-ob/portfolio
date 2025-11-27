import React from 'react'

const Contact = () => {
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

  const emailLink = `mailto:obedemoni@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
  const phoneLink = "tel:+254729237059"

  return (
    <div>
      <h3 className="text-lg mb-3 text-slate-300">Contact</h3>
      <div className="space-y-1">
        <div>
          <a 
            href={emailLink}
            className="text-slate-400 hover:text-white transition-colors"
          >
            obedemoni@gmail.com
          </a>
        </div>
        <div>
          <a 
            href={phoneLink}
            className="text-slate-400 hover:text-white transition-colors"
          >
            0729237059
          </a>
        </div>
        <div>
          <a 
            href="https://linkedin.com/in/obed-emoni"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  )
}

export default Contact