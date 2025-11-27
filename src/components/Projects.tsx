import React from 'react'

const Projects = () => {
  return (
    <div className="text-center">
      <h2 className="text-4xl font-light mb-12 text-slate-300">My Work</h2>
      <div className="space-y-8 max-w-2xl mx-auto">
        <div className="bg-slate-800/30 rounded-lg p-8 border border-slate-700">
          <div className="mb-6">
            <img 
              src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
              alt="GitHub"
              className="w-16 h-16 mx-auto mb-4 rounded-lg"
            />
            <h3 className="text-xl font-medium text-slate-200 mb-2">GitHub Portfolio</h3>
            <p className="text-slate-400 mb-6">
              Explore my repositories, contributions, and coding journey. 
              See real projects, code quality, and development progress.
            </p>
          </div>
          <a 
            href="https://github.com/obapluto-ob"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded transition-all hover:scale-105"
          >
            <span>View All Projects</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
        

      </div>
    </div>
  )
}

export default Projects