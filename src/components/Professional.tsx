import React from 'react'
import SectionHeader from './SectionHeader'
import RealAchievements from './RealAchievements'
import TechnicalBlog from './TechnicalBlog'
import LearningJourney from './LearningJourney'

const Professional = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <SectionHeader title="Professional Impact" />
      
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <RealAchievements />
        <TechnicalBlog />
      </div>
      
      <LearningJourney />
    </div>
  )
}

export default Professional