import { useState, useEffect, useCallback } from 'react'
import { collection, doc, setDoc, getDoc, getDocs, orderBy, query, limit } from 'firebase/firestore'
import { db } from '../firebase'
import { CHALLENGES, ANSWERS, DIFF_COLOR, type ChallengeId, type Operator } from '../data/ctf'
import { LoginSandbox, TerminalSandbox, SQLSandbox, HashSandbox, XSSSandbox, BinarySandbox, ReconSandbox } from './CTFSandboxes'

const LS_KEY = 'ctf_operator'

interface LeaderEntry { callsign: string; score: number; solved: number }

// ── Registration ───────────────────────────────────────────────────────────
const RegisterScreen = ({ onRegister }: { onRegister: (op: Operator) => void }) => {
  const [callsign, setCallsign] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    const cs = callsign.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '')
    const em = email.trim().toLowerCase()
    if (cs.length < 3) return setError('Callsign must be at least 3 characters')
    if (!em.includes('@')) return setError('Enter a valid email')
    setLoading(true); setError('')
    try {
      const existing = await getDoc(doc(db, 'ctf_operators', cs))
      if (existing.exists()) {
        const data = existing.data() as Operator
        if (data.email !== em) { setError('Callsign taken. Use your original email.'); setLoading(false); return }
        const op = { ...data, lastSeen: Date.now() }
        await setDoc(doc(db, 'ctf_operators', cs), op, { merge: true })
        localStorage.setItem(LS_KEY, JSON.stringify(op))
        onRegister(op)
      } else {
        const op: Operator = { callsign: cs, email: em, solved: [], score: 0, hintsUsed: {}, joinedAt: Date.now(), lastSeen: Date.now() }
        await setDoc(doc(db, 'ctf_operators', cs), op)
        localStorage.setItem(LS_KEY, JSON.stringify(op))
        onRegister(op)
      }
    } catch {
      const op: Operator = { callsign: cs, email: em, solved: [], score: 0, hintsUsed: {}, joinedAt: Date.now(), lastSeen: Date.now() }
      localStorage.setItem(LS_KEY, JSON.stringify(op))
      onRegister(op)
    }
    setLoading(false)
  }

  return (
    <div className="w-full max-w-sm mx-auto font-mono px-2">
      <div className="text-center mb-6">
        <div className="text-2xl font-bold mb-1" style={{ color: 'var(--green)' }}>RED TEAM CTF</div>
        <p className="text-xs" style={{ color: 'var(--text-dim)' }}>Register your operator identity to begin</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Returning? Use same callsign + email to restore progress</p>
      </div>
      <div className="rounded-lg p-4 space-y-3" style={{ background: 'rgba(0,20,0,0.6)', border: '1px solid var(--border)' }}>
        <div>
          <label className="text-xs mb-1 block" style={{ color: 'var(--text-dim)' }}>CALLSIGN</label>
          <div className="flex items-center gap-2 rounded px-3 py-2" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border)' }}>
            <span style={{ color: 'var(--green-dim)' }} className="text-xs shrink-0">op://</span>
            <input
              value={callsign}
              onChange={e => setCallsign(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ''))}
              onKeyDown={e => e.key === 'Enter' && submit()}
              placeholder="GHOST_ZERO"
              maxLength={16}
              className="flex-1 bg-transparent outline-none text-sm font-mono min-w-0"
              style={{ color: 'var(--green)' }}
              autoFocus
            />
          </div>
        </div>
        <div>
          <label className="text-xs mb-1 block" style={{ color: 'var(--text-dim)' }}>EMAIL</label>
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
      </div>
    </div>
  )
}

