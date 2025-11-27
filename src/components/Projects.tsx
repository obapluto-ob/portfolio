import React, { useState, useEffect } from 'react'

const Projects = () => {
  const [githubData, setGithubData] = useState(null)
  const [readme, setReadme] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        // Fetch user profile
        const userResponse = await fetch('https://api.github.com/users/obapluto-ob')
        const userData = await userResponse.json()
        
        // Fetch profile README
        try {
          const readmeResponse = await fetch('https://raw.githubusercontent.com/obapluto-ob/obapluto-ob/main/README.md')
          if (readmeResponse.ok) {
            const readmeText = await readmeResponse.text()
            setReadme(readmeText)
          }
        } catch (error) {
          console.log('No profile README found')
        }
        
        setGithubData(userData)
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
    <div className="text-center max-w-3xl mx-auto">
      <h2 className="text-4xl font-light mb-8 text-slate-300">My Work</h2>
      
      {githubData && (
        <div className="bg-slate-800/30 rounded-lg p-8 border border-slate-700">
          <div className="flex items-center justify-center space-x-6 mb-8">
            <img 
              src={githubData.avatar_url}
              alt="GitHub Avatar"
              className="w-24 h-24 rounded-full"
            />
            <div className="text-left">
              <h3 className="text-2xl font-medium text-slate-200">{githubData.name || githubData.login}</h3>
              <p className="text-slate-400 text-lg">@{githubData.login}</p>
              {githubData.bio && <p className="text-slate-500 mt-2">{githubData.bio}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-light text-blue-400">{githubData.public_repos}</div>
              <div className="text-sm text-slate-500">Repositories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-blue-400">{githubData.followers}</div>
              <div className="text-sm text-slate-500">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-blue-400">{githubData.following}</div>
              <div className="text-sm text-slate-500">Following</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-blue-400">
                {new Date(githubData.created_at).getFullYear()}
              </div>
              <div className="text-sm text-slate-500">Joined</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-slate-400">
              Explore my repositories, contributions, and coding journey on GitHub.
            </p>
            
            <a 
              href={`${githubData.html_url}?tab=repositories`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg transition-all hover:scale-105 text-lg font-medium"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
              <span>View All Repositories</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      )}
      
      {readme && (
        <div className="mt-8 bg-slate-800/30 rounded-lg p-6 border border-slate-700">
          <h3 className="text-xl font-medium text-slate-300 mb-4">About Me</h3>
          <div className="text-left text-slate-400 space-y-3">
            {readme.split('\n').map((line, index) => {
              if (line.startsWith('# ')) {
                return <h4 key={index} className="text-lg font-medium text-slate-200 mt-4 mb-2">{line.replace('# ', '')}</h4>
              }
              if (line.startsWith('## ')) {
                return <h5 key={index} className="text-base font-medium text-slate-300 mt-3 mb-1">{line.replace('## ', '')}</h5>
              }
              if (line.startsWith('- ')) {
                return <li key={index} className="ml-4">{line.replace('- ', '')}</li>
              }
              if (line.trim()) {
                return <p key={index}>{line}</p>
              }
              return null
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default Projects