import React from 'react'

interface SectionHeaderProps {
  title: string
  className?: string
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, className = '' }) => {
  return (
    <header className={`text-center ${className}`}>
      <h2 className="text-4xl font-light mb-12 text-slate-300">{title}</h2>
    </header>
  )
}

export default SectionHeader