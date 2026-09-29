import { useState, useEffect, useRef } from 'react'

// ── Types ──────────────────────────────────────────────────────────────────
type ChallengeId = 'bruteforce' | 'cipher' | 'portscan' | 'sqli' | 'steganography'

interface Challenge {
  id: ChallengeId
  title: string
  category: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  points: number
  description: string
  hint: string
}

// ── Challenge definitions ──────────────────────────────────────────────────
const CHALLENGES: Challenge[] = [
  {
    id: 'bruteforce',
    title: 'Brute Force Login',
    category: 'Authentication',
    difficulty: 'EASY',
    points: 100,
    description: 'A weak admin panel uses a 4-digit PIN. The PIN is the year the internet was invented. Crack it.',
    hint: 'ARPANET went live in...',
  },
  {
    id: 'cipher',
    title: 'Caesar Cipher',
    category: 'Cryptography',
    difficulty: 'EASY',
    points: 150,
    description: 'Intercepted message: "KDOO KDOO WKH KDFTHU". Decrypt it. Shift = 3.',
    hint: 'Each letter shifted back by 3. A→X, B→Y...',
  },
  {
    id: 'portscan',
    title: 'Open Port Recon',
    category: 'Network',
    difficulty: 'MEDIUM',
    points: 200,
    description: 'Target: 192.168.1.1. A service is running on the default SSH port. What port number is it?',
    hint: 'RFC 4251 defines the standard SSH port.',
  },
  {
    id: 'sqli',
    title: 'SQL Injection',
    category: 'Web Exploitation',
    difficulty: 'MEDIUM',
    points: 250,
    description: "Login form: username field is vulnerable. Enter the classic SQLi payload that always returns true.",
    hint: "Comment out the rest of the query with --",
  },
  {
    id: 'steganography',
    title: 'Hidden Message',
    category: 'Steganography',
    difficulty: 'HARD',
    points: 400,
    description: "Binary message hidden in plain sight:\n01001111 01000010 01000101 01000100\nDecode it to ASCII.",
    hint: 'Each 8-bit group = one ASCII character. O=79, B=66...',
  },
]

const ANSWERS: Record<ChallengeId, string[]> = {
  bruteforce: ['1969'],
  cipher: ['HALL HALL THE HACKER', 'HALL HALL WKH KDFTHU'],
  portscan: ['22'],
  sqli: ["' OR '1'='1", "' OR '1'='1'--", "' OR 1=1--", "admin'--", "' OR '1'='1' --"],
  steganography: ['OBED', 'obed'],
}

const DIFF_COLOR: Record<string, string> = {
  EASY: '#00ff41',
  MEDIUM: '#febc2e',
  HARD: '#ff5f57',
}

// ── Fake terminal output for each challenge ────────────────────────────────
const SCAN_LINES: Record<ChallengeId, string[]> = {
  bruteforce: [
    '> Initializing brute force module...',
    '> Target: admin.panel.local:8080',
    '> Trying 0000... FAIL',
    '> Trying 0001... FAIL',
    '> Trying ...',
    '> Dictionary: 4-digit numeric PINs',
    '> Hint: Think historically.',
  ],
  cipher: [
    '> Intercepted packet on port 443',
    '> Payload (hex): 4b44 4f4c 2048 4b4f 4c20 5748 4520 484b 4651 5545',
    '> Encoding detected: Caesar cipher',
    '> Shift value: 3',
    '> Awaiting decryption...',
  ],
  portscan: [
    '> nmap -sV 192.168.1.1',
    '> Starting Nmap scan...',
    '> PORT     STATE  SERVICE',
    '> 80/tcp   open   http',
    '> 443/tcp  open   https',
    '> ???/tcp  open   ssh',
    '> Identify the SSH port number.',
  ],
  sqli: [
    "> Target: http://vuln-app.local/login",
    "> Testing username field for SQLi...",
    "> Payload: ' OR '1'='?",
    "> Query: SELECT * FROM users WHERE username='INPUT'",
    "> Goal: make the WHERE clause always true.",
  ],
  steganography: [
    '> Analyzing image metadata...',
    '> LSB steganography detected',
    '> Extracted binary payload:',
    '> 01001111 01000010 01000101 01000100',
    '> Convert each byte to ASCII character.',
  ],
}

