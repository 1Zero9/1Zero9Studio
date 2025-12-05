'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getBuilderVersion } from '@/lib/versions'
import { useBuilder } from '@/context/BuilderContext'

interface BuilderHeaderProps {
  currentStep?: number
  totalSteps?: number
  stepNames?: string[]
}

export default function BuilderHeader({ currentStep, totalSteps, stepNames }: BuilderHeaderProps) {
  const version = getBuilderVersion()
  const router = useRouter()
  const { state, resetBuilder } = useBuilder()
  const [showSessionBanner, setShowSessionBanner] = useState(false)
  const [hasSavedData, setHasSavedData] = useState(false)

  // Check for saved session on mount
  useEffect(() => {
    const saved = localStorage.getItem('builder-state')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.started) {
          setHasSavedData(true)
          setShowSessionBanner(true)
          // Auto-hide banner after 8 seconds
          setTimeout(() => setShowSessionBanner(false), 8000)
        }
      } catch (error) {
        console.error('Failed to check saved state:', error)
      }
    }
  }, [])

  const handleReset = () => {
    if (confirm('Are you sure you want to reset? This will clear all your progress.')) {
      // Clear all builder state
      resetBuilder()
      setHasSavedData(false)
      setShowSessionBanner(false)
      console.log('🔄 Builder reset - returning to start')
    }
  }

  const handleHomeClick = () => {
    router.push('/')
  }

  return (
    <div>
      {/* Session Restoration Banner */}
      {showSessionBanner && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-accent/90 to-rocket-red/90 backdrop-blur-md shadow-lg animate-fadeIn">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Welcome Back!</p>
                  <p className="text-white/90 text-xs">Continuing from your previous session...</p>
                </div>
              </div>
              <button
                onClick={() => setShowSessionBanner(false)}
                className="text-white/80 hover:text-white transition-colors p-1"
                aria-label="Close banner"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <header className={`fixed left-0 right-0 z-50 bg-dark-bg/95 backdrop-blur-md border-b border-dark-lighter transition-all duration-300 ${showSessionBanner ? 'top-[52px]' : 'top-0'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand - Links to main site */}
          <Link href="/" className="flex items-center space-x-3 group">
            <Image
              src="/images/109-logo-circle-white2.png"
              alt="1Zero9 Studio"
              width={40}
              height={40}
              className="group-hover:scale-110 transition-transform duration-300"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-text-light group-hover:text-rocket-red transition-colors">
                1Zero9 Studio
              </h1>
              <p className="text-xs text-text-gray">Vision Studio <span className="text-rocket-red/70">v{version}</span></p>
            </div>
          </Link>

          {/* Step Indicator */}
          {currentStep !== undefined && totalSteps && (
            <div className="hidden md:flex items-center space-x-2">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                <React.Fragment key={step}>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all duration-300 ${
                    step < currentStep
                      ? 'bg-accent text-dark-bg'
                      : step === currentStep
                      ? 'bg-rocket-red text-white ring-2 ring-rocket-red/50 ring-offset-2 ring-offset-dark-bg'
                      : 'bg-dark-card text-text-gray border border-dark-lighter'
                  }`}>
                    {step}
                  </div>
                  {step < totalSteps && (
                    <div className={`w-8 h-0.5 transition-all duration-300 ${
                      step < currentStep ? 'bg-accent' : 'bg-dark-lighter'
                    }`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            {/* Home Button */}
            <Link
              href="/"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-dark-card hover:bg-dark-lighter border border-dark-lighter hover:border-[var(--nova-red)]/30 text-text-gray hover:text-white transition-all duration-300"
              title="Return to home page"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="hidden sm:inline text-sm font-semibold">Home</span>
            </Link>

            {/* Save Progress (if user has started) */}
            <button className="hidden md:flex items-center space-x-2 px-4 py-2 text-text-gray hover:text-text-light transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              <span className="text-sm">Auto-saved</span>
            </button>

            {/* Help */}
            <button className="p-2 text-text-gray hover:text-text-light transition-colors" aria-label="Help">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            {/* Reset Builder */}
            <button
              onClick={handleReset}
              className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                hasSavedData
                  ? 'bg-accent/20 border-2 border-accent text-accent hover:bg-accent hover:text-dark-bg shadow-lg shadow-accent/30 animate-pulse'
                  : 'bg-dark-card hover:bg-dark-lighter border border-dark-lighter hover:border-accent/30 text-text-gray hover:text-text-light'
              }`}
              title={hasSavedData ? "Reset and start fresh" : "Reset builder"}
            >
              {hasSavedData && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-ping"></span>
              )}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden sm:inline text-sm font-semibold">Reset</span>
            </button>
          </div>
        </div>
      </div>
    </header>
    </div>
  )
}
