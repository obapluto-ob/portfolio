interface SectionHeaderProps {
  title: string
  subtitle?: string
  className?: string
}

const SectionHeader = ({ title, subtitle, className = '' }: SectionHeaderProps) => {
  return (
    <header className={`text-center ${className}`}>
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="h-px flex-1 max-w-16" style={{ background: 'linear-gradient(90deg, transparent, var(--green-dim))' }} />
        <span className="text-xs font-mono" style={{ color: 'var(--text-dim)' }}>{'<section>'}</span>
        <div className="h-px flex-1 max-w-16" style={{ background: 'linear-gradient(90deg, var(--green-dim), transparent)' }} />
      </div>
      <h2
        className="text-3xl sm:text-4xl font-bold mb-2 glitch"
        data-text={title}
        style={{ color: 'var(--green)', fontFamily: "'JetBrains Mono', monospace" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm font-mono" style={{ color: 'var(--text-dim)' }}>
          <span style={{ color: 'var(--green-dim)' }}>// </span>{subtitle}
        </p>
      )}
    </header>
  )
}

export default SectionHeader
