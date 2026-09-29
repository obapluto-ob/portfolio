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
      { level: 1, text: 'ARPANET — the first network that became the internet — launched in the late 1960s. Enter the 4-digit year into the PIN pad.', cost: 10 },
      { level: 2, text: 'The first ARPANET message was sent on October 29th of that year. The year starts with 196...', cost: 20 },
      { level: 3, text: 'The answer is: 1969', cost: 40 },
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
      { level: 1, text: 'Caesar cipher shifts each letter by a fixed number. To DECRYPT shift=3, move each letter 3 places BACK in the alphabet. Example: K→H (K is the 11th letter, go back 3 = 8th = H).', cost: 15 },
      { level: 2, text: 'Full decode: K→H, D→A, O→L, O→L | K→H, D→A, O→L, O→L | W→T, K→H, H→E | K→H, D→A, F→C, T→Q... wait, try the terminal: type  decode KDOO KDOO WKH KDFTHU --shift 3', cost: 25 },
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
      { level: 1, text: 'In the recon terminal, type: nmap 192.168.1.1 and read the output. Look for the ssh service row and note its port number.', cost: 20 },
      { level: 2, text: 'SSH runs on a port below 100. It is a 2-digit number that is also the atomic number of titanium.', cost: 30 },
      { level: 3, text: 'The answer is: 22', cost: 60 },
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
      { level: 1, text: "Edit the query in the SQL console. The username value is between two single quotes. A single quote ' inside that value breaks the SQL syntax and lets you inject code.", cost: 25 },
      { level: 2, text: "After the quote, add OR to make the WHERE clause always true: ' OR '1'='1. Then add -- to comment out the rest so the query does not error.", cost: 40 },
      { level: 3, text: "Paste this into the username part of the query: ' OR '1'='1'--", cost: 75 },
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
      { level: 1, text: 'MD5 hashes cannot be reversed directly. Type a guess into the crack box and hit CRACK. The tool will hash your guess and compare it to the target hash.', cost: 30 },
      { level: 2, text: 'This is the single most common password in every leaked database. It is literally the English word for a secret code.', cost: 45 },
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
      { level: 1, text: 'The comment box renders HTML without sanitising it. Type HTML into the comment field and post it. Try something with angle brackets like <b>hello</b> first to see if it renders.', cost: 35 },
      { level: 2, text: 'JavaScript runs inside script tags. The alert() function shows a popup. Combine them and post as a comment: <script>alert(something)</script>', cost: 50 },
      { level: 3, text: "Post this as a comment: <script>alert('XSS')</script>", cost: 100 },
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
      { level: 1, text: 'Binary uses only 0 and 1. Each group of 8 bits equals one letter. Convert each group to a decimal number then look up that number in an ASCII table. Type one letter per box.', cost: 40 },
      { level: 2, text: '01001111 = 64+8+4+2+1 = 79 = O. Do the same for each group. The four decimal values are: 79, 66, 69, 68.', cost: 60 },
      { level: 3, text: 'The answer is: OBED (the first name of this portfolio author, hidden in the image)', cost: 120 },
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
      { level: 1, text: 'OSINT means finding information from public sources. In the recon terminal type: github obapluto-ob and read the output. Then use: submit <username>', cost: 50 },
      { level: 2, text: 'The GitHub username is visible on the Projects page of this portfolio and in the URL of every GitHub link. Look for the part after github.com/', cost: 75 },
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
