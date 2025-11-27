import React from 'react'
import { achievements } from '../data/achievements'

const Achievements = () => {
  return (
    <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700">
      <h3 className="text-xl font-medium text-slate-200 mb-6">Impact & Results</h3>
      <div className="grid grid-cols-2 gap-4">
        {achievements.map((achievement, index) => (
          <div key={index} className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-1">
              {achievement.metric}
            </div>
            <div className="text-sm text-slate-400 leading-tight">
              {achievement.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Achievements