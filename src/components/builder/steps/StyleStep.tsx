'use client'

import React, { useState } from 'react'
import { DesignStyle, ColorScheme, Typography, COLOR_SCHEMES, TYPOGRAPHY_PRESETS } from '@/types/builder'

interface StyleStepProps {
  selectedStyle: DesignStyle | null
  selectedColorScheme: ColorScheme | null
  selectedTypography: Typography | null
  onSelectStyle: (style: DesignStyle) => void
  onSelectColorScheme: (scheme: ColorScheme) => void
  onSelectTypography: (typography: Typography) => void
}

const DESIGN_STYLES = [
  {
    style: 'minimalist' as DesignStyle,
    name: 'Minimalist',
    description: 'Clean, simple, and elegant with plenty of white space',
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 12a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z" />
      </svg>
    ),
    mood: 'Professional, Modern, Sophisticated',
  },
  {
    style: 'bold' as DesignStyle,
    name: 'Bold',
    description: 'Eye-catching colors and dramatic contrasts that demand attention',
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    mood: 'Energetic, Vibrant, Confident',
  },
  {
    style: 'futuristic' as DesignStyle,
    name: 'Futuristic',
    description: 'Tech-forward design with neon accents and modern aesthetics',
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    mood: 'Innovative, Cutting-edge, Dynamic',
  },
  {
    style: 'classic' as DesignStyle,
    name: 'Classic',
    description: 'Timeless elegance with traditional typography and warm tones',
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    mood: 'Trustworthy, Established, Refined',
  },
]

