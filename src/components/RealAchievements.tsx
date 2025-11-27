import React, { useState, useEffect } from 'react'

interface GitHubStats {
  totalRepos: number
  totalCommits: number
  languages: string[]
  recentActivity: number
  joinedYear: number
}

const RealAchievements = () => {
  const [stats, setStats] = useState<GitHubStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRealStats = async () => {
      try {
        // Get user data
        const userResponse = await fetch('https://api.github.com/users/obapluto-ob')
        const userData = await userResponse.json()
        
        // Get repositories
        const reposResponse = await fetch('https://api.github.com/users/obapluto-ob/repos?per_page=100')
        const repos = await reposResponse.json()
        
        // Get recent events for activity
        const eventsResponse = await fetch('https://api.github.com/users/obapluto-ob/events/public?per_page=100')
        const events = await eventsResponse.json()
        
        // Calculate real stats
        const languages = [...new Set(repos.map((repo: any) => repo.language).filter(Boolean))]
        const recentCommits = events.filter((event: any) => event.type === 'PushEvent').length
        const joinedYear = new Date(userData.created_at).getFullYear()
        
        setStats({
          totalRepos: userData.public_repos,
          totalCommits: recentCommits,
          languages: languages.slice(0, 4),
          recentActivity: events.length,
          joinedYear
        })
      } catch (error) {
        console.error('Failed to fetch GitHub stats:', error)
      }
      setLoading(false)
    }

    fetchRealStats()
  }, [])

  if (loading) {
    return (
      <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700">
        <h3 className="text-xl font-medium text-slate-200 mb-6">Real Impact & Results</h3>
        <div className="animate-pulse grid grid-cols-2 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="text-center">
              <div className="h-8 bg-slate-700 rounded mb-2"></div>
              <div className="h-4 bg-slate-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) return null

  const achievements = [
    {
      metric: `${stats.totalRepos}+`,
      description: "Public repositories created and maintained"
    },
    {
      metric: `${stats.languages.length}+`,
      description: "Programming languages actively used"
    },
    {
      metric: `${new Date().getFullYear() - stats.joinedYear}+`,
      description: "Years of active GitHub development"
    },
    {
      metric: `${stats.recentActivity}+`,
      description: "Recent contributions and activities"
    }
  ]

  return (
    <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700">
      <h3 className="text-xl font-medium text-slate-200 mb-6">Real Impact & Results</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {achievements.map((achievement, index) => (
          <div key={index} className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-1">
              {achievement.metric}
            </div>
            <div className="text-sm text-slate-400 leading-tight">
              {achievement.description}
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        <p className="text-xs text-slate-500">
          Primary languages: {stats.languages.join(', ')}
        </p>
      </div>
    </div>
  )
}

export default RealAchievements