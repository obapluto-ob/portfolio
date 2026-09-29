import { useState, useEffect } from 'react'

const BOOT_LINES = [
  { text: 'BIOS v2.0.25 — POST check passed...', delay: 400 },
  { text: 'Initializing secure connection [TLS 1.3]...', delay: 600 },
  { text: 'Loading kernel modules [crypto, net, fs]...', delay: 700 },
  { text: 'Mounting encrypted filesystem...', delay: 500 },
  { text: 'Verifying identity: obapluto-ob...', delay: 800 },
  { text: 'Identity confirmed. Clearance: FULL', delay: 600 },
  { text: 'Decrypting portfolio data...', delay: 700 },
  { text: 'Compiling skill tree [████████] done', delay: 800 },
  { text: 'Loading project database — 7 records found', delay: 600 },
  { text: 'Scanning for vulnerabilities... none found', delay: 900 },
  { text: 'Establishing Firebase link...', delay: 700 },
  { text: 'Launching portfolio interface...', delay: 600 },
  { text: '> ACCESS GRANTED. WELCOME, OPERATOR.', delay: 400 },
]

const SKIP_AFTER_MS = 3000

interface Props {
  onDone: () => void
}

const LoadingSpinner = ({ onDone }: Props) => {
  const [visibleLines, setVisibleLines] = useState(0)
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  const [showSkip, setShowSkip] = useState(false)

  const finish = () => {
    setVisibleLines(BOOT_LINES.length)
    setProgress(100)
    setDone(true)
    setTimeout(onDone, 400)
  }

  useEffect(() => {
    // Show skip button after SKIP_AFTER_MS
    const skipTimer = setTimeout(() => setShowSkip(true), SKIP_AFTER_MS)

    let cumulative = 0
    const timers: ReturnType<typeof setTimeout>[] = []

    BOOT_LINES.forEach((line, i) => {
      cumulative += line.delay
      const t = setTimeout(() => {
        const next = i + 1
        setVisibleLines(next)
        setProgress(Math.round((next / BOOT_LINES.length) * 100))
        if (next === BOOT_LINES.length) {
          setTimeout(() => {
            setDone(true)
            setTimeout(onDone, 500)
          }, 600)
        }
      }, cumulative)
      timers.push(t)
    })

    return () => {
      clearTimeout(skipTimer)
      timers.forEach(clearTimeout)
    }
  }, [])

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'var(--bg)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,65,0.015) 2px,rgba(0,255,65,0.015) 4px)'
      }} />

      <div className="relative w-full max-w-lg px-6">
        {/* ASCII logo */}
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

        {/* Boot log */}
        <div className="font-mono text-xs space-y-2 mb-6 overflow-y-auto" style={{ height: '200px' }}>
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

        {/* Progress bar */}
        <div className="hack-progress h-2 w-full mb-2 rounded">
          <div
            className="hack-progress-fill h-full rounded"
            style={{ width: `${progress}%`, transition: 'width 0.3s ease-out' }}
          />
        </div>
        <div className="flex justify-between items-center text-xs font-mono mb-4" style={{ color: 'var(--text-muted)' }}>
          <span style={{ color: done ? 'var(--green)' : 'var(--text-muted)' }}>
            {done ? 'BOOT COMPLETE' : 'LOADING'}
          </span>
          <span style={{ color: progress === 100 ? 'var(--green)' : 'var(--text-muted)' }}>
            {progress}%
          </span>
        </div>

        {/* Skip button — appears after 3s */}
        <div className="text-center h-8">
          {showSkip && !done && (
            <button
              onClick={finish}
              className="font-mono text-xs px-4 py-1.5 rounded transition-all hover:scale-105"
              style={{
                color: 'var(--text-muted)',
                border: '1px solid var(--border)',
                background: 'transparent',
                animation: 'fadeIn 0.5s ease'
              }}
            >
              [ PRESS ANY KEY TO SKIP ]
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default LoadingSpinner
