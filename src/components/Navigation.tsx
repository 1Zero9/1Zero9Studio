'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'About', href: '/about' },
]

export default function Navigation() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close the mobile drawer when navigating
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const isLinkActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    if (href.startsWith('/#')) {
      return pathname === '/'
    }
    return pathname === href
  }

  const renderLinks = (isMobile = false) => (
    <div className={`${isMobile ? 'flex flex-col gap-4' : 'flex items-center gap-6 whitespace-nowrap'}`}>
      {navLinks.map(link => {
        const active = isLinkActive(link.href)
        return (
          <Link
            key={link.label}
            href={link.href}
            onClick={() => isMobile && setMenuOpen(false)}
            className={`rounded-full px-5 py-2 text-[0.7rem] uppercase tracking-[0.32em] transition-all duration-200 border ${
              active
                ? 'bg-[var(--nova-red)] text-white border-[var(--nova-red)]/30 shadow-[0_10px_30px_rgba(255,77,92,0.45)]'
                : 'text-text-gray border-transparent hover:text-white hover:bg-white/10 hover:border-white/20'
            }`}
          >
            {link.label}
          </Link>
        )
      })}
    </div>
  )

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
          : ''
      }`}
      style={{
        background: scrolled
          ? 'linear-gradient(135deg, rgba(107, 31, 63, 0.95) 0%, rgba(74, 21, 41, 0.95) 45%, rgba(42, 26, 62, 0.95) 75%, rgba(26, 20, 50, 0.95) 100%)'
          : 'linear-gradient(135deg, #6b1f3f 0%, #4a1529 45%, #2a1a3e 75%, #1a1432 100%)',
      }}
    >
      <div className="container-custom flex items-center justify-between gap-6 h-20">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/109-logo-circle-white2.png"
            alt="1Zero9 Studio logo"
            width={48}
            height={48}
            priority
            className="rounded-full border border-white/15 shadow-lg"
          />
          <div className="leading-tight">
            <span className="block text-[0.6rem] tracking-[0.6em] uppercase text-white/60">
              Studio
            </span>
            <span className="logo-title text-2xl text-white">1Zero9</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {renderLinks()}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/contact"
            className="rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2 text-sm font-semibold text-white hover:from-cyan-300 hover:to-blue-400 transition-all duration-250 shadow-lg shadow-cyan-500/40 hover:shadow-cyan-500/60 hover:scale-105"
          >
            Let's Talk
          </Link>
          <Link
            href="/builder"
            className="rounded-full bg-[var(--nova-red)] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-[var(--nova-red)]/30 hover:shadow-[var(--nova-red)]/50 transition-all duration-250"
          >
            Launch Builder
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen(prev => !prev)}
          className="md:hidden rounded-full border border-white/30 p-2 text-white transition-all duration-200 active:scale-95 hover:bg-white/10 backdrop-blur-sm"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
          }}
          aria-label="Toggle navigation menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div
          className="md:hidden border-t border-white/10 px-6 py-6 backdrop-blur-xl"
          style={{
            background: 'linear-gradient(180deg, rgba(74, 21, 41, 0.98) 0%, rgba(42, 26, 62, 0.98) 100%)',
          }}
        >
          {renderLinks(true)}
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-center text-sm font-semibold text-white hover:from-cyan-300 hover:to-blue-400 transition-all duration-250 shadow-lg shadow-cyan-500/40"
            >
              Let's Talk
            </Link>
            <Link
              href="/builder"
              className="rounded-full bg-[var(--nova-red)] px-5 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-[var(--nova-red)]/30 hover:shadow-[var(--nova-red)]/50 transition-all duration-250"
            >
              Launch Builder
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
