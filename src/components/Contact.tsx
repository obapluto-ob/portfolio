import React from 'react'

const Contact = () => {
  return (
    <div className="h-full bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4 text-blue-400">Contact</h2>
      <p className="text-xs text-gray-400 mb-4">
        "Code is only as powerful as the problems it solves."
      </p>
      <div className="space-y-2">
        <a 
          href="mailto:obedemoni@gmail.com"
          className="block bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-xs font-semibold transition-colors text-center"
        >
          Email
        </a>
        <a 
          href="https://linkedin.com/in/obed-lopeyok"
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-xs font-semibold transition-colors text-center"
        >
          LinkedIn
        </a>
      </div>
    </div>
  )
}

export default Contact