// ── Main CTF ───────────────────────────────────────────────────────────────
const RedTeamCTF = () => {
  const [operator, setOperator] = useState<Operator | null>(null)
  const [selected, setSelected] = useState<ChallengeId | null>(null)
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null)
  const [attempts, setAttempts] = useState<Record<string, number>>({})
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({})
  const [unlockedHints, setUnlockedHints] = useState<Record<string, number>>({})
  const [leaderboard, setLeaderboard] = useState<LeaderEntry[]>([])
  const [showLeader, setShowLeader] = useState(false)
  // mobile: 'list' shows challenge list, 'sandbox' shows active challenge
  const [mobileView, setMobileView] = useState<'list' | 'sandbox'>('list')

  // Auto-login
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY)
    if (saved) { try { setOperator(JSON.parse(saved)) } catch { localStorage.removeItem(LS_KEY) } }
  }, [])

  // Leaderboard
  useEffect(() => {
    if (!showLeader) return
    getDocs(query(collection(db, 'ctf_operators'), orderBy('score', 'desc'), limit(10)))
      .then(snap => setLeaderboard(snap.docs.map(d => {
        const data = d.data() as Operator
        return { callsign: data.callsign, score: data.score, solved: data.solved.length }
      })))
      .catch(() => {})
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
    try { await setDoc(doc(db, 'ctf_operators', op.callsign), op, { merge: true }) } catch {}
  }

  const solved = new Set(operator?.solved ?? [])

  const isUnlocked = (id: ChallengeId) => {
    const c = CHALLENGES.find(c => c.id === id)
    if (!c?.unlockAfter) return true
    return solved.has(c.unlockAfter)
  }

  // useCallback so sandbox components always get a stable reference per render
  const handleCorrect = useCallback((id: ChallengeId, input: string): boolean => {
    if (cooldowns[id] && cooldowns[id] > Date.now()) {
      const secs = Math.ceil((cooldowns[id] - Date.now()) / 1000)
      setFeedback({ msg: `Cooldown active — wait ${secs}s`, ok: false })
      return false
    }
    if (solved.has(id)) return true

    const correct = ANSWERS[id].some(a => a.toLowerCase() === input.trim().toLowerCase())
    if (!correct) {
      const att = Math.min((attempts[id] ?? 0) + 1, 5)
      setAttempts(p => ({ ...p, [id]: att }))
      if (att >= 5) {
        setCooldowns(p => ({ ...p, [id]: Date.now() + 60_000 }))
        setAttempts(p => ({ ...p, [id]: 0 }))
        setFeedback({ msg: '5 failed attempts — 60s cooldown. Use a hint.', ok: false })
      } else {
        setFeedback({ msg: `Wrong. Attempt ${att}/5.${att >= 3 ? ' Consider a hint.' : ''}`, ok: false })
      }
      return false
    }

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
    setFeedback({ msg: `FLAG CAPTURED! +${pts} pts`, ok: true })
    setAttempts(p => ({ ...p, [id]: 0 }))
    return true
  }, [operator, solved, attempts, cooldowns])

  const unlockHint = (challengeId: ChallengeId, level: 1 | 2 | 3) => {
    const key = `${challengeId}_${level}`
    if (unlockedHints[key]) return
    const challenge = CHALLENGES.find(c => c.id === challengeId)!
    const hint = challenge.hints.find(h => h.level === level)!
    setUnlockedHints(p => ({ ...p, [key]: level }))
    saveOperator({ ...operator!, score: Math.max(0, (operator?.score ?? 0) - hint.cost), hintsUsed: { ...(operator?.hintsUsed ?? {}), [key]: hint.cost } })
  }

  const selectChallenge = (id: ChallengeId) => {
    setSelected(id)
    setFeedback(null)
    setMobileView('sandbox')
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

  const totalPoints = operator.score

  // ── Challenge list panel ─────────────────────────────────────────────────
  const ChallengeList = () => (
    <div className="space-y-2">
      {CHALLENGES.map(c => {
        const isSolved = solved.has(c.id)
        const isActive = selected === c.id
        const locked = !isUnlocked(c.id)
        const inCooldown = !!(cooldowns[c.id] && cooldowns[c.id] > Date.now())
        const secsLeft = inCooldown ? Math.ceil((cooldowns[c.id] - Date.now()) / 1000) : 0
        return (
          <button key={c.id}
            onClick={() => { if (!locked && !inCooldown) selectChallenge(c.id) }}
            disabled={locked || inCooldown}
            className="w-full text-left rounded-lg p-3 transition-all active:scale-[0.98]"
            style={{
              background: isActive ? 'rgba(0,255,65,0.08)' : isSolved ? 'rgba(0,255,65,0.03)' : 'rgba(0,15,0,0.6)',
              border: `1px solid ${isActive ? 'var(--green)' : isSolved ? 'rgba(0,255,65,0.25)' : locked ? 'rgba(255,255,255,0.05)' : 'var(--border)'}`,
              opacity: locked ? 0.4 : 1,
              cursor: locked || inCooldown ? 'not-allowed' : 'pointer',
            }}>
            <div className="flex items-center justify-between mb-1 gap-2">
              <span className="text-xs font-bold truncate" style={{ color: isSolved ? 'var(--green)' : locked ? 'var(--text-muted)' : 'var(--text)' }}>
                {isSolved ? '✓ ' : locked ? '🔒 ' : inCooldown ? `⏱${secsLeft}s ` : '○ '}{c.title}
              </span>
              <span className="text-xs font-bold shrink-0" style={{ color: DIFF_COLOR[c.difficulty] }}>{c.difficulty}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{c.category}</span>
              <span className="text-xs shrink-0" style={{ color: 'var(--cyan)' }}>{c.points}pts</span>
            </div>
            {locked && c.unlockAfter && (
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                Solve: {CHALLENGES.find(x => x.id === c.unlockAfter)?.title}
              </div>
            )}
          </button>
        )
      })}
      {solved.size === CHALLENGES.length && (
        <div className="rounded-lg p-4 text-center" style={{ border: '1px solid var(--green)', background: 'rgba(0,255,65,0.06)' }}>
          <div className="font-bold text-sm" style={{ color: 'var(--green)' }}>ALL FLAGS CAPTURED</div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>{totalPoints} pts — Elite Operator</div>
        </div>
      )}
    </div>
  )

  // ── Sandbox panel ────────────────────────────────────────────────────────
  const SandboxPanel = () => (
    <div>
      {/* Mobile back button */}
      <button
        onClick={() => setMobileView('list')}
        className="lg:hidden mb-3 text-xs px-3 py-1.5 rounded flex items-center gap-1"
        style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'transparent' }}
      >
        ← Back to challenges
      </button>

      {!selectedChallenge ? (
        <div className="rounded-lg p-8 text-center flex flex-col items-center justify-center"
          style={{ border: '1px solid var(--border)', background: 'rgba(0,10,0,0.6)', minHeight: '200px' }}>
          <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>SELECT A CHALLENGE</div>
          <div className="text-xs" style={{ color: 'var(--text-dim)' }}>{'>'} awaiting target_</div>
        </div>
      ) : (
        <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)', background: 'rgba(0,10,0,0.8)' }}>
          {/* Terminal bar */}
          <div className="flex items-center gap-2 px-3 py-2" style={{ background: 'rgba(0,255,65,0.05)', borderBottom: '1px solid var(--border)' }}>
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: '#ff5f57' }} />
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: '#febc2e' }} />
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: '#28c840' }} />
            <span className="ml-1 text-xs truncate" style={{ color: 'var(--text-dim)' }}>
              ctf/{selectedChallenge.id}
            </span>
            {solved.has(selectedChallenge.id) && (
              <span className="ml-auto text-xs font-bold shrink-0" style={{ color: 'var(--green)' }}>✓ SOLVED</span>
            )}
          </div>

          <div className="p-3 sm:p-4 space-y-4">
            {/* Meta */}
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
              <div className="text-xs font-bold py-2 px-3 rounded"
                style={{
                  color: feedback.ok ? 'var(--green)' : '#ff5f57',
                  background: feedback.ok ? 'rgba(0,255,65,0.06)' : 'rgba(255,95,87,0.06)',
                  border: `1px solid ${feedback.ok ? 'rgba(0,255,65,0.2)' : 'rgba(255,95,87,0.2)'}`
                }}>
                {feedback.ok ? '✓ ' : '✗ '}{feedback.msg}
              </div>
            )}

            {/* Hints */}
            {!solved.has(selectedChallenge.id) && (
              <div className="space-y-2">
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>// HINTS (deducts points)</div>
                {selectedChallenge.hints.map(hint => {
                  const key = `${selectedChallenge.id}_${hint.level}`
                  const isUnlockedHint = !!unlockedHints[key]
                  return (
                    <div key={hint.level} className="rounded p-2" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)' }}>
                      <div className="flex items-center justify-between mb-1 gap-2">
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Hint {hint.level}/3</span>
                        {!isUnlockedHint ? (
                          <button onClick={() => unlockHint(selectedChallenge.id, hint.level as 1|2|3)}
                            className="text-xs px-2 py-0.5 rounded shrink-0"
                            style={{ border: '1px solid var(--border)', color: '#febc2e', background: 'rgba(254,188,46,0.06)' }}>
                            Unlock (-{hint.cost}pts)
                          </button>
                        ) : (
                          <span className="text-xs shrink-0" style={{ color: 'var(--text-muted)' }}>-{hint.cost}pts</span>
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

            {/* Explanation after solve */}
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
  )

  return (
    <div className="w-full max-w-5xl mx-auto font-mono pb-16 px-1 sm:px-0">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold" style={{ color: 'var(--green)' }}>{'>'} RED TEAM CTF</h2>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-xs" style={{ color: 'var(--cyan)' }}>op://{operator.callsign}</span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>|</span>
            <span className="text-xs" style={{ color: 'var(--green)' }}>{totalPoints}pts</span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>|</span>
            <span className="text-xs" style={{ color: 'var(--cyan)' }}>{solved.size}/{CHALLENGES.length} flags</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowLeader(v => !v)}
            className="text-xs px-2 py-1.5 rounded"
            style={{ border: '1px solid var(--border)', color: showLeader ? 'var(--green)' : 'var(--text-muted)', background: showLeader ? 'rgba(0,255,65,0.08)' : 'transparent' }}>
            LEADERBOARD
          </button>
          <button onClick={() => { localStorage.removeItem(LS_KEY); setOperator(null) }}
            className="text-xs px-2 py-1.5 rounded"
            style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'transparent' }}>
            LOGOUT
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="hack-progress h-1 w-full mb-4 rounded">
        <div className="hack-progress-fill h-full rounded transition-all duration-700"
          style={{ width: `${(solved.size / CHALLENGES.length) * 100}%` }} />
      </div>

      {/* Leaderboard */}
      {showLeader && (
        <div className="rounded-lg p-4 mb-4" style={{ background: 'rgba(0,10,0,0.9)', border: '1px solid var(--green)' }}>
          <div className="text-sm font-bold mb-3" style={{ color: 'var(--green)' }}>// GLOBAL LEADERBOARD</div>
          {leaderboard.length === 0
            ? <div className="text-xs" style={{ color: 'var(--text-muted)' }}>No operators yet — be the first!</div>
            : leaderboard.map((e, i) => (
              <div key={e.callsign} className="flex items-center gap-3 py-1.5 text-xs" style={{ borderBottom: '1px solid var(--border)' }}>
                <span className="w-5 text-right shrink-0" style={{ color: i < 3 ? 'var(--green)' : 'var(--text-muted)' }}>{i + 1}.</span>
                <span className="flex-1 font-bold truncate" style={{ color: e.callsign === operator.callsign ? 'var(--cyan)' : 'var(--text)' }}>
                  {e.callsign}{e.callsign === operator.callsign ? ' (you)' : ''}
                </span>
                <span className="shrink-0" style={{ color: 'var(--green)' }}>{e.score}pts</span>
                <span className="shrink-0" style={{ color: 'var(--text-muted)' }}>{e.solved}flags</span>
              </div>
            ))
          }
        </div>
      )}

      {/* Desktop: side-by-side | Mobile: tab-switched */}
      <div className="hidden lg:grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2"><ChallengeList /></div>
        <div className="lg:col-span-3"><SandboxPanel /></div>
      </div>

      {/* Mobile layout */}
      <div className="lg:hidden">
        {mobileView === 'list' ? <ChallengeList /> : <SandboxPanel />}
      </div>
    </div>
  )
}

export default RedTeamCTF
