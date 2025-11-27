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
    <div className="text-center">
      <h2 className="text-4xl font-light mb-12 text-slate-300">Let's Connect</h2>
      <div className="space-y-6 max-w-md mx-auto">
        <div>
          <p className="text-slate-500 mb-2">Email</p>
          <a 
            href={emailLink}
            className="text-xl text-slate-300 hover:text-white transition-colors"
          >
            obedemoni@gmail.com
          </a>
        </div>
        <div>
          <p className="text-slate-500 mb-2">Phone</p>
          <a 
            href={phoneLink}
            className="text-xl text-slate-300 hover:text-white transition-colors"
          >
            0729237059
          </a>
        </div>
        <div>
          <p className="text-slate-500 mb-2">LinkedIn</p>
          <a 
            href="https://linkedin.com/in/obed-emoni"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl text-slate-300 hover:text-white transition-colors"
          >
            /in/obed-emoni
          </a>
        </div>
      </div>
    </div>
  )
}

export default Contact