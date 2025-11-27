import React, { useState, useEffect } from 'react'

interface GitHubEvent {
  id: string
  type: string
  repo: { name: string }
  created_at: string
  payload: any
}

const GitHubActivity = () => {
  const [events, setEvents] = useState<GitHubEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await fetch('https://api.github.com/users/obapluto-ob/events/public?per_page=5')
        if (response.ok) {
          const data = await response.json()
          setEvents(data)
        }
      } catch (error) {
        console.error('Failed to fetch GitHub activity:', error)
      }
      setLoading(false)
    }

    fetchActivity()
  }, [])

  const getEventDescription = (event: GitHubEvent) => {
    switch (event.type) {
      case 'PushEvent':
        return `Pushed ${event.payload.commits?.length || 1} commit(s) to ${event.repo.name}`
      case 'CreateEvent':
        return `Created ${event.payload.ref_type} in ${event.repo.name}`
      case 'ForkEvent':
        return `Forked ${event.repo.name}`
      case 'WatchEvent':
        return `Starred ${event.repo.name}`
      case 'IssuesEvent':
        return `${event.payload.action} issue in ${event.repo.name}`
      case 'PullRequestEvent':
        return `${event.payload.action} pull request in ${event.repo.name}`
      default:
        return `Activity in ${event.repo.name}`
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'PushEvent':
        return '📝'
      case 'CreateEvent':
        return '🆕'
      case 'ForkEvent':
        return '🍴'
      case 'WatchEvent':
        return '⭐'
      case 'IssuesEvent':
        return '🐛'
      case 'PullRequestEvent':
        return '🔀'
      default:
        return '💻'
    }
  }

  if (loading) {
    return (
      <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-medium text-slate-200 mb-4">Recent Activity</h3>
        <div className="animate-pulse space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="h-4 bg-slate-700 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700">
      <h3 className="text-lg font-medium text-slate-200 mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {events.slice(0, 4).map((event) => (
          <div key={event.id} className="flex items-start space-x-3 text-sm">
            <span className="text-lg">{getEventIcon(event.type)}</span>
            <div>
              <p className="text-slate-300">{getEventDescription(event)}</p>
              <p className="text-slate-500 text-xs">
                {new Date(event.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GitHubActivity