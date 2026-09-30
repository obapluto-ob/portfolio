import { useState, useEffect, useCallback, useRef } from 'react'
import { collection, doc, setDoc, getDoc, getDocs, orderBy, query, limit } from 'firebase/firestore'
import { db } from '../firebase'
import { CHALLENGES, ANSWERS, DIFF_COLOR, type ChallengeId, type Operator } from '../data/ctf'
import { LoginSandbox, TerminalSandbox, SQLSandbox, HashSandbox, XSSSandbox, BinarySandbox, ReconSandbox } from './CTFSandboxes'

const LS_KEY = 'ctf_operator'

interface LeaderEntry { callsign: string; score: number; solved: number }

// ── Registration ───────────────────────────────────────────────────────────
const hashPassword = async (pw: string) => {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

const RegisterScreen = ({ onRegister }: { onRegister: (op: Operator) => void }) => {
  const [callsign, setCallsign] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    const cs = callsign.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '')
    const em = email.trim().toLowerCase()
    if (cs.length < 3) return setError('Callsign must be at least 3 characters')
    if (!em.includes('@')) return setError('Enter a valid email')
    const WEAK = ['1234','0000','AAAA','BBBB','ABCD','1111','2222','3333','4444','5555','6666','7777','8888','9999','QWER','PASS','ROOT','HACK']
    if (password.length < 4) return setError('Access key must be at least 4 characters')
    if (WEAK.includes(password.toUpperCase())) return setError('Access key too weak — choose something unique')
    setLoading(true); setError('')
    try {
      const pwHash = await hashPassword(password)
      const existing = await getDoc(doc(db, 'ctf_operators', cs))
      if (existing.exists()) {
        const data = existing.data() as Operator
        if (data.email !== em) { setError('Callsign taken. Choose a different callsign.'); setLoading(false); return }
        if (data.passwordHash && data.passwordHash !== pwHash) { setError('Wrong access key for this callsign.'); setLoading(false); return }
        // existing account with no key yet — set it now (one-time migration)
        const op = { ...data, passwordHash: pwHash, lastSeen: Date.now() }
        await setDoc(doc(db, 'ctf_operators', cs), op, { merge: true })
        localStorage.setItem(LS_KEY, JSON.stringify(op))
        onRegister(op)
      } else {
        const op: Operator = { callsign: cs, email: em, passwordHash: pwHash, solved: [], score: 0, hintsUsed: {}, joinedAt: Date.now(), lastSeen: Date.now() }
        await setDoc(doc(db, 'ctf_operators', cs), op)
        localStorage.setItem(LS_KEY, JSON.stringify(op))
        onRegister(op)
      }
    } catch {
      const pwHash = await hashPassword(password)
      const op: Operator = { callsign: cs, email: em, passwordHash: pwHash, solved: [], score: 0, hintsUsed: {}, joinedAt: Date.now(), lastSeen: Date.now() }
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
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Returning? Use same callsign + email + access key</p>
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
        <div>
          <label className="text-xs mb-1 block" style={{ color: 'var(--text-dim)' }}>ACCESS KEY <span style={{ color: 'var(--text-muted)' }}>— min 4 chars, you set this</span></label>
          <div className="flex items-center gap-2 rounded px-3 py-2" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border)' }}>
            <span className="text-xs shrink-0" style={{ color: 'var(--cyan)' }}>[KEY]</span>
            <input
              value={password}
              onChange={e => setPassword(e.target.value.toUpperCase().replace(/[^A-Z0-9!@#$%^&*_\-]/g, ''))}
              onKeyDown={e => e.key === 'Enter' && submit()}
              placeholder="GHOST-7X2K"
              maxLength={16}
              type="password"
              className="flex-1 bg-transparent outline-none text-sm font-mono tracking-widest min-w-0"
              style={{ color: 'var(--green)' }}
            />
          </div>
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

// ── Mission Debrief (all flags captured) ──────────────────────────────────
const DEBRIEF_LINES = [
  '> INITIALIZING DEBRIEF PROTOCOL...',
  '> CONNECTING TO SECURE SERVER... OK',
  '> VERIFYING OPERATOR CREDENTIALS... CONFIRMED',
  '> COMPILING MISSION REPORT...',
  '────────────────────────────────────────',
  '  [CLASSIFIED] MISSION DEBRIEF — EYES ONLY',
  '────────────────────────────────────────',
  '> ALL TARGETS NEUTRALIZED',
  '> ALL FLAGS CAPTURED',
  '> ZERO TRACES LEFT BEHIND',
  '> NSA HAS BEEN NOTIFIED. JUST KIDDING.',
  '────────────────────────────────────────',
  '> INITIATING SELF-DESTRUCT IN 10s...',
  '> just kidding. probably.',
]

// tiny Web Audio tick — no file needed
const playTick = (() => {
  let ctx: AudioContext | null = null
  return () => {
    try {
      if (!ctx) ctx = new AudioContext()
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.connect(g); g.connect(ctx.destination)
      o.frequency.value = 880
      g.gain.setValueAtTime(0.04, ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04)
      o.start(); o.stop(ctx.currentTime + 0.04)
    } catch {}
  }
})()

const REDACT = '████████'

const MissionDebrief = ({ operator, rank, onDismiss }: { operator: Operator; rank: number | null; onDismiss: () => void }) => {
  const [visibleLines, setVisibleLines] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [revealed, setRevealed] = useState(0)   // how many stat fields unredacted
  const [score, setScore] = useState(0)          // animated counter
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; char: string }[]>([])
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // terminal typewriter
  useEffect(() => {
    if (visibleLines < DEBRIEF_LINES.length) {
      playTick()
      timerRef.current = setTimeout(() => setVisibleLines(v => v + 1), visibleLines < 4 ? 420 : 190)
    } else {
      setTimeout(() => setFlipped(true), 400)
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [visibleLines])

  // matrix burst on flip
  useEffect(() => {
    if (!flipped) return
    const chars = '01アイウエオカキクケコ#$%&'
    const burst = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      char: chars[Math.floor(Math.random() * chars.length)],
    }))
    setParticles(burst)
    setTimeout(() => setParticles([]), 1200)
    // start unredacting stats one by one
    let i = 0
    const iv = setInterval(() => {
      i++; setRevealed(i)
      if (i >= 6) clearInterval(iv)
    }, 280)
    return () => clearInterval(iv)
  }, [flipped])

  // score counter
  useEffect(() => {
    if (revealed < 3) return
    const target = operator.score
    const step = Math.ceil(target / 40)
    const iv = setInterval(() => {
      setScore(s => { if (s + step >= target) { clearInterval(iv); return target } return s + step })
    }, 30)
    return () => clearInterval(iv)
  }, [revealed])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const { left, top, width, height } = el.getBoundingClientRect()
    setTilt({ x: ((e.clientY - top) / height - 0.5) * -14, y: ((e.clientX - left) / width - 0.5) * 14 })
  }

  const maxScore = CHALLENGES.reduce((s, c) => s + c.points, 0)
  const clearanceLevel = operator.score >= maxScore * 0.9 ? 'LEVEL 5 — ELITE' : operator.score >= maxScore * 0.65 ? 'LEVEL 4 — SENIOR' : operator.score >= maxScore * 0.4 ? 'LEVEL 3 — OPERATIVE' : 'LEVEL 2 — RECRUIT'
  const clearancePct   = Math.round(Math.min((operator.score / maxScore) * 100, 100))
  const clearanceColor = operator.score >= maxScore * 0.9 ? '#cc00ff' : operator.score >= maxScore * 0.65 ? '#ff5f57' : operator.score >= maxScore * 0.4 ? '#febc2e' : 'var(--green)'
  const bgImage = operator.score >= maxScore * 0.9
    ? 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&q=80'
    : operator.score >= maxScore * 0.65
    ? 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1600&q=80'
    : operator.score >= maxScore * 0.4
    ? 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1600&q=80'
    : 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=1600&q=80'
  const stripImage = operator.score >= maxScore * 0.9
    ? 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80'
    : operator.score >= maxScore * 0.65
    ? 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80'
    : operator.score >= maxScore * 0.4
    ? 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80'
    : 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&q=80'
  const flawless = Object.keys(operator.hintsUsed).length === 0

  const stats = [
    { label: 'CALLSIGN',      value: `op://${operator.callsign}`,          color: 'var(--cyan)',  big: false },
    { label: 'CLEARANCE',     value: clearanceLevel,                        color: clearanceColor, big: false },
    { label: 'FINAL SCORE',   value: `${score} / ${maxScore} pts`,           color: '#ffd700',      big: true  },
    { label: 'FLAGS CAPTURED',value: `${operator.solved.length}/${CHALLENGES.length}`, color: 'var(--green)', big: true },
    { label: 'GLOBAL RANK',   value: rank !== null ? `#${rank}` : '—',      color: rank !== null && rank <= 3 ? '#ffd700' : 'var(--text)', big: true },
    { label: 'HINTS USED',    value: flawless ? 'NONE' : `${Object.keys(operator.hintsUsed).length}`, color: flawless ? 'var(--green)' : '#febc2e', big: true },
  ]

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center font-mono overflow-auto py-8">
      {/* Background */}
      <div className="absolute inset-0" style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'brightness(0.18) saturate(0.4) hue-rotate(80deg)',
      }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,rgba(0,20,0,0.85),rgba(0,5,0,0.92))' }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,65,0.025) 2px,rgba(0,255,65,0.025) 4px)'
      }} />

      {/* Matrix burst particles */}
      {particles.map(p => (
        <div key={p.id} className="absolute text-xs font-mono pointer-events-none"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            color: 'var(--green)', opacity: 0,
            animation: 'debrief-particle 1.2s ease-out forwards',
            animationDelay: `${Math.random() * 0.3}s`,
          }}>{p.char}</div>
      ))}

      <div className="relative z-10 w-full max-w-lg px-4 space-y-4">
        {/* Glitch title */}
        <div className="text-center">
          <div className="inline-block px-4 py-1 rounded text-xs tracking-widest font-bold mb-3"
            style={{ border: '1px solid #cc00ff', color: '#cc00ff', background: 'rgba(204,0,255,0.08)', boxShadow: '0 0 20px rgba(204,0,255,0.3)', letterSpacing: '0.3em' }}>
            [ CLASSIFIED — EYES ONLY ]
          </div>
          <div className="glitch text-4xl sm:text-6xl font-black tracking-tight leading-none"
            data-text="ELITE OPERATOR"
            style={{ color: 'var(--green)', textShadow: '0 0 40px var(--green),0 0 80px rgba(0,255,65,0.3)' }}>
            ELITE OPERATOR
          </div>
        </div>

        {/* Terminal */}
        <div className="rounded-lg p-4 space-y-1 scan-sweep" style={{ background: 'rgba(0,8,0,0.92)', border: '1px solid var(--border)' }}>
          {DEBRIEF_LINES.slice(0, visibleLines).map((line, i) => (
            <div key={i} className="text-xs" style={{
              color: line.startsWith('──') ? 'rgba(0,255,65,0.25)' : line.includes('CLASSIFIED') ? '#cc00ff' : line.includes('SELF-DESTRUCT') ? '#ff5f57' : line.includes('kidding') ? '#febc2e' : 'var(--green)',
              fontWeight: line.includes('CLASSIFIED') ? 700 : 400,
            }}>{line}</div>
          ))}
              {visibleLines < DEBRIEF_LINES.length && (
            <>
              <div className="cursor text-xs" style={{ color: 'var(--green)' }} />
              <button
                onClick={() => setVisibleLines(DEBRIEF_LINES.length)}
                className="text-xs mt-2 px-2 py-0.5 rounded"
                style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'transparent' }}>
                skip &gt;&gt;
              </button>
            </>
          )}
        </div>

        {/* 3D flip card */}
        <div style={{ perspective: '1000px' }}>
          <div style={{
            position: 'relative',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.8s cubic-bezier(0.4,0,0.2,1)',
            transform: flipped ? 'rotateY(0deg)' : 'rotateY(180deg)',
            minHeight: 320,
          }}>
            {/* BACK — classified stamp (shown before flip) */}
            <div style={{
              position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              borderRadius: 12, background: 'rgba(0,10,0,0.95)',
              border: '1px solid rgba(204,0,255,0.3)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16,
            }}>
              <img
                src={stripImage}
                alt=""
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12, filter: 'brightness(0.15) saturate(0.2) hue-rotate(90deg)' }}
              />
              <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 48, fontWeight: 900, color: '#cc00ff', opacity: 0.9, letterSpacing: '0.1em', textShadow: '0 0 30px #cc00ff', transform: 'rotate(-8deg)', border: '4px solid #cc00ff', padding: '8px 20px', borderRadius: 4 }}>
                  CLASSIFIED
                </div>
                <div className="text-xs mt-4" style={{ color: 'rgba(204,0,255,0.6)' }}>DECRYPTING DOSSIER...</div>
              </div>
            </div>

            {/* FRONT — dossier (shown after flip) */}
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setTilt({ x: 0, y: 0 })}
              onTouchMove={e => {
                const t = e.touches[0]
                const el = cardRef.current
                if (!el) return
                const { left, top, width, height } = el.getBoundingClientRect()
                setTilt({ x: ((t.clientY - top) / height - 0.5) * -10, y: ((t.clientX - left) / width - 0.5) * 10 })
              }}
              onTouchEnd={() => setTilt({ x: 0, y: 0 })}
              style={{
                position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: tilt.x === 0 && tilt.y === 0 ? 'transform 0.5s ease' : 'transform 0.08s ease',
                transformStyle: 'preserve-3d',
                borderRadius: 12, padding: '1rem',
                background: 'rgba(0,18,0,0.95)',
                border: '1px solid rgba(0,255,65,0.4)',
                boxShadow: `0 ${20+Math.abs(tilt.x)}px ${40+Math.abs(tilt.y)*2}px rgba(0,0,0,0.8),0 0 40px rgba(0,255,65,0.08)`,
              }}>
              {/* Circuit image strip */}
              <div style={{ width:'100%', height:72, borderRadius:8, marginBottom:12, overflow:'hidden', transform:'translateZ(20px)', boxShadow:'0 8px 24px rgba(0,0,0,0.6)', position:'relative', flexShrink:0 }}>
                <img src={stripImage} alt=""
                  style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.45) saturate(0.3) hue-rotate(90deg)', display:'block', position:'relative', zIndex:0 }} />
                <div style={{ position:'absolute', inset:0, zIndex:1, background:'linear-gradient(90deg,rgba(0,255,65,0.15),transparent,rgba(0,255,65,0.15))', pointerEvents:'none' }} />
              </div>

              <div className="text-xs tracking-widest mb-3" style={{ color:'var(--text-muted)', transform:'translateZ(10px)' }}>// OPERATOR DOSSIER</div>

              <div className="grid grid-cols-2 gap-3" style={{ transform:'translateZ(15px)' }}>
                {stats.map((s, i) => (
                  <div key={s.label}>
                    <div className="text-xs" style={{ color:'var(--text-muted)' }}>{s.label}</div>
                    <div className={s.big ? 'text-2xl font-black' : 'text-sm font-bold'}
                      style={{ color: revealed > i ? s.color : 'rgba(0,255,65,0.3)', textShadow: revealed > i && s.label === 'FINAL SCORE' ? '0 0 20px #ffd70080' : 'none',
                        transition: 'color 0.3s', letterSpacing: revealed > i ? 'normal' : '0.05em' }}>
                      {revealed > i ? s.value : REDACT}
                    </div>
                  </div>
                ))}
              </div>

              {/* Clearance bar */}
              {revealed >= 2 && (
                <div style={{ marginTop:12, transform:'translateZ(18px)' }}>
                  <div className="flex justify-between text-xs mb-1" style={{ color:'var(--text-muted)' }}>
                    <span>CLEARANCE LEVEL</span>
                    <span style={{ color: clearanceColor }}>{clearancePct}%</span>
                  </div>
                  <div style={{ height:6, borderRadius:3, background:'rgba(0,255,65,0.1)', overflow:'hidden' }}>
                    <div style={{
                      height:'100%', borderRadius:3,
                      background: `linear-gradient(90deg, var(--green), ${clearanceColor})`,
                      boxShadow: `0 0 8px ${clearanceColor}`,
                      width: `${clearancePct}%`,
                      transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
                    }} />
                  </div>
                </div>
              )}

              {flawless && revealed >= 6 && (
                <div className="text-xs text-center py-1.5 rounded mt-3 font-bold tracking-widest"
                  style={{ color:'var(--green)', border:'1px solid rgba(0,255,65,0.4)', background:'rgba(0,255,65,0.06)', transform:'translateZ(22px)', letterSpacing:'0.2em' }}>
                  [ FLAWLESS — ZERO HINTS ]
                </div>
              )}

              <button onClick={onDismiss}
                className="w-full py-2.5 rounded font-bold text-sm transition-all hover:scale-[1.02] mt-3"
                style={{ background:'var(--green)', color:'var(--bg)', boxShadow:'0 0 20px rgba(0,255,65,0.4)', transform:'translateZ(25px)', letterSpacing:'0.1em' }}>
                {'>'} VIEW LEADERBOARD
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Auto-redirect countdown ─────────────────────────────────────────────────
const AutoRedirect = ({ onDone }: { onDone: () => void }) => {
  const [secs, setSecs] = useState(3)
  useEffect(() => {
    if (secs <= 0) { onDone(); return }
    const t = setTimeout(() => setSecs(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [secs])
  return (
    <div className="absolute bottom-8 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
      Auto-advancing in {secs}s...
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
  const [mobileView, setMobileView] = useState<'list' | 'sandbox'>('list')
  const [celebration, setCelebration] = useState<{ title: string; pts: number; next: ChallengeId | null } | null>(null)
  const [showDebrief, setShowDebrief] = useState(false)
  const [debriefRank, setDebriefRank] = useState<number | null>(null)
  const [confirmRetake, setConfirmRetake] = useState(false)

  // Auto-login + sync to Firestore
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY)
    if (saved) {
      try {
        const op = JSON.parse(saved) as Operator
        setOperator(op)
        setDoc(doc(db, 'ctf_operators', op.callsign), op, { merge: true })
          .catch(() => {})
      } catch { localStorage.removeItem(LS_KEY) }
    }
  }, [])

  const fetchLeaderboard = () => {
    setLeaderboard([])
    getDocs(query(collection(db, 'ctf_operators'), orderBy('score', 'desc'), limit(10)))
      .then(snap => {
        setLeaderboard(snap.docs.map(d => {
          const data = d.data() as Operator
          return { callsign: data.callsign, score: data.score, solved: data.solved.length }
        }))
      })
      .catch(e => console.warn('[CTF] Leaderboard fetch failed:', e))
  }

  // Leaderboard
  useEffect(() => {
    if (!showLeader) return
    fetchLeaderboard()
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
    try {
      await setDoc(doc(db, 'ctf_operators', op.callsign), op, { merge: true })
    } catch { /* offline — localStorage already saved */ }
  }

  const solved = new Set(operator?.solved ?? [])

  const isUnlocked = (id: ChallengeId) => {
    const c = CHALLENGES.find(c => c.id === id)
    if (!c?.unlockAfter) return true
    return solved.has(c.unlockAfter)
  }

  const handleCorrect = useCallback((id: ChallengeId, input: string): boolean => {
    if (cooldowns[id] && cooldowns[id] > Date.now()) {
      const secs = Math.ceil((cooldowns[id] - Date.now()) / 1000)
      setFeedback({ msg: `Cooldown active — wait ${secs}s`, ok: false })
      return false
    }
    const alreadySolved = operator?.solved.includes(id) ?? false
    if (alreadySolved) return true

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
    // find next unsolved unlocked challenge
    const nextChallenge = CHALLENGES.find(c =>
      !newOp.solved.includes(c.id) &&
      (!c.unlockAfter || newOp.solved.includes(c.unlockAfter))
    ) ?? null
    const isAllDone = newOp.solved.length === CHALLENGES.length
    setCelebration({ title: challenge.title, pts, next: nextChallenge?.id ?? null })
    if (showLeader || isAllDone) setTimeout(() => {
      getDocs(query(collection(db, 'ctf_operators'), orderBy('score', 'desc'), limit(50)))
        .then(snap => {
          const idx = snap.docs.findIndex(d => d.id === newOp.callsign)
          if (idx !== -1) setDebriefRank(idx + 1)
          setLeaderboard(snap.docs.slice(0, 10).map(d => { const data = d.data() as Operator; return { callsign: data.callsign, score: data.score, solved: data.solved.length } }))
        }).catch(() => {})
    }, 1500)
    return true
  }, [operator, attempts, cooldowns, showLeader])

  const unlockHint = (challengeId: ChallengeId, level: 1 | 2 | 3) => {
    const key = `${challengeId}_${level}`
    if (unlockedHints[key]) return
    const challenge = CHALLENGES.find(c => c.id === challengeId)!
    const hint = challenge.hints.find(h => h.level === level)!
    setUnlockedHints(p => ({ ...p, [key]: level }))
    saveOperator({ ...operator!, score: (operator?.score ?? 0) - hint.cost, hintsUsed: { ...(operator?.hintsUsed ?? {}), [key]: hint.cost } })
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

  // ── Mission debrief (all flags) ──────────────────────────────────────────
  if (showDebrief) return (
    <MissionDebrief
      operator={operator}
      rank={debriefRank}
      onDismiss={() => { setShowDebrief(false); setShowLeader(true) }}
    />
  )

  // ── Celebration overlay ──────────────────────────────────────────────────
  if (celebration) {
    const lines = ['ACCESS GRANTED', 'FLAG CAPTURED', 'SYSTEM COMPROMISED', '> HACK SUCCESSFUL_']
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center font-mono"
        style={{ background: 'rgba(0,0,0,0.97)' }}>
        {/* Scanline effect */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.03) 2px, rgba(0,255,65,0.03) 4px)'
        }} />
        <div className="text-center space-y-4 px-6 relative z-10">
          <div className="text-xs tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>CHALLENGE COMPLETE</div>
          <div className="text-3xl sm:text-5xl font-black tracking-tight" style={{
            color: 'var(--green)',
            textShadow: '0 0 30px var(--green), 0 0 60px rgba(0,255,65,0.4)'
          }}>HACK<br />SUCCESS</div>
          <div className="text-sm font-bold" style={{ color: 'var(--cyan)' }}>{celebration.title}</div>
          <div className="text-2xl font-black" style={{ color: '#ffd700', textShadow: '0 0 20px #ffd70080' }}>+{celebration.pts} pts</div>
          <div className="space-y-1 py-2">
            {lines.map((l, i) => (
              <div key={i} className="text-xs" style={{ color: 'var(--green)', opacity: 0.6 + i * 0.1 }}>{l}</div>
            ))}
          </div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {celebration.next ? 'Loading next challenge...' : 'All challenges complete!'}
          </div>
          <button
            onClick={() => {
              setCelebration(null)
              if (celebration.next) selectChallenge(celebration.next)
              else setShowDebrief(true)
            }}
            className="mt-2 px-6 py-2 rounded font-bold text-sm transition-all hover:scale-105"
            style={{ background: 'var(--green)', color: 'var(--bg)', boxShadow: '0 0 20px rgba(0,255,65,0.4)' }}>
            {celebration.next ? '> NEXT CHALLENGE' : '> VIEW RESULTS'}
          </button>
        </div>
        {/* Auto-redirect */}
        {celebration.next && <AutoRedirect onDone={() => { setCelebration(null); selectChallenge(celebration.next!) }} />}
      </div>
    )
  }

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
                {isSolved ? '[+] ' : locked ? '[X] ' : inCooldown ? `[${secsLeft}s] ` : '[ ] '}{c.title}
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
        <div className="rounded-lg p-4 text-center space-y-2" style={{ border: '1px solid var(--green)', background: 'rgba(0,255,65,0.06)' }}>
          <div className="font-bold text-sm" style={{ color: 'var(--green)' }}>ALL FLAGS CAPTURED</div>
          <div className="text-xs" style={{ color: 'var(--text-dim)' }}>{totalPoints} pts — Elite Operator</div>
          <button
            onClick={() => setShowDebrief(true)}
            className="w-full py-2 rounded font-bold text-xs transition-all hover:scale-[1.02] mt-1"
            style={{ background: 'var(--green)', color: 'var(--bg)', boxShadow: '0 0 16px rgba(0,255,65,0.4)', letterSpacing: '0.1em' }}>
            {'>'} VIEW MISSION DEBRIEF
          </button>
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
          <button onClick={() => setConfirmRetake(true)}
            className="text-xs px-2 py-1.5 rounded"
            style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'transparent' }}>
            RETAKE
          </button>
          <button onClick={() => { localStorage.removeItem(LS_KEY); setOperator(null) }}
            className="text-xs px-2 py-1.5 rounded"
            style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'transparent' }}>
            LOGOUT
          </button>
        </div>
      </div>

      {/* Reset confirm modal */}
      {confirmRetake && (
        <div className="fixed inset-0 z-50 flex items-center justify-center font-mono" style={{ background: 'rgba(0,0,0,0.85)' }}>
          <div className="rounded-lg p-6 max-w-sm w-full mx-4 space-y-4" style={{ background: 'rgba(0,12,0,0.98)', border: '1px solid #ff5f57', boxShadow: '0 0 40px rgba(255,95,87,0.2)' }}>
            <div className="text-sm font-bold" style={{ color: '#ff5f57' }}>[ WARNING ] RETAKE MISSION</div>
            <div className="text-xs space-y-1" style={{ color: 'var(--text-dim)' }}>
              <div>This will unlock all challenges from scratch.</div>
              <div style={{ color: '#febc2e' }}>  — challenges reset to unsolved</div>
              <div style={{ color: '#febc2e' }}>  — hints cleared</div>
              <div style={{ color: 'var(--green)' }}>  — your score ({operator.score} pts) is kept</div>
              <div style={{ color: 'var(--green)' }}>  — recover the remaining {CHALLENGES.reduce((s,c) => s + c.points, 0) - operator.score} pts to hit 100%</div>
              <div className="mt-2" style={{ color: 'var(--text-muted)' }}>Callsign <span style={{ color: 'var(--cyan)' }}>op://{operator.callsign}</span> stays on leaderboard.</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  // keep score — retake just unlocks all challenges again
                  const fresh: Operator = { ...operator, solved: [], hintsUsed: {}, lastSeen: Date.now() }
                  await saveOperator(fresh)
                  setSelected(null)
                  setAttempts({})
                  setCooldowns({})
                  setUnlockedHints({})
                  setFeedback(null)
                  setShowDebrief(false)
                  setConfirmRetake(false)
                }}
                className="flex-1 py-2 rounded font-bold text-xs transition-all hover:scale-[1.02]"
                style={{ background: '#ff5f57', color: '#000' }}>
                CONFIRM RETAKE
              </button>
              <button
                onClick={() => setConfirmRetake(false)}
                className="flex-1 py-2 rounded font-bold text-xs transition-all hover:scale-[1.02]"
                style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'transparent' }}>
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className="hack-progress h-1 w-full mb-4 rounded">
        <div className="hack-progress-fill h-full rounded transition-all duration-700"
          style={{ width: `${(solved.size / CHALLENGES.length) * 100}%` }} />
      </div>

      {/* Leaderboard */}
      {showLeader && (
        <div className="rounded-lg p-4 mb-4" style={{ background: 'rgba(0,10,0,0.9)', border: '1px solid var(--green)' }}>
          <div className="text-sm font-bold mb-3 flex items-center justify-between" style={{ color: 'var(--green)' }}>
            <span>// GLOBAL LEADERBOARD</span>
            <button onClick={fetchLeaderboard} className="text-xs px-2 py-0.5 rounded" style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'transparent' }}>↻ REFRESH</button>
          </div>
          {leaderboard.length === 0
            ? <div className="text-xs" style={{ color: 'var(--text-muted)' }}>No operators yet — be the first!</div>
            : leaderboard.map((e, i) => {
              const isYou = e.callsign === operator.callsign
              const displayScore = isYou ? operator.score : e.score
              const displaySolved = isYou ? operator.solved.length : e.solved
              const medalColors: Record<number, { outer: string; inner: string; shine: string; shadow: string }> = {
                0: { outer: '#b8860b', inner: '#ffd700', shine: '#fff5a0', shadow: '#7a5800' },
                1: { outer: '#7a7a7a', inner: '#c0c0c0', shine: '#f0f0f0', shadow: '#444' },
                2: { outer: '#7a3f00', inner: '#cd7f32', shine: '#f0a860', shadow: '#4a2000' },
              }
              const m = medalColors[i]
              return (
                <div key={e.callsign} className="flex items-center gap-3 py-2 text-xs" style={{ borderBottom: '1px solid var(--border)' }}>
                  <div className="shrink-0 flex items-center justify-center" style={{ width: 28, height: 28 }}>
                    {m ? (
                      <div style={{
                        width: 24, height: 24, borderRadius: '50%',
                        background: `radial-gradient(circle at 35% 35%, ${m.shine}, ${m.inner} 45%, ${m.outer} 75%, ${m.shadow})`,
                        boxShadow: `0 2px 4px rgba(0,0,0,0.6), inset 0 1px 2px ${m.shine}40, 0 0 8px ${m.inner}60`,
                        border: `1.5px solid ${m.outer}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 9, fontWeight: 900, color: m.shadow,
                        textShadow: `0 1px 0 ${m.shine}`,
                        letterSpacing: '-0.5px',
                      }}>{i + 1}</div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{i + 1}.</span>
                    )}
                  </div>
                  <span className="flex-1 font-bold truncate" style={{ color: isYou ? 'var(--cyan)' : i === 0 ? '#ffd700' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : 'var(--text)' }}>
                    {e.callsign}{isYou ? ' (you)' : ''}
                  </span>
                  <span className="shrink-0" style={{ color: 'var(--green)' }}>{displayScore}pts</span>
                  <span className="shrink-0" style={{ color: 'var(--text-muted)' }}>{displaySolved}flags</span>
                </div>
              )
            })
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
