'use client'

import { useState } from 'react'

interface ContactFormProps {
  onClose?: () => void
  showCloseButton?: boolean
}

export default function ContactForm({ onClose, showCloseButton = false }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // TODO: Replace with actual API endpoint
      // Example: const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })

      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log('Form submitted:', formData)

      setIsSubmitting(false)
      setSubmitStatus('success')

      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          message: ''
        })
        setSubmitStatus('idle')
        if (onClose) onClose()
      }, 2000)
    } catch (error) {
      console.error('Form submission error:', error)
      setIsSubmitting(false)
      setSubmitStatus('error')

      // Reset error state after 3 seconds
      setTimeout(() => {
        setSubmitStatus('idle')
      }, 3000)
    }
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
      {showCloseButton && onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-ink transition-colors"
          aria-label="Close form"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <div className="mb-6">
        <h3 className="text-2xl md:text-3xl font-bold text-ink mb-2">Get in Touch</h3>
        <p className="text-slate-600">We'll get back to you within 24 hours.</p>
      </div>

      {submitStatus === 'success' ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h4 className="text-xl font-bold text-ink mb-2">Message Sent!</h4>
          <p className="text-slate-600">We'll be in touch soon to discuss your project.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-ink mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-cyan-50/30 border border-slate-200 rounded-lg text-ink placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 focus:bg-cyan-50 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-cyan-50/30 border border-slate-200 rounded-lg text-ink placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 focus:bg-cyan-50 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-ink mb-2">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-cyan-50/30 border border-slate-200 rounded-lg text-ink placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 focus:bg-cyan-50 focus:ring-2 focus:ring-cyan-400/20 transition-all resize-none"
              placeholder="Tell us about your project..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary btn-large glow-effect disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Sending...
              </span>
            ) : (
              'Send Message'
            )}
          </button>

          {submitStatus === 'error' && (
            <div className="text-center text-red-500 text-sm">
              Something went wrong. Please try again or email us directly.
            </div>
          )}
        </form>
      )}
    </div>
  )
}
