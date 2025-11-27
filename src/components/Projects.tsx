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
    <div className="h-full bg-gray-800 rounded-lg p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-blue-400">Projects</h2>
      <div className="grid grid-cols-3 gap-3 h-full">
        {projects.map((project, index) => (
          <div key={index} className="bg-gray-900 rounded-lg p-3 flex flex-col">
            <h3 className="text-sm font-semibold mb-2 text-blue-300">
              {project.title}
            </h3>
            <p className="text-xs text-gray-400 mb-2 flex-1">
              {project.description.substring(0, 80)}...
            </p>
            <div className="flex flex-wrap gap-1 mb-2">
              {project.tech.slice(0, 3).map((tech, i) => (
                <span key={i} className="bg-blue-900 text-blue-200 px-1 py-0.5 rounded text-xs">
                  {tech}
                </span>
              ))}
            </div>
            <a 
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-xs font-medium"
            >
              GitHub →
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Projects