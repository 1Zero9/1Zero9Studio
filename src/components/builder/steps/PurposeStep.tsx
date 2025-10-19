'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { SiteType } from '@/types/builder'
import AIAgent from '@/components/builder/AIAgent'

interface PurposeStepProps {
  selectedType: SiteType | null
  purposeDescription: string | undefined
  onSelect: (type: SiteType) => void
  onDescriptionChange: (description: string) => void
}

// SVG Icon Component
const SiteTypeIcon = ({ type, className = "" }: { type: SiteType; className?: string }) => {
  const icons = {
    portfolio: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    store: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    blog: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    business: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    landing: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    restaurant: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    nonprofit: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    education: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    events: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    community: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    saas: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  }
  return icons[type] || null
}

const SITE_TYPES = [
  {
    type: 'portfolio' as SiteType,
    title: 'Portfolio',
    description: 'Showcase creative work and achievements',
    keywords: ['designer', 'photographer', 'artist'],
  },
  {
    type: 'store' as SiteType,
    title: 'Online Store',
    description: 'Sell products with e-commerce',
    keywords: ['shop', 'sell', 'products'],
  },
  {
    type: 'blog' as SiteType,
    title: 'Blog',
    description: 'Share stories and expertise',
    keywords: ['write', 'articles', 'content'],
  },
  {
    type: 'business' as SiteType,
    title: 'Business',
    description: 'Professional company presence',
    keywords: ['company', 'services', 'consulting'],
  },
  {
    type: 'landing' as SiteType,
    title: 'Landing Page',
    description: 'Convert visitors to customers',
    keywords: ['launch', 'campaign', 'convert'],
  },
  {
    type: 'restaurant' as SiteType,
    title: 'Restaurant',
    description: 'Menu, reservations & online ordering',
    keywords: ['menu', 'food', 'dining'],
  },
  {
    type: 'nonprofit' as SiteType,
    title: 'Nonprofit',
    description: 'Mission-driven organization site',
    keywords: ['charity', 'donate', 'cause'],
  },
  {
    type: 'education' as SiteType,
    title: 'Education',
    description: 'Courses, training & learning platform',
    keywords: ['courses', 'learning', 'teach'],
  },
  {
    type: 'events' as SiteType,
    title: 'Events',
    description: 'Event promotion & ticket sales',
    keywords: ['conference', 'tickets', 'schedule'],
  },
  {
    type: 'community' as SiteType,
    title: 'Community',
    description: 'Forum, membership & social hub',
    keywords: ['forum', 'members', 'social'],
  },
  {
    type: 'saas' as SiteType,
    title: 'SaaS Product',
    description: 'Software product & subscription site',
    keywords: ['software', 'app', 'subscription'],
  },
]

