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
    preview: '⬜',
    mood: 'Professional, Modern, Sophisticated',
  },
  {
    style: 'bold' as DesignStyle,
    name: 'Bold',
    description: 'Eye-catching colors and dramatic contrasts that demand attention',
    preview: '🔴',
    mood: 'Energetic, Vibrant, Confident',
  },
  {
    style: 'futuristic' as DesignStyle,
    name: 'Futuristic',
    description: 'Tech-forward design with neon accents and modern aesthetics',
    preview: '🔮',
    mood: 'Innovative, Cutting-edge, Dynamic',
  },
  {
    style: 'classic' as DesignStyle,
    name: 'Classic',
    description: 'Timeless elegance with traditional typography and warm tones',
    preview: '📜',
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
    onSelectColorScheme(COLOR_SCHEMES[style][0])
    onSelectTypography(TYPOGRAPHY_PRESETS[style])
    // Move to colors tab
    setActiveTab('colors')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12 space-y-4 animate-fadeIn">
        <h2 className="text-4xl md:text-5xl font-black">
          <span className="text-text-light">CHOOSE YOUR </span>
          <span className="text-rocket-red">STYLE</span>
        </h2>
        <p className="text-lg md:text-xl text-text-gray max-w-2xl mx-auto">
          Define the look and feel that represents your brand
        </p>
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
                  <div className="text-5xl">{designStyle.preview}</div>

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
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {COLOR_SCHEMES[selectedStyle].map((scheme, index) => (
                <button
                  key={index}
                  onClick={() => onSelectColorScheme(scheme)}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                    selectedColorScheme === scheme
                      ? 'border-rocket-red shadow-lg shadow-rocket-red/20'
                      : 'border-dark-lighter hover:border-rocket-red/50'
                  }`}
                >
                  <div className="flex space-x-2 mb-4">
                    <div
                      className="w-16 h-16 rounded-lg shadow-md"
                      style={{ backgroundColor: scheme.primary }}
                    />
                    <div
                      className="w-16 h-16 rounded-lg shadow-md"
                      style={{ backgroundColor: scheme.secondary }}
                    />
                    <div
                      className="w-16 h-16 rounded-lg shadow-md"
                      style={{ backgroundColor: scheme.accent }}
                    />
                  </div>
                  <div className="text-left space-y-1 text-sm">
                    <p className="text-text-gray">
                      <span className="font-semibold">Primary:</span> {scheme.primary}
                    </p>
                    <p className="text-text-gray">
                      <span className="font-semibold">Accent:</span> {scheme.accent}
                    </p>
                  </div>
                  {selectedColorScheme === scheme && (
                    <div className="mt-4 flex items-center space-x-2 text-rocket-red text-sm font-semibold">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Selected</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Typography Tab */}
        {activeTab === 'typography' && selectedStyle && (
          <div className="animate-fadeIn">
            <p className="text-center text-text-gray mb-8">
              Font pairing optimized for your {selectedStyle} style
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="bg-dark-card/50 border border-dark-lighter rounded-xl p-8">
                <div className="space-y-6">
                  <div>
                    <p className="text-text-gray text-sm mb-2">Heading Font:</p>
                    <h3
                      className="text-4xl font-bold text-text-light"
                      style={{ fontFamily: selectedTypography?.headingFont || 'Inter' }}
                    >
                      {selectedTypography?.headingFont || 'Inter'}
                    </h3>
                  </div>
                  <div>
                    <p className="text-text-gray text-sm mb-2">Body Font:</p>
                    <p
                      className="text-lg text-text-gray"
                      style={{ fontFamily: selectedTypography?.bodyFont || 'Inter' }}
                    >
                      {selectedTypography?.bodyFont || 'Inter'} - The quick brown fox jumps over the lazy dog.
                    </p>
                  </div>
                  <div className="bg-dark-bg/50 rounded-lg p-4">
                    <p className="text-xs text-text-gray">
                      This combination has been carefully selected to match your {selectedStyle} aesthetic
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
