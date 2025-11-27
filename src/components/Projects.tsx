import React from 'react'

const Projects = () => {
  return (
    <div className="text-center">
      <h2 className="text-4xl font-light mb-8 text-slate-300">Projects</h2>
      <div className="space-y-6 max-w-lg mx-auto">
        <p className="text-slate-400 text-lg">
          Currently building exciting projects at Moringa School.
        </p>
        <p className="text-slate-500">
          Check back soon to see my latest work, or visit my GitHub for ongoing development.
        </p>
        <a 
          href="https://github.com/obapluto-ob"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded transition-colors"
        >
          View GitHub
        </a>
      </div>
    </div>
  )
}

export default Projects