'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
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
          <Image
            src="/images/109-black-bg-whitetext2.png"
            alt="1Zero9 Studio"
            width={400}
            height={200}
            className="max-w-md"
          />
        </div>
        
        {/* Cool Navigation */}
        <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between py-4">
              {/* Small logo in top left when navigated */}
              {showMainLogo && (
                <div className="flex items-center">
                  <Image
                    src="/images/109-black-bg-whitetext2.png"
                    alt="1Zero9 Studio"
                    width={120}
                    height={60}
                    className="mr-4"
                  />
                </div>
              )}
              
              {/* Main Navigation */}
              <div className="flex-1 flex justify-center">
                <div className="flex space-x-8">
                  <a
                    href="/"
                    className="relative text-white px-4 py-2 rounded-lg font-semibold hover:text-[#E72F2F] transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                  >
                    Home
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E72F2F] transition-all duration-300 group-hover:w-full"></span>
                  </a>
                  <a
                    href="/services"
                    className="relative text-white px-4 py-2 rounded-lg font-semibold hover:text-[#E72F2F] transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                  >
                    Services
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E72F2F] transition-all duration-300 group-hover:w-full"></span>
                  </a>
                  <a
                    href="/portfolio"
                    className="relative text-white px-4 py-2 rounded-lg font-semibold hover:text-[#E72F2F] transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                  >
                    Portfolio
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E72F2F] transition-all duration-300 group-hover:w-full"></span>
                  </a>
                  <a
                    href="/about"
                    className="relative text-white px-4 py-2 rounded-lg font-semibold hover:text-[#E72F2F] transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                  >
                    About
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E72F2F] transition-all duration-300 group-hover:w-full"></span>
                  </a>
                  <a
                    href="/contact"
                    className="relative text-white px-4 py-2 rounded-lg font-semibold hover:text-[#E72F2F] transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                  >
                    Contact
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E72F2F] transition-all duration-300 group-hover:w-full"></span>
                  </a>
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

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600 text-sm">
                © 2024 1Zero9 Studio. All rights reserved.
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">
                Professional web development & management
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
