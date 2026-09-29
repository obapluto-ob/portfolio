import { useState, useEffect, useRef } from 'react'
import { projects } from '../data/portfolio'

interface Line {
  type: 'input' | 'output' | 'error' | 'success' | 'info' | 'ascii'
  text: string
}

const ASCII_BANNER = `
 ██████╗ ██████╗ ███████╗██████╗ 
██╔═══██╗██╔══██╗██╔════╝██╔══██╗
██║   ██║██████╔╝█████╗  ██║  ██║
██║   ██║██╔══██╗██╔══╝  ██║  ██║
╚██████╔╝██████╔╝███████╗██████╔╝
 ╚═════╝ ╚═════╝ ╚══════╝╚═════╝ 
`

const COMMANDS: Record<string, (args: string[]) => Line[]> = {
  help: () => [
    { type: 'info', text: '┌─────────────────────────────────────────┐' },
    { type: 'info', text: '│         AVAILABLE COMMANDS               │' },
    { type: 'info', text: '├─────────────────────────────────────────┤' },
    { type: 'success', text: '  whoami          → identity & bio' },
    { type: 'success', text: '  skills          → technical skill tree' },
    { type: 'success', text: '  projects        → list all projects' },
    { type: 'success', text: '  project <name>  → project details' },
    { type: 'success', text: '  contact         → contact information' },
    { type: 'success', text: '  status          → availability status' },
    { type: 'success', text: '  scan            → run port/vuln scan (demo)' },
    { type: 'success', text: '  decrypt         → decode a message' },
    { type: 'success', text: '  ping <target>   → ping a host (demo)' },
    { type: 'success', text: '  nmap            → network scan (demo)' },
    { type: 'success', text: '  clear           → clear terminal' },
    { type: 'info', text: '└─────────────────────────────────────────┘' },
  ],

  whoami: () => [
    { type: 'success', text: '> Obed Emoni Lopeyok' },
    { type: 'output', text: '  Role     : Full-stack Developer' },
    { type: 'output', text: '  Location : Nairobi, Kenya' },
    { type: 'output', text: '  Training : Moringa School — Completed' },
    { type: 'output', text: '  Stack    : React · TypeScript · Python · Flutter' },
    { type: 'output', text: '  GitHub   : github.com/obapluto-ob' },
    { type: 'success', text: '  Status   : [AVAILABLE FOR HIRE]' },
  ],

  skills: () => [
    { type: 'info', text: 'SKILL TREE — ACCESS LEVEL: FULL' },
    { type: 'output', text: '' },
    { type: 'output', text: '  [LANGUAGES]' },
    { type: 'success', text: '  Python      ████████████████░░░░  80%' },
    { type: 'success', text: '  TypeScript  ███████████████░░░░░  75%' },
    { type: 'success', text: '  JavaScript  █████████████████░░░  85%' },
    { type: 'success', text: '  Dart        ████████████░░░░░░░░  60%' },
    { type: 'output', text: '' },
    { type: 'output', text: '  [FRAMEWORKS]' },
    { type: 'success', text: '  React       █████████████████░░░  85%' },
    { type: 'success', text: '  Django      ██████████████░░░░░░  70%' },
    { type: 'success', text: '  Flask       ███████████████░░░░░  75%' },
    { type: 'success', text: '  Flutter     ████████████░░░░░░░░  60%' },
    { type: 'output', text: '' },
    { type: 'output', text: '  [DATABASES]' },
    { type: 'success', text: '  PostgreSQL  ██████████████░░░░░░  70%' },
    { type: 'success', text: '  SQLite      ████████████████░░░░  80%' },
    { type: 'success', text: '  MongoDB     ████████████░░░░░░░░  60%' },
    { type: 'success', text: '  Firebase    ███████████████░░░░░  75%' },
  ],

  projects: () => [
    { type: 'info', text: 'PROJECTS DATABASE — ' + projects.length + ' RECORDS FOUND' },
    { type: 'output', text: '' },
    ...projects.map((p, i) => ({
      type: 'success' as const,
      text: `  [${String(i + 1).padStart(2, '0')}] ${p.title.padEnd(22)} [${p.status.toUpperCase()}]`
    })),
    { type: 'output', text: '' },
    { type: 'info', text: '  Type: project <name> for details' },
  ],

  contact: () => [
    { type: 'info', text: 'CONTACT CHANNELS — ENCRYPTED' },
    { type: 'output', text: '' },
    { type: 'success', text: '  EMAIL  : obedemoni@gmail.com' },
    { type: 'success', text: '  GITHUB : github.com/obapluto-ob' },
    { type: 'output', text: '  PHONE  : +254 729 237 059' },
    { type: 'output', text: '  LOC    : Nairobi, Kenya (Remote OK)' },
    { type: 'output', text: '' },
    { type: 'info', text: '  [AVAILABLE FOR REMOTE & ON-SITE ROLES]' },
  ],

  status: () => [
    { type: 'info', text: 'SYSTEM STATUS CHECK...' },
    { type: 'output', text: '' },
    { type: 'success', text: '  [✓] Available for hire' },
    { type: 'success', text: '  [✓] Open to remote work' },
    { type: 'success', text: '  [✓] Moringa School — COMPLETED' },
    { type: 'success', text: '  [✓] Production projects deployed' },
    { type: 'success', text: '  [✓] Full-stack capable' },
    { type: 'output', text: '' },
    { type: 'info', text: '  UPTIME: 100% | RESPONSE TIME: <24h' },
  ],

  scan: () => [
    { type: 'info', text: 'Initializing vulnerability scan...' },
    { type: 'output', text: '  Scanning portfolio.sh [████████████] 100%' },
    { type: 'output', text: '' },
    { type: 'success', text: '  PORT 443  HTTPS   OPEN   [SECURE]' },
    { type: 'success', text: '  PORT 80   HTTP    OPEN   [REDIRECTS → 443]' },
    { type: 'output', text: '  PORT 22   SSH     CLOSED' },
    { type: 'output', text: '  PORT 3306 MYSQL   CLOSED' },
    { type: 'output', text: '' },
    { type: 'success', text: '  VULNERABILITIES FOUND: 0' },
    { type: 'success', text: '  SECURITY RATING: A+' },
    { type: 'info', text: '  Scan complete. No threats detected.' },
  ],

  nmap: () => [
    { type: 'info', text: 'Starting Nmap 7.94 ( https://nmap.org )' },
    { type: 'output', text: '  Nmap scan report for obapluto-ob.github.io' },
    { type: 'output', text: '  Host is up (0.021s latency).' },
    { type: 'output', text: '' },
    { type: 'output', text: '  PORT     STATE  SERVICE  VERSION' },
    { type: 'success', text: '  443/tcp  open   https    GitHub Pages' },
    { type: 'success', text: '  80/tcp   open   http     GitHub Pages' },
    { type: 'output', text: '' },
    { type: 'info', text: '  2 open ports. OS: Linux. No CVEs found.' },
  ],

  decrypt: () => [
    { type: 'info', text: 'Decrypting message...' },
    { type: 'output', text: '  Cipher: ROT13' },
    { type: 'output', text: '  Input : Boru Rzbal Ybcrlbx' },
    { type: 'output', text: '  Key   : 13' },
    { type: 'output', text: '' },
    { type: 'success', text: '  Output: Obed Emoni Lopeyok' },
    { type: 'output', text: '' },
    { type: 'info', text: '  Decryption successful. Identity confirmed.' },
  ],

  clear: () => [],
}

