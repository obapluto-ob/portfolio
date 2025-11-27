import React, { useState, useEffect } from 'react'

interface RealContribution {
  name: string
  description: string
  language: string
  stars: number
  forks: number
  updated: string
}

const OpenSourceContributions = () => {
  const [contributions, setContributions] = useState<RealContribution[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRealContributions = async () => {
      try {
        const response = await fetch('https://api.github.com/users/obapluto-ob/repos?sort=updated&per_page=10')
        const repos = await response.json()
        
        const realContribs = repos
          .filter((repo: any) => !repo.fork && repo.stargazers_count >= 0)
          .slice(0, 3)
          .map((repo: any) => ({
            name: repo.name,
            description: repo.description || 'No description available',
            language: repo.language || 'Mixed',
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            updated: new Date(repo.updated_at).toLocaleDateString()
          }))
        
        setContributions(realContribs)
      } catch (error) {
        console.error('Failed to fetch contributions:', error)
      }
      setLoading(false)
    }

    fetchRealContributions()
  }, [])

  if (loading) {
    return (
      <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700">
        <h3 className="text-xl font-medium text-slate-200 mb-6">My Projects</h3>
        <div className="animate-pulse space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="border border-slate-600 rounded-lg p-4">
              <div className="h-4 bg-slate-700 rounded mb-2"></div>
              <div className="h-3 bg-slate-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (contributions.length === 0) {
    return (
      <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700">
        <h3 className="text-xl font-medium text-slate-200 mb-6">My Projects</h3>
        <div className="text-center py-8">
          <p className="text-slate-400 mb-4">Building my first projects at Moringa School</p>
          <p className="text-sm text-slate-500">Check back soon for updates!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700">
      <h3 className="text-xl font-medium text-slate-200 mb-6">My Projects</h3>
      <div className="space-y-4">
        {contributions.map((contrib, index) => (
          <div key={index} className="border border-slate-600 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-slate-200">{contrib.name}</h4>
              <div className="flex items-center space-x-3 text-xs text-slate-400">
                <span>{contrib.language}</span>
                {contrib.stars > 0 && <span>⭐ {contrib.stars}</span>}
                {contrib.forks > 0 && <span>🍴 {contrib.forks}</span>}
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-2">{contrib.description}</p>
            <p className="text-xs text-slate-500">Last updated: {contrib.updated}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OpenSourceContributions