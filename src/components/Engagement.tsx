import React, { useState } from 'react'
import { Code, Zap } from 'lucide-react'
import SectionHeader from './SectionHeader'
import PortfolioRating from './PortfolioRating'
import ShareButtons from './ShareButtons'
import CodeChallenge from './CodeChallenge'
import APIBuilder from './APIBuilder'
import GuestbookEnhanced from './GuestbookEnhanced'

const Engagement = () => {
  const [activeTool, setActiveTool] = useState<'debug' | 'api' | null>(null)
  const [guestMessages, setGuestMessages] = useState<string[]>([])
  const [newMessage, setNewMessage] = useState('')

  const handleAddMessage = () => {
    if (newMessage.trim()) {
      setGuestMessages(prev => [...prev, newMessage.trim()])
      setNewMessage('')
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <SectionHeader title="Engage & Play" />
      
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <PortfolioRating />
        <ShareButtons />
      </div>
      
      {/* Developer Tools Section */}
      <div className="bg-slate-800/30 rounded-lg p-8 border border-slate-700 mb-8">
        <h3 className="text-xl font-medium text-slate-200 mb-6 text-center">Developer Tools</h3>
        
        {!activeTool ? (
          <div className="grid md:grid-cols-2 gap-4 text-center">
            <button 
              onClick={() => setActiveTool('debug')}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-8 rounded-lg transition-colors"
            >
              <div className="text-3xl mb-2">
                <Code className="w-8 h-8 mx-auto text-blue-400" />
              </div>
              <div className="font-medium">Debug Challenge</div>
              <div className="text-sm opacity-90 mt-1">Find & fix code bugs</div>
            </button>
            <button 
              onClick={() => setActiveTool('api')}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-8 rounded-lg transition-colors"
            >
              <div className="text-3xl mb-2">
                <Zap className="w-8 h-8 mx-auto text-purple-400" />
              </div>
              <div className="font-medium">API Builder</div>
              <div className="text-sm opacity-90 mt-1">Generate REST APIs</div>
            </button>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium text-slate-200">
                {activeTool === 'debug' ? 'Debug Challenge' : 'API Builder'}
              </h4>
              <button
                onClick={() => setActiveTool(null)}
                className="text-slate-400 hover:text-slate-200 px-3 py-1 rounded transition-colors"
              >
                ← Back to Tools
              </button>
            </div>
            
            {activeTool === 'debug' && <CodeChallenge />}
            {activeTool === 'api' && <APIBuilder />}
          </div>
        )}
      </div>
      
      {/* Enhanced Guestbook */}
      <GuestbookEnhanced />
    </div>
  )
}

export default Engagement