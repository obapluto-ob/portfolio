import { useState, useRef, useEffect } from 'react'
import type { Challenge } from '../data/ctf'

interface SandboxProps {
  challenge: Challenge
  onCorrect: (input: string) => boolean
  solved: boolean
}

// ── Login Sandbox (bruteforce) ─────────────────────────────────────────────
export const LoginSandbox = ({ challenge, onCorrect, solved }: SandboxProps) => {
  const [pin, setPin] = useState('')
  const [log, setLog] = useState<{ text: string; ok: boolean }[]>([
    { text: '> Target: admin.panel.local:8080', ok: true },
    { text: '> Auth method: 4-digit PIN', ok: true },
    { text: '> Rate limit: none detected', ok: true },
    { text: '> Ready to attempt login...', ok: true },
  ])
  const [shaking, setShaking] = useState(false)
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [log])

  const attempt = () => {
    if (!pin || pin.length !== 4 || solved) return
    const correct = onCorrect(pin)
    if (correct) {
      setLog(p => [...p,
        { text: `> Trying PIN: ${pin}...`, ok: true },
        { text: '> AUTH SUCCESS — Access granted!', ok: true },
        { text: '> Flag captured: CTF{brute_force_1969}', ok: true },
      ])
    } else {
      setShaking(true)
      setTimeout(() => setShaking(false), 500)
      setLog(p => [...p, { text: `> Trying PIN: ${pin}... FAILED`, ok: false }])
    }
    setPin('')
  }

  return (
    <div className="space-y-3">
      <div ref={logRef} className="rounded p-3 text-xs font-mono space-y-1 overflow-y-auto" style={{ background: 'rgba(0,0,0,0.5)', height: '140px', border: '1px solid var(--border)' }}>
        {log.map((l, i) => <div key={i} style={{ color: l.ok ? 'var(--green)' : '#ff5f57' }}>{l.text}</div>)}
      </div>
      <div className={`rounded p-4 ${shaking ? 'animate-pulse' : ''}`} style={{ background: 'rgba(0,20,0,0.6)', border: '1px solid var(--border)' }}>
        <div className="text-xs mb-3 text-center font-bold" style={{ color: 'var(--green)' }}>ADMIN PANEL — PIN REQUIRED</div>
        <div className="flex gap-2 justify-center mb-3">
          {[0,1,2,3].map(i => (
            <div key={i} className="w-10 h-12 rounded flex items-center justify-center text-xl font-bold" style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid ${pin[i] ? 'var(--green)' : 'var(--border)'}`, color: 'var(--green)' }}>
              {pin[i] ? '●' : ''}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 max-w-[180px] mx-auto">
          {[1,2,3,4,5,6,7,8,9,'C',0,'↵'].map((k, i) => (
            <button key={i} onClick={() => {
              if (k === 'C') setPin('')
              else if (k === '↵') attempt()
              else if (pin.length < 4) setPin(p => p + k)
            }}
              className="h-10 rounded text-sm font-bold transition-all hover:scale-105 active:scale-95"
              style={{ background: k === '↵' ? 'var(--green)' : 'rgba(0,255,65,0.08)', color: k === '↵' ? 'var(--bg)' : 'var(--green)', border: '1px solid var(--border)' }}
            >{k}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Terminal Sandbox (cipher) ──────────────────────────────────────────────
export const TerminalSandbox = ({ challenge, onCorrect, solved }: SandboxProps) => {
  const [input, setInput] = useState('')
  const [lines, setLines] = useState<{ text: string; type: 'cmd' | 'out' | 'err' | 'ok' }[]>([
    { text: 'Cipher Decoder v1.0 — type "help" for commands', type: 'out' },
    { text: 'Intercepted: "KDOO KDOO WKH KDFTHU"', type: 'out' },
    { text: 'Shift: 3 | Mode: decrypt', type: 'out' },
  ])
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [lines])

  const caesarDecrypt = (text: string, shift: number) =>
    text.toUpperCase().split('').map(c => {
      if (c >= 'A' && c <= 'Z') return String.fromCharCode(((c.charCodeAt(0) - 65 - shift + 26) % 26) + 65)
      return c
    }).join('')

  const run = (cmd: string) => {
    const c = cmd.trim().toLowerCase()
    setLines(p => [...p, { text: `$ ${cmd}`, type: 'cmd' }])
    setHistory(h => [cmd, ...h])
    setHistIdx(-1)

    if (c === 'help') {
      setLines(p => [...p,
        { text: 'decode <text> --shift <n>  Decrypt Caesar cipher', type: 'out' },
        { text: 'encode <text> --shift <n>  Encrypt with Caesar', type: 'out' },
        { text: 'auto <text>                Try all 25 shifts', type: 'out' },
        { text: 'clear                      Clear terminal', type: 'out' },
      ])
    } else if (c === 'clear') {
      setLines([])
    } else if (c.startsWith('decode ')) {
      const parts = cmd.split('--shift')
      const text = parts[0].replace(/^decode /i, '').trim()
      const shift = parts[1] ? parseInt(parts[1].trim()) : 3
      const result = caesarDecrypt(text, isNaN(shift) ? 3 : shift)
      setLines(p => [...p, { text: `Decrypted: ${result}`, type: 'out' }])
      if (onCorrect(result)) {
        setLines(p => [...p, { text: '✓ FLAG CAPTURED: CTF{caesar_shift_3}', type: 'ok' }])
      }
    } else if (c.startsWith('auto ')) {
      const text = cmd.replace(/^auto /i, '').trim()
      for (let s = 1; s <= 25; s++) {
        setLines(p => [...p, { text: `shift ${String(s).padStart(2,'0')}: ${caesarDecrypt(text, s)}`, type: 'out' }])
      }
    } else if (c.startsWith('encode ')) {
      const parts = cmd.split('--shift')
      const text = parts[0].replace(/^encode /i, '').trim()
      const shift = parts[1] ? parseInt(parts[1].trim()) : 3
      const result = text.toUpperCase().split('').map(ch => {
        if (ch >= 'A' && ch <= 'Z') return String.fromCharCode(((ch.charCodeAt(0) - 65 + (isNaN(shift) ? 3 : shift)) % 26) + 65)
        return ch
      }).join('')
      setLines(p => [...p, { text: `Encoded: ${result}`, type: 'out' }])
    } else {
      setLines(p => [...p, { text: `Command not found: ${cmd}. Type "help".`, type: 'err' }])
    }
    setInput('')
  }

  return (
    <div className="rounded overflow-hidden" style={{ border: '1px solid var(--border)', background: 'rgba(0,0,0,0.7)' }}>
      <div ref={logRef} className="p-3 text-xs font-mono space-y-0.5 overflow-y-auto" style={{ height: '220px' }}>
        {lines.map((l, i) => (
          <div key={i} style={{ color: l.type === 'cmd' ? 'var(--cyan)' : l.type === 'err' ? '#ff5f57' : l.type === 'ok' ? 'var(--green)' : 'var(--text-dim)' }}>{l.text}</div>
        ))}
      </div>
      <div className="flex items-center gap-2 px-3 py-2" style={{ borderTop: '1px solid var(--border)' }}>
        <span className="text-xs" style={{ color: 'var(--green-dim)' }}>$</span>
        <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && input.trim()) run(input)
            if (e.key === 'ArrowUp') { const h = history[histIdx + 1]; if (h) { setInput(h); setHistIdx(i => i + 1) } }
            if (e.key === 'ArrowDown') { const h = history[histIdx - 1]; setInput(h ?? ''); setHistIdx(i => Math.max(-1, i - 1)) }
          }}
          placeholder='decode "KDOO KDOO WKH KDFTHU" --shift 3'
          className="flex-1 bg-transparent text-xs outline-none font-mono"
          style={{ color: 'var(--green)' }} autoFocus
        />
      </div>
    </div>
  )
}

// ── SQL Console Sandbox ────────────────────────────────────────────────────
export const SQLSandbox = ({ onCorrect, solved }: SandboxProps) => {
  const [query, setQuery] = useState("SELECT * FROM users WHERE username='' AND password='secret'")
  const [result, setResult] = useState<string | null>(null)
  const [injected, setInjected] = useState(false)

  const run = () => {
    const q = query.toLowerCase()
    const correct = onCorrect(query)
    if (correct || q.includes("or '1'='1") || q.includes('or 1=1') || q.includes("admin'--")) {
      setInjected(true)
      setResult('✓ Query returned ALL rows — authentication bypassed!\n\nid | username | email\n1  | admin    | admin@corp.local\n2  | root     | root@corp.local\n3  | guest    | guest@corp.local\n\nFlag: CTF{sql_injection_bypass}')
    } else if (q.includes('select')) {
      setResult('0 rows returned — login failed.')
    } else {
      setResult('ERROR: Syntax error near unexpected token.')
    }
  }

  return (
    <div className="space-y-3 text-xs font-mono">
      <div className="rounded p-3" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border)' }}>
        <div style={{ color: 'var(--text-muted)' }} className="mb-2">-- Vulnerable query (edit the username value):</div>
        <textarea value={query} onChange={e => setQuery(e.target.value)} rows={3}
          className="w-full bg-transparent outline-none resize-none"
          style={{ color: 'var(--cyan)', caretColor: 'var(--green)' }} />
      </div>
      <button onClick={run} className="w-full py-2 rounded font-bold transition-all hover:scale-[1.01]"
        style={{ background: 'rgba(0,255,65,0.1)', color: 'var(--green)', border: '1px solid var(--green)' }}>
        ▶ EXECUTE QUERY
      </button>
      {result && (
        <div className="rounded p-3 whitespace-pre-line" style={{ background: injected ? 'rgba(0,255,65,0.06)' : 'rgba(255,95,87,0.06)', border: `1px solid ${injected ? 'var(--green)' : '#ff5f57'}`, color: injected ? 'var(--green)' : '#ff5f57' }}>
          {result}
        </div>
      )}
    </div>
  )
}

// ── Hash Crack Sandbox ─────────────────────────────────────────────────────
export const HashSandbox = ({ onCorrect, solved }: SandboxProps) => {
  const [input, setInput] = useState('')
  const [cracking, setCracking] = useState(false)
  const [log, setLog] = useState<string[]>(['> Hash Cracker v3.1 ready', '> Target: 5f4dcc3b5aa765d61d8327deb882cf99 (MD5)'])
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight }, [log])

  const crack = () => {
    if (!input.trim() || cracking) return
    setCracking(true)
    const wordlist = ['123456', 'admin', 'letmein', 'qwerty', input.trim(), 'password']
    let i = 0
    const interval = setInterval(() => {
      if (i < wordlist.length) {
        const word = wordlist[i]
        setLog(p => [...p, `> Testing: "${word}"...`])
        if (word === input.trim() && onCorrect(word)) {
          setLog(p => [...p, `> MATCH FOUND: "${word}"`, '> Flag: CTF{md5_is_dead_use_bcrypt}'])
          clearInterval(interval)
          setCracking(false)
        } else if (i === wordlist.length - 1) {
          setLog(p => [...p, '> Not in wordlist. Try another word.'])
          clearInterval(interval)
          setCracking(false)
        }
        i++
      }
    }, 300)
  }

  return (
    <div className="space-y-3 text-xs font-mono">
      <div ref={logRef} className="rounded p-3 space-y-0.5 overflow-y-auto" style={{ height: '160px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border)' }}>
        {log.map((l, i) => <div key={i} style={{ color: l.includes('MATCH') || l.includes('Flag') ? 'var(--green)' : 'var(--text-dim)' }}>{l}</div>)}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && crack()}
          placeholder="Enter a word to test against the hash..."
          className="flex-1 px-3 py-2 rounded outline-none font-mono text-xs"
          style={{ background: 'rgba(0,255,65,0.05)', border: '1px solid var(--border)', color: 'var(--green)' }} />
        <button onClick={crack} disabled={cracking}
          className="px-4 py-2 rounded font-bold transition-all hover:scale-105 disabled:opacity-50"
          style={{ background: 'var(--green)', color: 'var(--bg)' }}>
          {cracking ? '...' : 'CRACK'}
        </button>
      </div>
    </div>
  )
}

// ── XSS Sandbox ───────────────────────────────────────────────────────────
export const XSSSandbox = ({ onCorrect, solved }: SandboxProps) => {
  const [payload, setPayload] = useState('')
  const [comments, setComments] = useState([
    { user: 'alice', text: 'Great site!' },
    { user: 'bob', text: 'Very useful, thanks.' },
  ])
  const [alerted, setAlerted] = useState(false)

  const post = () => {
    if (!payload.trim()) return
    const isXSS = payload.toLowerCase().includes('<script>') && payload.toLowerCase().includes('alert')
    setComments(p => [...p, { user: 'you', text: payload }])
    if (isXSS) {
      setAlerted(true)
      onCorrect(payload)
    }
    setPayload('')
  }

  return (
    <div className="space-y-3 text-xs font-mono">
      {alerted && (
        <div className="rounded p-3 text-center animate-pulse" style={{ background: 'rgba(0,255,65,0.1)', border: '1px solid var(--green)' }}>
          <div className="font-bold mb-1" style={{ color: 'var(--green)' }}>⚠ ALERT TRIGGERED</div>
          <div style={{ color: 'var(--text-dim)' }}>{'Script executed! Flag: CTF{xss_stored_injection}'}</div>
        </div>
      )}
      <div className="rounded p-3 space-y-2" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border)', maxHeight: '140px', overflowY: 'auto' }}>
        <div className="font-bold mb-2" style={{ color: 'var(--text-dim)' }}>// Comment section (unsanitised)</div>
        {comments.map((c, i) => (
          <div key={i} className="flex gap-2">
            <span style={{ color: 'var(--cyan)' }}>{c.user}:</span>
            <span style={{ color: c.user === 'you' && alerted ? 'var(--green)' : 'var(--text-muted)' }}
              dangerouslySetInnerHTML={c.user === 'you' ? undefined : { __html: c.text }}>
              {c.user === 'you' ? c.text : undefined}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={payload} onChange={e => setPayload(e.target.value)} onKeyDown={e => e.key === 'Enter' && post()}
          placeholder="Post a comment... (try injecting a script)"
          className="flex-1 px-3 py-2 rounded outline-none font-mono text-xs"
          style={{ background: 'rgba(0,255,65,0.05)', border: '1px solid var(--border)', color: 'var(--green)' }} />
        <button onClick={post} className="px-4 py-2 rounded font-bold transition-all hover:scale-105"
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

  const check = () => {
    setChecked(true)
    const result = inputs.join('')
    onCorrect(result)
  }

  const allFilled = inputs.every(v => v.length > 0)

  return (
    <div className="space-y-4 text-xs font-mono">
      <div className="rounded p-3" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border)' }}>
        <div style={{ color: 'var(--text-muted)' }} className="mb-2">// Binary payload — decode each byte to ASCII:</div>
        <div className="grid grid-cols-4 gap-3">
          {BYTES.map((byte, i) => {
            const decimal = parseInt(byte, 2)
            const ascii = String.fromCharCode(decimal)
            const correct = inputs[i].toUpperCase() === ascii
            return (
              <div key={i} className="text-center">
                <div className="mb-1" style={{ color: 'var(--cyan)', letterSpacing: '1px' }}>{byte}</div>
                <div className="mb-1" style={{ color: 'var(--text-muted)' }}>= {decimal}</div>
                <div className="mb-1" style={{ color: 'var(--text-muted)' }}>= ?</div>
                <input
                  maxLength={1}
                  value={inputs[i]}
                  onChange={e => setInputs(p => { const n = [...p]; n[i] = e.target.value.toUpperCase(); return n })}
                  className="w-10 h-10 text-center rounded text-lg font-bold outline-none"
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
      <button onClick={check} disabled={!allFilled}
        className="w-full py-2 rounded font-bold transition-all hover:scale-[1.01] disabled:opacity-40"
        style={{ background: 'rgba(0,255,65,0.1)', color: 'var(--green)', border: '1px solid var(--green)' }}>
        DECODE & SUBMIT
      </button>
      {checked && inputs.join('').toUpperCase() === 'OBED' && (
        <div className="text-center" style={{ color: 'var(--green)' }}>{'✓ Flag: CTF{lsb_steg_decoded}'}</div>
      )}
    </div>
  )
}

// ── Recon Sandbox ──────────────────────────────────────────────────────────
export const ReconSandbox = ({ challenge, onCorrect, solved }: SandboxProps) => {
  const [cmd, setCmd] = useState('')
  const [lines, setLines] = useState<{ text: string; green?: boolean }[]>([
    { text: '> OSINT Terminal v1.0' },
    { text: '> Type "help" for available commands' },
  ])
  const logRef = useRef<HTMLDivElement>(null)
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight }, [lines])

  const run = (c: string) => {
    const lower = c.trim().toLowerCase()
    setLines(p => [...p, { text: `$ ${c}`, green: true }])
    if (lower === 'help') {
      setLines(p => [...p,
        { text: 'whois <domain>       WHOIS lookup' },
        { text: 'nmap <ip>            Port scan' },
        { text: 'github <username>    GitHub profile recon' },
        { text: 'submit <answer>      Submit your flag' },
      ])
    } else if (lower.startsWith('nmap ')) {
      setLines(p => [...p,
        { text: 'Starting Nmap scan...' },
        { text: 'PORT    STATE  SERVICE' },
        { text: '22/tcp  open   ssh' },
        { text: '80/tcp  open   http' },
        { text: '443/tcp open   https' },
      ])
    } else if (lower.startsWith('whois ')) {
      setLines(p => [...p,
        { text: 'Registrant: Obed Emoni Lopeyok' },
        { text: 'Country: KE' },
        { text: 'GitHub: github.com/obapluto-ob' },
      ])
    } else if (lower.startsWith('github ')) {
      const user = c.split(' ')[1]
      setLines(p => [...p,
        { text: `Fetching github.com/${user}...` },
        { text: 'Login: obapluto-ob' },
        { text: 'Name: Obed Emoni Lopeyok' },
        { text: 'Repos: 20+, Followers: growing' },
      ])
    } else if (lower.startsWith('submit ')) {
      const ans = c.replace(/^submit /i, '').trim()
      if (onCorrect(ans)) {
        setLines(p => [...p, { text: '✓ CORRECT! Flag: CTF{osint_recon_complete}', green: true }])
      } else {
        setLines(p => [...p, { text: '✗ Wrong answer. Keep digging.' }])
      }
    } else {
      setLines(p => [...p, { text: `Command not found: ${c}` }])
    }
    setCmd('')
  }

  return (
    <div className="rounded overflow-hidden" style={{ border: '1px solid var(--border)', background: 'rgba(0,0,0,0.7)' }}>
      <div ref={logRef} className="p-3 text-xs font-mono space-y-0.5 overflow-y-auto" style={{ height: '200px' }}>
        {lines.map((l, i) => <div key={i} style={{ color: l.green ? 'var(--green)' : 'var(--text-dim)' }}>{l.text}</div>)}
      </div>
      <div className="flex items-center gap-2 px-3 py-2" style={{ borderTop: '1px solid var(--border)' }}>
        <span className="text-xs" style={{ color: 'var(--green-dim)' }}>$</span>
        <input value={cmd} onChange={e => setCmd(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && cmd.trim() && run(cmd)}
          placeholder='github obapluto-ob'
          className="flex-1 bg-transparent text-xs outline-none font-mono"
          style={{ color: 'var(--green)' }} autoFocus />
      </div>
    </div>
  )
}
