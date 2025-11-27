import React from 'react'

const Skills = () => {
  const skills = [
    { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Django", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" },
    { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
    { name: "Flutter", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg" },
    { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" }
  ]

  return (
    <div className="text-center">
      <h2 className="text-4xl font-light mb-12 text-slate-300">Technical Skills</h2>
      <div className="grid grid-cols-4 gap-12 max-w-2xl mx-auto">
        {skills.map((skill, i) => (
          <div key={i} className="flex flex-col items-center space-y-3">
            <img 
              src={skill.icon} 
              alt={skill.name}
              className="w-16 h-16 filter brightness-75 hover:brightness-100 transition-all"
            />
            <span className="text-slate-400 text-sm">{skill.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Skills