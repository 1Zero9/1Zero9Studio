'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BuilderState } from '@/types/builder'

interface SubmitStepProps {
  contactInfo: BuilderState['contactInfo']
  builderState: BuilderState
  onUpdateContact: (contact: Partial<BuilderState['contactInfo']>) => void
}

type SubmitState = 'form' | 'submitting' | 'success' | 'error'

export default function SubmitStep({ contactInfo, builderState, onUpdateContact }: SubmitStepProps) {
  const [submitState, setSubmitState] = useState<SubmitState>('form')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [designId, setDesignId] = useState<string | null>(null)
  const router = useRouter()

  const handleInputChange = (field: keyof BuilderState['contactInfo'], value: string) => {
    onUpdateContact({ [field]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!contactInfo.name || !contactInfo.email || !agreedToTerms) {
      return
    }

    setSubmitState('submitting')
    setErrorMessage(null)

    try {
      // Call our API to save the design
      const response = await fetch('/api/save-design', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          state: builderState,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save design')
      }

      // Success!
      setDesignId(data.id)
      setSubmitState('success')

      // Clean up builder state after successful submission
      // This will be done after showing success message
      setTimeout(() => {
        localStorage.removeItem('builder-state')
        console.log('✅ Design submitted - builder state cleared')
      }, 5000) // Give user time to see success message

    } catch (error: any) {
      console.error('Submission error:', error)
      setErrorMessage(error.message || 'Something went wrong. Please try again.')
      setSubmitState('error')
    }
  }

  const handleReturnHome = () => {
    // Clear builder state
    localStorage.removeItem('builder-state')
    console.log('🏠 Returning home - builder state cleared')
    router.push('/')
  }

  const isFormValid = !!contactInfo.name && !!contactInfo.email && agreedToTerms

  if (submitState === 'success') {
    return (
      <div className="min-h-[600px] flex items-center justify-center px-4 py-8">
        <div className="max-w-2xl w-full text-center animate-fadeIn">
          {/* Success Animation */}
          <div className="mb-8 relative">
            <div className="w-32 h-32 mx-auto bg-green-500/20 rounded-full flex items-center justify-center animate-pulse">
              <div className="w-24 h-24 bg-green-500/30 rounded-full flex items-center justify-center">
                <svg className="w-16 h-16 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <h2 className="text-5xl font-black mb-4">
            <span className="text-text-light">SUBMISSION </span>
            <span className="text-rocket-red">COMPLETE!</span>
          </h2>

          <p className="text-xl text-text-gray mb-8">
            Thank you for using 1Zero9 Studio's Website Builder!
          </p>

          <div className="bg-dark-card border-2 border-dark-lighter rounded-xl p-8 mb-8 text-left">
            <h3 className="text-2xl font-bold text-text-light mb-4">What Happens Next?</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-rocket-red/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-rocket-red font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-bold text-text-light mb-1">We'll Review Your Design</h4>
                  <p className="text-sm text-text-gray">
                    Our team will carefully review all your selections and prepare a detailed proposal.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-rocket-red/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-rocket-red font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-bold text-text-light mb-1">You'll Receive a Quote</h4>
                  <p className="text-sm text-text-gray">
                    Within 24-48 hours, we'll email you a customized quote and timeline.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-rocket-red/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-rocket-red font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-bold text-text-light mb-1">Let's Build Together</h4>
                  <p className="text-sm text-text-gray">
                    Once approved, we'll start bringing your vision to life!
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-rocket-red/10 to-accent/10 border border-rocket-red/30 rounded-xl p-6 mb-8">
            <p className="text-text-light mb-2">
              <span className="font-bold">Check your email:</span> {contactInfo.email}
            </p>
            <p className="text-sm text-text-gray">
              We've sent a confirmation with your design summary and next steps.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleReturnHome}
              className="px-8 py-4 bg-rocket-red text-white rounded-lg font-bold hover:bg-rocket-red/90 transition-all hover:scale-105"
            >
              Return to Home
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('builder-state')
                window.location.reload()
              }}
              className="px-8 py-4 bg-dark-card border-2 border-dark-lighter text-text-light rounded-lg font-bold hover:border-rocket-red/50 transition-all"
            >
              Start New Project
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-12 space-y-4 animate-fadeIn">
        <h2 className="text-4xl md:text-5xl font-black">
          <span className="text-text-light">ALMOST </span>
          <span className="text-rocket-red">DONE!</span>
        </h2>
        <p className="text-lg md:text-xl text-text-gray max-w-2xl mx-auto">
          Just a few more details and we'll get started on your project
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Contact Information */}
        <div className="bg-dark-card border-2 border-dark-lighter rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-text-light flex items-center gap-2">
            <span className="text-2xl">👤</span>
            Your Contact Information
          </h3>

          {/* Name */}
          <div>
            <label className="block text-text-light font-semibold mb-2">
              Full Name <span className="text-rocket-red">*</span>
            </label>
            <input
              type="text"
              value={contactInfo.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-lighter rounded-lg text-text-light placeholder:text-text-gray/50 focus:outline-none focus:border-rocket-red transition-colors"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-text-light font-semibold mb-2">
              Email Address <span className="text-rocket-red">*</span>
            </label>
            <input
              type="email"
              value={contactInfo.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="john@example.com"
              className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-lighter rounded-lg text-text-light placeholder:text-text-gray/50 focus:outline-none focus:border-rocket-red transition-colors"
              required
            />
            <p className="text-xs text-text-gray/70 mt-1">
              We'll send your quote and project details to this email
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-text-light font-semibold mb-2">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              value={contactInfo.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-lighter rounded-lg text-text-light placeholder:text-text-gray/50 focus:outline-none focus:border-rocket-red transition-colors"
            />
          </div>

          {/* Preferred Contact */}
          <div>
            <label className="block text-text-light font-semibold mb-2">
              Preferred Contact Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleInputChange('preferredContact', 'email')}
                className={`px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                  contactInfo.preferredContact === 'email'
                    ? 'bg-rocket-red text-white'
                    : 'bg-dark-bg text-text-gray hover:bg-dark-lighter'
                }`}
              >
                📧 Email
              </button>
              <button
                type="button"
                onClick={() => handleInputChange('preferredContact', 'phone')}
                className={`px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                  contactInfo.preferredContact === 'phone'
                    ? 'bg-rocket-red text-white'
                    : 'bg-dark-bg text-text-gray hover:bg-dark-lighter'
                }`}
              >
                📞 Phone
              </button>
              <button
                type="button"
                onClick={() => handleInputChange('preferredContact', 'either')}
                className={`px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                  contactInfo.preferredContact === 'either'
                    ? 'bg-rocket-red text-white'
                    : 'bg-dark-bg text-text-gray hover:bg-dark-lighter'
                }`}
              >
                ✅ Either
              </button>
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="bg-dark-card border-2 border-dark-lighter rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-text-light flex items-center gap-2">
            <span className="text-2xl">💭</span>
            Additional Notes (Optional)
          </h3>

          <div>
            <label className="block text-text-light font-semibold mb-2">
              Anything else we should know?
            </label>
            <textarea
              value={contactInfo.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Timeline expectations, budget range, special requirements, etc."
              className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-lighter rounded-lg text-text-light placeholder:text-text-gray/50 focus:outline-none focus:border-rocket-red transition-colors resize-none"
              rows={4}
            />
          </div>
        </div>

        {/* Terms & Submit */}
        <div className="bg-dark-card border-2 border-dark-lighter rounded-xl p-6 space-y-6">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-2 border-dark-lighter bg-dark-bg checked:bg-rocket-red checked:border-rocket-red cursor-pointer"
            />
            <label htmlFor="terms" className="text-sm text-text-gray cursor-pointer">
              I agree to receive communications from 1Zero9 Studio regarding my project. We respect your privacy and will never share your information with third parties.
            </label>
          </div>

          <button
            type="submit"
            disabled={!isFormValid || submitState === 'submitting'}
            className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
              isFormValid && submitState !== 'submitting'
                ? 'bg-rocket-red text-white hover:bg-rocket-red/90 hover:scale-[1.02] cursor-pointer'
                : 'bg-dark-lighter text-text-gray/50 cursor-not-allowed'
            }`}
          >
            {submitState === 'submitting' ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Submitting Your Design...
              </span>
            ) : (
              '🚀 Submit My Project'
            )}
          </button>
        </div>

        {/* Error State */}
        {submitState === 'error' && errorMessage && (
          <div className="bg-red-500/10 border-2 border-red-500/50 rounded-xl p-6 flex items-start gap-4 animate-fadeIn">
            <div className="text-3xl">❌</div>
            <div className="flex-1">
              <h4 className="font-bold text-red-400 mb-1">Submission Failed</h4>
              <p className="text-sm text-text-gray mb-3">{errorMessage}</p>
              <button
                onClick={() => setSubmitState('form')}
                className="text-sm text-rocket-red hover:text-rocket-red/80 font-medium"
              >
                Try again →
              </button>
            </div>
          </div>
        )}

        {/* Validation Feedback */}
        {!isFormValid && submitState === 'form' && (
          <div className="bg-yellow-500/10 border-2 border-yellow-500/50 rounded-xl p-6 flex items-start gap-4 animate-fadeIn">
            <div className="text-3xl">⚠️</div>
            <div>
              <h4 className="font-bold text-yellow-400 mb-1">Required fields missing</h4>
              <ul className="text-sm text-text-gray space-y-1">
                {!contactInfo.name && <li>• Please enter your full name</li>}
                {!contactInfo.email && <li>• Please enter your email address</li>}
                {!agreedToTerms && <li>• Please agree to receive communications</li>}
              </ul>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
