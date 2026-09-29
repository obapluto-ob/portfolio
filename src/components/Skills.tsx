import { useState, useEffect } from 'react'
import SectionHeader from './SectionHeader'
import HackTerminal from './HackTerminal'

const SKILLS: { category: string; level: string; items: { name: string; pct: number; tag: string }[] }[] = [
  {
    category: 'LANGUAGES',
    level: 'critical',
    items: [
      { name: 'JavaScript', pct: 85, tag: 'EXPERT' },
      { name: 'TypeScript', pct: 78, tag: 'ADVANCED' },
      { name: 'Python',     pct: 80, tag: 'EXPERT' },
      { name: 'Dart',       pct: 60, tag: 'INTERMEDIATE' },
    ],
  },
  {
    category: 'FRAMEWORKS',
    level: 'high',
    items: [
      { name: 'React',    pct: 85, tag: 'EXPERT' },
      { name: 'Django',   pct: 70, tag: 'ADVANCED' },
      { name: 'Flask',    pct: 75, tag: 'ADVANCED' },
      { name: 'Flutter',  pct: 60, tag: 'INTERMEDIATE' },
      { name: 'Node.js',  pct: 72, tag: 'ADVANCED' },
      { name: 'Express',  pct: 70, tag: 'ADVANCED' },
    ],
  },
  {
    category: 'DATABASES',
    level: 'medium',
    items: [
      { name: 'PostgreSQL', pct: 70, tag: 'ADVANCED' },
      { name: 'SQLite',     pct: 80, tag: 'EXPERT' },
      { name: 'MongoDB',    pct: 60, tag: 'INTERMEDIATE' },
      { name: 'Firebase',   pct: 75, tag: 'ADVANCED' },
    ],
  },
  {
    category: 'TOOLS & OPS',
    level: 'low',
    items: [
      { name: 'Git',    pct: 82, tag: 'EXPERT' },
      { name: 'Docker', pct: 55, tag: 'INTERMEDIATE' },
      { name: 'Linux',  pct: 70, tag: 'ADVANCED' },
      { name: 'REST APIs', pct: 85, tag: 'EXPERT' },
    ],
  },
]

const tagColor = (tag: string) => {
  if (tag === 'EXPERT')       return 'threat-critical'
  if (tag === 'ADVANCED')     return 'threat-high'
  if (tag === 'INTERMEDIATE') return 'threat-medium'
  return 'threat-low'
}

const SkillBar = ({ name, pct, tag }: { name: string; pct: number; tag: string }) => {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 200)
    return () => clearTimeout(t)
  }, [pct])

  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-mono" style={{ color: 'var(--text-body)' }}>{name}</span>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-1.5 py-0.5 rounded border font-mono ${tagColor(tag)}`}>{tag}</span>
          <span className="text-xs font-mono" style={{ color: 'var(--text-dim)' }}>{pct}%</span>
        </div>
      </div>
      <div className="hack-progress h-1.5">
        <div className="hack-progress-fill" style={{ width: `${width}%` }} />
      </div>
    </div>
  )
}

const Skills = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <SectionHeader title="SKILL_TREE" subtitle="technical capabilities — access level: full" className="mb-10" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {SKILLS.map(({ category, level, items }) => (
          <div key={category} className="glass-bright rounded-lg p-5 card-hover scan-sweep">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--green)', boxShadow: '0 0 6px var(--green-glow)' }} />
              <h3 className="text-sm font-bold font-mono" style={{ color: 'var(--green)' }}>{category}</h3>
              <span className={`ml-auto text-xs px-2 py-0.5 rounded border font-mono threat-${level}`}>
                {level.toUpperCase()}
              </span>
            </div>
            {items.map(skill => (
              <SkillBar key={skill.name} {...skill} />
            ))}
          </div>
        ))}
      </div>

      {/* Interactive terminal */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--green)' }} />
          <h3 className="text-sm font-bold font-mono" style={{ color: 'var(--green)' }}>
            INTERACTIVE TERMINAL — try: whoami, skills, projects, scan, nmap
          </h3>
        </div>
        <HackTerminal />
      </div>
    </div>
  )
}

export default Skills
