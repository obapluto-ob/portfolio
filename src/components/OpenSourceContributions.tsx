import React from 'react'
import { contributions } from '../data/achievements'

const OpenSourceContributions = () => {
  return (
    <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700">
      <h3 className="text-xl font-medium text-slate-200 mb-6">Open Source Impact</h3>
      <div className="space-y-4">
        {contributions.map((contrib, index) => (
          <div key={index} className="border border-slate-600 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-slate-200">{contrib.project}</h4>
              <div className="flex space-x-1">
                {contrib.tech.slice(0, 2).map((tech, techIndex) => (
                  <span 
                    key={techIndex}
                    className="text-xs bg-blue-600 text-white px-2 py-1 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-2">{contrib.description}</p>
            <p className="text-xs text-green-400">✓ {contrib.impact}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OpenSourceContributions