'use client'

import React from 'react'
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
    description: 'Showcase creative work',
  },
  {
    type: 'store' as SiteType,
    title: 'Store',
    description: 'Sell products online',
  },
  {
    type: 'blog' as SiteType,
    title: 'Blog',
    description: 'Share stories',
  },
  {
    type: 'business' as SiteType,
    title: 'Business',
    description: 'Company presence',
  },
  {
    type: 'landing' as SiteType,
    title: 'Landing',
    description: 'Convert visitors',
  },
  {
    type: 'restaurant' as SiteType,
    title: 'Restaurant',
    description: 'Menu & ordering',
  },
  {
    type: 'nonprofit' as SiteType,
    title: 'Nonprofit',
    description: 'Mission-driven',
  },
  {
    type: 'education' as SiteType,
    title: 'Education',
    description: 'Courses & learning',
  },
  {
    type: 'events' as SiteType,
    title: 'Events',
    description: 'Event promotion',
  },
  {
    type: 'community' as SiteType,
    title: 'Community',
    description: 'Forum & members',
  },
  {
    type: 'saas' as SiteType,
    title: 'SaaS',
    description: 'Software product',
  },
]

export default function PurposeStep({
  selectedType,
  purposeDescription = '',
  onSelect,
  onDescriptionChange
}: PurposeStepProps) {
  return (
    <div className="h-[calc(100vh-160px)] flex flex-col">
      {/* Header - Compact */}
      <div className="text-center py-4 px-4">
        <h2 className="text-3xl md:text-4xl font-black">
          <span className="text-text-light">WHAT DO YOU </span>
          <span className="text-rocket-red">NEED?</span>
        </h2>
        <p className="text-sm text-text-gray mt-2">
          Chat with ARIA or browse options below
        </p>
      </div>

      {/* Centered ARIA */}
      <div className="flex-1 flex items-center justify-center px-4 pb-4 overflow-hidden">
        <div className="w-full max-w-3xl flex flex-col h-full">

          {/* ARIA AI Chat - Centered */}
          <div className="flex-1 flex flex-col bg-dark-card border-2 border-dark-lighter rounded-xl overflow-hidden">
            {/* ARIA Header */}
            <div className="bg-gradient-to-r from-rocket-red/20 to-accent/20 border-b-2 border-rocket-red/30 p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                <Image
                  src="/images/109-logo-circle1.png"
                  alt="ARIA"
                  width={32}
                  height={32}
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-light">Chat with ARIA</h3>
                <p className="text-xs text-text-gray">Describe your business or project needs</p>
              </div>
            </div>

            {/* ARIA Chat Interface */}
            <div className="flex-1 overflow-y-auto p-4">
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

            {/* Selection Status */}
            {selectedType && (
              <div className="border-t-2 border-rocket-red/30 bg-rocket-red/10 p-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-rocket-red flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-rocket-red">
                      {SITE_TYPES.find(t => t.type === selectedType)?.title} Selected!
                    </p>
                    <p className="text-xs text-text-gray">Click Next when ready</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Browse Options Link */}
          <div className="mt-4 text-center">
            <p className="text-sm text-text-gray">
              Not sure? <button className="text-accent hover:text-accent/80 font-semibold underline">Browse all options</button> or let ARIA guide you
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
