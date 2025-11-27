import React from 'react'

const LearningJourney = () => {
  const milestones = [
    {
      period: "2024 - Present",
      title: "Full-stack Development at Moringa School",
      description: "Intensive bootcamp covering modern web and mobile development",
      skills: ["React", "Django", "Flutter", "PostgreSQL"]
    },
    {
      period: "Current Focus",
      title: "Building Real-World Projects",
      description: "Applying learned concepts to create functional applications",
      skills: ["TypeScript", "API Integration", "Database Design"]
    },
    {
      period: "Next Goals",
      title: "Professional Development",
      description: "Seeking opportunities to contribute to meaningful projects",
      skills: ["Team Collaboration", "Code Reviews", "Best Practices"]
    }
  ]

  return (
    <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700">
      <h3 className="text-xl font-medium text-slate-200 mb-6">Learning Journey</h3>
      <div className="space-y-6">
        {milestones.map((milestone, index) => (
          <div key={index} className="relative">
            {index < milestones.length - 1 && (
              <div className="absolute left-3 top-8 w-0.5 h-12 bg-slate-600"></div>
            )}
            <div className="flex items-start space-x-4">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs text-blue-400 font-medium">{milestone.period}</span>
                </div>
                <h4 className="font-medium text-slate-200 mb-1">{milestone.title}</h4>
                <p className="text-sm text-slate-400 mb-2">{milestone.description}</p>
                <div className="flex flex-wrap gap-1">
                  {milestone.skills.map((skill, skillIndex) => (
                    <span 
                      key={skillIndex}
                      className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LearningJourney