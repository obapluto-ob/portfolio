export interface Skill {
  name: string
  icon: string
  fallbackIcon?: string
}

export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  status: 'production' | 'active' | 'archived'
  featured: boolean
}

export interface PersonalInfo {
  name: string
  title: string
  bio: string
  email: string
  github: string
  linkedin?: string
  resume?: string
  location: string
}

export const personalInfo: PersonalInfo = {
  name: "Obed Emoni Lopeyok",
  title: "Full-stack Developer",
  bio: "Full-stack Developer based in Nairobi, Kenya. Recently completed software engineering training at Moringa School. Building production applications across web and mobile with React, TypeScript, Python, and API-driven architectures. Open to full-time roles and freelance projects.",
  email: "obedemoni@gmail.com",
  github: "obapluto-ob",
  location: "Kenya"
}

export const skillCategories = {
  "Languages": [
    { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
    { name: "Dart", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg" }
  ],
  "Frameworks": [
    { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Django", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" },
    { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "Flutter", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg" }
  ],
  "Databases": [
    { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
    { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
    { name: "SQLite", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg" }
  ],
  "Tools & Platforms": [
    { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
    { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
    { name: "VS Code", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
    { name: "Linux", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" }
  ]
}

export const projects: Project[] = [
  {
    id: "bpay",
    title: "BPay",
    description: "Cross-border fintech application focused on Kenya–Nigeria crypto-to-fiat and payment workflows.",
    technologies: ["React", "Node.js", "TypeScript", "APIs"],
    githubUrl: "https://github.com/obapluto-ob/bpay-fintech-app",
    liveUrl: "https://bpayapp.co.ke",
    status: "production",
    featured: true
  },
  {
    id: "qrib",
    title: "Qrib",
    description: "Student accommodation platform designed to help students discover housing and connect with property hosts.",
    technologies: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    githubUrl: "https://github.com/obapluto-ob/qrib",
    status: "active",
    featured: true
  },
  {
    id: "codvault",
    title: "CODVault",
    description: "Full-stack Call of Duty: Mobile information platform with React, Express, SQLite, REST APIs, search, loadouts, guides and administrative content management.",
    technologies: ["React", "Express", "SQLite", "REST API"],
    githubUrl: "https://github.com/obapluto-ob/codvault",
    status: "active",
    featured: true
  },
  {
    id: "cpars",
    title: "CPARS Transportation",
    description: "Freight booking and transportation platform focused on shipper and carrier workflows.",
    technologies: ["React", "Node.js", "PostgreSQL", "APIs"],
    githubUrl: "https://github.com/obapluto-ob/CPARS",
    liveUrl: "https://cparstransportation.com",
    status: "production",
    featured: true
  },
  {
    id: "jobboard",
    title: "JobBoard",
    description: "Full-stack job marketplace built with React and Flask, featuring JWT authentication, job listings, applications, saved jobs, profiles and protected routes.",
    technologies: ["React", "Flask", "Python", "JWT", "SQLAlchemy"],
    githubUrl: "https://github.com/obapluto-ob/module_5_project",
    status: "active",
    featured: false
  },
  {
    id: "neemasynergy",
    title: "Neema Synergy",
    description: "Business website and Express-based content management system with administrative authentication, image management and dynamic site settings.",
    technologies: ["Express", "Node.js", "JavaScript", "CMS"],
    githubUrl: "https://github.com/obapluto-ob/neemasynergy",
    status: "active",
    featured: false
  },
  {
    id: "portfolio",
    title: "Portfolio",
    description: "React and TypeScript developer portfolio with interactive tooling, GitHub integrations, analytics, Firebase-backed engagement and responsive UI.",
    technologies: ["React", "TypeScript", "Vite", "Firebase", "Tailwind CSS"],
    githubUrl: "https://github.com/obapluto-ob/portfolio",
    liveUrl: "https://obapluto-ob.netlify.app",
    status: "production",
    featured: false
  }
]

export const featuredProjects = projects.filter(p => p.featured)
export const moreProjects = projects.filter(p => !p.featured)
