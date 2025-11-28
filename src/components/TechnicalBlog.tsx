import React from 'react'

const TechnicalBlog = () => {
  // Check if user has real blog posts/articles
  const hasRealWriting = false // Set to true when you have real articles
  
  if (!hasRealWriting) {
    return (
      <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700">
        <h3 className="text-xl font-medium text-slate-200 mb-6">Technical Writing</h3>
        <div className="py-6">
          <p className="text-slate-300 mb-6 text-center">Currently focused on building projects</p>
          <p className="text-slate-400 mb-6 text-center">
            Planning to share my learning journey through technical articles
          </p>
          
          <div className="mb-6">
            <h4 className="text-slate-200 font-medium mb-4 text-center">Upcoming Technical Articles:</h4>
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-slate-700/50 p-3 rounded border-l-4 border-blue-500">
                <div className="font-medium text-blue-400">React & TypeScript</div>
                <div className="text-sm text-slate-400">Building type-safe React applications with advanced patterns</div>
              </div>
              <div className="bg-slate-700/50 p-3 rounded border-l-4 border-green-500">
                <div className="font-medium text-green-400">Django REST APIs</div>
                <div className="text-sm text-slate-400">Creating scalable backend services with Django & PostgreSQL</div>
              </div>
              <div className="bg-slate-700/50 p-3 rounded border-l-4 border-purple-500">
                <div className="font-medium text-purple-400">Flutter Development</div>
                <div className="text-sm text-slate-400">Cross-platform mobile apps with state management</div>
              </div>
              <div className="bg-slate-700/50 p-3 rounded border-l-4 border-yellow-500">
                <div className="font-medium text-yellow-400">Web Performance</div>
                <div className="text-sm text-slate-400">Optimizing React apps for speed and user experience</div>
              </div>
              <div className="bg-slate-700/50 p-3 rounded border-l-4 border-red-500">
                <div className="font-medium text-red-400">DevOps & Deployment</div>
                <div className="text-sm text-slate-400">CI/CD pipelines, Docker, and cloud deployment strategies</div>
              </div>
              <div className="bg-slate-700/50 p-3 rounded border-l-4 border-indigo-500">
                <div className="font-medium text-indigo-400">Database Design</div>
                <div className="text-sm text-slate-400">SQL optimization and database architecture patterns</div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-slate-500">Follow my journey as I document real-world solutions and best practices</p>
          </div>
        </div>
      </div>
    )
  }

  // This section will show when you have real articles
  return (
    <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700">
      <h3 className="text-xl font-medium text-slate-200 mb-6">Technical Writing</h3>
      {/* Real articles will go here when available */}
    </div>
  )
}

export default TechnicalBlog