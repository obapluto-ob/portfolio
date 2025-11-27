import React from 'react'

const Projects = () => {
  const projects = [
    {
      title: "Portfolio Website",
      description: "Modern React portfolio with automated Git deployment",
      tech: ["React", "TypeScript", "Tailwind CSS", "GitHub Actions"],
      github: "https://github.com/obapluto-ob/portfolio",
      live: "https://obapluto-ob.github.io/portfolio"
    }
    // Add more projects here as you build them
  ]

  return (
    <section id="projects" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">
          <span className="text-blue-400">Featured Projects</span>
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
              <h3 className="text-xl font-semibold mb-3 text-blue-300">
                {project.title}
              </h3>
              <p className="text-gray-400 mb-4">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((tech, i) => (
                  <span key={i} className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-sm">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                <a 
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  GitHub →
                </a>
                {project.live && (
                  <a 
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 font-medium"
                  >
                    Live Demo →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a 
            href="https://github.com/obapluto-ob"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 font-medium text-lg"
          >
            View All Projects on GitHub →
          </a>
        </div>
      </div>
    </section>
  )
}

export default Projects