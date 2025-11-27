import React from 'react'

const Projects = () => {
  const projects = [
    {
      title: "Crypto Investment Dashboard",
      description: "A portfolio tracker and real-time crypto app with news, charts, and secure transaction history",
      tech: ["React", "JavaScript", "API Integration", "Charts"],
      github: "https://github.com/obapluto-ob/crypto-dashboard",
      live: null,
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&h=300&fit=crop"
    },
    {
      title: "SMS-Control System",
      description: "Control a mobile device remotely via SMS commands (location, WhatsApp trigger)",
      tech: ["Python", "SMS API", "Mobile Integration"],
      github: "https://github.com/obapluto-ob/sms-control",
      live: null,
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&h=300&fit=crop"
    },
    {
      title: "Personal Portfolio CMS",
      description: "Fully customizable Django-powered personal site with login, dashboard, and blog features",
      tech: ["Django", "Python", "PostgreSQL", "HTML/CSS"],
      github: "https://github.com/obapluto-ob/portfolio-cms",
      live: null,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop"
    }
  ]

  return (
    <div className="bg-slate-800/50 rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4 text-slate-200">Featured Projects</h3>
      <div className="space-y-4">
        {projects.slice(0, 2).map((project, index) => (
          <div key={index} className="border-l-2 border-blue-500 pl-4">
            <h4 className="font-medium text-slate-200 mb-1">
              {project.title}
            </h4>
            <p className="text-sm text-slate-400 mb-2">
              {project.description.substring(0, 100)}...
            </p>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {project.tech.slice(0, 2).map((tech, i) => (
                  <span key={i} className="text-xs text-slate-500">
                    {tech}
                  </span>
                ))}
              </div>
              <a 
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                View
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Projects