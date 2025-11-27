import React from 'react'

const Skills = () => {
  const skills = ["Python", "JavaScript", "React", "Django", "React Native", "Flutter", "Node.js", "PostgreSQL"]

  return (
    <div className="h-full bg-gray-800 rounded-lg p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-blue-400">Skills</h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, i) => (
          <span key={i} className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-xs">
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}

export default Skills