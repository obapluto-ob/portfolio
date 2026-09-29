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

// ── Terminal Sandbox (cipher) ──────────────────────────────────────────────
export const TerminalSandbox = ({ onCorrect, solved }: SandboxProps) => {
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
  const onCorrectRef = useRef(onCorrect)
  useEffect(() => { onCorrectRef.current = onCorrect }, [onCorrect])

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
        { text: 'submit <answer>            Submit decrypted text directly', type: 'out' },
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
      if (onCorrectRef.current(result)) {
        setLines(p => [...p, { text: '✓ FLAG CAPTURED: CTF{caesar_shift_3}', type: 'ok' }])
      } else {
        setLines(p => [...p, { text: '> If correct, use: submit ' + result, type: 'out' }])
      }
    } else if (c.startsWith('submit ')) {
      const ans = cmd.replace(/^submit /i, '').trim()
      if (onCorrectRef.current(ans)) {
        setLines(p => [...p, { text: '✓ FLAG CAPTURED: CTF{caesar_shift_3}', type: 'ok' }])
      } else {
        setLines(p => [...p, { text: '✗ Wrong answer. Try decoding first.', type: 'err' }])
      }
    } else if (c.startsWith('auto ')) {
      const text = cmd.replace(/^auto /i, '').trim()
      for (let s = 1; s <= 25; s++) {
        setLines(p => [...p, { text: `shift ${String(s).padStart(2, '0')}: ${caesarDecrypt(text, s)}`, type: 'out' }])
      }
    } else {
      // last resort: try the raw input as a direct answer
      if (onCorrectRef.current(cmd.trim())) {
        setLines(p => [...p, { text: '✓ FLAG CAPTURED: CTF{caesar_shift_3}', type: 'ok' }])
      } else {
        setLines(p => [...p, { text: `Command not found: ${cmd}. Type "help" or use: submit <answer>`, type: 'err' }])
      }
    }
    setInput('')
  }

  return (
    <div className="rounded overflow-hidden" style={{ border: '1px solid var(--border)', background: 'rgba(0,0,0,0.7)' }}>
      <div ref={logRef} className="p-3 text-xs font-mono space-y-0.5 overflow-y-auto" style={{ height: '180px' }}>
        {lines.map((l, i) => (
          <div key={i} style={{ color: l.type === 'cmd' ? 'var(--cyan)' : l.type === 'err' ? '#ff5f57' : l.type === 'ok' ? 'var(--green)' : 'var(--text-dim)' }}>
            {l.text}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 px-3 py-2" style={{ borderTop: '1px solid var(--border)' }}>
        <span className="text-xs shrink-0" style={{ color: 'var(--green-dim)' }}>$</span>
        <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && input.trim()) run(input)
            if (e.key === 'ArrowUp') { const h = history[histIdx + 1]; if (h) { setInput(h); setHistIdx(i => i + 1) } }
            if (e.key === 'ArrowDown') { const h = history[histIdx - 1]; setInput(h ?? ''); setHistIdx(i => Math.max(-1, i - 1)) }
          }}
          placeholder='decode "KDOO KDOO WKH KDFTHU" --shift 3'
          className="flex-1 bg-transparent text-xs outline-none font-mono min-w-0"
          style={{ color: 'var(--green)' }}
        />
      </div>
    </div>
  )
}

