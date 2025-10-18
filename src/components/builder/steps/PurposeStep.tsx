'use client'

import React from 'react'
import { SiteType } from '@/types/builder'

interface PurposeStepProps {
  selectedType: SiteType | null
  onSelect: (type: SiteType) => void
}

const SITE_TYPES = [
  {
    type: 'portfolio' as SiteType,
    icon: '💼',
    title: 'Portfolio',
    description: 'Showcase your work, projects, and creative achievements',
    examples: 'Designers, photographers, artists, freelancers',
  },
  {
    type: 'store' as SiteType,
    icon: '🛍️',
    title: 'Online Store',
    description: 'Sell products directly to customers with an e-commerce experience',
    examples: 'Retailers, artisans, product businesses',
  },
  {
    type: 'blog' as SiteType,
    icon: '📝',
    title: 'Blog',
    description: 'Share your thoughts, stories, and expertise with the world',
    examples: 'Writers, journalists, thought leaders',
  },
  {
    type: 'business' as SiteType,
    icon: '🏢',
    title: 'Business Site',
    description: 'Professional presence for your company with services and team info',
    examples: 'Agencies, consultants, local businesses',
  },
  {
    type: 'landing' as SiteType,
    icon: '🎯',
    title: 'Landing Page',
    description: 'Single-page site designed to convert visitors into customers',
    examples: 'Product launches, events, campaigns',
  },
]

export default function PurposeStep({ selectedType, onSelect }: PurposeStepProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-12 space-y-4 animate-fadeIn">
        <h2 className="text-4xl md:text-5xl font-black">
          <span className="text-text-light">WHAT'S YOUR </span>
          <span className="text-rocket-red">PURPOSE?</span>
        </h2>
        <p className="text-lg md:text-xl text-text-gray max-w-2xl mx-auto">
          Choose the type of website that best fits your goals
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SITE_TYPES.map((siteType) => (
          <button
            key={siteType.type}
            onClick={() => onSelect(siteType.type)}
            className={`text-left p-6 rounded-xl border-2 transition-all duration-300 group hover:scale-105 ${
              selectedType === siteType.type
                ? 'border-rocket-red bg-rocket-red/10 shadow-lg shadow-rocket-red/20'
                : 'border-dark-lighter bg-dark-card/50 hover:border-rocket-red/50 hover:bg-dark-card/70'
            }`}
          >
            <div className="space-y-4">
              <div className="text-5xl">{siteType.icon}</div>

              <div>
                <h3 className="text-xl font-bold text-text-light mb-2 group-hover:text-rocket-red transition-colors">
                  {siteType.title}
                </h3>
                <p className="text-text-gray text-sm mb-3 leading-relaxed">
                  {siteType.description}
                </p>
                <p className="text-xs text-text-gray/70 italic">
                  Perfect for: {siteType.examples}
                </p>
              </div>

              {/* Selection indicator */}
              {selectedType === siteType.type && (
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

      {selectedType && (
        <div className="mt-8 text-center text-text-gray text-sm animate-fadeIn">
          Great choice! We'll customize the experience for a {SITE_TYPES.find(t => t.type === selectedType)?.title.toLowerCase()}.
        </div>
      )}
    </div>
  )
}
