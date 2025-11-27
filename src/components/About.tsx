import React, { useState, useEffect } from 'react'

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
      <h2 className="text-4xl font-light mb-8 text-slate-300 text-center">About Me</h2>
      
      {readme ? (
        <div className="bg-slate-800/30 rounded-lg p-8 border border-slate-700">
          <div className="text-left text-slate-400 space-y-4">
            {readme.split('\n').map((line, index) => {
              // Skip HTML tags and image lines
              if (line.includes('<img') || line.includes('<p align') || line.includes('</p>') || line.includes('<h1') || line.includes('</h1>') || line.includes('<h3') || line.includes('</h3>')) {
                return null
              }
              
              // Handle markdown headers
              if (line.startsWith('## ')) {
                return <h4 key={index} className="text-xl font-medium text-slate-200 mt-6 mb-3">{line.replace('## ', '')}</h4>
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
    </div>
  )
}

export default About