const HackTerminal = () => {
  const [lines, setLines] = useState<Line[]>([
    { type: 'ascii', text: ASCII_BANNER },
    { type: 'info', text: 'PORTFOLIO OS v2.0.25 — SECURE SHELL INITIALIZED' },
    { type: 'output', text: 'Type "help" to list available commands.' },
    { type: 'output', text: '' },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const [isProcessing, setIsProcessing] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  const runCommand = (raw: string) => {
    const trimmed = raw.trim()
    if (!trimmed) return

    const newHistory = [trimmed, ...history].slice(0, 50)
    setHistory(newHistory)
    setHistIdx(-1)

    const inputLine: Line = { type: 'input', text: trimmed }
    const [cmd, ...args] = trimmed.toLowerCase().split(' ')

    setIsProcessing(true)
    setTimeout(() => {
      if (cmd === 'clear') {
        setLines([])
        setIsProcessing(false)
        return
      }

      // project <name> lookup
      if (cmd === 'project' && args.length > 0) {
        const query = args.join(' ').toLowerCase()
        const found = projects.find(p => p.title.toLowerCase().includes(query) || p.id.includes(query))
        const result: Line[] = found ? [
          { type: 'info', text: `PROJECT: ${found.title}` },
          { type: 'output', text: `  Status : ${found.status.toUpperCase()}` },
          { type: 'output', text: `  Tech   : ${found.technologies.join(', ')}` },
          { type: 'output', text: `  Desc   : ${found.description}` },
          ...(found.githubUrl ? [{ type: 'success' as const, text: `  GitHub : ${found.githubUrl}` }] : []),
          ...(found.liveUrl   ? [{ type: 'success' as const, text: `  Live   : ${found.liveUrl}` }] : []),
        ] : [{ type: 'error', text: `project not found: "${args.join(' ')}"` }]

        setLines(prev => [...prev, inputLine, ...result, { type: 'output', text: '' }])
        setIsProcessing(false)
        return
      }

      // ping demo
      if (cmd === 'ping') {
        const target = args[0] || 'portfolio.sh'
        const result: Line[] = [
          { type: 'info', text: `PING ${target}` },
          { type: 'success', text: `  64 bytes from ${target}: icmp_seq=1 ttl=64 time=12.3 ms` },
          { type: 'success', text: `  64 bytes from ${target}: icmp_seq=2 ttl=64 time=11.8 ms` },
          { type: 'success', text: `  64 bytes from ${target}: icmp_seq=3 ttl=64 time=13.1 ms` },
          { type: 'output', text: `  3 packets transmitted, 3 received, 0% packet loss` },
        ]
        setLines(prev => [...prev, inputLine, ...result, { type: 'output', text: '' }])
        setIsProcessing(false)
        return
      }

      const handler = COMMANDS[cmd]
      const result = handler
        ? handler(args)
        : [{ type: 'error' as const, text: `command not found: ${cmd} — type "help"` }]

      setLines(prev => [...prev, inputLine, ...result, { type: 'output', text: '' }])
      setIsProcessing(false)
    }, 300)
  }

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      runCommand(input)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(histIdx + 1, history.length - 1)
      setHistIdx(next)
      setInput(history[next] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.max(histIdx - 1, -1)
      setHistIdx(next)
      setInput(next === -1 ? '' : history[next])
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const cmds = Object.keys(COMMANDS)
      const match = cmds.find(c => c.startsWith(input.toLowerCase()))
      if (match) setInput(match)
    }
  }

  const lineColor = (type: Line['type']) => {
    switch (type) {
      case 'input':   return 'var(--green)'
      case 'success': return 'var(--green)'
      case 'error':   return 'var(--red)'
      case 'info':    return 'var(--cyan)'
      case 'ascii':   return 'var(--green-dim)'
      default:        return 'var(--text-body)'
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="glass-bright rounded-lg overflow-hidden neon-border scan-sweep">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2 border-b" style={{ borderColor: 'var(--border)', background: 'rgba(0,255,65,0.05)' }}>
          <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: 'var(--green-dim)' }} />
          <span className="ml-3 text-xs" style={{ color: 'var(--text-dim)' }}>
            root@portfolio:~# — SECURE SHELL
          </span>
          <span className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>
            {isProcessing ? 'PROCESSING...' : 'READY'}
          </span>
        </div>

        {/* Output */}
        <div
          className="p-4 h-80 overflow-y-auto text-xs sm:text-sm font-mono"
          style={{ background: 'rgba(0,8,0,0.95)' }}
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((line, i) => (
            <div key={i} style={{ color: lineColor(line.type), whiteSpace: 'pre' }}>
              {line.type === 'input' && (
                <span style={{ color: 'var(--green-dim)' }}>root@portfolio:~$ </span>
              )}
              {line.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 px-4 py-3 border-t" style={{ borderColor: 'var(--border)', background: 'rgba(0,8,0,0.98)' }}>
          <span className="text-xs sm:text-sm shrink-0" style={{ color: 'var(--green-dim)' }}>
            root@portfolio:~$
          </span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            className="flex-1 bg-transparent outline-none text-xs sm:text-sm font-mono"
            style={{ color: 'var(--green)', caretColor: 'var(--green)' }}
            placeholder="type a command..."
            autoComplete="off"
            spellCheck={false}
            aria-label="Terminal input"
          />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>TAB to autocomplete</span>
        </div>
      </div>
    </div>
  )
}

export default HackTerminal
