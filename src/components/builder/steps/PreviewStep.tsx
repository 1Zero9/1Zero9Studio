'use client'

import React, { useState, useEffect } from 'react'
import { BuilderState } from '@/types/builder'

interface PreviewStepProps {
  state: BuilderState
  onEditStep: (step: number) => void
}

const TECH_STACK = [
  { name: 'Next.js 15', color: 'green' },
  { name: 'React 19', color: 'blue' },
  { name: 'Claude AI', color: 'purple' },
  { name: 'Supabase', color: 'green' },
  { name: 'PostgreSQL', color: 'blue' },
  { name: 'Vercel Edge', color: 'purple' },
  { name: 'TypeScript', color: 'blue' },
  { name: 'Tailwind CSS', color: 'green' },
]

export default function PreviewStep({ state, onEditStep }: PreviewStepProps) {
  const [activeArrows, setActiveArrows] = useState<Set<number>>(new Set())

  // Animate arrows
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveArrows(prev => {
        const newSet = new Set<number>()
        // Randomly activate 2-3 arrows
        const numArrows = Math.floor(Math.random() * 2) + 2
        for (let i = 0; i < numArrows; i++) {
          const randomIndex = Math.floor(Math.random() * (TECH_STACK.length - 1))
          newSet.add(randomIndex)
        }
        return newSet
      })
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Main CTA */}
        <div className="text-center mb-8 animate-fadeIn">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            <span className="text-text-light">YOU'RE </span>
            <span className="text-rocket-red">ALMOST DONE!</span>
          </h2>
          <p className="text-lg text-text-gray max-w-2xl mx-auto">
            Click <strong className="text-accent">Next</strong> to submit your project details and we'll contact you within 24 hours
          </p>
        </div>

        {/* Tech Stack Visualization */}
        <div className="mb-8 bg-black/40 backdrop-blur-sm border-2 border-green-500/20 rounded-xl p-6">
          <div className="text-center mb-4">
            <p className="text-sm text-green-400 font-mono font-bold">ENTERPRISE TECHNOLOGY STACK</p>
            <p className="text-xs text-text-gray mt-1">Your site will be built with professional-grade tools</p>
          </div>

          {/* Tech Stack Flow - 2 Columns on larger screens */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="flex flex-col gap-2">
              {TECH_STACK.slice(0, 4).map((tech, index) => (
                <div key={index} className="flex flex-col">
                  {/* Tech Box */}
                  <div className={`px-4 py-2 bg-green-500/10 border-2 border-green-500/30 rounded-lg ${
                    activeArrows.has(index) || activeArrows.has(index - 1) ? 'animate-pulse' : ''
                  }`}>
                    <p className="text-sm text-green-400 font-mono text-center font-semibold">
                      {tech.name}
                    </p>
                  </div>

                  {/* Animated Arrow */}
                  {index < 3 && (
                    <div className="flex justify-center py-1">
                      <svg className={`w-6 h-6 transition-all duration-300 ${
                        activeArrows.has(index)
                          ? 'text-green-400 animate-bounce'
                          : 'text-green-500/30'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-2">
              {TECH_STACK.slice(4, 8).map((tech, index) => (
                <div key={index + 4} className="flex flex-col">
                  {/* Tech Box */}
                  <div className={`px-4 py-2 bg-green-500/10 border-2 border-green-500/30 rounded-lg ${
                    activeArrows.has(index + 4) || activeArrows.has(index + 3) ? 'animate-pulse' : ''
                  }`}>
                    <p className="text-sm text-green-400 font-mono text-center font-semibold">
                      {tech.name}
                    </p>
                  </div>

                  {/* Animated Arrow */}
                  {index < 3 && (
                    <div className="flex justify-center py-1">
                      <svg className={`w-6 h-6 transition-all duration-300 ${
                        activeArrows.has(index + 4)
                          ? 'text-green-400 animate-bounce'
                          : 'text-green-500/30'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-text-gray">Professional-grade • Scalable • Secure • Fast</p>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-dark-card border-2 border-dark-lighter rounded-xl">
            <h4 className="text-sm font-bold text-text-light mb-2">Your Project</h4>
            <ul className="text-xs text-text-gray space-y-1">
              <li>• {state.siteType || 'Business'} website</li>
              <li>• {state.designStyle || 'Modern'} design style</li>
              <li>• {state.selectedSections.filter(s => s.enabled).length} sections</li>
            </ul>
          </div>

          <div className="p-4 bg-gradient-to-br from-rocket-red/10 to-accent/10 border-2 border-rocket-red/30 rounded-xl">
            <h4 className="text-sm font-bold text-text-light mb-2">What Happens Next?</h4>
            <ul className="text-xs text-text-gray space-y-1">
              <li>• Submit your contact info</li>
              <li>• We'll reach out in 24hrs</li>
              <li>• Your site built in 7-14 days</li>
            </ul>
          </div>
        </div>

        {/* Quick Edit Panel */}
        <div className="bg-dark-card border-2 border-dark-lighter rounded-xl p-4">
          <h3 className="text-base font-bold text-text-light mb-3">Need to Change Something?</h3>
          <div className="space-y-2">
            <button
              onClick={() => onEditStep(1)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-bg hover:bg-dark-lighter text-text-gray hover:text-text-light transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edit Purpose</span>
            </button>
            <button
              onClick={() => onEditStep(2)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-bg hover:bg-dark-lighter text-text-gray hover:text-text-light transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              <span>Edit Style</span>
            </button>
            <button
              onClick={() => onEditStep(3)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-bg hover:bg-dark-lighter text-text-gray hover:text-text-light transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span>Edit Sections</span>
            </button>
            <button
              onClick={() => onEditStep(4)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-bg hover:bg-dark-lighter text-text-gray hover:text-text-light transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span>Edit Content</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
