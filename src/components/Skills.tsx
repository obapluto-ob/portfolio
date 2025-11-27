import React from 'react'

const Skills = () => {
  const skills = ["Python", "JavaScript", "React", "Django", "React Native", "Flutter", "Node.js", "PostgreSQL"]

  return (
    <div className="bg-slate-800/50 rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4 text-slate-200">Technical Skills</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, i) => (
          <span key={i} className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm font-medium">
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}

export default Skills