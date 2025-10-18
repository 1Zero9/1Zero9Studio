'use client'

import React from 'react'
import Image from 'next/image'

interface WelcomeStepProps {
  onStart: () => void
}

export default function WelcomeStep({ onStart }: WelcomeStepProps) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-3xl text-center space-y-8 animate-fadeIn">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/images/109-logo-circle-white2.png"
            alt="1Zero9 Studio"
            width={120}
            height={120}
            className="animate-pulse"
          />
        </div>

        {/* Heading */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black">
            <span className="text-text-light">LET'S BUILD</span>
            <br />
            <span className="text-rocket-red">YOUR SITE</span>
          </h1>
          <p className="text-xl md:text-2xl text-text-gray max-w-2xl mx-auto leading-relaxed">
            In just a few steps, we'll help you design the perfect website for your business.
            No technical knowledge required.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-dark-card/50 backdrop-blur-sm border border-dark-lighter rounded-xl p-6 hover:bg-dark-card/70 transition-all duration-300">
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="text-lg font-bold text-text-light mb-2">Choose Your Style</h3>
            <p className="text-text-gray text-sm">
              Select from curated design themes that match your brand
            </p>
          </div>

          <div className="bg-dark-card/50 backdrop-blur-sm border border-dark-lighter rounded-xl p-6 hover:bg-dark-card/70 transition-all duration-300">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="text-lg font-bold text-text-light mb-2">See It Live</h3>
            <p className="text-text-gray text-sm">
              Preview your website in real-time as you make choices
            </p>
          </div>

          <div className="bg-dark-card/50 backdrop-blur-sm border border-dark-lighter rounded-xl p-6 hover:bg-dark-card/70 transition-all duration-300">
            <div className="text-4xl mb-3">🚀</div>
            <h3 className="text-lg font-bold text-text-light mb-2">Get Your Quote</h3>
            <p className="text-text-gray text-sm">
              Receive an instant estimate and project timeline
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-8">
          <button
            onClick={onStart}
            className="btn-primary btn-large glow-effect text-lg px-12 py-4 inline-flex items-center space-x-2"
          >
            <span>Start Building</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          <p className="text-text-gray text-sm mt-4">Takes less than 3 minutes</p>
        </div>
      </div>
    </div>
  )
}
