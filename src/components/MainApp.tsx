'use client'

import { useState, useEffect } from 'react'
import LandingPage from './LandingPage'

export default function MainApp({ children }: { children: React.ReactNode }) {
  const [showLanding, setShowLanding] = useState(true)
  const [showMainLogo, setShowMainLogo] = useState(false)

  const handleLandingComplete = () => {
    setShowLanding(false)
    setShowMainLogo(true)
  }

  useEffect(() => {
    // Check if we should show landing (only on first visit)
    const hasVisited = sessionStorage.getItem('hasVisitedLanding')
    if (hasVisited) {
      setShowLanding(false)
      setShowMainLogo(true)
    }
  }, [])

  useEffect(() => {
    if (!showLanding) {
      sessionStorage.setItem('hasVisitedLanding', 'true')
    }
  }, [showLanding])

  if (showLanding) {
    return <LandingPage onComplete={handleLandingComplete} />
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main Logo and Navigation */}
      <header className="relative">
        {/* Main Logo Section */}
        <div className="bg-white flex items-center justify-center py-12">
          <div className="flex items-center gap-4">
            <svg className="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              1Zero9 Studio
            </h1>
          </div>
        </div>
        
        {/* Clean Navigation */}
        <nav className="bg-gray-900 shadow-sm border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between py-4">
              {/* Small logo in top left when navigated */}
              {showMainLogo && (
                <div className="flex items-center">
                  <svg className="w-8 h-8 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  <h2 className="text-xl font-bold text-white">
                    1Zero9 Studio
                  </h2>
                </div>
              )}
              
              {/* Main Navigation */}
              <div className="flex-1 flex justify-center">
                <div className="flex space-x-8">
                  {[
                    { href: '/', label: 'Home' },
                    { href: '/services', label: 'Services' },
                    { href: '/portfolio', label: 'Portfolio' },
                    { href: '/about', label: 'About' },
                    { href: '/contact', label: 'Contact' }
                  ].map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="text-white hover:text-red-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="bg-white">
        {children}
      </main>

      {/* Clean Footer */}
      <footer className="bg-gray-900 text-white border-t border-gray-700">
        <div className="max-w-6xl mx-auto py-12 px-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center lg:items-start">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                <h3 className="text-2xl font-bold text-white">
                  1Zero9 Studio
                </h3>
              </div>
              <p className="text-gray-300 text-center lg:text-left max-w-md">
                Professional web development & management solutions for modern businesses.
              </p>
            </div>
            
            <div className="flex flex-col items-center lg:items-end gap-4">
              <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-400">
                <span>Professional Design</span>
                <span>Expert Development</span>
                <span>Ongoing Support</span>
              </div>
              
              <p className="text-gray-500 text-sm text-center">
                © 2024 1Zero9 Studio. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
