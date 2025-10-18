'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

export default function Navigation() {
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [logoHovered, setLogoHovered] = useState(false)
  const [menuButtonHovered, setMenuButtonHovered] = useState(false)
  const [showDiscoveryHint, setShowDiscoveryHint] = useState(false)
  const [hintFadingOut, setHintFadingOut] = useState(false)
  const [hasSeenHint, setHasSeenHint] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 100
      setScrolled(isScrolled)

      // Show discovery hint on first scroll
      if (isScrolled && !hasSeenHint) {
        setShowDiscoveryHint(true)
        setHasSeenHint(true)

        // Start fade out after 2 seconds
        setTimeout(() => {
          setHintFadingOut(true)
          // Completely hide after fade animation completes
          setTimeout(() => {
            setShowDiscoveryHint(false)
            setHintFadingOut(false)
          }, 300) // Match fadeOut animation duration
        }, 2000)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasSeenHint])

  const scrollToSection = (sectionId: string) => {
    setMenuOpen(false)
    setMobileMenuOpen(false)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Logo with Menu - Desktop */}
      <div className="relative">
        <button
          onClick={() => scrolled && setMenuOpen(!menuOpen)}
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
          className={`hidden md:block fixed z-50 transition-all duration-500 ${
            scrolled || !isHomePage
              ? 'top-8 left-8 scale-[0.35] cursor-pointer hover:scale-[0.38] animate-pulse'
              : 'top-16 left-1/2 -translate-x-1/2 scale-100 cursor-default pointer-events-none'
          } ${logoHovered && scrolled ? 'drop-shadow-neon' : ''}`}
          aria-label={scrolled ? "Toggle menu" : "1Zero9 Studio"}
        >
          <div className={`transition-all duration-300 ${logoHovered && scrolled ? 'animate-pulse-glow' : ''}`}>
            <Image
              src="/images/109-logo-circle-white2.png"
              alt="1Zero9 Studio"
              width={250}
              height={250}
              priority
            />
          </div>
        </button>

        {/* Dropdown Menu - Desktop */}
        {(menuOpen || showDiscoveryHint) && scrolled && (
          <div className={`hidden md:block fixed top-16 left-48 z-40 bg-dark-card/95 backdrop-blur-md border border-dark-lighter rounded-xl shadow-2xl overflow-hidden ${
            hintFadingOut ? 'animate-fadeOut' : showDiscoveryHint && !menuOpen ? 'animate-fadeIn' : menuOpen ? 'animate-fadeIn' : ''
          }`}>
            <nav className="py-2">
              <button
                onClick={() => {
                  window.location.href = '/'
                  setMenuOpen(false)
                }}
                className="w-full px-6 py-3 text-left text-text-gray hover:text-white hover:bg-rocket-red/20 transition-all duration-300 flex items-center space-x-3 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-rocket-red/0 via-rocket-red/10 to-rocket-red/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="relative z-10">Home</span>
              </button>

              <button
                onClick={() => scrollToSection('about')}
                className="w-full px-6 py-3 text-left text-text-gray hover:text-white hover:bg-rocket-red/20 transition-all duration-300 flex items-center space-x-3 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-rocket-red/0 via-rocket-red/10 to-rocket-red/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="relative z-10">About</span>
              </button>

              <button
                onClick={() => scrollToSection('services')}
                className="w-full px-6 py-3 text-left text-text-gray hover:text-white hover:bg-rocket-red/20 transition-all duration-300 flex items-center space-x-3 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-rocket-red/0 via-rocket-red/10 to-rocket-red/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="relative z-10">Services</span>
              </button>

              <a
                href="/portfolio"
                className="block w-full px-6 py-3 text-left text-text-gray hover:text-white hover:bg-rocket-red/20 transition-all duration-300 flex items-center space-x-3 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-rocket-red/0 via-rocket-red/10 to-rocket-red/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="relative z-10">Portfolio</span>
              </a>

              <button
                onClick={() => scrollToSection('contact')}
                className="w-full px-6 py-3 text-left text-text-gray hover:text-white hover:bg-rocket-red/20 transition-all duration-300 flex items-center space-x-3 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-rocket-red/0 via-rocket-red/10 to-rocket-red/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="relative z-10">Contact</span>
              </button>
            </nav>
          </div>
        )}

        {/* Click outside to close */}
        {menuOpen && (
          <div
            className="fixed inset-0 z-30"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </div>

      {/* Mobile Logo (large centered when not scrolled on homepage) */}
      {isHomePage && (
        <div
          className={`md:hidden fixed z-40 transition-all duration-500 ${
            scrolled
              ? 'opacity-0 pointer-events-none scale-0'
              : 'top-16 left-1/2 -translate-x-1/2 scale-75 opacity-100'
          }`}
        >
          <Image
            src="/images/109-logo-circle-white2.png"
            alt="1Zero9 Studio"
            width={250}
            height={250}
            priority
          />
        </div>
      )}

      {/* Mobile Burger Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className={`md:hidden fixed top-4 left-4 z-50 bg-dark-card/95 backdrop-blur-sm border border-dark-lighter rounded-lg p-3 transition-all duration-300 ${
          scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
        aria-label="Toggle mobile menu"
      >
        <div className="w-6 h-5 relative flex flex-col justify-between">
          <span className={`block h-0.5 w-full bg-text-light transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block h-0.5 w-full bg-text-light transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block h-0.5 w-full bg-text-light transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </div>
      </button>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-dark-bg/95 backdrop-blur-md animate-fadeIn">
          <nav className="flex flex-col items-center justify-center h-full space-y-6">
            <a
              href="/"
              className="text-2xl text-text-gray hover:text-rocket-red transition-colors flex items-center space-x-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Home</span>
            </a>

            <button
              onClick={() => scrollToSection('about')}
              className="text-2xl text-text-gray hover:text-rocket-red transition-colors flex items-center space-x-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>About</span>
            </button>

            <button
              onClick={() => scrollToSection('services')}
              className="text-2xl text-text-gray hover:text-rocket-red transition-colors flex items-center space-x-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Services</span>
            </button>

            <a
              href="/portfolio"
              className="text-2xl text-text-gray hover:text-rocket-red transition-colors flex items-center space-x-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Portfolio</span>
            </a>

            <button
              onClick={() => scrollToSection('contact')}
              className="text-2xl text-text-gray hover:text-rocket-red transition-colors flex items-center space-x-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Contact</span>
            </button>
          </nav>
        </div>
      )}
    </>
  )
}
