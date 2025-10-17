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
    phone: '',
    company: '',
    message: '',
    projectType: 'website'
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
          phone: '',
          company: '',
          message: '',
          projectType: 'website'
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
    <div className="bg-dark-card/70 backdrop-blur-md border border-dark-lighter rounded-2xl p-6 md:p-8 shadow-2xl">
      {showCloseButton && onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-gray hover:text-text-light transition-colors"
          aria-label="Close form"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <div className="mb-6">
        <h3 className="text-2xl md:text-3xl font-bold text-text-light mb-2">Let's Launch Your Project</h3>
        <p className="text-text-gray">Fill out the form below and we'll get back to you within 24 hours.</p>
      </div>

      {submitStatus === 'success' ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h4 className="text-xl font-bold text-text-light mb-2">Message Sent! 🚀</h4>
          <p className="text-text-gray">We'll be in touch soon to discuss your project.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-light mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-bg border border-dark-lighter rounded-lg text-text-light placeholder-text-gray focus:outline-none focus:border-rocket-red transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-light mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-bg border border-dark-lighter rounded-lg text-text-light placeholder-text-gray focus:outline-none focus:border-rocket-red transition-colors"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-text-light mb-2">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-bg border border-dark-lighter rounded-lg text-text-light placeholder-text-gray focus:outline-none focus:border-rocket-red transition-colors"
                placeholder="+1 (234) 567-8900"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-text-light mb-2">
                Company
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-bg border border-dark-lighter rounded-lg text-text-light placeholder-text-gray focus:outline-none focus:border-rocket-red transition-colors"
                placeholder="Your Company"
              />
            </div>
          </div>

          <div>
            <label htmlFor="projectType" className="block text-sm font-medium text-text-light mb-2">
              Project Type *
            </label>
            <select
              id="projectType"
              name="projectType"
              required
              value={formData.projectType}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-bg border border-dark-lighter rounded-lg text-text-light focus:outline-none focus:border-rocket-red transition-colors"
            >
              <option value="website">Website Development</option>
              <option value="app">Mobile App</option>
              <option value="ecommerce">E-commerce</option>
              <option value="redesign">Website Redesign</option>
              <option value="maintenance">Maintenance & Support</option>
              <option value="consulting">Consulting</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-text-light mb-2">
              Project Details *
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-bg border border-dark-lighter rounded-lg text-text-light placeholder-text-gray focus:outline-none focus:border-rocket-red transition-colors resize-none"
              placeholder="Tell us about your project, timeline, and any specific requirements..."
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
              '🚀 Launch Your Project'
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
