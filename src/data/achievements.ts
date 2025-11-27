export interface Achievement {
  metric: string
  description: string
  icon: string
}

export interface BlogPost {
  title: string
  excerpt: string
  readTime: string
  tags: string[]
  url?: string
}

export interface Contribution {
  project: string
  description: string
  impact: string
  tech: string[]
}

export const achievements: Achievement[] = [
  {
    metric: "40%",
    description: "Faster load times through code optimization",
    icon: "⚡"
  },
  {
    metric: "60%",
    description: "Reduction in bugs through testing practices",
    icon: "🐛"
  },
  {
    metric: "5+",
    description: "Cross-functional teams collaborated with",
    icon: "👥"
  },
  {
    metric: "100%",
    description: "Project delivery rate at Moringa School",
    icon: "🎯"
  }
]

export const blogPosts: BlogPost[] = [
  {
    title: "Building Scalable React Applications",
    excerpt: "Best practices for component architecture and state management in large React projects.",
    readTime: "5 min read",
    tags: ["React", "JavaScript", "Architecture"]
  },
  {
    title: "Django REST API Security",
    excerpt: "Essential security measures every Django developer should implement in production.",
    readTime: "7 min read", 
    tags: ["Django", "Python", "Security"]
  },
  {
    title: "Mobile-First Development with Flutter",
    excerpt: "Why starting with mobile design leads to better cross-platform applications.",
    readTime: "4 min read",
    tags: ["Flutter", "Mobile", "UI/UX"]
  }
]

export const contributions: Contribution[] = [
  {
    project: "React Documentation",
    description: "Contributed to improving TypeScript examples in official React docs",
    impact: "Helped 1000+ developers understand React with TypeScript",
    tech: ["React", "TypeScript", "Documentation"]
  },
  {
    project: "Django Community",
    description: "Active in Django forums helping solve authentication issues",
    impact: "Resolved 50+ community questions on Stack Overflow",
    tech: ["Django", "Python", "Authentication"]
  },
  {
    project: "Open Source Tools",
    description: "Maintaining utility libraries for African developers",
    impact: "Used by 20+ projects across Kenya and Nigeria",
    tech: ["JavaScript", "Node.js", "NPM"]
  }
]