'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function BuilderHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/95 backdrop-blur-md border-b border-dark-lighter">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
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
              <p className="text-xs text-text-gray">Website Builder</p>
            </div>
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
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

            {/* Exit to Home */}
            <Link
              href="/"
              className="flex items-center space-x-2 px-4 py-2 bg-dark-card hover:bg-dark-lighter border border-dark-lighter rounded-lg transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="hidden sm:inline text-sm">Exit</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
