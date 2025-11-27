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
    <div className="h-full bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4 text-blue-400">Contact</h2>
      <p className="text-xs text-gray-400 mb-4">
        "Code is only as powerful as the problems it solves."
      </p>
      <div className="space-y-2">
        <a 
          href={emailLink}
          className="block bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-xs font-semibold transition-colors text-center"
        >
          📧 Email Me
        </a>
        <a 
          href={phoneLink}
          className="block bg-orange-600 hover:bg-orange-700 px-3 py-2 rounded text-xs font-semibold transition-colors text-center"
        >
          📱 Call: 0729237059
        </a>
        <a 
          href="https://linkedin.com/in/obed-emoni"
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-xs font-semibold transition-colors text-center"
        >
          💼 LinkedIn
        </a>
      </div>
    </div>
  )
}

export default Contact