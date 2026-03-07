import React from 'react'
import SectionHeader from './SectionHeader'
import RealAchievements from './RealAchievements'
import TechnicalBlog from './TechnicalBlog'
import GitHubActivity from './GitHubActivity'

const Professional = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-16 text-center">
        <h2 className="text-5xl font-bold mb-4 gradient-text" style={{fontFamily: 'Space Grotesk, sans-serif'}}>Professional Impact</h2>
        <p className="text-slate-400 text-lg">Achievements and contributions</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <RealAchievements />
        <TechnicalBlog />
      </div>
      
      <GitHubActivity />
    </div>
  )
}

export default Professional