import React, { useState, useEffect } from 'react'

const Projects = () => {
  const [githubData, setGithubData] = useState(null)
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        // Fetch user profile
        const userResponse = await fetch('https://api.github.com/users/obapluto-ob')
        const userData = await userResponse.json()
        
        // Fetch pinned repositories
        const pinnedQuery = `
          query {
            user(login: "obapluto-ob") {
              pinnedItems(first: 6, types: REPOSITORY) {
                nodes {
                  ... on Repository {
                    id
                    name
                    description
                    url
                    primaryLanguage {
                      name
                    }
                  }
                }
              }
            }
          }
        `
        
        const pinnedResponse = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: pinnedQuery })
        })
        
        let reposData = []
        if (pinnedResponse.ok) {
          const pinnedData = await pinnedResponse.json()
          reposData = pinnedData.data?.user?.pinnedItems?.nodes || []
        }
        
        // Fallback to regular repos if no pinned repos or API fails
        // Fallback to regular repos if no pinned repos
        if (reposData.length === 0) {
          const reposResponse = await fetch('https://api.github.com/users/obapluto-ob/repos?sort=updated&per_page=6')
          const fallbackData = await reposResponse.json()
          reposData = fallbackData
        }
        
        setGithubData(userData)
        setRepos(reposData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching GitHub data:', error)
        setLoading(false)
      }
    }

    fetchGitHubData()
  }, [])

  if (loading) {
    return (
      <div className="text-center">
        <h2 className="text-4xl font-light mb-12 text-slate-300">My Work</h2>
        <div className="text-slate-400">Loading GitHub data...</div>
      </div>
    )
  }

  return (
    <div className="text-center max-w-4xl mx-auto">
      <h2 className="text-4xl font-light mb-8 text-slate-300">My Work</h2>
      
      {githubData && (
        <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700 mb-8">
          <div className="flex items-center justify-center space-x-6 mb-6">
            <img 
              src={githubData.avatar_url}
              alt="GitHub Avatar"
              className="w-20 h-20 rounded-full"
            />
            <div className="text-left">
              <h3 className="text-xl font-medium text-slate-200">{githubData.name || githubData.login}</h3>
              <p className="text-slate-400">@{githubData.login}</p>
              {githubData.bio && <p className="text-slate-500 text-sm mt-1">{githubData.bio}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-light text-blue-400">{githubData.public_repos}</div>
              <div className="text-xs text-slate-500">Repositories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-light text-blue-400">{githubData.followers}</div>
              <div className="text-xs text-slate-500">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-light text-blue-400">{githubData.following}</div>
              <div className="text-xs text-slate-500">Following</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-light text-blue-400">
                {new Date(githubData.created_at).getFullYear()}
              </div>
              <div className="text-xs text-slate-500">Joined</div>
            </div>
          </div>
          
          <a 
            href={githubData.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded transition-colors"
          >
            <span>View Full Profile</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      )}
      
      {repos.length > 0 && (
        <div>
          <h3 className="text-xl font-medium text-slate-300 mb-4">Pinned Repositories</h3>
          <div className="grid grid-cols-2 gap-4">
            {repos.slice(0, 4).map((repo) => (
              <div key={repo.id} className="bg-slate-800/30 rounded-lg p-4 border border-slate-700 text-left">
                <h4 className="font-medium text-slate-200 mb-2">{repo.name}</h4>
                <p className="text-sm text-slate-400 mb-3">
                  {repo.description || 'No description available'}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{repo.primaryLanguage?.name || repo.language}</span>
                  <a 
                    href={repo.url || repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    View Code
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Projects