export default function StyleStep({
  selectedStyle,
  selectedColorScheme,
  selectedTypography,
  onSelectStyle,
  onSelectColorScheme,
  onSelectTypography,
}: StyleStepProps) {
  const [activeTab, setActiveTab] = useState<'style' | 'colors' | 'typography'>('style')

  const handleStyleSelect = (style: DesignStyle) => {
    onSelectStyle(style)
    // Auto-select first color scheme and typography for this style
    const schemes = COLOR_SCHEMES[style]
    const typos = TYPOGRAPHY_PRESETS[style]
    if (schemes && schemes[0]) {
      const { name, ...schemeWithoutName } = schemes[0]
      onSelectColorScheme(schemeWithoutName)
    }
    if (typos && typos[0]) {
      const { name, ...typoWithoutName } = typos[0]
      onSelectTypography(typoWithoutName)
    }
    // Move to colors tab
    setActiveTab('colors')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12 space-y-4 animate-fadeIn">
        <h2 className="text-4xl md:text-5xl font-black">
          <span className="text-text-light">DESIGN </span>
          <span className="text-rocket-red">PREFERENCES</span>
        </h2>
        <p className="text-lg md:text-xl text-text-gray max-w-2xl mx-auto">
          Help our team understand your aesthetic vision
        </p>

        {/* Clarification Banner */}
        <div className="mt-6 p-4 bg-dark-card border-2 border-dark-lighter rounded-xl max-w-3xl mx-auto">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-text-gray text-left">
              These preferences guide our designers as they build your site. You'll work directly with our team to refine the final design during development.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8 space-x-2">
        <button
          onClick={() => setActiveTab('style')}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
            activeTab === 'style'
              ? 'bg-rocket-red text-white'
              : 'bg-dark-card text-text-gray hover:bg-dark-card/70'
          }`}
        >
          Design Style
        </button>
        <button
          onClick={() => setActiveTab('colors')}
          disabled={!selectedStyle}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
            activeTab === 'colors'
              ? 'bg-rocket-red text-white'
              : !selectedStyle
              ? 'bg-dark-card/50 text-text-gray/50 cursor-not-allowed'
              : 'bg-dark-card text-text-gray hover:bg-dark-card/70'
          }`}
        >
          Colors
        </button>
        <button
          onClick={() => setActiveTab('typography')}
          disabled={!selectedStyle}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
            activeTab === 'typography'
              ? 'bg-rocket-red text-white'
              : !selectedStyle
              ? 'bg-dark-card/50 text-text-gray/50 cursor-not-allowed'
              : 'bg-dark-card text-text-gray hover:bg-dark-card/70'
          }`}
        >
          Typography
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* Design Style Tab */}
        {activeTab === 'style' && (
          <div className="grid md:grid-cols-2 gap-6 animate-fadeIn">
            {DESIGN_STYLES.map((designStyle) => (
              <button
                key={designStyle.style}
                onClick={() => handleStyleSelect(designStyle.style)}
                className={`text-left p-6 rounded-xl border-2 transition-all duration-300 group hover:scale-105 ${
                  selectedStyle === designStyle.style
                    ? 'border-rocket-red bg-rocket-red/10 shadow-lg shadow-rocket-red/20'
                    : 'border-dark-lighter bg-dark-card/50 hover:border-rocket-red/50 hover:bg-dark-card/70'
                }`}
              >
                <div className="space-y-4">
                  <div className={`transition-colors ${
                    selectedStyle === designStyle.style
                      ? 'text-rocket-red'
                      : 'text-text-gray group-hover:text-rocket-red'
                  }`}>
                    {designStyle.icon}
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-text-light mb-2 group-hover:text-rocket-red transition-colors">
                      {designStyle.name}
                    </h3>
                    <p className="text-text-gray mb-3 leading-relaxed">
                      {designStyle.description}
                    </p>
                    <div className="inline-block bg-dark-bg/50 px-3 py-1 rounded-full text-xs text-text-gray">
                      {designStyle.mood}
                    </div>
                  </div>

                  {selectedStyle === designStyle.style && (
                    <div className="flex items-center space-x-2 text-rocket-red text-sm font-semibold">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Selected</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Colors Tab */}
        {activeTab === 'colors' && selectedStyle && (
          <div className="animate-fadeIn">
            <p className="text-center text-text-gray mb-8">
              Choose a color palette for your {selectedStyle} design
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {COLOR_SCHEMES[selectedStyle].map((scheme, index) => {
                const { name, ...schemeColors } = scheme
                const isSelected = selectedColorScheme?.primary === scheme.primary
                return (
                  <button
                    key={index}
                    onClick={() => onSelectColorScheme(schemeColors)}
                    className={`bg-dark-card border-2 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 ${
                      isSelected
                        ? 'border-rocket-red shadow-2xl'
                        : 'border-dark-lighter hover:border-text-gray'
                    }`}
                  >
                    {/* Color Swatch Preview */}
                    <div className="h-32 grid grid-cols-2 grid-rows-2">
                      <div style={{ backgroundColor: scheme.primary }} className="relative group">
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white">
                          Primary
                        </span>
                      </div>
                      <div style={{ backgroundColor: scheme.secondary }} className="relative group">
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white">
                          Secondary
                        </span>
                      </div>
                      <div style={{ backgroundColor: scheme.accent }} className="relative group">
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white">
                          Accent
                        </span>
                      </div>
                      <div style={{ backgroundColor: scheme.background }} className="relative group border-l border-t border-dark-lighter">
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white">
                          Background
                        </span>
                      </div>
                    </div>

                    {/* Scheme Name */}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-text-light mb-1">{name}</h3>
                      <div className="flex gap-2 flex-wrap">
                        <span className="text-xs font-mono text-text-gray">{scheme.primary}</span>
                      </div>
                      {isSelected && (
                        <div className="mt-3 flex items-center justify-center text-rocket-red text-sm font-medium">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Selected
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Typography Tab */}
        {activeTab === 'typography' && selectedStyle && (
          <div className="animate-fadeIn">
            <p className="text-center text-text-gray mb-8">
              Choose a font pairing for your {selectedStyle} style
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              {TYPOGRAPHY_PRESETS[selectedStyle].map((typo, index) => {
                const { name, ...typoFonts } = typo
                const isSelected = selectedTypography?.headingFont === typo.headingFont
                return (
                  <button
                    key={index}
                    onClick={() => onSelectTypography(typoFonts)}
                    className={`bg-dark-card border-2 rounded-xl p-6 text-left transition-all duration-300 hover:scale-[1.02] ${
                      isSelected
                        ? 'border-rocket-red shadow-2xl'
                        : 'border-dark-lighter hover:border-text-gray'
                    }`}
                  >
                    {/* Font Preview */}
                    <div className="mb-4 pb-4 border-b border-dark-lighter">
                      <div className="mb-3">
                        <p className="text-xs text-text-gray mb-1">Heading Font</p>
                        <h3
                          className="text-3xl font-bold text-text-light"
                          style={{ fontFamily: typo.headingFont }}
                        >
                          The Quick Brown Fox
                        </h3>
                      </div>
                      <div>
                        <p className="text-xs text-text-gray mb-1">Body Font</p>
                        <p
                          className="text-base text-text-gray"
                          style={{ fontFamily: typo.bodyFont }}
                        >
                          The quick brown fox jumps over the lazy dog. Typography matters.
                        </p>
                      </div>
                    </div>

                    {/* Typography Info */}
                    <div>
                      <h4 className="text-lg font-bold text-text-light mb-2">{name}</h4>
                      <div className="flex gap-4 text-sm text-text-gray">
                        <div>
                          <span className="block text-xs text-text-gray/70">Heading</span>
                          <span className="font-medium">{typo.headingFont}</span>
                        </div>
                        <div>
                          <span className="block text-xs text-text-gray/70">Body</span>
                          <span className="font-medium">{typo.bodyFont}</span>
                        </div>
                        <div>
                          <span className="block text-xs text-text-gray/70">Scale</span>
                          <span className="font-medium capitalize">{typo.scale}</span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="mt-4 flex items-center text-rocket-red text-sm font-medium">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Selected
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
