import React from 'react'

const Skills = () => {
  const skillCategories = [
    {
      title: "Programming Languages",
      skills: ["Python", "JavaScript", "HTML5", "CSS3"]
    },
    {
      title: "Frameworks & Libraries",
      skills: ["React", "Django", "Node.js", "Express"]
    },
    {
      title: "Databases",
      skills: ["PostgreSQL", "SQLite"]
    },
    {
      title: "Tools & Platforms",
      skills: ["Git", "VS Code", "Postman", "Figma", "Docker", "Linux"]
    }
  ]

  return (
    <section className="py-20 px-4 bg-gray-800">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">
          <span className="text-blue-400">Technical Skills</span>
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {skillCategories.map((category, index) => (
            <div key={index} className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-blue-300">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, i) => (
                  <span key={i} className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills