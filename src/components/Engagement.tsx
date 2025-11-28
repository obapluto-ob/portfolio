import React from 'react'
import SectionHeader from './SectionHeader'
import PortfolioRating from './PortfolioRating'
import ShareButtons from './ShareButtons'

const Engagement = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <SectionHeader title="Engage & Play" />
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <PortfolioRating />
        <ShareButtons />
      </div>
      
      {/* Mini Game Section */}
      <div className="bg-slate-800/30 rounded-lg p-8 border border-slate-700 text-center">
        <h3 className="text-xl font-medium text-slate-200 mb-6">Mini Games</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-4 rounded-lg transition-colors">
            🐍 Snake Game
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 px-6 py-4 rounded-lg transition-colors">
            🧩 Memory Game
          </button>
        </div>
        <p className="text-slate-400 text-sm mt-4">Games coming soon!</p>
      </div>
      
      {/* Guestbook Section */}
      <div className="mt-8 bg-slate-800/30 rounded-lg p-8 border border-slate-700">
        <h3 className="text-xl font-medium text-slate-200 mb-6 text-center">Guestbook</h3>
        <div className="text-center">
          <p className="text-slate-400 mb-4">Leave a message for other visitors!</p>
          <textarea 
            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-4 text-slate-200 placeholder-slate-400"
            placeholder="Write your message here..."
            rows={3}
          />
          <button className="mt-4 bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg transition-colors">
            Sign Guestbook
          </button>
        </div>
      </div>
    </div>
  )
}

export default Engagement