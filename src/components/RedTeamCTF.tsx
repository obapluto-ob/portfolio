import { useState, useEffect, useRef } from 'react'
import { collection, doc, setDoc, getDoc, getDocs, orderBy, query, limit } from 'firebase/firestore'
import { db } from '../firebase'
import { CHALLENGES, ANSWERS, DIFF_COLOR, type ChallengeId, type Operator } from '../data/ctf'
import { LoginSandbox, TerminalSandbox, SQLSandbox, HashSandbox, XSSSandbox, BinarySandbox, ReconSandbox } from './CTFSandboxes'

// ── Local storage keys ─────────────────────────────────────────────────────
const LS_KEY = 'ctf_operator'

// ── Leaderboard entry ──────────────────────────────────────────────────────
interface LeaderEntry { callsign: string; score: number; solved: number; joinedAt: number }

// ── Registration screen ────────────────────────────────────────────────────
const RegisterScreen = ({ onRegister }: { onRegister: (op: Operator) => void }) => {
  const [callsign, setCallsign] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    const cs = callsign.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '')
    const em = email.trim().toLowerCase()
    if (cs.length < 3) return setError('Callsign must be at least 3 characters (A-Z, 0-9, _)')
    if (cs.length > 16) return setError('Callsign max 16 characters')
    if (!em.includes('@')) return setError('Enter a valid email')
    setLoading(true)
    setError('')
    try {
      // Check if callsign already taken
      const existing = await getDoc(doc(db, 'ctf_operators', cs))
      if (existing.exists()) {
        // Returning operator — restore their progress
        const data = existing.data() as Operator
        if (data.email !== em) {
          setError('Callsign taken. Use your original email or choose a different callsign.')
          setLoading(false)
          return
        }
        const op: Operator = { ...data, lastSeen: Date.now() }
        await setDoc(doc(db, 'ctf_operators', cs), op, { merge: true })
        localStorage.setItem(LS_KEY, JSON.stringify(op))
        onRegister(op)
      } else {
        // New operator
        const op: Operator = {
          callsign: cs,
          email: em,
          solved: [],
          score: 0,
          hintsUsed: {},
          joinedAt: Date.now(),
          lastSeen: Date.now(),
        }
        await setDoc(doc(db, 'ctf_operators', cs), op)
        localStorage.setItem(LS_KEY, JSON.stringify(op))
        onRegister(op)
      }
    } catch {
      // Firebase unavailable — run locally
      const op: Operator = {
        callsign: cs, email: em, solved: [], score: 0,
        hintsUsed: {}, joinedAt: Date.now(), lastSeen: Date.now(),
      }
      localStorage.setItem(LS_KEY, JSON.stringify(op))
      onRegister(op)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto font-mono">
      <div className="text-center mb-8">
        <pre className="text-xs select-none mb-2" style={{ color: 'var(--green-dim)' }}>{`
 ██████╗████████╗███████╗
██╔════╝╚══██╔══╝██╔════╝
██║        ██║   █████╗  
██║        ██║   ██╔══╝  
╚██████╗   ██║   ██║     
 ╚═════╝   ╚═╝   ╚═╝     `}</pre>
        <h2 className="text-xl font-bold" style={{ color: 'var(--green)' }}>RED TEAM CTF</h2>
        <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>Register your operator identity to begin</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Returning? Use your callsign + email to restore progress</p>
      </div>

      <div className="rounded-lg p-6 space-y-4" style={{ background: 'rgba(0,20,0,0.6)', border: '1px solid var(--border)' }}>
        <div>
          <label className="text-xs mb-1 block" style={{ color: 'var(--text-dim)' }}>CALLSIGN (your hacker alias)</label>
          <div className="flex items-center gap-2 rounded px-3 py-2" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border)' }}>
            <span style={{ color: 'var(--green-dim)' }} className="text-xs">op://</span>
            <input
              value={callsign}
              onChange={e => setCallsign(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ''))}
              onKeyDown={e => e.key === 'Enter' && submit()}
              placeholder="GHOST_ZERO"
              maxLength={16}
              className="flex-1 bg-transparent outline-none text-sm font-mono"
              style={{ color: 'var(--green)' }}
              autoFocus
            />
          </div>
        </div>

        <div>
          <label className="text-xs mb-1 block" style={{ color: 'var(--text-dim)' }}>EMAIL (to restore progress later)</label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="operator@darknet.io"
            type="email"
            className="w-full px-3 py-2 rounded outline-none text-sm font-mono"
            style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border)', color: 'var(--green)' }}
          />
        </div>

        {error && <div className="text-xs" style={{ color: '#ff5f57' }}>✗ {error}</div>}

        <button onClick={submit} disabled={loading}
          className="w-full py-3 rounded font-bold text-sm transition-all hover:scale-[1.01] disabled:opacity-50"
          style={{ background: 'var(--green)', color: 'var(--bg)' }}>
          {loading ? 'AUTHENTICATING...' : '> DEPLOY OPERATOR'}
        </button>

        <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
          Your progress is saved to the global leaderboard
        </p>
      </div>
    </div>
  )
}

