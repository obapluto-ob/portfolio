import React from 'react'

const TechnicalBlog = () => {
  // Check if user has real blog posts/articles
  const hasRealWriting = false // Set to true when you have real articles
  
  if (!hasRealWriting) {
    return (
      <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700">
        <h3 className="text-xl font-medium text-slate-200 mb-6">Technical Writing</h3>
        <div className="text-center py-8">
          <p className="text-slate-400 mb-4">Currently focused on building projects</p>
          <p className="text-sm text-slate-500 mb-4">
            Planning to share my learning journey through technical articles soon
          </p>
          <div className="text-xs text-slate-600">
            Topics I want to write about:
            <div className="flex justify-center space-x-2 mt-2">
              <span className="bg-slate-700 px-2 py-1 rounded">React</span>
              <span className="bg-slate-700 px-2 py-1 rounded">Django</span>
              <span className="bg-slate-700 px-2 py-1 rounded">Flutter</span>
            </div>
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