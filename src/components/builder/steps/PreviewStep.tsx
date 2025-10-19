'use client'

import React, { useState } from 'react'
import { BuilderState } from '@/types/builder'

interface PreviewStepProps {
  state: BuilderState
  onEditStep: (step: number) => void
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile'

export default function PreviewStep({ state, onEditStep }: PreviewStepProps) {
  const [viewport, setViewport] = useState<ViewportSize>('desktop')

  const viewportStyles = {
    desktop: 'w-full h-full',
    tablet: 'w-[768px] h-[1024px] mx-auto',
    mobile: 'w-[375px] h-[667px] mx-auto',
  }

  // Apply user's color scheme or use defaults
  const colors = state.colorScheme || {
    primary: '#dc2626',
    secondary: '#0f172a',
    accent: '#fbbf24',
    background: '#ffffff',
    text: '#1a1a1a',
  }

  // Override with brand color if provided
  const primaryColor = state.userContent.primaryColor || colors.primary

  const typography = state.typography || {
    headingFont: 'Poppins',
    bodyFont: 'Inter',
    scale: 'medium' as const,
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header Controls */}
      <div className="sticky top-0 z-50 bg-dark-card border-b-2 border-dark-lighter">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-text-light">
                <span className="text-rocket-red">PREVIEW</span> YOUR SITE
              </h2>
              <p className="text-sm text-text-gray">See how your website will look</p>
            </div>

            {/* Viewport Toggles */}
            <div className="flex items-center gap-2 bg-dark-bg rounded-lg p-1">
              <button
                onClick={() => setViewport('desktop')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  viewport === 'desktop'
                    ? 'bg-rocket-red text-white'
                    : 'text-text-gray hover:text-text-light'
                }`}
                title="Desktop view"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewport('tablet')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  viewport === 'tablet'
                    ? 'bg-rocket-red text-white'
                    : 'text-text-gray hover:text-text-light'
                }`}
                title="Tablet view"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewport('mobile')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  viewport === 'mobile'
                    ? 'bg-rocket-red text-white'
                    : 'text-text-gray hover:text-text-light'
                }`}
                title="Mobile view"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Frame */}
      <div className="py-8 px-4 overflow-auto">
        <div
          className={`${viewportStyles[viewport]} bg-white rounded-xl shadow-2xl overflow-auto border-4 border-dark-lighter transition-all duration-300`}
          style={{
            minHeight: viewport === 'desktop' ? '600px' : undefined,
            maxHeight: viewport === 'desktop' ? 'none' : undefined,
          }}
        >
          {/* Rendered Preview */}
          <div style={{ fontFamily: typography.bodyFont }}>
            {/* Hero Section */}
            {state.selectedSections.some(s => s.type === 'hero' && s.enabled) && (
              <section
                className="relative py-20 px-6 text-center"
                style={{
                  backgroundColor: colors.background,
                  color: colors.text,
                  backgroundImage: `linear-gradient(135deg, ${colors.background} 0%, ${colors.secondary}20 100%)`,
                }}
              >
                {state.userContent.logo && (
                  <div className="mb-6 flex justify-center">
                    <img
                      src={state.userContent.logo}
                      alt="Logo"
                      className="h-16 object-contain"
                    />
                  </div>
                )}
                <h1
                  className="text-5xl font-black mb-4"
                  style={{
                    fontFamily: typography.headingFont,
                    color: primaryColor,
                  }}
                >
                  {state.userContent.businessName || 'Your Business Name'}
                </h1>
                <p className="text-xl mb-8" style={{ color: colors.text }}>
                  {state.userContent.tagline || 'Your amazing tagline goes here'}
                </p>
                <button
                  className="px-8 py-4 rounded-lg font-bold text-white transition-transform hover:scale-105"
                  style={{ backgroundColor: primaryColor }}
                >
                  Get Started
                </button>
              </section>
            )}

            {/* About Section */}
            {state.selectedSections.some(s => s.type === 'about' && s.enabled) && (
              <section className="py-16 px-6" style={{ backgroundColor: colors.secondary }}>
                <div className="max-w-4xl mx-auto text-center">
                  <h2
                    className="text-4xl font-black mb-6"
                    style={{
                      fontFamily: typography.headingFont,
                      color: primaryColor,
                    }}
                  >
                    About Us
                  </h2>
                  <p className="text-lg leading-relaxed" style={{ color: colors.text }}>
                    We're dedicated to delivering exceptional {state.siteType || 'services'} that exceed expectations.
                    Our team combines creativity with technical expertise to bring your vision to life.
                  </p>
                </div>
              </section>
            )}

            {/* Services Section */}
            {state.selectedSections.some(s => s.type === 'services' && s.enabled) && (
              <section className="py-16 px-6" style={{ backgroundColor: colors.background }}>
                <div className="max-w-6xl mx-auto">
                  <h2
                    className="text-4xl font-black mb-12 text-center"
                    style={{
                      fontFamily: typography.headingFont,
                      color: primaryColor,
                    }}
                  >
                    Our Services
                  </h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="p-6 rounded-xl border-2 transition-transform hover:scale-105"
                        style={{
                          borderColor: colors.accent,
                          backgroundColor: colors.secondary + '10',
                        }}
                      >
                        <div className="text-4xl mb-4" style={{ color: primaryColor }}>
                          ✨
                        </div>
                        <h3
                          className="text-xl font-bold mb-2"
                          style={{ fontFamily: typography.headingFont, color: colors.text }}
                        >
                          Service {i}
                        </h3>
                        <p style={{ color: colors.text + 'cc' }}>
                          Professional {state.siteType || 'service'} solutions tailored to your needs.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Portfolio/Gallery Section */}
            {state.selectedSections.some(s => (s.type === 'portfolio' || s.type === 'gallery') && s.enabled) && (
              <section className="py-16 px-6" style={{ backgroundColor: colors.secondary }}>
                <div className="max-w-6xl mx-auto">
                  <h2
                    className="text-4xl font-black mb-12 text-center"
                    style={{
                      fontFamily: typography.headingFont,
                      color: primaryColor,
                    }}
                  >
                    Our Work
                  </h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-xl"
                        style={{ backgroundColor: colors.accent + '30' }}
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Contact Section */}
            {state.selectedSections.some(s => s.type === 'contact' && s.enabled) && (
              <section className="py-16 px-6" style={{ backgroundColor: colors.background }}>
                <div className="max-w-2xl mx-auto text-center">
                  <h2
                    className="text-4xl font-black mb-6"
                    style={{
                      fontFamily: typography.headingFont,
                      color: primaryColor,
                    }}
                  >
                    Get In Touch
                  </h2>
                  {state.userContent.email && (
                    <p className="mb-2" style={{ color: colors.text }}>
                      📧 {state.userContent.email}
                    </p>
                  )}
                  {state.userContent.phone && (
                    <p className="mb-6" style={{ color: colors.text }}>
                      📞 {state.userContent.phone}
                    </p>
                  )}

                  {/* Social Links */}
                  {state.userContent.socialLinks && (
                    <div className="flex justify-center gap-4 mt-6">
                      {state.userContent.socialLinks.facebook && (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                          <span className="text-white">f</span>
                        </div>
                      )}
                      {state.userContent.socialLinks.instagram && (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                          <span className="text-white">📷</span>
                        </div>
                      )}
                      {state.userContent.socialLinks.twitter && (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                          <span className="text-white">🐦</span>
                        </div>
                      )}
                      {state.userContent.socialLinks.linkedin && (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                          <span className="text-white">in</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Footer */}
            <footer className="py-8 px-6 text-center text-sm" style={{ backgroundColor: colors.secondary, color: colors.text }}>
              <p>© 2025 {state.userContent.businessName || 'Your Business'}. All rights reserved.</p>
              <p className="mt-2 opacity-70">Built with 1Zero9 Studio</p>
            </footer>
          </div>
        </div>
      </div>

      {/* Quick Edit Panel */}
      <div className="fixed bottom-24 right-4 bg-dark-card border-2 border-dark-lighter rounded-xl p-4 shadow-2xl max-w-xs">
        <h3 className="text-lg font-bold text-text-light mb-3">Quick Edit</h3>
        <div className="space-y-2">
          <button
            onClick={() => onEditStep(1)}
            className="w-full text-left px-3 py-2 rounded-lg bg-dark-bg hover:bg-dark-lighter text-text-gray hover:text-text-light transition-colors text-sm"
          >
            ✏️ Edit Purpose
          </button>
          <button
            onClick={() => onEditStep(2)}
            className="w-full text-left px-3 py-2 rounded-lg bg-dark-bg hover:bg-dark-lighter text-text-gray hover:text-text-light transition-colors text-sm"
          >
            🎨 Edit Style
          </button>
          <button
            onClick={() => onEditStep(3)}
            className="w-full text-left px-3 py-2 rounded-lg bg-dark-bg hover:bg-dark-lighter text-text-gray hover:text-text-light transition-colors text-sm"
          >
            📋 Edit Sections
          </button>
          <button
            onClick={() => onEditStep(4)}
            className="w-full text-left px-3 py-2 rounded-lg bg-dark-bg hover:bg-dark-lighter text-text-gray hover:text-text-light transition-colors text-sm"
          >
            📝 Edit Content
          </button>
        </div>
      </div>
    </div>
  )
}