// ── Main CTF component ─────────────────────────────────────────────────────
const RedTeamCTF = () => {
  const [operator, setOperator] = useState<Operator | null>(null)
  const [selected, setSelected] = useState<ChallengeId | null>(null)
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null)
  const [attempts, setAttempts] = useState<Record<string, number>>({})
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({})
  const [unlockedHints, setUnlockedHints] = useState<Record<string, number>>({})
  const [leaderboard, setLeaderboard] = useState<LeaderEntry[]>([])
  const [showLeader, setShowLeader] = useState(false)
  const [view, setView] = useState<'challenges' | 'sandbox'>('challenges')
  const feedbackRef = useRef<HTMLDivElement>(null)

  // Auto-login from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY)
    if (saved) {
      try { setOperator(JSON.parse(saved)) } catch { localStorage.removeItem(LS_KEY) }
    }
  }, [])

  // Load leaderboard
  useEffect(() => {
    if (!showLeader) return
    const load = async () => {
      try {
        const snap = await getDocs(query(collection(db, 'ctf_operators'), orderBy('score', 'desc'), limit(10)))
        setLeaderboard(snap.docs.map(d => {
          const data = d.data() as Operator
          return { callsign: data.callsign, score: data.score, solved: data.solved.length, joinedAt: data.joinedAt }
        }))
      } catch { /* Firebase unavailable */ }
    }
    load()
  }, [showLeader])

  // Cooldown ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setCooldowns(prev => {
        const now = Date.now()
        const updated = { ...prev }
        let changed = false
        Object.keys(updated).forEach(k => { if (updated[k] <= now) { delete updated[k]; changed = true } })
        return changed ? updated : prev
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const saveOperator = async (op: Operator) => {
    setOperator(op)
    localStorage.setItem(LS_KEY, JSON.stringify(op))
    try { await setDoc(doc(db, 'ctf_operators', op.callsign), op, { merge: true }) } catch { /* offline */ }
  }

  const solved = new Set(operator?.solved ?? [])
  const totalPoints = operator?.score ?? 0

  const isUnlocked = (id: ChallengeId) => {
    const c = CHALLENGES.find(c => c.id === id)
    if (!c?.unlockAfter) return true
    return solved.has(c.unlockAfter)
  }

  const handleCorrect = (id: ChallengeId, input: string): boolean => {
    // Block if in cooldown
    if (cooldowns[id] && cooldowns[id] > Date.now()) {
      const secs = Math.ceil((cooldowns[id] - Date.now()) / 1000)
      setFeedback({ msg: `⏱ Cooldown active — wait ${secs}s before trying again.`, ok: false })
      return false
    }
    // Block if already solved
    if (solved.has(id)) return true

    const correct = ANSWERS[id].some(a => a.toLowerCase() === input.trim().toLowerCase())
    if (!correct) {
      const att = (attempts[id] ?? 0) + 1
      // Hard cap — never go above 5 active attempts
      const capped = Math.min(att, 5)
      setAttempts(p => ({ ...p, [id]: capped }))
      if (capped >= 5) {
        setCooldowns(p => ({ ...p, [id]: Date.now() + 60_000 }))
        setAttempts(p => ({ ...p, [id]: 0 })) // reset after cooldown set
        setFeedback({ msg: '✗ 5 failed attempts — 60s cooldown activated. Use a hint.', ok: false })
      } else {
        setFeedback({ msg: `✗ Wrong. Attempt ${capped}/5.${capped >= 3 ? ' Consider unlocking a hint.' : ''}`, ok: false })
      }
      return false
    }
    if (solved.has(id)) return true
    const challenge = CHALLENGES.find(c => c.id === id)!
    const hintPenalty = Object.values(operator?.hintsUsed ?? {}).reduce((s, v) => s + v, 0)
    const pts = Math.max(challenge.points - hintPenalty, Math.floor(challenge.points * 0.2))
    const newOp: Operator = {
      ...operator!,
      solved: [...(operator?.solved ?? []), id],
      score: (operator?.score ?? 0) + pts,
      lastSeen: Date.now(),
    }
    saveOperator(newOp)
    setFeedback({ msg: `✓ FLAG CAPTURED! +${pts} pts`, ok: true })
    setAttempts(p => ({ ...p, [id]: 0 }))
    return true
  }

  const unlockHint = (challengeId: ChallengeId, level: 1 | 2 | 3) => {
    const key = `${challengeId}_${level}`
    if (unlockedHints[key]) return
    const challenge = CHALLENGES.find(c => c.id === challengeId)!
    const hint = challenge.hints.find(h => h.level === level)!
    setUnlockedHints(p => ({ ...p, [key]: level }))
    const newOp: Operator = {
      ...operator!,
      score: Math.max(0, (operator?.score ?? 0) - hint.cost),
      hintsUsed: { ...(operator?.hintsUsed ?? {}), [key]: hint.cost },
    }
    saveOperator(newOp)
  }

  const selectedChallenge = CHALLENGES.find(c => c.id === selected)

  const renderSandbox = () => {
    if (!selectedChallenge || !operator) return null
    const props = {
      challenge: selectedChallenge,
      onCorrect: (input: string) => handleCorrect(selectedChallenge.id, input),
      solved: solved.has(selectedChallenge.id),
    }
    switch (selectedChallenge.sandboxType) {
      case 'login': return <LoginSandbox {...props} />
      case 'terminal': return <TerminalSandbox {...props} />
      case 'sqlconsole': return <SQLSandbox {...props} />
      case 'hashcrack': return <HashSandbox {...props} />
      case 'xss': return <XSSSandbox {...props} />
      case 'binary': return <BinarySandbox {...props} />
      case 'recon': return <ReconSandbox {...props} />
      default: return null
    }
  }

  if (!operator) return <RegisterScreen onRegister={op => setOperator(op)} />

  return (
    <div className="max-w-5xl mx-auto font-mono pb-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--green)' }}>
            {'>'} RED TEAM CTF
          </h2>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs" style={{ color: 'var(--cyan)' }}>op://{operator.callsign}</span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>|</span>
            <span className="text-xs" style={{ color: 'var(--green)' }}>{totalPoints} pts</span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>|</span>
            <span className="text-xs" style={{ color: 'var(--cyan)' }}>{solved.size}/{CHALLENGES.length} flags</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowLeader(v => !v)}
            className="text-xs px-3 py-1.5 rounded transition-all hover:scale-105"
            style={{ border: '1px solid var(--border)', color: showLeader ? 'var(--green)' : 'var(--text-muted)', background: showLeader ? 'rgba(0,255,65,0.08)' : 'transparent' }}>
            LEADERBOARD
          </button>
          <button onClick={() => { localStorage.removeItem(LS_KEY); setOperator(null) }}
            className="text-xs px-3 py-1.5 rounded transition-all hover:scale-105"
            style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'transparent' }}>
            LOGOUT
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="hack-progress h-1 w-full mb-5 rounded">
        <div className="hack-progress-fill h-full rounded transition-all duration-700"
          style={{ width: `${(solved.size / CHALLENGES.length) * 100}%` }} />
      </div>

      {/* Leaderboard overlay */}
      {showLeader && (
        <div className="rounded-lg p-4 mb-5" style={{ background: 'rgba(0,10,0,0.9)', border: '1px solid var(--green)' }}>
          <div className="text-sm font-bold mb-3" style={{ color: 'var(--green)' }}>// GLOBAL LEADERBOARD</div>
          {leaderboard.length === 0
            ? <div className="text-xs" style={{ color: 'var(--text-muted)' }}>No operators yet — be the first!</div>
            : leaderboard.map((e, i) => (
              <div key={e.callsign} className="flex items-center gap-3 py-1.5 text-xs" style={{ borderBottom: '1px solid var(--border)' }}>
                <span className="w-5 text-right" style={{ color: i < 3 ? 'var(--green)' : 'var(--text-muted)' }}>
                  {i === 0 ? '▲' : i === 1 ? '▲' : i === 2 ? '▲' : `${i + 1}.`}
                </span>
                <span className="flex-1 font-bold" style={{ color: e.callsign === operator.callsign ? 'var(--cyan)' : 'var(--text)' }}>
                  {e.callsign}{e.callsign === operator.callsign ? ' (you)' : ''}
                </span>
                <span style={{ color: 'var(--green)' }}>{e.score} pts</span>
                <span style={{ color: 'var(--text-muted)' }}>{e.solved} flags</span>
              </div>
            ))
          }
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Challenge list */}
        <div className="lg:col-span-2 space-y-2">
          {CHALLENGES.map(c => {
            const isSolved = solved.has(c.id)
            const isActive = selected === c.id
            const locked = !isUnlocked(c.id)
            const inCooldown = cooldowns[c.id] && cooldowns[c.id] > Date.now()
            const secsLeft = inCooldown ? Math.ceil((cooldowns[c.id] - Date.now()) / 1000) : 0

            return (
              <button key={c.id}
                onClick={() => { if (!locked && !inCooldown) { setSelected(c.id); setFeedback(null); setView('sandbox') } }}
                disabled={locked || !!inCooldown}
                className="w-full text-left rounded-lg p-3 transition-all"
                style={{
                  background: isActive ? 'rgba(0,255,65,0.08)' : isSolved ? 'rgba(0,255,65,0.03)' : 'rgba(0,15,0,0.6)',
                  border: `1px solid ${isActive ? 'var(--green)' : isSolved ? 'rgba(0,255,65,0.25)' : locked ? 'rgba(255,255,255,0.05)' : 'var(--border)'}`,
                  opacity: locked ? 0.4 : 1,
                  cursor: locked ? 'not-allowed' : 'pointer',
                }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold" style={{ color: isSolved ? 'var(--green)' : locked ? 'var(--text-muted)' : 'var(--text)' }}>
                    {isSolved ? '✓ ' : locked ? '🔒 ' : inCooldown ? `⏱ ${secsLeft}s ` : '○ '}{c.title}
                  </span>
                  <span className="text-xs font-bold" style={{ color: DIFF_COLOR[c.difficulty] }}>{c.difficulty}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.category}</span>
                  <span className="text-xs" style={{ color: 'var(--cyan)' }}>{c.points} pts</span>
                </div>
                {locked && c.unlockAfter && (
                  <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    Unlock: solve {CHALLENGES.find(x => x.id === c.unlockAfter)?.title}
                  </div>
                )}
              </button>
            )
          })}

          {solved.size === CHALLENGES.length && (
            <div className="rounded-lg p-4 text-center" style={{ border: '1px solid var(--green)', background: 'rgba(0,255,65,0.06)' }}>
              <div className="font-bold" style={{ color: 'var(--green)' }}>ALL FLAGS CAPTURED</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>{totalPoints} pts — Elite Operator</div>
            </div>
          )}
        </div>

        {/* Sandbox panel */}
        <div className="lg:col-span-3">
          {!selectedChallenge ? (
            <div className="rounded-lg p-8 text-center h-full flex flex-col items-center justify-center"
              style={{ border: '1px solid var(--border)', background: 'rgba(0,10,0,0.6)', minHeight: '300px' }}>
              <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>SELECT A CHALLENGE TO BEGIN</div>
              <div className="text-xs" style={{ color: 'var(--text-dim)' }}>{'>'} awaiting target_</div>
            </div>
          ) : (
            <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)', background: 'rgba(0,10,0,0.8)' }}>
              {/* Terminal bar */}
              <div className="flex items-center gap-2 px-4 py-2" style={{ background: 'rgba(0,255,65,0.05)', borderBottom: '1px solid var(--border)' }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#febc2e' }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }} />
                <span className="ml-2 text-xs" style={{ color: 'var(--text-dim)' }}>
                  ctf/{selectedChallenge.id} — {selectedChallenge.title}
                </span>
                {solved.has(selectedChallenge.id) && (
                  <span className="ml-auto text-xs font-bold" style={{ color: 'var(--green)' }}>✓ SOLVED</span>
                )}
              </div>

              <div className="p-4 space-y-4">
                {/* Description */}
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(0,255,65,0.08)', color: 'var(--green)', border: '1px solid rgba(0,255,65,0.2)' }}>
                      {selectedChallenge.category}
                    </span>
                    <span className="text-xs font-bold" style={{ color: DIFF_COLOR[selectedChallenge.difficulty] }}>
                      {selectedChallenge.difficulty}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--cyan)' }}>{selectedChallenge.points} pts</span>
                  </div>
                  <p className="text-xs leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-dim)' }}>
                    {selectedChallenge.description}
                  </p>
                </div>

                {/* Sandbox */}
                {renderSandbox()}

                {/* Feedback */}
                {feedback && (
                  <div ref={feedbackRef} className="text-xs font-bold py-2 px-3 rounded"
                    style={{ color: feedback.ok ? 'var(--green)' : '#ff5f57', background: feedback.ok ? 'rgba(0,255,65,0.06)' : 'rgba(255,95,87,0.06)', border: `1px solid ${feedback.ok ? 'rgba(0,255,65,0.2)' : 'rgba(255,95,87,0.2)'}` }}>
                    {feedback.msg}
                  </div>
                )}

                {/* Progressive hints */}
                {!solved.has(selectedChallenge.id) && (
                  <div className="space-y-2">
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>// HINTS (deducts points)</div>
                    {selectedChallenge.hints.map(hint => {
                      const key = `${selectedChallenge.id}_${hint.level}`
                      const isUnlockedHint = !!unlockedHints[key]
                      return (
                        <div key={hint.level} className="rounded p-2" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)' }}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Hint {hint.level}/3</span>
                            {!isUnlockedHint ? (
                              <button onClick={() => unlockHint(selectedChallenge.id, hint.level as 1|2|3)}
                                className="text-xs px-2 py-0.5 rounded transition-all hover:scale-105"
                                style={{ border: '1px solid var(--border)', color: '#febc2e', background: 'rgba(254,188,46,0.06)' }}>
                                Unlock (-{hint.cost} pts)
                              </button>
                            ) : (
                              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>-{hint.cost} pts</span>
                            )}
                          </div>
                          {isUnlockedHint && (
                            <p className="text-xs pl-2" style={{ color: 'var(--cyan)', borderLeft: '2px solid var(--cyan)' }}>
                              {hint.text}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Explanation after solving */}
                {solved.has(selectedChallenge.id) && (
                  <div className="rounded p-3" style={{ background: 'rgba(0,255,65,0.04)', border: '1px solid rgba(0,255,65,0.2)' }}>
                    <div className="text-xs font-bold mb-1" style={{ color: 'var(--green)' }}>// REAL-WORLD CONTEXT</div>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-dim)' }}>
                      {selectedChallenge.explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RedTeamCTF
