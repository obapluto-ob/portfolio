import React from 'react'
import { skillCategories } from '../data/portfolio'
import LazyImage from './LazyImage'

const Skills = () => {

  return (
    <div className="text-center max-w-6xl mx-auto">
      <header>
        <h2 className="text-4xl font-light mb-12 text-slate-300">Technical Skills</h2>
      </header>
      
      <div className="space-y-12">
        {Object.entries(skillCategories).map(([category, skills]) => (
          <div key={category}>
            <h3 className="text-xl font-medium text-slate-200 mb-6">{category}</h3>
            <div className="grid grid-cols-4 gap-8 max-w-lg mx-auto">
              {skills.map((skill) => (
                <div key={skill.name} className="flex flex-col items-center space-y-3 group">
                  <LazyImage
                    src={skill.icon}
                    alt={`${skill.name} icon`}
                    className="w-12 h-12 filter brightness-75 group-hover:brightness-100 transition-all duration-300"
                    fallback={
                      <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                        <span className="text-slate-400 text-xs font-mono">
                          {skill.name.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                    }
                  />
                  <span className="text-slate-400 text-xs group-hover:text-slate-300 transition-colors">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Skills