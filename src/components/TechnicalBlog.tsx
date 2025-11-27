import React from 'react'
import { blogPosts } from '../data/achievements'

const TechnicalBlog = () => {
  return (
    <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700">
      <h3 className="text-xl font-medium text-slate-200 mb-6">Technical Writing</h3>
      <div className="space-y-4">
        {blogPosts.map((post, index) => (
          <div key={index} className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-medium text-slate-200 mb-1">{post.title}</h4>
            <p className="text-sm text-slate-400 mb-2">{post.excerpt}</p>
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {post.tags.map((tag, tagIndex) => (
                  <span 
                    key={tagIndex}
                    className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="text-xs text-slate-500">{post.readTime}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <button className="text-blue-400 hover:text-blue-300 text-sm">
          View All Articles →
        </button>
      </div>
    </div>
  )
}

export default TechnicalBlog