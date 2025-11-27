import React from 'react'

const Contact = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-8">
          <span className="text-blue-400">Let's Connect</span>
        </h2>
        <p className="text-xl text-gray-400 mb-12">
          "Code is only as powerful as the problems it solves. I build to solve, not just to ship." 
          <br />Let's connect and build something amazing together!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <a 
            href="https://github.com/obapluto-ob"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <span>GitHub</span>
            <span>→</span>
          </a>
          <a 
            href="https://linkedin.com/in/obed-lopeyok"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <span>LinkedIn</span>
            <span>→</span>
          </a>
          <a 
            href="mailto:obedemoni@gmail.com"
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <span>Email</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  )
}

export default Contact