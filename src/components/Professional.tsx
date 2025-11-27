import React from 'react'
import SectionHeader from './SectionHeader'
import Achievements from './Achievements'
import TechnicalBlog from './TechnicalBlog'
import OpenSourceContributions from './OpenSourceContributions'

const Professional = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <SectionHeader title="Professional Impact" />
      
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Achievements />
        <TechnicalBlog />
      </div>
      
      <OpenSourceContributions />
    </div>
  )
}

export default Professional