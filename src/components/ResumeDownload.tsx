import React from 'react'

const ResumeDownload = () => {
  const handleDownload = () => {
    // Create a simple resume content
    const resumeContent = `
OBED EMONI LOPEYOK
Full-Stack Developer

Email: obedlopeyok@gmail.com
Phone: +254 729 237 059
GitHub: github.com/obapluto-ob
Portfolio: https://obapluto-ob.github.io/portfolio

SKILLS
• Languages: Python, JavaScript, TypeScript, Dart
• Frameworks: React, Django, Node.js, Flutter
• Databases: PostgreSQL, MongoDB, SQLite
• Tools: Git, Docker, VS Code, Linux

PROJECTS
• BPay App - Modern payment solution platform (bpayapp.co.ke)
• StopWatch Pro - Precision timing application
• Ludomania Gaming Platform - Competitive gaming platform

EDUCATION
Full-stack Development - Moringa School, Nairobi

CONTACT
Ready for freelance projects and full-time opportunities.
    `
    
    const blob = new Blob([resumeContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'Obed_Emoni_Lopeyok_Resume.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg transition-colors font-medium"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <span>Download Resume</span>
    </button>
  )
}

export default ResumeDownload