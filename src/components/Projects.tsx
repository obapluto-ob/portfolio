import React, { useState, useEffect } from 'react'
import SectionHeader from './SectionHeader'
import { featuredProjects, moreProjects, type Project } from '../data/portfolio'

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

const statusColors: Record<Project['status'], string> = {
  production: 'bg-green-600/30 text-green-300 border-green-600/40',
  active: 'bg-blue-600/30 text-blue-300 border-blue-600/40',
  archived: 'bg-slate-600/30 text-slate-400 border-slate-600/40'
}

const statusLabels: Record<Project['status'], string> = {
  production: 'Live',
  active: 'Active',
  archived: 'Archived'
}

const techColors = [
  'bg-blue-600/30 text-blue-300',
  'bg-purple-600/30 text-purple-300',
  'bg-green-600/30 text-green-300',
  'bg-yellow-600/30 text-yellow-300',
  'bg-pink-600/30 text-pink-300',
  'bg-orange-600/30 text-orange-300',
  'bg-cyan-600/30 text-cyan-300',
]

function getTechColor(_tech: string, index: number) {
  return techColors[index % techColors.length]
}

function ProjectCard({ project, featured }: { project: Project; featured: boolean }) {
  return (
    <div
      className={`glass rounded-2xl overflow-hidden card-hover glow-hover group flex flex-col ${
        featured ? '' : 'p-5'
      }`}
    >
      {/* Preview area for featured projects */}
      {featured && (
        <div className="relative w-full h-48 bg-slate-900 overflow-hidden">
          {project.liveUrl ? (
            <>
              <iframe
                src={project.liveUrl}
                title={`${project.title} preview`}
                className="w-full h-full border-0 pointer-events-none"
                style={{ transform: 'scale(0.75)', transformOrigin: 'top left', width: '133%', height: '133%' }}
                loading="lazy"
                sandbox="allow-scripts allow-same-origin"
              />
              <div className="absolute inset-0" aria-hidden="true" />
            </>
          ) : (
            /* Placeholder for projects without a live URL */
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-800 to-slate-900 px-6">
              <div className="text-3xl font-black text-slate-600 tracking-widest uppercase select-none">
                {project.title.slice(0, 2)}
              </div>
              <div className="flex flex-wrap justify-center gap-1.5">
                {project.technologies.slice(0, 4).map((tech, i) => (
                  <span
                    key={tech}
                    className={`px-2 py-0.5 text-xs rounded-full font-medium ${getTechColor(tech, i)} opacity-70`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="text-xs text-slate-600 mt-1">No live demo</div>
            </div>
          )}
        </div>
      )}

      {/* Card body */}
      <div className={featured ? 'p-6 flex flex-col flex-1' : 'flex flex-col flex-1'}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <h4
            className={`font-bold text-slate-200 group-hover:text-blue-400 transition-colors ${
              featured ? 'text-xl' : 'text-base'
            }`}
          >
            {project.title}
          </h4>
          <span
            className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusColors[project.status]}`}
          >
            {statusLabels[project.status]}
          </span>
        </div>
      </div>

      {/* Description */}
      <p
        className={`text-slate-400 mb-4 leading-relaxed flex-1 ${
          featured ? 'text-sm' : 'text-xs'
        }`}
      >
        {project.description}
      </p>

      {/* Tech badges */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.technologies.map((tech, i) => (
          <span
            key={tech}
            className={`px-2 py-0.5 text-xs rounded-full font-medium ${getTechColor(tech, i)}`}
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 glass hover:bg-slate-700/50 rounded-lg text-sm font-medium border border-slate-600 transition-all hover:scale-105"
            aria-label={`View ${project.title} source code on GitHub`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
            </svg>
            GitHub
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-sm font-medium transition-all hover:scale-105"
            aria-label={`View ${project.title} live demo`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Live Demo
          </a>
        )}
      </div>
    </div>
    </div>
  )
}

const Projects = () => {
  const [githubData, setGithubData] = useState<GitHubUser | null>(null)
  const [githubError, setGithubError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const res = await fetch('https://api.github.com/users/obapluto-ob')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        setGithubData(await res.json())
      } catch {
        setGithubError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchGitHubData()
  }, [])

  return (
    <div className="max-w-5xl mx-auto">
      <SectionHeader title="My Work" className="mb-10" />

      {/* GitHub profile card — degrades gracefully */}
      {!githubError && (
        <div className="glass rounded-2xl p-6 mb-10 glow">
          {loading ? (
            <div className="flex items-center justify-center space-x-2 py-4">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" aria-hidden="true"></div>
              <span className="text-slate-400 text-sm">Loading GitHub profile…</span>
            </div>
          ) : githubData ? (
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <img
                src={githubData.avatar_url}
                alt={`${githubData.name || githubData.login} GitHub avatar`}
                className="w-16 h-16 rounded-full border-2 border-slate-600 flex-shrink-0"
              />
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-bold text-slate-200">{githubData.name || githubData.login}</h3>
                <p className="text-slate-400 text-sm">@{githubData.login}</p>
              </div>
              <div className="flex gap-6 text-center">
                <div>
                  <div className="text-xl font-bold text-blue-400">{githubData.public_repos}</div>
                  <div className="text-xs text-slate-400">Repos</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-purple-400">{githubData.followers}</div>
                  <div className="text-xs text-slate-400">Followers</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-green-400">{new Date(githubData.created_at).getFullYear()}</div>
                  <div className="text-xs text-slate-400">Joined</div>
                </div>
              </div>
              <a
                href={`${githubData.html_url}?tab=repositories`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-5 py-2.5 rounded-xl transition-all hover:scale-105 font-medium text-sm whitespace-nowrap"
                aria-label="View all repositories on GitHub"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
                All Repos
              </a>
            </div>
          ) : null}
        </div>
      )}

      {/* Featured Projects */}
      <section aria-labelledby="featured-projects-heading">
        <h3
          id="featured-projects-heading"
          className="text-2xl font-bold text-slate-200 mb-6 flex items-center gap-3"
        >
          <span className="w-8 h-0.5 bg-gradient-to-r from-transparent to-blue-500" aria-hidden="true"></span>
          Featured Projects
          <span className="w-8 h-0.5 bg-gradient-to-l from-transparent to-blue-500" aria-hidden="true"></span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {featuredProjects.map(project => (
            <ProjectCard key={project.id} project={project} featured={true} />
          ))}
        </div>
      </section>

      {/* More Projects */}
      <section aria-labelledby="more-projects-heading">
        <h3
          id="more-projects-heading"
          className="text-xl font-semibold text-slate-300 mb-4 flex items-center gap-3"
        >
          <span className="w-6 h-0.5 bg-gradient-to-r from-transparent to-slate-500" aria-hidden="true"></span>
          More Projects
          <span className="w-6 h-0.5 bg-gradient-to-l from-transparent to-slate-500" aria-hidden="true"></span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {moreProjects.map(project => (
            <ProjectCard key={project.id} project={project} featured={false} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Projects
