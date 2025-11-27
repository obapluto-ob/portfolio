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
    <div className="bg-slate-800/50 rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4 text-slate-200">Get In Touch</h3>
      <div className="grid grid-cols-3 gap-3">
        <a 
          href={emailLink}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-medium transition-colors text-center"
        >
          Email
        </a>
        <a 
          href={phoneLink}
          className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded text-sm font-medium transition-colors text-center"
        >
          Call
        </a>
        <a 
          href="https://linkedin.com/in/obed-emoni"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded text-sm font-medium transition-colors text-center"
        >
          LinkedIn
        </a>
      </div>
      <p className="text-xs text-slate-500 mt-3 text-center">
        0729237059 • obedemoni@gmail.com
      </p>
    </div>
  )
}

export default Contact