import { useState, useRef, useEffect } from 'react'
import type { Challenge } from '../data/ctf'

interface SandboxProps {
  challenge: Challenge
  onCorrect: (input: string) => boolean
  solved: boolean
}

// ── Login Sandbox (bruteforce) ─────────────────────────────────────────────
export const LoginSandbox = ({ onCorrect, solved }: SandboxProps) => {
  const [pin, setPin] = useState('')
  const [log, setLog] = useState<{ text: string; ok: boolean }[]>([
    { text: '> Target: admin.panel.local:8080', ok: true },
    { text: '> Auth method: 4-digit PIN', ok: true },
    { text: '> Rate limit: none detected', ok: true },
    { text: '> Ready to attempt login...', ok: true },
  ])
  const [shaking, setShaking] = useState(false)
  const logRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef(pin)
  const onCorrectRef = useRef(onCorrect)
  useEffect(() => { onCorrectRef.current = onCorrect }, [onCorrect])
  useEffect(() => { pinRef.current = pin }, [pin])

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [log])

  const attempt = () => {
    const currentPin = pinRef.current
    if (!currentPin || currentPin.length !== 4 || solved) return
    const correct = onCorrectRef.current(currentPin)
    if (correct) {
      setLog(p => [...p,
        { text: `> Trying PIN: ${currentPin}...`, ok: true },
        { text: '> AUTH SUCCESS — Access granted!', ok: true },
        { text: '> Flag captured: CTF{brute_force_1969}', ok: true },
      ])
    } else {
      setShaking(true)
      setTimeout(() => setShaking(false), 500)
      setLog(p => [...p, { text: `> Trying PIN: ${currentPin}... FAILED`, ok: false }])
    }
    setPin('')
  }

  return (
    <div className="space-y-3">
      <div ref={logRef} className="rounded p-3 text-xs font-mono space-y-1 overflow-y-auto"
        style={{ background: 'rgba(0,0,0,0.5)', height: '120px', border: '1px solid var(--border)' }}>
        {log.map((l, i) => <div key={i} style={{ color: l.ok ? 'var(--green)' : '#ff5f57' }}>{l.text}</div>)}
      </div>
      <div className={`rounded p-3 ${shaking ? 'animate-pulse' : ''}`}
        style={{ background: 'rgba(0,20,0,0.6)', border: `1px solid ${solved ? 'var(--green)' : 'var(--border)'}` }}>
        <div className="text-xs mb-3 text-center font-bold" style={{ color: 'var(--green)' }}>
          {solved ? '✓ ACCESS GRANTED' : 'ADMIN PANEL — PIN REQUIRED'}
        </div>
        {/* PIN display */}
        <div className="flex gap-2 justify-center mb-3">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="w-9 h-11 rounded flex items-center justify-center text-xl font-bold"
              style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid ${pin[i] ? 'var(--green)' : 'var(--border)'}`, color: 'var(--green)' }}>
              {pin[i] ? '●' : ''}
            </div>
          ))}
        </div>
        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2 max-w-[180px] mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '↵'].map((k, i) => (
            <button key={i}
              disabled={solved}
              onClick={() => {
                if (solved) return
                if (k === 'C') setPin('')
                else if (k === '↵') attempt()
                else if (typeof k === 'number') setPin(p => p.length < 4 ? p + k : p)
              }}
              className="h-10 rounded text-sm font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
              style={{
                background: k === '↵' ? 'var(--green)' : 'rgba(0,255,65,0.08)',
                color: k === '↵' ? 'var(--bg)' : 'var(--green)',
                border: '1px solid var(--border)'
              }}
            >{k}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Terminal Sandbox — REAL xterm.js terminal ────────────────────────────
export const TerminalSandbox = ({ onCorrect, solved }: SandboxProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const termRef = useRef<import('@xterm/xterm').Terminal | null>(null)
  const fitRef = useRef<import('@xterm/addon-fit').FitAddon | null>(null)
  const lineRef = useRef('')
  const historyRef = useRef<string[]>([])
  const histIdxRef = useRef(-1)
  const onCorrectRef = useRef(onCorrect)
  useEffect(() => { onCorrectRef.current = onCorrect }, [onCorrect])

  const caesarDecrypt = (text: string, shift: number) =>
    text.toUpperCase().split('').map(c =>
      c >= 'A' && c <= 'Z' ? String.fromCharCode(((c.charCodeAt(0) - 65 - shift + 26) % 26) + 65) : c
    ).join('')

  const prompt = (term: import('@xterm/xterm').Terminal) => term.write('\r\n\x1b[32m$\x1b[0m ')

  const runCmd = (term: import('@xterm/xterm').Terminal, cmd: string) => {
    const c = cmd.trim().toLowerCase()
    term.write('\r\n')
    if (!c) { prompt(term); return }
    historyRef.current = [cmd, ...historyRef.current]
    histIdxRef.current = -1
    if (c === 'help') {
      term.write('\x1b[36mdecode <text> --shift <n>\x1b[0m  Decrypt Caesar cipher\r\n')
      term.write('\x1b[36msubmit <answer>\x1b[0m            Submit answer\r\n')
      term.write('\x1b[36mauto <text>\x1b[0m                Try all 25 shifts\r\n')
      term.write('\x1b[36mclear\x1b[0m                      Clear terminal\r\n')
    } else if (c === 'clear') {
      term.clear()
    } else if (c.startsWith('decode ')) {
      const parts = cmd.split('--shift')
      const text = parts[0].replace(/^decode /i, '').trim()
      const shift = parts[1] ? parseInt(parts[1].trim()) : 3
      const result = caesarDecrypt(text, isNaN(shift) ? 3 : shift)
      term.write(`\x1b[33mDecrypted:\x1b[0m ${result}\r\n`)
      if (onCorrectRef.current(result)) {
        term.write('\x1b[32m\u2713 FLAG CAPTURED: CTF{caesar_shift_3}\x1b[0m\r\n')
      } else {
        term.write(`\x1b[2mHint: submit ${result}\x1b[0m\r\n`)
      }
    } else if (c.startsWith('submit ')) {
      const ans = cmd.replace(/^submit /i, '').trim()
      if (onCorrectRef.current(ans)) {
        term.write('\x1b[32m\u2713 FLAG CAPTURED: CTF{caesar_shift_3}\x1b[0m\r\n')
      } else {
        term.write('\x1b[31m\u2717 Wrong answer.\x1b[0m\r\n')
      }
    } else if (c.startsWith('auto ')) {
      const text = cmd.replace(/^auto /i, '').trim()
      for (let s = 1; s <= 25; s++) {
        term.write(`\x1b[2mshift ${String(s).padStart(2, '0')}:\x1b[0m ${caesarDecrypt(text, s)}\r\n`)
      }
    } else {
      if (onCorrectRef.current(cmd.trim())) {
        term.write('\x1b[32m\u2713 FLAG CAPTURED: CTF{caesar_shift_3}\x1b[0m\r\n')
      } else {
        term.write(`\x1b[31mCommand not found: ${cmd}\x1b[0m  (type \x1b[36mhelp\x1b[0m)\r\n`)
      }
    }
    prompt(term)
  }

  useEffect(() => {
    if (!containerRef.current) return
    let term: import('@xterm/xterm').Terminal
    let fit: import('@xterm/addon-fit').FitAddon
    Promise.all([
      import('@xterm/xterm'),
      import('@xterm/addon-fit'),
      import('@xterm/xterm/css/xterm.css'),
    ]).then(([{ Terminal }, { FitAddon }]) => {
      term = new Terminal({
        theme: { background: '#000d00', foreground: '#00ff41', cursor: '#00ff41', selectionBackground: 'rgba(0,255,65,0.3)' },
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 12,
        cursorBlink: true,
        convertEol: true,
        rows: 12,
      })
      fit = new FitAddon()
      term.loadAddon(fit)
      term.open(containerRef.current!)
      fit.fit()
      termRef.current = term
      fitRef.current = fit
      term.write('\x1b[32mCipher Decoder v2.0\x1b[0m \u2014 type \x1b[36mhelp\x1b[0m\r\n')
      term.write('\x1b[33mIntercepted:\x1b[0m "KDOO KDOO WKH KDFTHU"\r\n')
      if (solved) { term.write('\x1b[32m\u2713 Already solved\x1b[0m\r\n'); return }
      prompt(term)
      term.onKey(({ key, domEvent: e }) => {
        if (solved) return
        if (e.key === 'Enter') {
          const cmd = lineRef.current; lineRef.current = ''; runCmd(term, cmd)
        } else if (e.key === 'Backspace') {
          if (lineRef.current.length > 0) { lineRef.current = lineRef.current.slice(0, -1); term.write('\b \b') }
        } else if (e.key === 'ArrowUp') {
          const next = histIdxRef.current + 1
          if (next < historyRef.current.length) {
            histIdxRef.current = next; lineRef.current = historyRef.current[next]
            term.write('\r\x1b[2K\x1b[32m$\x1b[0m ' + lineRef.current)
          }
        } else if (e.key === 'ArrowDown') {
          const next = histIdxRef.current - 1
          histIdxRef.current = Math.max(-1, next)
          lineRef.current = next < 0 ? '' : historyRef.current[next]
          term.write('\r\x1b[2K\x1b[32m$\x1b[0m ' + lineRef.current)
        } else if (!e.ctrlKey && !e.altKey && key) {
          lineRef.current += key; term.write(key)
        }
      })
    })
    const ro = new ResizeObserver(() => fitRef.current?.fit())
    if (containerRef.current) ro.observe(containerRef.current)
    return () => { ro.disconnect(); termRef.current?.dispose() }
  }, [])

  return <div ref={containerRef} style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }} />
}

// ── SQL Console Sandbox — REAL SQLite via sql.js (WebAssembly) ────────────
export const SQLSandbox = ({ onCorrect, solved }: SandboxProps) => {
  const [injection, setInjection] = useState('')
  const [result, setResult] = useState<{ cols: string[]; rows: string[][] } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [bypassed, setBypassed] = useState(false)
  const [loading, setLoading] = useState(true)
  const dbRef = useRef<import('sql.js').Database | null>(null)
  const onCorrectRef = useRef(onCorrect)
  useEffect(() => { onCorrectRef.current = onCorrect }, [onCorrect])

  // boot real SQLite DB in browser via WASM
  useEffect(() => {
    let cancelled = false
    import('sql.js').then(({ default: initSqlJs }) =>
      initSqlJs({ locateFile: () => '/sql-wasm.wasm' })
    ).then(SQL => {
      if (cancelled) return
      const db = new SQL.Database()
      // seed a real users table
      db.run(`
        CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, email TEXT);
        INSERT INTO users VALUES (1,'admin','5f4dcc3b5aa765d61d8327deb882cf99','admin@corp.local');
        INSERT INTO users VALUES (2,'root','d8578edf8458ce06fbc5bb76a58c5ca4','root@corp.local');
        INSERT INTO users VALUES (3,'guest','084e0343a0486ff05530df6c705c8bb4','guest@corp.local');
      `)
      dbRef.current = db
      setLoading(false)
    }).catch(() => setLoading(false))
    return () => { cancelled = true }
  }, [])

  const fullQuery = `SELECT * FROM users WHERE username='${injection}' AND password='...';`

  const run = () => {
    if (solved || !dbRef.current) return
    setError(null)
    setResult(null)
    const query = `SELECT * FROM users WHERE username='${injection}' AND password='irrelevant';`
    try {
      const res = dbRef.current.exec(query)
      if (res.length > 0 && res[0].values.length > 0) {
        const cols = res[0].columns
        const rows = res[0].values.map(r => r.map(v => String(v ?? 'NULL')))
        setResult({ cols, rows })
        setBypassed(true)
        onCorrectRef.current(injection)
      } else {
        setResult({ cols: [], rows: [] })
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'SQL error')
    }
  }

  return (
    <div className="space-y-3 text-xs font-mono">
      {loading && <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Initializing SQLite engine...</div>}
      <div className="rounded p-3 space-y-2" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border)' }}>
        <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>// Real SQLite — inject into the username field:</div>
        <div className="flex flex-wrap items-center gap-1">
          <span style={{ color: 'var(--text-dim)' }}>SELECT * FROM users WHERE username=</span>
          <span style={{ color: 'var(--green)' }}>'</span>
          <input
            value={injection}
            onChange={e => { if (!solved) setInjection(e.target.value) }}
            onKeyDown={e => e.key === 'Enter' && run()}
            disabled={solved || loading}
            placeholder="inject here..."
            className="bg-transparent outline-none font-mono disabled:opacity-50"
            style={{ color: '#febc2e', borderBottom: '1px solid var(--green)', minWidth: 80, width: Math.max(80, injection.length * 8) }}
            autoFocus
          />
          <span style={{ color: 'var(--green)' }}>'</span>
          <span style={{ color: 'var(--text-dim)' }}>AND password='...';</span>
        </div>
        <div className="mt-2 p-2 rounded text-xs break-all" style={{ background: 'rgba(0,255,65,0.04)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--text-dim)' }}>Preview: </span>{fullQuery}
        </div>
      </div>

      <button onClick={run} disabled={solved || loading}
        className="w-full py-2 rounded font-bold transition-all hover:scale-[1.01] disabled:opacity-40"
        style={{ background: 'rgba(0,255,65,0.1)', color: 'var(--green)', border: '1px solid var(--green)' }}>
        {loading ? 'LOADING ENGINE...' : '▶ EXECUTE QUERY'}
      </button>

      {error && (
        <div className="rounded p-2" style={{ background: 'rgba(255,95,87,0.06)', border: '1px solid #ff5f57', color: '#ff5f57' }}>
          SQL Error: {error}
        </div>
      )}

      {result && (
        <div className="rounded overflow-hidden" style={{ border: `1px solid ${bypassed ? 'var(--green)' : 'var(--border)'}` }}>
          {result.rows.length === 0 ? (
            <div className="p-3" style={{ color: 'var(--text-muted)' }}>0 rows returned — login failed.</div>
          ) : (
            <>
              <div className="px-3 py-1 text-xs font-bold" style={{ background: 'rgba(0,255,65,0.08)', color: 'var(--green)' }}>
                {result.rows.length} row(s) returned — AUTH BYPASSED
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {result.cols.map(c => <th key={c} className="px-3 py-1 text-left" style={{ color: 'var(--cyan)' }}>{c}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(0,255,65,0.05)' }}>
                      {row.map((cell, j) => <td key={j} className="px-3 py-1" style={{ color: 'var(--text-dim)' }}>{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ── Hash Crack Sandbox — REAL Web Crypto API (SHA-256 + MD5 via subtle) ──
const md5 = async (str: string): Promise<string> => {
  // Real MD5 via a pure-JS implementation (Web Crypto doesn't support MD5)
  // Using the same algorithm as the target hash
  const rotateLeft = (x: number, n: number) => (x << n) | (x >>> (32 - n))
  const addUnsigned = (a: number, b: number) => {
    const a8 = a & 0x80000000, b8 = b & 0x80000000
    const a4 = a & 0x40000000, b4 = b & 0x40000000
    const c = (a & 0x3fffffff) + (b & 0x3fffffff)
    if (a4 & b4) return c ^ 0x80000000 ^ a8 ^ b8
    if (a4 | b4) return c & 0x40000000 ? c ^ 0xc0000000 ^ a8 ^ b8 : c ^ 0x40000000 ^ a8 ^ b8
    return c ^ a8 ^ b8
  }
  const F = (x: number, y: number, z: number) => (x & y) | (~x & z)
  const G = (x: number, y: number, z: number) => (x & z) | (y & ~z)
  const H = (x: number, y: number, z: number) => x ^ y ^ z
  const I = (x: number, y: number, z: number) => y ^ (x | ~z)
  const FF = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number) =>
    addUnsigned(rotateLeft(addUnsigned(addUnsigned(a, F(b, c, d)), addUnsigned(x, ac)), s), b)
  const GG = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number) =>
    addUnsigned(rotateLeft(addUnsigned(addUnsigned(a, G(b, c, d)), addUnsigned(x, ac)), s), b)
  const HH = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number) =>
    addUnsigned(rotateLeft(addUnsigned(addUnsigned(a, H(b, c, d)), addUnsigned(x, ac)), s), b)
  const II = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number) =>
    addUnsigned(rotateLeft(addUnsigned(addUnsigned(a, I(b, c, d)), addUnsigned(x, ac)), s), b)
  const convertToWordArray = (s: string) => {
    const lWordCount = (((s.length + 8) >> 6) + 1) * 16
    const lWordArray: number[] = Array(lWordCount - 1).fill(0)
    let lBytePosition = 0, lByteCount = 0
    while (lByteCount < s.length) {
      lWordArray[lByteCount >> 2] |= s.charCodeAt(lByteCount) << lBytePosition
      lBytePosition = (lBytePosition + 8) % 32
      lByteCount++
    }
    lWordArray[lByteCount >> 2] |= 0x80 << lBytePosition
    lWordArray[lWordCount - 2] = s.length << 3
    return lWordArray
  }
  const wordToHex = (v: number) => {
    let r = ''
    for (let i = 0; i <= 3; i++) r += ('0' + ((v >> (i * 8)) & 0xff).toString(16)).slice(-2)
    return r
  }
  const x = convertToWordArray(str)
  let a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476
  for (let k = 0; k < x.length; k += 16) {
    const [aa, bb, cc, dd] = [a, b, c, d]
    a=FF(a,b,c,d,x[k],7,0xd76aa478);d=FF(d,a,b,c,x[k+1],12,0xe8c7b756);c=FF(c,d,a,b,x[k+2],17,0x242070db);b=FF(b,c,d,a,x[k+3],22,0xc1bdceee)
    a=FF(a,b,c,d,x[k+4],7,0xf57c0faf);d=FF(d,a,b,c,x[k+5],12,0x4787c62a);c=FF(c,d,a,b,x[k+6],17,0xa8304613);b=FF(b,c,d,a,x[k+7],22,0xfd469501)
    a=FF(a,b,c,d,x[k+8],7,0x698098d8);d=FF(d,a,b,c,x[k+9],12,0x8b44f7af);c=FF(c,d,a,b,x[k+10],17,0xffff5bb1);b=FF(b,c,d,a,x[k+11],22,0x895cd7be)
    a=FF(a,b,c,d,x[k+12],7,0x6b901122);d=FF(d,a,b,c,x[k+13],12,0xfd987193);c=FF(c,d,a,b,x[k+14],17,0xa679438e);b=FF(b,c,d,a,x[k+15],22,0x49b40821)
    a=GG(a,b,c,d,x[k+1],5,0xf61e2562);d=GG(d,a,b,c,x[k+6],9,0xc040b340);c=GG(c,d,a,b,x[k+11],14,0x265e5a51);b=GG(b,c,d,a,x[k],20,0xe9b6c7aa)
    a=GG(a,b,c,d,x[k+5],5,0xd62f105d);d=GG(d,a,b,c,x[k+10],9,0x2441453);c=GG(c,d,a,b,x[k+15],14,0xd8a1e681);b=GG(b,c,d,a,x[k+4],20,0xe7d3fbc8)
    a=GG(a,b,c,d,x[k+9],5,0x21e1cde6);d=GG(d,a,b,c,x[k+14],9,0xc33707d6);c=GG(c,d,a,b,x[k+3],14,0xf4d50d87);b=GG(b,c,d,a,x[k+8],20,0x455a14ed)
    a=GG(a,b,c,d,x[k+13],5,0xa9e3e905);d=GG(d,a,b,c,x[k+2],9,0xfcefa3f8);c=GG(c,d,a,b,x[k+7],14,0x676f02d9);b=GG(b,c,d,a,x[k+12],20,0x8d2a4c8a)
    a=HH(a,b,c,d,x[k+5],4,0xfffa3942);d=HH(d,a,b,c,x[k+8],11,0x8771f681);c=HH(c,d,a,b,x[k+11],16,0x6d9d6122);b=HH(b,c,d,a,x[k+14],23,0xfde5380c)
    a=HH(a,b,c,d,x[k+1],4,0xa4beea44);d=HH(d,a,b,c,x[k+4],11,0x4bdecfa9);c=HH(c,d,a,b,x[k+7],16,0xf6bb4b60);b=HH(b,c,d,a,x[k+10],23,0xbebfbc70)
    a=HH(a,b,c,d,x[k+13],4,0x289b7ec6);d=HH(d,a,b,c,x[k],11,0xeaa127fa);c=HH(c,d,a,b,x[k+3],16,0xd4ef3085);b=HH(b,c,d,a,x[k+6],23,0x4881d05)
    a=HH(a,b,c,d,x[k+9],4,0xd9d4d039);d=HH(d,a,b,c,x[k+12],11,0xe6db99e5);c=HH(c,d,a,b,x[k+15],16,0x1fa27cf8);b=HH(b,c,d,a,x[k+2],23,0xc4ac5665)
    a=II(a,b,c,d,x[k],6,0xf4292244);d=II(d,a,b,c,x[k+7],10,0x432aff97);c=II(c,d,a,b,x[k+14],15,0xab9423a7);b=II(b,c,d,a,x[k+5],21,0xfc93a039)
    a=II(a,b,c,d,x[k+12],6,0x655b59c3);d=II(d,a,b,c,x[k+3],10,0x8f0ccc92);c=II(c,d,a,b,x[k+10],15,0xffeff47d);b=II(b,c,d,a,x[k+1],21,0x85845dd1)
    a=II(a,b,c,d,x[k+8],6,0x6fa87e4f);d=II(d,a,b,c,x[k+15],10,0xfe2ce6e0);c=II(c,d,a,b,x[k+6],15,0xa3014314);b=II(b,c,d,a,x[k+13],21,0x4e0811a1)
    a=II(a,b,c,d,x[k+4],6,0xf7537e82);d=II(d,a,b,c,x[k+11],10,0xbd3af235);c=II(c,d,a,b,x[k+2],15,0x2ad7d2bb);b=II(b,c,d,a,x[k+9],21,0xeb86d391)
    a=addUnsigned(a,aa);b=addUnsigned(b,bb);c=addUnsigned(c,cc);d=addUnsigned(d,dd)
  }
  return (wordToHex(a)+wordToHex(b)+wordToHex(c)+wordToHex(d)).toLowerCase()
}

const TARGET_HASH = '5f4dcc3b5aa765d61d8327deb882cf99'
const WORDLIST = ['123456','admin','letmein','qwerty','monkey','dragon','master','abc123','pass','login','welcome','shadow','sunshine','princess','football','iloveyou','password']

export const HashSandbox = ({ onCorrect, solved }: SandboxProps) => {
  const [input, setInput] = useState('')
  const [cracking, setCracking] = useState(false)
  const [autoRunning, setAutoRunning] = useState(false)
  const [log, setLog] = useState<{ text: string; type: 'info' | 'ok' | 'err' | 'dim' }[]>([
    { text: '> Hash Cracker v3.1 — Real MD5 engine', type: 'info' },
    { text: '> Target: 5f4dcc3b5aa765d61d8327deb882cf99 (MD5)', type: 'info' },
    { text: '> Type a word and hit CRACK, or run AUTO to try wordlist', type: 'dim' },
  ])
  const logRef = useRef<HTMLDivElement>(null)
  const onCorrectRef = useRef(onCorrect)
  useEffect(() => { onCorrectRef.current = onCorrect }, [onCorrect])
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight }, [log])

  const crack = async (word: string) => {
    if (!word.trim() || cracking || solved) return
    setCracking(true)
    const hash = await md5(word.trim())
    setLog(p => [...p,
      { text: `> Testing: "${word.trim()}"`, type: 'dim' },
      { text: `> MD5("${word.trim()}") = ${hash}`, type: 'dim' },
    ])
    if (hash === TARGET_HASH) {
      setLog(p => [...p,
        { text: `> HASH MATCH: "${word.trim()}" → ${hash}`, type: 'ok' },
        { text: '> Flag: CTF{md5_is_dead_use_bcrypt}', type: 'ok' },
      ])
      onCorrectRef.current(word.trim())
    } else {
      setLog(p => [...p, { text: `> No match. Hash differs.`, type: 'err' }])
    }
    setCracking(false)
  }

  const runAuto = async () => {
    if (autoRunning || solved) return
    setAutoRunning(true)
    setLog(p => [...p, { text: `> Running wordlist (${WORDLIST.length} words)...`, type: 'info' }])
    for (const word of WORDLIST) {
      const hash = await md5(word)
      setLog(p => [...p, { text: `  ${word.padEnd(12)} → ${hash}`, type: 'dim' }])
      if (hash === TARGET_HASH) {
        setLog(p => [...p,
          { text: `> CRACKED: "${word}"`, type: 'ok' },
          { text: '> Flag: CTF{md5_is_dead_use_bcrypt}', type: 'ok' },
        ])
        onCorrectRef.current(word)
        setAutoRunning(false)
        return
      }
      await new Promise(r => setTimeout(r, 60))
    }
    setLog(p => [...p, { text: '> Not in wordlist. Try manually.', type: 'err' }])
    setAutoRunning(false)
  }

  const colorMap = { info: 'var(--green)', ok: 'var(--green)', err: '#ff5f57', dim: 'var(--text-dim)' }

  return (
    <div className="space-y-3 text-xs font-mono">
      <div ref={logRef} className="rounded p-3 space-y-0.5 overflow-y-auto"
        style={{ height: '160px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border)' }}>
        {log.map((l, i) => (
          <div key={i} style={{ color: colorMap[l.type], fontWeight: l.type === 'ok' ? 700 : 400 }}>{l.text}</div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && crack(input)}
          disabled={solved} placeholder="Enter a word to hash and compare..."
          className="flex-1 px-3 py-2 rounded outline-none font-mono text-xs min-w-0 disabled:opacity-50"
          style={{ background: 'rgba(0,255,65,0.05)', border: '1px solid var(--border)', color: 'var(--green)' }} />
        <button onClick={() => crack(input)} disabled={cracking || solved}
          className="px-3 py-2 rounded font-bold transition-all hover:scale-105 disabled:opacity-50 shrink-0"
          style={{ background: 'var(--green)', color: 'var(--bg)' }}>
          {cracking ? '...' : 'CRACK'}
        </button>
        <button onClick={runAuto} disabled={autoRunning || solved}
          className="px-3 py-2 rounded font-bold transition-all hover:scale-105 disabled:opacity-50 shrink-0"
          style={{ background: 'rgba(0,255,65,0.1)', color: 'var(--green)', border: '1px solid var(--green)' }}>
          {autoRunning ? 'RUNNING...' : 'AUTO'}
        </button>
      </div>
    </div>
  )
}

// ── XSS Sandbox — REAL sandboxed iframe, payload actually executes ─────────
export const XSSSandbox = ({ onCorrect, solved }: SandboxProps) => {
  const [payload, setPayload] = useState('')
  const [comments, setComments] = useState([
    { user: 'alice', text: 'Great site!' },
    { user: 'bob', text: 'Very useful, thanks.' },
  ])
  const [alerted, setAlerted] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const onCorrectRef = useRef(onCorrect)
  useEffect(() => { onCorrectRef.current = onCorrect }, [onCorrect])

  // listen for real alert() calls from inside the iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'xss-alert') {
        setAlerted(true)
        onCorrectRef.current(e.data.payload)
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  const buildIframeDoc = (posts: { user: string; text: string }[]) => {
    const commentsHtml = posts.map(c =>
      `<div class="comment"><span class="user">${c.user}:</span> ${c.text}</div>`
    ).join('')
    // intercept alert() so it posts a message to parent instead of native dialog
    return `<!DOCTYPE html><html><head><style>
      body{margin:0;padding:8px;background:#000d00;color:#4a9e5c;font-family:monospace;font-size:12px}
      .comment{padding:3px 0;border-bottom:1px solid #0a2a0a}
      .user{color:#00fff9}
    </style></head><body>
    <script>
      window.alert = function(msg) {
        parent.postMessage({ type: 'xss-alert', payload: String(msg) }, '*')
        const el = document.createElement('div')
        el.style.cssText = 'background:#003300;border:1px solid #00ff41;padding:6px;margin:4px 0;color:#00ff41;font-weight:bold'
        el.textContent = 'alert("' + msg + '") — EXECUTED'
        document.body.prepend(el)
      }
    <\/script>
    ${commentsHtml}
    </body></html>`
  }

  const post = () => {
    if (!payload.trim() || solved) return
    const newComments = [...comments, { user: 'you', text: payload }]
    setComments(newComments)
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument
      if (doc) {
        doc.open()
        doc.write(buildIframeDoc(newComments))
        doc.close()
      }
    }
    setPayload('')
  }

  // init iframe on mount
  useEffect(() => {
    if (!iframeRef.current) return
    const doc = iframeRef.current.contentDocument
    if (doc) { doc.open(); doc.write(buildIframeDoc(comments)); doc.close() }
  }, [])

  return (
    <div className="space-y-3 text-xs font-mono">
      {alerted && (
        <div className="rounded p-3 text-center" style={{ background: 'rgba(0,255,65,0.1)', border: '1px solid var(--green)' }}>
          <div className="font-bold mb-1" style={{ color: 'var(--green)' }}>REAL alert() EXECUTED IN IFRAME</div>
          <div style={{ color: 'var(--text-dim)' }}>Flag: CTF{'{xss_stored_injection}'}</div>
        </div>
      )}
      <div className="rounded overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <div className="px-3 py-1 text-xs" style={{ background: 'rgba(0,255,65,0.05)', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
          // Live comment section — unsanitised HTML renders inside real iframe
        </div>
        <iframe
          ref={iframeRef}
          sandbox="allow-scripts"
          style={{ width: '100%', height: 120, border: 'none', display: 'block' }}
          title="xss-sandbox"
        />
      </div>
      <div className="flex gap-2">
        <input value={payload} onChange={e => setPayload(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && post()}
          placeholder="Post a comment... try <script>alert('XSS')</script>"
          className="flex-1 px-3 py-2 rounded outline-none font-mono text-xs min-w-0"
          style={{ background: 'rgba(0,255,65,0.05)', border: '1px solid var(--border)', color: 'var(--green)' }} />
        <button onClick={post} disabled={solved}
          className="px-3 py-2 rounded font-bold transition-all hover:scale-105 disabled:opacity-40 shrink-0"
          style={{ background: 'var(--green)', color: 'var(--bg)' }}>POST</button>
      </div>
    </div>
  )
}

// ── Binary Decoder Sandbox ─────────────────────────────────────────────────
export const BinarySandbox = ({ onCorrect, solved }: SandboxProps) => {
  const BYTES = ['01001111', '01000010', '01000101', '01000100']
  const [inputs, setInputs] = useState(['', '', '', ''])
  const [checked, setChecked] = useState(false)
  const onCorrectRef = useRef(onCorrect)
  useEffect(() => { onCorrectRef.current = onCorrect }, [onCorrect])

  const check = () => {
    if (solved) return
    setChecked(true)
    onCorrectRef.current(inputs.join(''))
  }

  return (
    <div className="space-y-4 text-xs font-mono">
      <div className="rounded p-3" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border)' }}>
        <div style={{ color: 'var(--text-muted)' }} className="mb-3">// Decode each byte to ASCII:</div>
        <div className="grid grid-cols-4 gap-2">
          {BYTES.map((byte, i) => {
            const decimal = parseInt(byte, 2)
            const ascii = String.fromCharCode(decimal)
            const correct = inputs[i].toUpperCase() === ascii
            return (
              <div key={i} className="text-center">
                <div className="mb-1 text-xs break-all" style={{ color: 'var(--cyan)' }}>{byte}</div>
                <div className="mb-1" style={{ color: 'var(--text-muted)' }}>{decimal}</div>
                <input
                  maxLength={1}
                  value={inputs[i]}
                  disabled={solved}
                  onChange={e => { if (!solved) setInputs(p => { const n = [...p]; n[i] = e.target.value.toUpperCase(); return n }) }}
                  className="w-9 h-9 text-center rounded text-base font-bold outline-none mx-auto block disabled:opacity-50"
                  style={{
                    background: checked ? (correct ? 'rgba(0,255,65,0.15)' : 'rgba(255,95,87,0.15)') : 'rgba(0,255,65,0.05)',
                    border: `1px solid ${checked ? (correct ? 'var(--green)' : '#ff5f57') : 'var(--border)'}`,
                    color: 'var(--green)'
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>
      <button onClick={check} disabled={!inputs.every(v => v.length > 0) || solved}
        className="w-full py-2 rounded font-bold transition-all hover:scale-[1.01] disabled:opacity-40"
        style={{ background: 'rgba(0,255,65,0.1)', color: 'var(--green)', border: '1px solid var(--green)' }}>
        DECODE & SUBMIT
      </button>
      {checked && inputs.join('').toUpperCase() === 'OBED' && (
        <div className="text-center" style={{ color: 'var(--green)' }}>✓ Flag: CTF{'{lsb_steg_decoded}'}</div>
      )}
    </div>
  )
}

// ── Recon Sandbox (portscan + osint recon) ────────────────────────────────
export const ReconSandbox = ({ challenge, onCorrect, solved }: SandboxProps) => {
  const isPortscan = challenge.id === 'portscan'
  const [cmd, setCmd] = useState('')
  const [lines, setLines] = useState<{ text: string; green?: boolean }[]>([
    { text: isPortscan ? '> Network Recon Terminal v1.0' : '> OSINT Terminal v1.0' },
    { text: '> Type "help" for available commands' },
  ])
  const [historyR, setHistoryR] = useState<string[]>([])
  const [histIdxR, setHistIdxR] = useState(-1)
  const cmdInputRef = useRef<HTMLInputElement>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const onCorrectRef = useRef(onCorrect)
  useEffect(() => { onCorrectRef.current = onCorrect }, [onCorrect])
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight }, [lines])

  const run = (c: string) => {
    if (solved) return
    setHistoryR(h => [c, ...h])
    setHistIdxR(-1)
    const lower = c.trim().toLowerCase()
    setLines(p => [...p, { text: `$ ${c}`, green: true }])
    if (lower === 'help') {
      setLines(p => [...p,
        { text: 'nmap <ip>            Port scan' },
        ...(!isPortscan ? [
          { text: 'whois <domain>       WHOIS lookup' },
          { text: 'github <username>    GitHub profile recon' },
        ] : []),
        { text: 'submit <answer>      Submit your answer' },
      ])
    } else if (lower.startsWith('nmap ')) {
      setLines(p => [...p,
        { text: 'Starting Nmap scan...' },
        { text: 'PORT    STATE  SERVICE' },
        { text: '22/tcp  open   ssh' },
        { text: '80/tcp  open   http' },
        { text: '443/tcp open   https' },
        { text: isPortscan ? '> SSH port identified. Use: submit <port>' : '> Scan complete.' },
      ])
    } else if (!isPortscan && lower.startsWith('whois ')) {
      setLines(p => [...p,
        { text: 'Registrant: Obed Emoni Lopeyok' },
        { text: 'Country: KE' },
        { text: 'GitHub: github.com/obapluto-ob' },
      ])
    } else if (!isPortscan && lower.startsWith('github ')) {
      const user = c.split(' ')[1]
      setLines(p => [...p,
        { text: `Fetching github.com/${user}...` },
        { text: 'Login: obapluto-ob' },
        { text: 'Name: Obed Emoni Lopeyok' },
        { text: 'Repos: 20+' },
      ])
    } else if (lower.startsWith('submit ')) {
      const ans = c.replace(/^submit /i, '').trim()
      if (onCorrectRef.current(ans)) {
        setLines(p => [...p, { text: `✓ CORRECT! Flag: CTF{${isPortscan ? 'nmap_port_22_ssh' : 'osint_recon_complete'}}`, green: true }])
      } else {
        setLines(p => [...p, { text: '✗ Wrong answer. Keep digging.' }])
      }
    } else {
      // try raw input as a direct answer
      const ans = c.trim()
      if (onCorrectRef.current(ans)) {
        setLines(p => [...p, { text: `✓ CORRECT! Flag: CTF{${isPortscan ? 'nmap_port_22_ssh' : 'osint_recon_complete'}}`, green: true }])
      } else {
        setLines(p => [...p, { text: `Command not found: ${c}. Type "help" or: submit <answer>` }])
      }
    }
    setCmd('')
  }

  return (
    <div className="rounded overflow-hidden" style={{ border: '1px solid var(--border)', background: 'rgba(0,0,0,0.7)' }}>
      <div ref={logRef} className="p-3 text-xs font-mono space-y-0.5 overflow-y-auto" style={{ height: '180px' }}>
        {lines.map((l, i) => <div key={i} style={{ color: l.green ? 'var(--green)' : 'var(--text-dim)' }}>{l.text}</div>)}
      </div>
      <div className="flex items-center gap-2 px-3 py-2" style={{ borderTop: '1px solid var(--border)', opacity: solved ? 0.4 : 1 }}>
        <span className="text-xs shrink-0" style={{ color: 'var(--green-dim)' }}>$</span>
        <input value={cmd} onChange={e => setCmd(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && cmd.trim()) { run(cmd); return }
            if (e.key === 'ArrowUp') {
              e.preventDefault()
              const next = histIdxR + 1
              if (next < historyR.length) { setHistIdxR(next); setCmd(historyR[next]); setTimeout(() => { const el = cmdInputRef.current; if (el) { el.selectionStart = el.selectionEnd = el.value.length } }, 0) }
            }
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              const next = histIdxR - 1
              if (next < 0) { setHistIdxR(-1); setCmd('') }
              else { setHistIdxR(next); setCmd(historyR[next]); setTimeout(() => { const el = cmdInputRef.current; if (el) { el.selectionStart = el.selectionEnd = el.value.length } }, 0) }
            }
          }}
          disabled={solved}
          ref={cmdInputRef}
          placeholder={isPortscan ? 'nmap 192.168.1.1' : 'github obapluto-ob'}
          className="flex-1 bg-transparent text-xs outline-none font-mono min-w-0"
          style={{ color: 'var(--green)' }} />
      </div>
    </div>
  )
}