// ── SQL Console Sandbox ────────────────────────────────────────────────────
export const SQLSandbox = ({ onCorrect, solved }: SandboxProps) => {
  const [injection, setInjection] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [injected, setInjected] = useState(false)
  const onCorrectRef = useRef(onCorrect)
  useEffect(() => { onCorrectRef.current = onCorrect }, [onCorrect])

  const fullQuery = `SELECT * FROM users WHERE username='${injection}' AND password='secret'`

  const run = () => {
    if (solved) return
    const q = fullQuery.toLowerCase()
    const payload = injection.trim() || fullQuery
    const correct = onCorrectRef.current(payload)
    if (correct || q.includes("or '1'='1") || q.includes('or 1=1') || q.includes("admin'--")) {
      setInjected(true)
      setResult('✓ Query returned ALL rows — authentication bypassed!\n\nid | username | email\n1  | admin    | admin@corp.local\n2  | root     | root@corp.local\n\nFlag: CTF{sql_injection_bypass}')
    } else if (injection.trim()) {
      setResult('0 rows returned — login failed. Try injecting into the username.')
    } else {
      setResult('0 rows returned — login failed.')
    }
  }

  return (
    <div className="space-y-3 text-xs font-mono">
      {/* Visual query builder */}
      <div className="rounded p-3 space-y-2" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border)' }}>
        <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>// Type your injection into the username field:</div>
        <div className="flex flex-wrap items-center gap-1" style={{ color: 'var(--cyan)' }}>
          <span style={{ color: 'var(--text-dim)' }}>SELECT * FROM users WHERE username=</span>
          <span style={{ color: 'var(--green)' }}>'</span>
          <input
            value={injection}
            onChange={e => { if (!solved) setInjection(e.target.value) }}
            onKeyDown={e => e.key === 'Enter' && run()}
            disabled={solved}
            placeholder="type here..."
            className="bg-transparent outline-none font-mono disabled:opacity-50"
            style={{ color: '#febc2e', borderBottom: '1px solid var(--green)', minWidth: 80, width: Math.max(80, injection.length * 8) }}
            autoFocus
          />
          <span style={{ color: 'var(--green)' }}>'</span>
          <span style={{ color: 'var(--text-dim)' }}>AND password='secret'</span>
        </div>
        {/* Full query preview */}
        <div className="mt-2 p-2 rounded text-xs break-all" style={{ background: 'rgba(0,255,65,0.04)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--text-dim)' }}>Preview: </span>{fullQuery}
        </div>
      </div>
      <button onClick={run} disabled={solved} className="w-full py-2 rounded font-bold transition-all hover:scale-[1.01] disabled:opacity-40"
        style={{ background: 'rgba(0,255,65,0.1)', color: 'var(--green)', border: '1px solid var(--green)' }}>
        ▶ EXECUTE QUERY
      </button>
      {result && (
        <div className="rounded p-3 whitespace-pre-line"
          style={{ background: injected ? 'rgba(0,255,65,0.06)' : 'rgba(255,95,87,0.06)', border: `1px solid ${injected ? 'var(--green)' : '#ff5f57'}`, color: injected ? 'var(--green)' : '#ff5f57' }}>
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
  const onCorrectRef = useRef(onCorrect)
  useEffect(() => { onCorrectRef.current = onCorrect }, [onCorrect])

  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight }, [log])

  const crack = () => {
    if (!input.trim() || cracking || solved) return
    setCracking(true)
    const guess = input.trim()
    const wordlist = ['123456', 'admin', 'letmein', 'qwerty', guess]
    let i = 0
    const interval = setInterval(() => {
      if (i >= wordlist.length) { clearInterval(interval); setCracking(false); return }
      const word = wordlist[i]
      i++
      setLog(p => [...p, `> Testing: "${word}"...`])
      if (onCorrectRef.current(word)) {
        setLog(p => [...p, `> MATCH FOUND: "${word}"`, '> Flag: CTF{md5_is_dead_use_bcrypt}'])
        clearInterval(interval)
        setCracking(false)
      } else if (i === wordlist.length) {
        setLog(p => [...p, '> Not in wordlist. Try another word.'])
        clearInterval(interval)
        setCracking(false)
      }
    }, 300)
  }

  return (
    <div className="space-y-3 text-xs font-mono">
      <div ref={logRef} className="rounded p-3 space-y-0.5 overflow-y-auto"
        style={{ height: '140px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border)' }}>
        {log.map((l, i) => <div key={i} style={{ color: l.includes('MATCH') || l.includes('Flag') ? 'var(--green)' : 'var(--text-dim)' }}>{l}</div>)}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && crack()}
          disabled={solved}
          placeholder="Enter a word to test..."
          className="flex-1 px-3 py-2 rounded outline-none font-mono text-xs min-w-0 disabled:opacity-50"
          style={{ background: 'rgba(0,255,65,0.05)', border: '1px solid var(--border)', color: 'var(--green)' }} />
        <button onClick={crack} disabled={cracking || solved}
          className="px-4 py-2 rounded font-bold transition-all hover:scale-105 disabled:opacity-50 shrink-0"
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
  const onCorrectRef = useRef(onCorrect)
  useEffect(() => { onCorrectRef.current = onCorrect }, [onCorrect])

  const post = () => {
    if (!payload.trim() || solved) return
    const isXSS = payload.toLowerCase().includes('<script>') && payload.toLowerCase().includes('alert')
    setComments(p => [...p, { user: 'you', text: payload }])
    if (isXSS) {
      setAlerted(true)
      onCorrectRef.current(payload)
    }
    setPayload('')
  }

  return (
    <div className="space-y-3 text-xs font-mono">
      {alerted && (
        <div className="rounded p-3 text-center" style={{ background: 'rgba(0,255,65,0.1)', border: '1px solid var(--green)' }}>
          <div className="font-bold mb-1" style={{ color: 'var(--green)' }}>ALERT TRIGGERED</div>
          <div style={{ color: 'var(--text-dim)' }}>Script executed! Flag: CTF{'{xss_stored_injection}'}</div>
        </div>
      )}
      <div className="rounded p-3 space-y-2" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border)', maxHeight: '130px', overflowY: 'auto' }}>
        <div className="font-bold mb-1" style={{ color: 'var(--text-dim)' }}>// Comment section (unsanitised)</div>
        {comments.map((c, i) => (
          <div key={i} className="flex gap-2 flex-wrap">
            <span className="shrink-0" style={{ color: 'var(--cyan)' }}>{c.user}:</span>
            <span style={{ color: c.user === 'you' && alerted ? 'var(--green)' : 'var(--text-muted)', wordBreak: 'break-all' }}>
              {c.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={payload} onChange={e => setPayload(e.target.value)} onKeyDown={e => e.key === 'Enter' && post()}
          placeholder="Post a comment... (try injecting a script)"
          className="flex-1 px-3 py-2 rounded outline-none font-mono text-xs min-w-0"
          style={{ background: 'rgba(0,255,65,0.05)', border: '1px solid var(--border)', color: 'var(--green)' }} />
        <button onClick={post} disabled={solved} className="px-3 py-2 rounded font-bold transition-all hover:scale-105 disabled:opacity-40 shrink-0"
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
  const logRef = useRef<HTMLDivElement>(null)
  const onCorrectRef = useRef(onCorrect)
  useEffect(() => { onCorrectRef.current = onCorrect }, [onCorrect])
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight }, [lines])

  const run = (c: string) => {
    if (solved) return
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
          onKeyDown={e => e.key === 'Enter' && cmd.trim() && run(cmd)}
          disabled={solved}
          placeholder={isPortscan ? 'nmap 192.168.1.1' : 'github obapluto-ob'}
          className="flex-1 bg-transparent text-xs outline-none font-mono min-w-0"
          style={{ color: 'var(--green)' }} />
      </div>
    </div>
  )
}
