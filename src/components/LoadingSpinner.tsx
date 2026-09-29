import { useState, useEffect } from 'react'

const BOOT_LINES = [
  { text: 'BIOS v2.0.25 — POST check passed...', delay: 200 },
  { text: 'Initializing secure connection [TLS 1.3]...', delay: 250 },
  { text: 'Loading kernel modules [crypto, net, fs]...', delay: 200 },
  { text: 'Verifying identity: obapluto-ob...', delay: 300 },
  { text: 'Identity confirmed. Clearance: FULL', delay: 200 },
  { text: 'Decrypting portfolio data...', delay: 250 },
  { text: 'Loading project database — 7 records found', delay: 200 },
  { text: 'Establishing Firebase link...', delay: 250 },
  { text: '> ACCESS GRANTED. WELCOME, OPERATOR.', delay: 200 },
]

interface Props { onDone: () => void }

const LoadingSpinner = ({ onDone }: Props) => {
  const [visibleLines, setVisibleLines] = useState(0)
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  const finish = () => {
    setVisibleLines(BOOT_LINES.length)
    setProgress(100)
    setDone(true)
    setTimeout(onDone, 300)
  }

  useEffect(() => {
    let cumulative = 0
    const timers: ReturnType<typeof setTimeout>[] = []
    BOOT_LINES.forEach((line, i) => {
      cumulative += line.delay
      const t = setTimeout(() => {
        const next = i + 1
        setVisibleLines(next)
        setProgress(Math.round((next / BOOT_LINES.length) * 100))
        if (next === BOOT_LINES.length) {
          setTimeout(() => { setDone(true); setTimeout(onDone, 400) }, 400)
        }
      }, cumulative)
      timers.push(t)
    })
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'var(--bg)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,65,0.015) 2px,rgba(0,255,65,0.015) 4px)'
      }} />
      <div className="relative w-full max-w-lg px-6">
        <div className="text-center mb-6">
          <pre className="text-xs leading-tight select-none" style={{ color: 'var(--green-dim)' }}>{`
 ██████╗ ██████╗ ███████╗██████╗ 
██╔═══██╗██╔══██╗██╔════╝██╔══██╗
██║   ██║██████╔╝█████╗  ██║  ██║
╚██████╔╝██████╔╝███████╗██████╔╝`}</pre>
          <p className="text-xs mt-2 font-mono" style={{ color: 'var(--text-dim)' }}>
            PORTFOLIO OS v2.0.25 — SECURE BOOT
          </p>
        </div>

        <div className="font-mono text-xs space-y-2 mb-6 overflow-y-auto" style={{ height: '180px' }}>
          {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="shrink-0" style={{ color: 'var(--green-dim)' }}>
                [{String(i + 1).padStart(2, '0')}]
              </span>
              <span style={{
                color: line.text.startsWith('>')
                  ? 'var(--cyan)'
                  : i === visibleLines - 1 && !done
                  ? 'var(--green)'
                  : 'var(--text-dim)'
              }}>
                {line.text}
              </span>
              {i === visibleLines - 1 && !done && (
                <span className="animate-pulse shrink-0" style={{ color: 'var(--green)' }}>█</span>
              )}
            </div>
          ))}
        </div>

        <div className="hack-progress h-2 w-full mb-2 rounded">
          <div className="hack-progress-fill h-full rounded" style={{ width: `${progress}%`, transition: 'width 0.2s ease-out' }} />
        </div>
        <div className="flex justify-between items-center text-xs font-mono mb-4" style={{ color: 'var(--text-muted)' }}>
          <span style={{ color: done ? 'var(--green)' : 'var(--text-muted)' }}>
            {done ? 'BOOT COMPLETE' : 'LOADING'}
          </span>
          <span style={{ color: progress === 100 ? 'var(--green)' : 'var(--text-muted)' }}>{progress}%</span>
        </div>

        <div className="text-center">
          {!done && (
            <button
              onClick={finish}
              className="font-mono text-xs px-4 py-1.5 rounded transition-all hover:scale-105"
              style={{ color: 'var(--text-muted)', border: '1px solid var(--border)', background: 'transparent' }}
            >
              [ SKIP ]
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default LoadingSpinner