// ── Main component ─────────────────────────────────────────────────────────
const RedTeamCTF = () => {
  const [selected, setSelected] = useState<Challenge | null>(null)
  const [input, setInput] = useState('')
  const [solved, setSolved] = useState<Set<ChallengeId>>(new Set())
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null)
  const [scanLines, setScanLines] = useState<string[]>([])
  const [scanIdx, setScanIdx] = useState(0)
  const [attempts, setAttempts] = useState<Record<string, number>>({})
  const inputRef = useRef<HTMLInputElement>(null)
  const logRef = useRef<HTMLDivElement>(null)

  const totalPoints = [...solved].reduce((sum, id) => {
    const c = CHALLENGES.find(c => c.id === id)
    return sum + (c?.points ?? 0)
  }, 0)

  // Animate scan lines when challenge selected
  useEffect(() => {
    if (!selected) return
    setScanLines([])
    setScanIdx(0)
    setFeedback(null)
    setInput('')
    inputRef.current?.focus()
  }, [selected])

  useEffect(() => {
    if (!selected) return
    const lines = SCAN_LINES[selected.id]
    if (scanIdx >= lines.length) return
    const t = setTimeout(() => {
      setScanLines(prev => [...prev, lines[scanIdx]])
      setScanIdx(i => i + 1)
    }, 350)
    return () => clearTimeout(t)
  }, [selected, scanIdx])

  // Auto-scroll log
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [scanLines, feedback])

  const submit = () => {
    if (!selected || !input.trim()) return
    const att = (attempts[selected.id] ?? 0) + 1
    setAttempts(prev => ({ ...prev, [selected.id]: att }))

    const correct = ANSWERS[selected.id].some(
      a => a.toLowerCase() === input.trim().toLowerCase()
    )

    if (correct) {
      setSolved(prev => new Set([...prev, selected.id]))
      setFeedback({ msg: `✓ CORRECT! +${selected.points} pts — Flag captured.`, ok: true })
      setInput('')
    } else {
      setFeedback({ msg: `✗ WRONG. Attempt ${att}/5. ${att >= 3 ? 'Check the hint.' : 'Try again.'}`, ok: false })
    }
  }

  return (
    <div className="max-w-5xl mx-auto font-mono">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--green)' }}>
            {'>'} RED TEAM CTF
          </h2>
          <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>
            Capture The Flag — solve challenges to earn points
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>SCORE</div>
            <div className="text-xl font-bold" style={{ color: 'var(--green)' }}>{totalPoints} pts</div>
          </div>
          <div className="text-right">
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>FLAGS</div>
            <div className="text-xl font-bold" style={{ color: 'var(--cyan)' }}>{solved.size}/{CHALLENGES.length}</div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="hack-progress h-1.5 w-full mb-6 rounded">
        <div
          className="hack-progress-fill h-full rounded transition-all duration-500"
          style={{ width: `${(solved.size / CHALLENGES.length) * 100}%` }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Challenge list */}
        <div className="space-y-3">
          {CHALLENGES.map(c => {
            const isSolved = solved.has(c.id)
            const isActive = selected?.id === c.id
            return (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className="w-full text-left rounded-lg p-4 transition-all hover:scale-[1.01]"
                style={{
                  background: isActive
                    ? 'rgba(0,255,65,0.08)'
                    : isSolved
                    ? 'rgba(0,255,65,0.04)'
                    : 'rgba(0,20,0,0.6)',
                  border: `1px solid ${isActive ? 'var(--green)' : isSolved ? 'rgba(0,255,65,0.3)' : 'var(--border)'}`,
                  boxShadow: isActive ? '0 0 12px rgba(0,255,65,0.15)' : 'none',
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold" style={{ color: isSolved ? 'var(--green)' : 'var(--text)' }}>
                    {isSolved ? '✓ ' : '○ '}{c.title}
                  </span>
                  <span className="text-xs font-bold" style={{ color: DIFF_COLOR[c.difficulty] }}>
                    {c.difficulty}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.category}</span>
                  <span className="text-xs" style={{ color: 'var(--cyan)' }}>{c.points} pts</span>
                </div>
              </button>
            )
          })}

          {/* Win state */}
          {solved.size === CHALLENGES.length && (
            <div className="rounded-lg p-4 text-center" style={{ border: '1px solid var(--green)', background: 'rgba(0,255,65,0.06)' }}>
              <div className="text-lg font-bold mb-1" style={{ color: 'var(--green)' }}>
                ALL FLAGS CAPTURED
              </div>
              <div className="text-xs" style={{ color: 'var(--text-dim)' }}>
                Total: {totalPoints} pts — Elite Operator status achieved
              </div>
            </div>
          )}
        </div>

        {/* Challenge terminal */}
        <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)', background: 'rgba(0,10,0,0.8)' }}>
          {/* Terminal title bar */}
          <div className="flex items-center gap-2 px-4 py-2" style={{ background: 'rgba(0,255,65,0.06)', borderBottom: '1px solid var(--border)' }}>
            <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
            <span className="ml-2 text-xs" style={{ color: 'var(--text-dim)' }}>
              {selected ? `ctf — ${selected.title}` : 'ctf — select a challenge'}
            </span>
          </div>

          {!selected ? (
            <div className="p-6 text-center" style={{ color: 'var(--text-muted)' }}>
              <div className="text-4xl mb-3" style={{ color: 'var(--green)', opacity: 0.3 }}>
                <svg viewBox="0 0 24 24" className="w-12 h-12 mx-auto" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
                </svg>
              </div>
              <p className="text-xs">Select a challenge to begin</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>{'>'} awaiting target selection_</p>
            </div>
          ) : (
            <div className="p-4 flex flex-col" style={{ minHeight: '380px' }}>
              {/* Challenge info */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(0,255,65,0.1)', color: 'var(--green)', border: '1px solid rgba(0,255,65,0.3)' }}>
                    {selected.category}
                  </span>
                  <span className="text-xs font-bold" style={{ color: DIFF_COLOR[selected.difficulty] }}>
                    {selected.difficulty} — {selected.points} pts
                  </span>
                  {solved.has(selected.id) && (
                    <span className="text-xs" style={{ color: 'var(--green)' }}>✓ SOLVED</span>
                  )}
                </div>
                <p className="text-xs leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-dim)' }}>
                  {selected.description}
                </p>
              </div>

              {/* Scan log */}
              <div
                ref={logRef}
                className="flex-1 text-xs space-y-1 overflow-y-auto mb-3 p-2 rounded"
                style={{ background: 'rgba(0,0,0,0.4)', minHeight: '120px', maxHeight: '160px' }}
              >
                {scanLines.map((line, i) => (
                  <div key={i} style={{ color: line.startsWith('>') ? 'var(--green)' : 'var(--text-muted)' }}>
                    {line}
                  </div>
                ))}
                {feedback && (
                  <div className="mt-2 font-bold" style={{ color: feedback.ok ? 'var(--green)' : '#ff5f57' }}>
                    {feedback.msg}
                  </div>
                )}
              </div>

              {/* Hint */}
              <details className="mb-3">
                <summary className="text-xs cursor-pointer select-none" style={{ color: 'var(--text-muted)' }}>
                  {'>'} show hint
                </summary>
                <p className="text-xs mt-1 pl-3" style={{ color: 'var(--cyan)', borderLeft: '2px solid var(--cyan)' }}>
                  {selected.hint}
                </p>
              </details>

              {/* Input */}
              {!solved.has(selected.id) && (
                <div className="flex gap-2">
                  <span className="text-xs self-center shrink-0" style={{ color: 'var(--green-dim)' }}>flag{'>'}</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && submit()}
                    placeholder="Enter your answer..."
                    className="flex-1 text-xs px-3 py-2 rounded outline-none font-mono"
                    style={{
                      background: 'rgba(0,255,65,0.05)',
                      border: '1px solid var(--border)',
                      color: 'var(--green)',
                    }}
                  />
                  <button
                    onClick={submit}
                    className="text-xs px-3 py-2 rounded transition-all hover:scale-105"
                    style={{ background: 'var(--green)', color: 'var(--bg)', fontWeight: 'bold' }}
                  >
                    SUBMIT
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RedTeamCTF
