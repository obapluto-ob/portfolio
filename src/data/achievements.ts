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

export const achievements: Achievement[] = [
  {
    metric: "Production",
    description: "Applications deployed and live",
    icon: "rocket"
  },
  {
    metric: "Full-stack",
    description: "Web and mobile development",
    icon: "zap"
  },
  {
    metric: "API",
    description: "Integrations and REST services built",
    icon: "link"
  },
  {
    metric: "Open-source",
    description: "Projects on GitHub",
    icon: "globe"
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
