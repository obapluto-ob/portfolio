export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT'
export type ChallengeId = 'bruteforce' | 'cipher' | 'portscan' | 'sqli' | 'steganography' | 'xss' | 'hash' | 'recon'

export interface Hint {
  level: 1 | 2 | 3
  text: string
  cost: number // points deducted
}

export interface Challenge {
  id: ChallengeId
  title: string
  category: string
  difficulty: Difficulty
  points: number
  description: string
  hints: Hint[]
  sandboxType: 'terminal' | 'login' | 'sqlconsole' | 'binary' | 'hashcrack' | 'xss' | 'recon'
  unlockAfter?: ChallengeId
  explanation: string // shown after solving
}

export interface Operator {
  callsign: string
  email: string
  solved: ChallengeId[]
  score: number
  hintsUsed: Record<string, number>
  joinedAt: number
  lastSeen: number
}

export const DIFF_COLOR: Record<Difficulty, string> = {
  EASY: '#00ff41',
  MEDIUM: '#febc2e',
  HARD: '#ff5f57',
  EXPERT: '#cc00ff',
}

export const CHALLENGES: Challenge[] = [
  {
    id: 'bruteforce',
    title: 'Brute Force Login',
    category: 'Authentication',
    difficulty: 'EASY',
    points: 100,
    description: 'An admin panel uses a 4-digit PIN. Intelligence suggests the PIN is the year ARPANET — the precursor to the internet — first went live. Use the login sandbox to crack it.',
    hints: [
      { level: 1, text: 'ARPANET launched in the late 1960s.', cost: 10 },
      { level: 2, text: 'The first message was sent on October 29th of that year.', cost: 20 },
      { level: 3, text: 'The answer is 1969.', cost: 40 },
    ],
    sandboxType: 'login',
    explanation: 'Brute force attacks try every possible combination. 4-digit PINs have only 10,000 possibilities — a script can crack them in seconds. Always use long, random passwords and rate limiting.',
  },
  {
    id: 'cipher',
    title: 'Caesar Cipher',
    category: 'Cryptography',
    difficulty: 'EASY',
    points: 150,
    description: 'Intercepted transmission: "KDOO KDOO WKH KDFTHU"\nThis is a Caesar cipher with shift 3. Decrypt it using the terminal decoder.',
    hints: [
      { level: 1, text: 'Each letter is shifted forward by 3. To decrypt, shift back by 3.', cost: 15 },
      { level: 2, text: 'K→H, D→A, O→L... decode each letter.', cost: 25 },
      { level: 3, text: 'The answer is: HALL HALL THE HACKER', cost: 50 },
    ],
    sandboxType: 'terminal',
    explanation: 'Caesar cipher is one of the oldest encryption techniques. Julius Caesar used it to protect military messages. It is trivially broken today — only 25 possible shifts to try.',
  },
  {
    id: 'portscan',
    title: 'Network Recon',
    category: 'Network',
    difficulty: 'MEDIUM',
    points: 200,
    description: 'Run an nmap scan against target 192.168.1.1. An SSH service is running on its standard port. Identify the port number from the scan results.',
    hints: [
      { level: 1, text: 'SSH is defined in RFC 4251.', cost: 20 },
      { level: 2, text: 'It runs on a port below 100.', cost: 30 },
      { level: 3, text: 'The answer is port 22.', cost: 60 },
    ],
    sandboxType: 'recon',
    unlockAfter: 'cipher',
    explanation: 'Port 22 is the default SSH port. Attackers scan for open ports to map attack surfaces. Security teams use the same tools defensively — knowing what is exposed is the first step to securing it.',
  },
  {
    id: 'sqli',
    title: 'SQL Injection',
    category: 'Web Exploitation',
    difficulty: 'MEDIUM',
    points: 250,
    description: "A login form passes user input directly into a SQL query:\nSELECT * FROM users WHERE username='INPUT' AND password='...'\nInject a payload into the username field to bypass authentication.",
    hints: [
      { level: 1, text: "Single quote ' breaks out of the string context.", cost: 25 },
      { level: 2, text: "Use OR to make the condition always true. Comment out the rest with --", cost: 40 },
      { level: 3, text: "Try: ' OR '1'='1'--", cost: 75 },
    ],
    sandboxType: 'sqlconsole',
    unlockAfter: 'portscan',
    explanation: "SQL injection is one of the most critical web vulnerabilities (OWASP Top 10). It occurs when user input is not sanitised before being used in a query. Always use parameterised queries / prepared statements.",
  },
  {
    id: 'hash',
    title: 'Hash Cracking',
    category: 'Cryptography',
    difficulty: 'MEDIUM',
    points: 300,
    description: 'Recovered password hash from a database dump:\nMD5: 5f4dcc3b5aa765d61d8327deb882cf99\nCrack it using the hash sandbox. Common passwords are vulnerable to dictionary attacks.',
    hints: [
      { level: 1, text: 'This is an MD5 hash of a very common password.', cost: 30 },
      { level: 2, text: 'It is in every wordlist. Think: what do most people use?', cost: 45 },
      { level: 3, text: 'The answer is: password', cost: 90 },
    ],
    sandboxType: 'hashcrack',
    unlockAfter: 'sqli',
    explanation: 'MD5 is a broken hash function — never use it for passwords. Modern systems use bcrypt, scrypt, or Argon2 with salting. The hash 5f4dcc3b5aa765d61d8327deb882cf99 is the MD5 of "password" — found in every rainbow table.',
  },
  {
    id: 'xss',
    title: 'Cross-Site Scripting',
    category: 'Web Exploitation',
    difficulty: 'HARD',
    points: 350,
    description: 'A comment box on a vulnerable site renders HTML without sanitisation. Inject a script payload that triggers an alert with the text "XSS". Enter your payload below.',
    hints: [
      { level: 1, text: 'HTML script tags execute JavaScript.', cost: 35 },
      { level: 2, text: 'Use <script>alert(...)</script> syntax.', cost: 50 },
      { level: 3, text: "Try: <script>alert('XSS')</script>", cost: 100 },
    ],
    sandboxType: 'xss',
    unlockAfter: 'hash',
    explanation: 'XSS allows attackers to inject scripts into pages viewed by other users. It can steal session cookies, redirect users, or deface sites. Prevention: always escape/sanitise output and use Content Security Policy headers.',
  },
  {
    id: 'steganography',
    title: 'Hidden Message',
    category: 'Steganography',
    difficulty: 'HARD',
    points: 400,
    description: 'Binary payload extracted from image LSB:\n01001111 01000010 01000101 01000100\nDecode each 8-bit group to its ASCII character.',
    hints: [
      { level: 1, text: 'Each group of 8 bits is one ASCII character. Convert binary to decimal first.', cost: 40 },
      { level: 2, text: '01001111=79=O, 01000010=66=B, 01000101=69=E, 01000100=68=D', cost: 60 },
      { level: 3, text: 'The answer is: OBED', cost: 120 },
    ],
    sandboxType: 'binary',
    unlockAfter: 'xss',
    explanation: 'Steganography hides data inside other data — images, audio, video. LSB (Least Significant Bit) steganography replaces the last bit of each pixel colour value. Invisible to the eye but detectable with the right tools.',
  },
  {
    id: 'recon',
    title: 'OSINT Recon',
    category: 'Intelligence',
    difficulty: 'EXPERT',
    points: 500,
    description: 'Target: github.com/obapluto-ob\nUsing open-source intelligence, find the answer:\nWhat is the GitHub username of this portfolio\'s author?',
    hints: [
      { level: 1, text: 'The answer is in the URL of this very portfolio\'s GitHub repo.', cost: 50 },
      { level: 2, text: 'Check the browser address bar or the GitHub links on the Projects page.', cost: 75 },
      { level: 3, text: 'The answer is: obapluto-ob', cost: 150 },
    ],
    sandboxType: 'recon',
    unlockAfter: 'steganography',
    explanation: 'OSINT (Open Source Intelligence) uses publicly available information to gather intelligence. GitHub profiles, LinkedIn, DNS records, and WHOIS data are all valid OSINT sources. Red teamers use this before any active engagement.',
  },
]

export const ANSWERS: Record<ChallengeId, string[]> = {
  bruteforce: ['1969'],
  cipher: ['hall hall the hacker', 'HALL HALL THE HACKER'],
  portscan: ['22'],
  sqli: ["' or '1'='1", "' or '1'='1'--", "' or 1=1--", "' or '1'='1' --", "admin'--", "' OR '1'='1", "' OR '1'='1'--", "' OR 1=1--"],
  hash: ['password'],
  xss: ["<script>alert('xss')</script>", '<script>alert("xss")</script>', "<script>alert('XSS')</script>", '<script>alert("XSS")</script>'],
  steganography: ['obed', 'OBED'],
  recon: ['obapluto-ob', 'obapluto'],
}