export default function PurposeStep({
  selectedType,
  purposeDescription = '',
  onSelect,
  onDescriptionChange
}: PurposeStepProps) {
  const [mode, setMode] = useState<'nova' | 'browse'>('nova')

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-8 md:mb-12 space-y-3 md:space-y-4 animate-fadeIn">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black">
          <span className="text-text-light">WHAT DO YOU </span>
          <span className="text-rocket-red">NEED?</span>
        </h2>
        <p className="text-base md:text-lg text-text-gray max-w-2xl mx-auto">
          Choose how you'd like to get started
        </p>
      </div>

      {/* Mode Selector - Clean Toggle */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 mb-8 md:mb-12">
        <button
          onClick={() => setMode('nova')}
          className={`flex items-center justify-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg transition-all duration-300 ${
            mode === 'nova'
              ? 'bg-rocket-red text-white shadow-xl shadow-rocket-red/30 scale-105'
              : 'bg-dark-card text-text-gray border-2 border-dark-lighter hover:border-rocket-red/30'
          }`}
        >
          <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full bg-white flex items-center justify-center ${mode === 'nova' ? '' : 'opacity-50'}`}>
            <Image
              src="/images/109-logo-circle1.png"
              alt="NOVA"
              width={20}
              height={20}
            />
          </div>
          <span>Get NOVA's Help</span>
        </button>
        <button
          onClick={() => setMode('browse')}
          className={`flex items-center justify-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg transition-all duration-300 ${
            mode === 'browse'
              ? 'bg-rocket-red text-white shadow-xl shadow-rocket-red/30 scale-105'
              : 'bg-dark-card text-text-gray border-2 border-dark-lighter hover:border-rocket-red/30'
          }`}
        >
          <svg className={`w-5 h-5 md:w-6 md:h-6 ${mode === 'browse' ? '' : 'opacity-50'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          <span>Browse Options</span>
        </button>
      </div>

      {/* Mode: Nova AI */}
      {mode === 'nova' && (
        <div className="animate-fadeIn">
          <div className="max-w-4xl mx-auto">
            <AIAgent
              currentSiteType={selectedType}
              onSiteTypeDetected={(type) => {
                onSelect(type)
                onDescriptionChange(`I need a ${type} website`)
              }}
              onUserInput={(input) => {
                if (input.length > 10) {
                  onDescriptionChange(input)
                }
              }}
            />
          </div>

          {/* Show selection below Nova when detected */}
          {selectedType && (
            <div className="mt-8 p-6 rounded-xl bg-rocket-red/10 border-2 border-rocket-red/30 animate-fadeIn max-w-4xl mx-auto shadow-lg shadow-rocket-red/20">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-rocket-red/20 flex items-center justify-center text-rocket-red">
                  <SiteTypeIcon type={selectedType} className="w-10 h-10" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-black text-rocket-red mb-1">
                    {SITE_TYPES.find(t => t.type === selectedType)?.title} Selected!
                  </h3>
                  <p className="text-text-light text-sm">
                    {SITE_TYPES.find(t => t.type === selectedType)?.description}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-rocket-red flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode: Browse */}
      {mode === 'browse' && (
        <div className="animate-fadeIn space-y-6 md:space-y-8">
          {/* Browse Introduction */}
          <div className="text-center space-y-2 md:space-y-3 mb-3 md:mb-4">
            <p className="text-base md:text-lg text-text-light font-medium">
              Select the type of website you need
            </p>
            <p className="text-sm text-text-gray max-w-2xl mx-auto px-2">
              Choose the category that best matches your vision. You'll be able to customize every detail in the next steps.
            </p>
          </div>

          {/* Site Type Grid - Compact 4-column */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {SITE_TYPES.map((siteType) => (
              <button
                key={siteType.type}
                onClick={() => {
                  onSelect(siteType.type)
                  onDescriptionChange(`I need a ${siteType.type} website`)
                }}
                className={`group relative text-center p-4 md:p-5 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                  selectedType === siteType.type
                    ? 'border-rocket-red bg-rocket-red/10 shadow-xl shadow-rocket-red/30'
                    : 'border-dark-lighter bg-dark-card hover:border-rocket-red/50 hover:bg-dark-card/70 hover:shadow-lg'
                }`}
              >
                {/* Selection Indicator - Top Right Corner */}
                {selectedType === siteType.type && (
                  <div className="absolute top-2 right-2 md:top-3 md:right-3 w-6 h-6 md:w-7 md:h-7 rounded-full bg-rocket-red flex items-center justify-center shadow-lg animate-fadeIn">
                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}

                {/* Icon */}
                <div className={`w-14 h-14 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                  selectedType === siteType.type
                    ? 'bg-rocket-red/20 text-rocket-red'
                    : 'bg-dark-lighter text-text-gray group-hover:bg-rocket-red/10 group-hover:text-rocket-red'
                }`}>
                  <SiteTypeIcon type={siteType.type} className="w-8 h-8 md:w-9 md:h-9" />
                </div>

                {/* Title */}
                <h4 className={`text-sm md:text-base font-black mb-1.5 md:mb-2 transition-colors ${
                  selectedType === siteType.type
                    ? 'text-rocket-red'
                    : 'text-text-light group-hover:text-rocket-red'
                }`}>
                  {siteType.title}
                </h4>

                {/* Description */}
                <p className="text-xs text-text-gray leading-snug mb-2 md:mb-3">
                  {siteType.description}
                </p>

                {/* Keywords/Tags - Show what this type is good for */}
                <div className="flex flex-wrap gap-1 justify-center">
                  {siteType.keywords.map((keyword, idx) => (
                    <span
                      key={idx}
                      className={`text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full transition-colors ${
                        selectedType === siteType.type
                          ? 'bg-rocket-red/20 text-rocket-red border border-rocket-red/30'
                          : 'bg-dark-lighter text-text-gray border border-dark-lighter group-hover:border-rocket-red/20'
                      }`}
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          {/* Selection Confirmation */}
          {selectedType && (
            <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-dark-card to-dark-bg border-2 border-rocket-red/30 animate-fadeIn shadow-xl">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-3 md:mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-rocket-red/20 flex items-center justify-center border-2 border-rocket-red">
                  <svg className="w-6 h-6 md:w-7 md:h-7 text-rocket-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-text-light text-center sm:text-left">
                  {SITE_TYPES.find(t => t.type === selectedType)?.title} <span className="text-rocket-red">Selected!</span>
                </h3>
              </div>
              <p className="text-center text-sm md:text-base text-text-gray mb-2">
                {SITE_TYPES.find(t => t.type === selectedType)?.description}
              </p>
              <p className="text-center text-xs md:text-sm text-text-light">
                Click <span className="text-rocket-red font-bold">Next</span> to choose your design style and colors
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
