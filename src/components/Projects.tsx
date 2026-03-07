import React, { useState, useEffect } from 'react'
import SectionHeader from './SectionHeader'
import GitHubActivity from './GitHubActivity'

interface GitHubUser {
  avatar_url: string
  name: string
  login: string
  bio: string
  public_repos: number
  followers: number
  following: number
  created_at: string
  html_url: string
}

const Projects = () => {
  const [githubData, setGithubData] = useState<GitHubUser | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const userResponse = await fetch('https://api.github.com/users/obapluto-ob')
        if (!userResponse.ok) {
          throw new Error(`HTTP error! status: ${userResponse.status}`)
        }
        const userData = await userResponse.json()
        setGithubData(userData)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch GitHub data:', error)
        setError('Failed to load GitHub data')
        setLoading(false)
      }
    }

    fetchGitHubData()
  }, [])

  if (loading) {
    return (
      <div className="text-center">
        <SectionHeader title="My Work" />
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="text-slate-400">Loading GitHub data...</span>
        </div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="text-center">
        <SectionHeader title="My Work" />
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 max-w-md mx-auto">
          <div className="text-red-400">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-sm text-red-300 hover:text-red-200 underline"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center max-w-3xl mx-auto">
      <SectionHeader title="My Work" className="mb-12" />
      
      {githubData && (
        <div className="glass rounded-2xl p-8 mb-12 glow">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-50"></div>
              <img 
                src={githubData.avatar_url}
                alt="GitHub Avatar"
                className="relative w-24 h-24 rounded-full border-2 border-slate-600"
              />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold text-slate-200">{githubData.name || githubData.login}</h3>
              <p className="text-slate-400 text-lg">@{githubData.login}</p>
              {githubData.bio && <p className="text-slate-500 mt-2">{githubData.bio}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
            <div className="text-center glass rounded-xl p-4">
              <div className="text-3xl font-bold text-blue-400">{githubData.public_repos}</div>
              <div className="text-sm text-slate-400">Repositories</div>
            </div>
            <div className="text-center glass rounded-xl p-4">
              <div className="text-3xl font-bold text-purple-400">{githubData.followers}</div>
              <div className="text-sm text-slate-400">Followers</div>
            </div>
            <div className="text-center glass rounded-xl p-4">
              <div className="text-3xl font-bold text-pink-400">{githubData.following}</div>
              <div className="text-sm text-slate-400">Following</div>
            </div>
            <div className="text-center glass rounded-xl p-4">
              <div className="text-3xl font-bold text-green-400">
                {new Date(githubData.created_at).getFullYear()}
              </div>
              <div className="text-sm text-slate-400">Joined</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-slate-300 text-lg">
              Explore my repositories, contributions, and coding journey on GitHub.
            </p>
            
            <a 
              href={`${githubData.html_url}?tab=repositories`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-xl transition-all hover:scale-105 text-lg font-semibold shadow-lg glow-hover"
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
      
      {/* Featured Projects */}
      <div className="mt-12">
        <h3 className="text-3xl font-bold text-slate-200 mb-8 flex items-center justify-center gap-3">
          <span className="w-12 h-0.5 bg-gradient-to-r from-transparent to-blue-500"></span>
          Featured Projects
          <span className="w-12 h-0.5 bg-gradient-to-l from-transparent to-blue-500"></span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* StopWatch Pro */}
          <div className="glass rounded-2xl overflow-hidden card-hover glow-hover group">
            <div className="aspect-video bg-gradient-to-br from-blue-900/50 to-slate-900 overflow-hidden relative">
              <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors"></div>
              <iframe 
                src="https://phase-1-stop-watch-applictation.vercel.app/" 
                className="w-full h-full border-0 scale-75 origin-top-left" 
                style={{width: '133.33%', height: '133.33%'}}
                title="StopWatch Pro Preview"
              />
            </div>
            <div className="p-6">
              <h4 className="font-bold text-xl text-slate-200 mb-2 group-hover:text-blue-400 transition-colors">StopWatch Pro</h4>
              <p className="text-slate-400 mb-4">Professional stopwatch with lap timing and export features</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-600/30 text-blue-300 text-xs rounded-full font-medium">React</span>
                <span className="px-3 py-1 bg-green-600/30 text-green-300 text-xs rounded-full font-medium">TypeScript</span>
              </div>
              <div className="flex gap-3">
                <a href="https://phase-1-stop-watch-applictation.vercel.app/" target="_blank" rel="noopener noreferrer" 
                   className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-center py-2.5 rounded-lg font-medium transition-all hover:scale-105">
                  Live Demo
                </a>
                <a href="https://github.com/obapluto-ob/StopWatch-Pro" target="_blank" rel="noopener noreferrer" 
                   className="flex-1 glass hover:bg-slate-700/50 text-center py-2.5 rounded-lg font-medium transition-all border border-slate-600">
                  Code
                </a>
              </div>
            </div>
          </div>

          {/* Ludomania */}
          <div className="glass rounded-2xl overflow-hidden card-hover glow-hover group">
            <div className="aspect-video bg-gradient-to-br from-green-900/50 to-slate-900 overflow-hidden relative">
              <div className="absolute inset-0 bg-green-500/10 group-hover:bg-green-500/20 transition-colors"></div>
              <iframe 
                src="https://ludomania-iota.vercel.app" 
                className="w-full h-full border-0 scale-75 origin-top-left" 
                style={{width: '133.33%', height: '133.33%'}}
                title="Ludomania Preview"
              />
            </div>
            <div className="p-6">
              <h4 className="font-bold text-xl text-slate-200 mb-2 group-hover:text-green-400 transition-colors">Ludomania</h4>
              <p className="text-slate-400 mb-4">Interactive gaming platform with multiple game modes</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-green-600/30 text-green-300 text-xs rounded-full font-medium">JavaScript</span>
                <span className="px-3 py-1 bg-purple-600/30 text-purple-300 text-xs rounded-full font-medium">CSS3</span>
              </div>
              <div className="flex gap-3">
                <a href="https://ludomania-iota.vercel.app" target="_blank" rel="noopener noreferrer" 
                   className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-center py-2.5 rounded-lg font-medium transition-all hover:scale-105">
                  Live Demo
                </a>
                <a href="https://github.com/obapluto-ob/Ludomania" target="_blank" rel="noopener noreferrer" 
                   className="flex-1 glass hover:bg-slate-700/50 text-center py-2.5 rounded-lg font-medium transition-all border border-slate-600">
                  Code
                </a>
              </div>
            </div>
          </div>

          {/* BPay App */}
          <div className="glass rounded-2xl overflow-hidden card-hover glow-hover group">
            <div className="aspect-video bg-gradient-to-br from-yellow-900/50 to-slate-900 overflow-hidden relative">
              <div className="absolute inset-0 bg-yellow-500/10 group-hover:bg-yellow-500/20 transition-colors"></div>
              <iframe 
                src="https://bpayapp.co.ke" 
                className="w-full h-full border-0 scale-75 origin-top-left" 
                style={{width: '133.33%', height: '133.33%'}}
                title="BPay App Preview"
              />
            </div>
            <div className="p-6">
              <h4 className="font-bold text-xl text-slate-200 mb-2 group-hover:text-yellow-400 transition-colors">BPay App</h4>
              <p className="text-slate-400 mb-4">Modern payment solution platform with secure transactions</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-yellow-600/30 text-yellow-300 text-xs rounded-full font-medium">React</span>
                <span className="px-3 py-1 bg-blue-600/30 text-blue-300 text-xs rounded-full font-medium">Node.js</span>
              </div>
              <div className="flex gap-3">
                <a href="https://bpayapp.co.ke" target="_blank" rel="noopener noreferrer" 
                   className="flex-1 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-center py-2.5 rounded-lg font-medium transition-all hover:scale-105">
                  Live Demo
                </a>
                <a href="https://github.com/obapluto-ob/bpay-app" target="_blank" rel="noopener noreferrer" 
                   className="flex-1 glass hover:bg-slate-700/50 text-center py-2.5 rounded-lg font-medium transition-all border border-slate-600">
                  Code
                </a>
              </div>
            </div>
          </div>

          {/* WeGatSauce Fashion */}
          <div className="glass rounded-2xl overflow-hidden card-hover glow-hover group">
            <div className="aspect-video bg-gradient-to-br from-pink-900/50 to-slate-900 overflow-hidden relative">
              <div className="absolute inset-0 bg-pink-500/10 group-hover:bg-pink-500/20 transition-colors"></div>
              <iframe 
                src="https://wegatsauce.pythonanywhere.com" 
                className="w-full h-full border-0 scale-75 origin-top-left" 
                style={{width: '133.33%', height: '133.33%'}}
                title="WeGatSauce Fashion Preview"
              />
            </div>
            <div className="p-6">
              <h4 className="font-bold text-xl text-slate-200 mb-2 group-hover:text-pink-400 transition-colors">WeGatSauce Fashion</h4>
              <p className="text-slate-400 mb-4">E-commerce fashion platform with modern shopping experience</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-pink-600/30 text-pink-300 text-xs rounded-full font-medium">Django</span>
                <span className="px-3 py-1 bg-orange-600/30 text-orange-300 text-xs rounded-full font-medium">Python</span>
              </div>
              <div className="flex gap-3">
                <a href="https://wegatsauce.pythonanywhere.com" target="_blank" rel="noopener noreferrer" 
                   className="flex-1 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-center py-2.5 rounded-lg font-medium transition-all hover:scale-105">
                  Live Demo
                </a>
                <a href="https://github.com/obapluto-ob/wegatsauce-fashion" target="_blank" rel="noopener noreferrer" 
                   className="flex-1 glass hover:bg-slate-700/50 text-center py-2.5 rounded-lg font-medium transition-all border border-slate-600">
                  Code
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Projects