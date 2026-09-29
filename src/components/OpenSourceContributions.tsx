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
          <p className="text-slate-400 mb-4">No public repositories found.</p>
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
                {contrib.stars > 0 && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {contrib.stars}
                  </span>
                )}
                {contrib.forks > 0 && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                    </svg>
                    {contrib.forks}
                  </span>
                )}
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