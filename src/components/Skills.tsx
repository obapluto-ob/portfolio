import React from 'react'
import { skillCategories } from '../data/portfolio'
import LazyImage from './LazyImage'

const Skills = () => {

  return (
    <div className="text-center max-w-6xl mx-auto">
      <header className="mb-16">
        <h2 className="text-5xl font-bold mb-4 gradient-text" style={{fontFamily: 'Space Grotesk, sans-serif'}}>Technical Skills</h2>
        <p className="text-slate-400 text-lg">Technologies I work with daily</p>
      </header>
      
      <div className="space-y-12">
        {Object.entries(skillCategories).map(([category, skills]) => (
          <div key={category}>
            <h3 className="text-2xl font-semibold text-slate-200 mb-8 flex items-center justify-center gap-2">
              <span className="w-8 h-0.5 bg-gradient-to-r from-transparent to-blue-500"></span>
              {category}
              <span className="w-8 h-0.5 bg-gradient-to-l from-transparent to-blue-500"></span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {skills.map((skill) => (
                <div key={skill.name} className="glass rounded-2xl p-6 card-hover glow-hover group cursor-pointer">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-xl group-hover:bg-blue-500/40 transition-all"></div>
                      <LazyImage
                        src={skill.icon}
                        alt={`${skill.name} icon`}
                        className="relative w-16 h-16 filter brightness-90 group-hover:brightness-110 group-hover:scale-110 transition-all duration-300"
                        fallback={
                          <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white text-lg font-bold">
                              {skill.name.slice(0, 2).toUpperCase()}
                            </span>
                          </div>
                        }
                      />
                    </div>
                    <span className="text-slate-300 font-medium group-hover:text-white transition-colors">
                      {skill.name}
                    </span>
                  </div>
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