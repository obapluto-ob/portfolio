import React, { useState } from 'react'

const MAX_MESSAGE_LENGTH = 1000

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    _honeypot: '' // spam trap — must stay empty
  })
  const [errors, setErrors] = useState<Partial<typeof formData>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const validate = () => {
    const next: Partial<typeof formData> = {}
    if (!formData.name.trim()) next.name = 'Name is required'
    if (!formData.email.trim()) {
      next.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      next.email = 'Enter a valid email address'
    }
    if (!formData.subject.trim()) next.subject = 'Subject is required'
    if (!formData.message.trim()) {
      next.message = 'Message is required'
    } else if (formData.message.length > MAX_MESSAGE_LENGTH) {
      next.message = `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer`
    }
    return next
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Honeypot check — bots fill hidden fields
    if (formData._honeypot) return

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    setStatus('sending')

    try {
      const { _honeypot, ...payload } = formData
      const response = await fetch('https://formspree.io/f/xvzgepzy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '', _honeypot: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const isSubmitting = status === 'sending'

  return (
    <div className="glass rounded-2xl p-8 glow-hover">
      <h3 className="text-2xl font-semibold text-slate-200 mb-6">Send Message</h3>

      {status === 'success' && (
        <div role="alert" className="bg-green-600/20 border border-green-600 text-green-400 p-4 rounded-xl mb-6">
          Message sent! I'll get back to you soon.
        </div>
      )}

      {status === 'error' && (
        <div role="alert" className="bg-red-600/20 border border-red-600 text-red-400 p-4 rounded-xl mb-6">
          Failed to send. Please try again or email me directly.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Honeypot — hidden from real users */}
        <input
          type="text"
          name="_honeypot"
          value={formData._honeypot}
          onChange={handleChange}
          tabIndex={-1}
          aria-hidden="true"
          style={{ display: 'none' }}
          autoComplete="off"
        />

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contact-name" className="block text-sm font-medium text-slate-300 mb-1">
              Name <span aria-hidden="true" className="text-red-400">*</span>
            </label>
            <input
              id="contact-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              aria-describedby={errors.name ? 'name-error' : undefined}
              aria-invalid={!!errors.name}
              className={`w-full bg-slate-700 border rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                errors.name ? 'border-red-500' : 'border-slate-600'
              }`}
              placeholder="Your name"
            />
            {errors.name && (
              <p id="name-error" role="alert" className="text-red-400 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="contact-email" className="block text-sm font-medium text-slate-300 mb-1">
              Email <span aria-hidden="true" className="text-red-400">*</span>
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              aria-describedby={errors.email ? 'email-error' : undefined}
              aria-invalid={!!errors.email}
              className={`w-full bg-slate-700 border rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                errors.email ? 'border-red-500' : 'border-slate-600'
              }`}
              placeholder="your@email.com"
            />
            {errors.email && (
              <p id="email-error" role="alert" className="text-red-400 text-xs mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="contact-subject" className="block text-sm font-medium text-slate-300 mb-1">
            Subject <span aria-hidden="true" className="text-red-400">*</span>
          </label>
          <input
            id="contact-subject"
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            aria-describedby={errors.subject ? 'subject-error' : undefined}
            aria-invalid={!!errors.subject}
            className={`w-full bg-slate-700 border rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
              errors.subject ? 'border-red-500' : 'border-slate-600'
            }`}
            placeholder="What's this about?"
          />
          {errors.subject && (
            <p id="subject-error" role="alert" className="text-red-400 text-xs mt-1">{errors.subject}</p>
          )}
        </div>

        <div>
          <label htmlFor="contact-message" className="block text-sm font-medium text-slate-300 mb-1">
            Message <span aria-hidden="true" className="text-red-400">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            rows={5}
            maxLength={MAX_MESSAGE_LENGTH}
            aria-describedby="message-count message-error"
            aria-invalid={!!errors.message}
            className={`w-full bg-slate-700 border rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-50 ${
              errors.message ? 'border-red-500' : 'border-slate-600'
            }`}
            placeholder="Your message…"
          />
          <div className="flex justify-between items-center mt-1">
            {errors.message ? (
              <p id="message-error" role="alert" className="text-red-400 text-xs">{errors.message}</p>
            ) : (
              <span id="message-count" className="text-xs text-slate-500">
                {formData.message.length}/{MAX_MESSAGE_LENGTH}
              </span>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" aria-hidden="true"></span>
              Sending…
            </span>
          ) : (
            'Send Message'
          )}
        </button>
      </form>
    </div>
  )
}

export default ContactForm
