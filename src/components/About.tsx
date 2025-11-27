import React, { useState, useEffect } from 'react'
import { personalInfo, skillCategories } from '../data/portfolio'
import SectionHeader from './SectionHeader'
import LazyImage from './LazyImage'
import analytics from '../utils/analytics'

const About = () => {
  const [readme, setReadme] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReadme = async () => {
      try {
        const readmeResponse = await fetch('https://raw.githubusercontent.com/obapluto-ob/obapluto-ob/main/README.md')
        if (readmeResponse.ok) {
          const readmeText = await readmeResponse.text()
          setReadme(readmeText)
        }
      } catch (error) {
        console.log('No profile README found')
      }
      setLoading(false)
    }

    fetchReadme()
  }, [])

  if (loading) {
    return (
      <div className="text-center max-w-4xl mx-auto">
        <h2 className="text-4xl font-light mb-12 text-slate-300">About Me</h2>
        <div className="text-slate-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Python Icon Header */}
      <div className="text-center mb-6">
        <LazyImage
          src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg"
          alt="Python"
          className="w-16 h-16 mx-auto animate-bounce opacity-80"
        />
      </div>
      
      <SectionHeader title="About Me" className="mb-8" />
      
      {readme ? (
        <div className="bg-slate-800/30 rounded-lg p-8 border border-slate-700">
          <div className="text-left text-slate-400 space-y-4">
            {readme.split('\n').map((line, index) => {
              // Skip HTML tags, image lines, and project sections
              if (line.includes('<img') || line.includes('<p align') || line.includes('</p>') || line.includes('<h1') || line.includes('</h1>') || line.includes('<h3') || line.includes('</h3>')) {
                return null
              }
              
              // Skip project-related sections
              if (line.toLowerCase().includes('project') || line.toLowerCase().includes('repository') || line.toLowerCase().includes('repo') || line.toLowerCase().includes('crypto') || line.toLowerCase().includes('sms-control') || line.toLowerCase().includes('portfolio') || line.toLowerCase().includes('dashboard') || line.toLowerCase().includes('cms')) {
                return null
              }
              
              // Handle markdown headers
              if (line.startsWith('## ')) {
                const headerText = line.replace('## ', '')
                // Skip project headers
                if (headerText.toLowerCase().includes('project')) return null
                return <h4 key={index} className="text-xl font-medium text-slate-200 mt-6 mb-3">{headerText}</h4>
              }
              if (line.startsWith('### ')) {
                return <h5 key={index} className="text-lg font-medium text-slate-300 mt-4 mb-2">{line.replace('### ', '')}</h5>
              }
              
              // Handle lists
              if (line.startsWith('- ')) {
                return <li key={index} className="ml-4 mb-1 text-slate-300">{line.replace('- ', '• ')}</li>
              }
              
              // Handle horizontal rules
              if (line.trim() === '---') {
                return <hr key={index} className="border-slate-600 my-6" />
              }
              
              // Handle quotes
              if (line.startsWith('> ')) {
                return <blockquote key={index} className="border-l-4 border-blue-500 pl-4 italic text-slate-300 my-4 text-lg">{line.replace('> ', '').replace(/[*"]/g, '')}</blockquote>
              }
              
              // Skip badge lines and empty lines
              if (line.includes('![') || line.includes('https://img.shields.io') || !line.trim()) {
                return null
              }
              
              // Regular paragraphs
              if (line.trim()) {
                return <p key={index} className="leading-relaxed text-slate-300">{line}</p>
              }
              
              return null
            }).filter(Boolean)}
          </div>
        </div>
      ) : (
        <div className="bg-slate-800/30 rounded-lg p-8 border border-slate-700 text-center">
          <h3 className="text-xl font-medium text-slate-200 mb-4">My Journey</h3>
          <p className="text-slate-400 leading-relaxed">
            Currently pursuing Full-stack Development at Moringa School in Nairobi. 
            Passionate about creating solutions that bridge the gap between complex problems 
            and elegant code. I believe in continuous learning and building projects that matter.
          </p>
        </div>
      )}
      
      {/* Tech Stack Section */}
      <div className="mt-12">
        <h3 className="text-2xl font-medium text-slate-200 mb-8 text-center">Tech Stack</h3>
        
        <div className="space-y-8">
          {/* Languages */}
          <div>
            <h4 className="text-lg font-medium text-slate-300 mb-4 text-center">Languages</h4>
            <div className="flex justify-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python" className="w-6 h-6" />
                <span className="text-slate-400">Python</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript" className="w-6 h-6" />
                <span className="text-slate-400">JavaScript</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="TypeScript" className="w-6 h-6" />
                <span className="text-slate-400">TypeScript</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg" alt="Dart" className="w-6 h-6" />
                <span className="text-slate-400">Dart</span>
              </div>
            </div>
          </div>
          
          {/* Frameworks & Libraries */}
          <div>
            <h4 className="text-lg font-medium text-slate-300 mb-4 text-center">Frameworks & Libraries</h4>
            <div className="flex justify-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" className="w-6 h-6" />
                <span className="text-slate-400">React</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" alt="Django" className="w-6 h-6" />
                <span className="text-slate-400">Django</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg" alt="Flutter" className="w-6 h-6" />
                <span className="text-slate-400">Flutter</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" className="w-6 h-6" />
                <span className="text-slate-400">Node.js</span>
              </div>
            </div>
          </div>
          
          {/* Databases */}
          <div>
            <h4 className="text-lg font-medium text-slate-300 mb-4 text-center">Databases</h4>
            <div className="flex justify-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" className="w-6 h-6" />
                <span className="text-slate-400">PostgreSQL</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" alt="MongoDB" className="w-6 h-6" />
                <span className="text-slate-400">MongoDB</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg" alt="SQLite" className="w-6 h-6" />
                <span className="text-slate-400">SQLite</span>
              </div>
            </div>
          </div>
          
          {/* Tools & Platforms */}
          <div>
            <h4 className="text-lg font-medium text-slate-300 mb-4 text-center">Tools & Platforms</h4>
            <div className="flex justify-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" alt="Git" className="w-6 h-6" />
                <span className="text-slate-400">Git</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" alt="Docker" className="w-6 h-6" />
                <span className="text-slate-400">Docker</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" alt="VS Code" className="w-6 h-6" />
                <span className="text-slate-400">VS Code</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" alt="Linux" className="w-6 h-6" />
                <span className="text-slate-400">Linux</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* GitHub Repositories Button */}
      <div className="text-center mt-8">
        <a 
          href={`https://github.com/${personalInfo.github}?tab=repositories`}
          target="_blank" 
          rel="noopener noreferrer"
          onClick={() => analytics.trackClick('github_repositories', 'about')}
          className="inline-flex items-center px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors border border-slate-600"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
          </svg>
          View My Repositories
        </a>
      </div>
    </div>
  )
}

export default About