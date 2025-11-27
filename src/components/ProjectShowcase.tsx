import React from 'react'
import analytics from '../utils/analytics'

interface Project {
  title: string
  description: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  status: 'live' | 'demo' | 'development'
}

const ProjectShowcase = () => {
  const projects: Project[] = [
    {
      title: "AutoClaimToken",
      description: "Crypto recovery tool with token scanner, wallet discovery, and seed phrase restoration using dictionary brute force attacks. Advanced blockchain utilities.",
      technologies: ["JavaScript", "Blockchain", "Crypto APIs", "Security"],
      liveUrl: "https://autoclaimtoken.vercel.app",
      githubUrl: "https://github.com/obapluto-ob/autoclaimtoken",
      status: "live"
    },
    {
      title: "StopWatch Pro",
      description: "Precision stopwatch application for gym workouts, athletics training, and cooking. Features lap timing and clean interface.",
      technologies: ["JavaScript", "HTML5", "CSS3"],
      liveUrl: "https://phase-1-stop-watch-applictation.vercel.app/",
      githubUrl: "https://github.com/obapluto-ob/phase-1-stop-watch-applictation",
      status: "live"
    },
    {
      title: "Ludomania Gaming Platform",
      description: "Competitive Ludo gaming platform where players can compete for real money. Landing page showcases features and allows developer collaboration requests.",
      technologies: ["React", "Node.js", "Gaming Logic"],
      liveUrl: "https://ludomania-iota.vercel.app",
      githubUrl: "https://github.com/obapluto-ob/ludomania",
      status: "development"
    }
  ]

  const handleProjectClick = (projectTitle: string, type: 'live' | 'github') => {
    analytics.trackClick(`project_${type}`, projectTitle)
  }

  if (projects.length === 0) {
    return (
      <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700">
        <h3 className="text-xl font-medium text-slate-200 mb-6">Featured Projects</h3>
        <div className="text-center py-8">
          <p className="text-slate-400 mb-4">Working on exciting projects at Moringa School</p>
          <p className="text-sm text-slate-500 mb-4">
            Will showcase live deployments here soon!
          </p>
          <div className="text-xs text-slate-600">
            <p>Currently building:</p>
            <div className="flex justify-center space-x-2 mt-2">
              <span className="bg-slate-700 px-2 py-1 rounded">Web Apps</span>
              <span className="bg-slate-700 px-2 py-1 rounded">Mobile Apps</span>
              <span className="bg-slate-700 px-2 py-1 rounded">APIs</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700">
      <h3 className="text-xl font-medium text-slate-200 mb-6">Featured Projects</h3>
      <div className="space-y-6">
        {projects.map((project, index) => (
          <div key={index} className="border border-slate-600 rounded-lg p-6">
            <div className="flex items-start justify-between mb-3">
              <h4 className="text-lg font-medium text-slate-200">{project.title}</h4>
              <span className={`text-xs px-2 py-1 rounded ${
                project.status === 'live' ? 'bg-green-600 text-white' :
                project.status === 'demo' ? 'bg-blue-600 text-white' :
                'bg-yellow-600 text-white'
              }`}>
                {project.status === 'live' ? 'Live' : 
                 project.status === 'demo' ? 'Demo' : 'In Progress'}
              </span>
            </div>
            
            <p className="text-slate-400 mb-4">{project.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.map((tech, techIndex) => (
                <span 
                  key={techIndex}
                  className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
            
            <div className="flex space-x-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleProjectClick(project.title, 'live')}
                  className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span>View Live</span>
                </a>
              )}
              
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleProjectClick(project.title, 'github')}
                  className="inline-flex items-center space-x-2 border border-slate-600 hover:border-slate-500 hover:bg-slate-800 px-4 py-2 rounded text-sm transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                  <span>Code</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProjectShowcase