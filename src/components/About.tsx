import React from 'react'

const About = () => {
  return (
    <div className="text-center max-w-3xl mx-auto">
      <h2 className="text-4xl font-light mb-12 text-slate-300">About Me</h2>
      
      <div className="space-y-8">
        <div className="bg-slate-800/30 rounded-lg p-8 border border-slate-700">
          <h3 className="text-xl font-medium text-slate-200 mb-4">My Journey</h3>
          <p className="text-slate-400 leading-relaxed">
            Currently pursuing Full-stack Development at Moringa School in Nairobi. 
            Passionate about creating solutions that bridge the gap between complex problems 
            and elegant code. I believe in continuous learning and building projects that matter.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700">
            <h4 className="text-lg font-medium text-slate-200 mb-3">Focus Areas</h4>
            <ul className="text-slate-400 space-y-2 text-sm">
              <li>• Web Development</li>
              <li>• Mobile Applications</li>
              <li>• API Development</li>
              <li>• Database Design</li>
            </ul>
          </div>
          
          <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700">
            <h4 className="text-lg font-medium text-slate-200 mb-3">Education</h4>
            <ul className="text-slate-400 space-y-2 text-sm">
              <li>• Moringa School - Full-stack Development</li>
              <li>• Software Engineering Program</li>
              <li>• Nairobi, Kenya</li>
              <li>• 2024 - Present</li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <p className="text-slate-500 italic">
            "Code is only as powerful as the problems it solves. I build to solve, not just to ship."
          </p>
        </div>
      </div>
    </div>
  )
}

export default About