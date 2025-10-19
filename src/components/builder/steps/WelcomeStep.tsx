'use client'

import React from 'react'
import Image from 'next/image'

interface WelcomeStepProps {
  onStart: () => void
}

export default function WelcomeStep({ onStart }: WelcomeStepProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-6xl w-full space-y-6 animate-fadeIn">

        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-3">
            <div className="relative">
              <Image
                src="/images/109-logo-circle-white2.png"
                alt="1Zero9 Studio"
                width={80}
                height={80}
                className="drop-shadow-2xl"
              />
              <div className="absolute inset-0 bg-rocket-red/20 blur-3xl -z-10"></div>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-black leading-tight">
            <span className="text-text-light">VISUALIZE YOUR</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rocket-red to-rocket-red">
              DREAM WEBSITE
            </span>
          </h1>

          <p className="text-base md:text-lg text-text-gray max-w-2xl mx-auto">
            Plan and visualize your perfect website with our Vision Studio.
            1Zero9's team will then build it for you using cutting-edge AI development.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 text-xs md:text-sm text-text-gray pt-2">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Under 3 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>NOVA AI Guidance</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Visual Mockups</span>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-br from-dark-card to-dark-bg border-2 border-dark-lighter rounded-2xl p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-black text-center mb-5">
            <span className="text-text-light">HOW </span>
            <span className="text-rocket-red">IT WORKS</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-dark-bg/50 border border-dark-lighter/50 hover:border-rocket-red/30 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-rocket-red/20 flex items-center justify-center border-2 border-rocket-red mb-3">
                <span className="text-lg font-bold text-rocket-red">1</span>
              </div>
              <h3 className="text-base font-bold text-text-light mb-1">Share Your Vision</h3>
              <p className="text-xs text-text-gray">
                Tell us what you need with NOVA AI
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-dark-bg/50 border border-dark-lighter/50 hover:border-rocket-red/30 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-rocket-red/20 flex items-center justify-center border-2 border-rocket-red mb-3">
                <span className="text-lg font-bold text-rocket-red">2</span>
              </div>
              <h3 className="text-base font-bold text-text-light mb-1">Visualize Design</h3>
              <p className="text-xs text-text-gray">
                Preview styles, colors, and layouts
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-dark-bg/50 border border-dark-lighter/50 hover:border-rocket-red/30 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-rocket-red/20 flex items-center justify-center border-2 border-rocket-red mb-3">
                <span className="text-lg font-bold text-rocket-red">3</span>
              </div>
              <h3 className="text-base font-bold text-text-light mb-1">Submit Your Plan</h3>
              <p className="text-xs text-text-gray">
                Send your vision to our team
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-dark-bg/50 border border-dark-lighter/50 hover:border-rocket-red/30 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-rocket-red/20 flex items-center justify-center border-2 border-rocket-red mb-3">
                <span className="text-lg font-bold text-rocket-red">4</span>
              </div>
              <h3 className="text-base font-bold text-text-light mb-1">We Build It</h3>
              <p className="text-xs text-text-gray">
                Expert team brings it to life
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-3 pt-2">
          <button
            onClick={onStart}
            className="group relative bg-gradient-to-r from-rocket-red to-rocket-red/90 text-white font-bold text-lg md:text-xl px-10 py-4 rounded-xl
              hover:from-rocket-red/90 hover:to-rocket-red transition-all duration-300
              shadow-2xl shadow-rocket-red/30 hover:shadow-rocket-red/50 hover:scale-105
              inline-flex items-center gap-3"
          >
            <span>Start Planning Now</span>
            <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          <p className="text-text-gray text-xs md:text-sm">
            Join <span className="text-rocket-red font-semibold">300+</span> businesses who've trusted 1Zero9 Studio
          </p>
        </div>

      </div>
    </div>
  )
}
