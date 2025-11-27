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
    <div>
      <h3 className="text-lg mb-3 text-slate-300">Projects</h3>
      <div className="space-y-2">
        {projects.slice(0, 2).map((project, index) => (
          <div key={index}>
            <a 
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
            >
              {project.title}
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Projects