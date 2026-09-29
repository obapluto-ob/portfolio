import { personalInfo } from '../data/portfolio'
import SectionHeader from './SectionHeader'
import ContactForm from './ContactForm'
import ResumeDownload from './ResumeDownload'
import SocialLinks from './SocialLinks'
import analytics from '../utils/analytics'

const BIO_LINES = [
  { label: 'NAME',     value: 'Obed Emoni Lopeyok' },
  { label: 'ROLE',     value: 'Full-stack Developer' },
  { label: 'LOCATION', value: 'Nairobi, Kenya' },
  { label: 'TRAINING', value: 'Moringa School — Completed ✓' },
  { label: 'STATUS',   value: 'Available for hire — remote & on-site' },
  { label: 'GITHUB',   value: 'github.com/obapluto-ob' },
  { label: 'EMAIL',    value: personalInfo.email },
]

const STACK = [
  { cat: 'Frontend',  items: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'] },
  { cat: 'Backend',   items: ['Python', 'Flask', 'Django', 'Node.js', 'Express'] },
  { cat: 'Mobile',    items: ['Flutter', 'Dart'] },
  { cat: 'Databases', items: ['PostgreSQL', 'SQLite', 'MongoDB', 'Firebase'] },
  { cat: 'Tools',     items: ['Git', 'Docker', 'Linux', 'REST APIs', 'JWT'] },
]

const AboutEnhanced = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <SectionHeader title="ABOUT.SH" subtitle="identity file — clearance level: public" className="mb-10" />

      {/* Bio card */}
      <div className="glass-bright rounded-lg p-6 mb-8 scan-sweep neon-border">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--green)' }} />
          <span className="text-xs font-mono" style={{ color: 'var(--text-dim)' }}>
            cat /etc/identity.conf
          </span>
        </div>

        <div className="space-y-2 font-mono text-sm">
          {BIO_LINES.map(({ label, value }) => (
            <div key={label} className="flex gap-3 flex-wrap">
              <span className="w-20 shrink-0 text-xs" style={{ color: 'var(--text-dim)' }}>{label}</span>
              <span style={{ color: 'var(--text-dim)' }}>:</span>
              <span style={{ color: label === 'STATUS' || label === 'TRAINING' ? 'var(--green)' : 'var(--text-body)' }}>
                {value}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-body)' }}>
            Full-stack Developer based in Nairobi, Kenya. Recently completed software engineering
            training at Moringa School, where I built production-grade applications across web and
            mobile. I focus on React, TypeScript, Python, and API-driven architectures — shipping
            real products that solve real problems. Now actively seeking full-time roles and
            freelance projects.
          </p>
          <p className="text-xs mt-3 font-mono" style={{ color: 'var(--green-dim)' }}>
            // "Code is only as powerful as the problems it solves."
          </p>
        </div>
      </div>

      {/* Tech stack */}
      <div className="glass-bright rounded-lg p-6 mb-8">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="w-2 h-2 rounded-full" style={{ background: 'var(--cyan)', boxShadow: '0 0 6px var(--cyan-glow)' }} />
          <span className="text-xs font-mono" style={{ color: 'var(--text-dim)' }}>
            cat /etc/stack.conf
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STACK.map(({ cat, items }) => (
            <div key={cat}>
              <div className="text-xs font-mono mb-2" style={{ color: 'var(--green-dim)' }}>
                [{cat.toUpperCase()}]
              </div>
              <div className="flex flex-wrap gap-1.5">
                {items.map(item => (
                  <span
                    key={item}
                    className="text-xs px-2 py-0.5 rounded border font-mono"
                    style={{ color: 'var(--text-body)', borderColor: 'var(--border)', background: 'rgba(0,255,65,0.04)' }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GitHub link */}
      <div className="text-center mb-12">
        <a
          href={`https://github.com/${personalInfo.github}?tab=repositories`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => analytics.trackClick('github_repositories', 'about')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-mono text-sm transition-all hover:scale-105 border card-hover"
          style={{ borderColor: 'var(--green-dim)', color: 'var(--green)', background: 'transparent' }}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
          </svg>
          ./view-repositories.sh
        </a>
      </div>

      {/* Contact section */}
      <div className="border-t pt-10 mb-4" style={{ borderColor: 'var(--border)' }}>
        <SectionHeader title="CONTACT.SH" subtitle="open a secure channel" className="mb-8" />

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Left — links */}
          <div className="glass-bright rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--green)' }} />
              <span className="text-xs font-mono" style={{ color: 'var(--text-dim)' }}>channels.conf</span>
            </div>

            <div className="space-y-3">
              <ResumeDownload />

              <div className="pt-2">
                <p className="text-xs font-mono mb-3" style={{ color: 'var(--text-dim)' }}>// social links</p>
                <SocialLinks />
              </div>

              <a
                href={`mailto:${personalInfo.email}?subject=${encodeURIComponent('Hiring Inquiry — Full-stack Developer')}`}
                onClick={() => analytics.trackClick('contact_email', 'contact')}
                className="flex items-center gap-3 p-3 rounded-lg border transition-all hover:scale-105 card-hover w-full"
                style={{ borderColor: 'var(--border)', background: 'rgba(0,255,65,0.05)' }}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" style={{ color: 'var(--green)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs font-mono" style={{ color: 'var(--green)' }}>EMAIL</div>
                  <div className="text-xs font-mono" style={{ color: 'var(--text-dim)' }}>{personalInfo.email}</div>
                </div>
              </a>

              <a
                href="tel:+254729237059"
                onClick={() => analytics.trackClick('contact_phone', 'contact')}
                className="flex items-center gap-3 p-3 rounded-lg border transition-all hover:scale-105 card-hover w-full"
                style={{ borderColor: 'var(--border)', background: 'rgba(0,255,65,0.05)' }}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" style={{ color: 'var(--green)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs font-mono" style={{ color: 'var(--green)' }}>PHONE</div>
                  <div className="text-xs font-mono" style={{ color: 'var(--text-dim)' }}>+254 729 237 059</div>
                </div>
              </a>
            </div>
          </div>

          <ContactForm />
        </div>

        <div className="text-center pb-16">
          <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            // Based in {personalInfo.location} — available for remote work worldwide
          </p>
        </div>
      </div>
    </div>
  )
}

export default AboutEnhanced
