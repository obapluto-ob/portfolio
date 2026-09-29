import React, { useState, useEffect } from 'react'
import { personalInfo } from '../data/portfolio'
import analytics from '../utils/analytics'

const LINES = [
  { prompt: 'whoami', output: 'Obed Emoni Lopeyok' },
  { prompt: 'cat role.txt', output: 'Full-stack Developer' },
  { prompt: 'cat location.txt', output: 'Nairobi, Kenya' },
  { prompt: 'cat stack.txt', output: 'React · TypeScript · Python · Flutter · Node.js' },
  { prompt: 'cat status.txt', output: 'Available for hire — open to remote & on-site' },
]

const TerminalLine = ({ prompt, output, delay }: { prompt: string; output: string; delay: number }) => {
  const [visible, setVisible] = useState(false)
  const [typed, setTyped] = useState('')
  const [showOutput, setShowOutput] = useState(false)

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(show)
  }, [delay])

  useEffect(() => {
    if (!visible) return
    let i = 0
    const interval = setInterval(() => {
      setTyped(prompt.slice(0, i + 1))
      i++
      if (i >= prompt.length) {
        clearInterval(interval)
        setTimeout(() => setShowOutput(true), 200)
      }
    }, 45)
    return () => clearInterval(interval)
  }, [visible, prompt])

  if (!visible) return null

  return (
    <div className="mb-3">
      <div className="flex items-center gap-2 text-sm sm:text-base">
        <span style={{ color: 'var(--green-dim)' }}>obapluto@portfolio</span>
        <span style={{ color: 'var(--text-dim)' }}>~$</span>
        <span style={{ color: 'var(--green)' }}>{typed}{!showOutput && <span className="animate-pulse">▌</span>}</span>
      </div>
      {showOutput && (
        <div className="ml-4 mt-1 text-sm sm:text-base" style={{ color: '#a3e8b0' }}>
          {output}
        </div>
      )}
    </div>
  )
}

const Hero = () => {
  const [showButtons, setShowButtons] = useState(false)

  useEffect(() => {
    const totalDelay = LINES.reduce((acc, _, i) => acc + 300 + i * 600 + LINES[i].prompt.length * 45 + 400, 0)
    const t = setTimeout(() => setShowButtons(true), Math.min(totalDelay, 4000))
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="text-center space-y-8 relative max-w-3xl mx-auto px-4">

      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-10 left-1/3 w-64 h-64 rounded-full blur-3xl opacity-10"
          style={{ background: 'var(--green)' }} />
        <div className="absolute bottom-10 right-1/3 w-80 h-80 rounded-full blur-3xl opacity-5"
          style={{ background: 'var(--green)' }} />
      </div>

      {/* Profile */}
      <div className="relative z-10">
        <div className="relative w-32 h-32 mx-auto mb-6 group">
          <div className="absolute inset-0 rounded-full blur-xl opacity-60 group-hover:opacity-90 transition-opacity animate-pulse"
            style={{ background: 'var(--green-glow)' }} />
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-2"
            style={{ borderColor: 'var(--green-dim)' }}>
            <img
              src="/4992579386737363750_121.jpg"
              alt={personalInfo.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(personalInfo.name)}&size=128&background=003311&color=00ff41&bold=true`
              }}
            />
          </div>
        </div>

        {/* Terminal header bar */}
        <div className="rounded-t-lg px-4 py-2 flex items-center gap-2 max-w-xl mx-auto"
          style={{ background: 'rgba(0,255,65,0.08)', borderBottom: '1px solid var(--border)' }}>
          <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: 'var(--green-dim)' }} />
          <span className="ml-2 text-xs" style={{ color: 'var(--text-dim)' }}>portfolio.sh</span>
        </div>

        {/* Terminal body */}
        <div className="glass rounded-b-lg p-6 text-left max-w-xl mx-auto">
          {LINES.map((line, i) => (
            <TerminalLine
              key={line.prompt}
              prompt={line.prompt}
              output={line.output}
              delay={i * 600 + 300}
            />
          ))}
        </div>
      </div>

      {/* CTA buttons */}
      {showButtons && (
        <div className="flex justify-center gap-4 relative z-10 flex-wrap">
          <a
            href={`mailto:${personalInfo.email}`}
            onClick={() => analytics.trackClick('contact_cta', 'hero')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-mono font-semibold transition-all hover:scale-105 focus:outline-none focus:ring-2"
            style={{
              background: 'var(--green)',
              color: 'var(--bg)',
              boxShadow: '0 0 20px var(--green-glow)'
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            ./contact.sh
          </a>

          <a
            href={`https://github.com/${personalInfo.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-mono font-semibold transition-all hover:scale-105 focus:outline-none focus:ring-2 border"
            style={{ borderColor: 'var(--green-dim)', color: 'var(--green)', background: 'transparent' }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            ./github.sh
          </a>
        </div>
      )}

      {/* Nav hint */}
      <div className="text-xs font-mono animate-bounce relative z-10" style={{ color: 'var(--text-muted)' }}>
        <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        navigate with arrows or dots
      </div>
    </div>
  )
}

export default Hero
