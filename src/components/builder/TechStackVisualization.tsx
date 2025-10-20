'use client'

import React, { useState, useEffect } from 'react'
import { SiteType, DesignStyle } from '@/types/builder'

interface TechStackVisualizationProps {
  siteType: SiteType
  designStyle?: DesignStyle
  businessName?: string
}

interface TechNode {
  id: string
  name: string
  category: 'frontend' | 'backend' | 'ai' | 'hosting' | 'email' | 'database' | 'integration'
  status: 'active' | 'building' | 'ready' | 'pending'
  description: string
  icon?: string
}

const getTechStack = (siteType: SiteType): TechNode[] => {
  const baseStack: TechNode[] = [
    // Core Infrastructure
    { id: 'github', name: 'GitHub', category: 'hosting', status: 'active', description: 'Version control & code repository', icon: '📦' },
    { id: 'vercel', name: 'Vercel', category: 'hosting', status: 'building', description: 'Global edge deployment', icon: '▲' },
    { id: 'cloudflare', name: 'Cloudflare', category: 'hosting', status: 'ready', description: 'CDN & DDoS protection', icon: '☁️' },

    // Frontend
    { id: 'nextjs', name: 'Next.js 15', category: 'frontend', status: 'ready', description: 'React framework', icon: '⚡' },
    { id: 'react', name: 'React 19', category: 'frontend', status: 'ready', description: 'UI library', icon: '⚛️' },
    { id: 'tailwind', name: 'Tailwind CSS', category: 'frontend', status: 'ready', description: 'Styling system', icon: '🎨' },

    // Backend
    { id: 'supabase', name: 'Supabase', category: 'database', status: 'ready', description: 'PostgreSQL database', icon: '🗄️' },
    { id: 'resend', name: 'Resend', category: 'email', status: 'ready', description: 'Transactional email', icon: '📧' },

    // AI Layer
    { id: 'claude', name: 'Claude Sonnet 4', category: 'ai', status: 'active', description: 'AI content generation', icon: '🤖' },
    { id: 'puter', name: 'Puter.com', category: 'ai', status: 'ready', description: 'AI infrastructure', icon: '🧠' },
    { id: 'aria', name: 'ARIA Assistant', category: 'ai', status: 'active', description: 'Your AI consultant', icon: '✨' },
  ]

  // Add site-specific integrations
  const siteSpecific: Record<SiteType, TechNode[]> = {
    store: [
      { id: 'stripe', name: 'Stripe', category: 'integration', status: 'ready', description: 'Payment processing', icon: '💳' },
      { id: 'inventory', name: 'Inventory System', category: 'backend', status: 'pending', description: 'Stock management', icon: '📊' },
    ],
    blog: [
      { id: 'markdown', name: 'MDX', category: 'frontend', status: 'ready', description: 'Content authoring', icon: '📝' },
      { id: 'rss', name: 'RSS Feed', category: 'integration', status: 'ready', description: 'Content syndication', icon: '📡' },
    ],
    portfolio: [
      { id: 'optimization', name: 'Image Optimization', category: 'frontend', status: 'ready', description: 'Sharp + Next Image', icon: '🖼️' },
      { id: 'analytics', name: 'Analytics', category: 'integration', status: 'ready', description: 'Visitor tracking', icon: '📈' },
    ],
    restaurant: [
      { id: 'reservations', name: 'Booking System', category: 'integration', status: 'pending', description: 'Table reservations', icon: '📅' },
      { id: 'menu', name: 'Menu Management', category: 'backend', status: 'ready', description: 'Dynamic menu', icon: '🍽️' },
    ],
    nonprofit: [
      { id: 'donations', name: 'Donation Platform', category: 'integration', status: 'ready', description: 'Secure donations', icon: '💝' },
      { id: 'volunteers', name: 'Volunteer Portal', category: 'backend', status: 'pending', description: 'Signup & scheduling', icon: '🤝' },
    ],
    education: [
      { id: 'lms', name: 'Learning System', category: 'backend', status: 'pending', description: 'Course management', icon: '🎓' },
      { id: 'video', name: 'Video Platform', category: 'integration', status: 'ready', description: 'Lesson streaming', icon: '🎬' },
    ],
    events: [
      { id: 'ticketing', name: 'Ticketing', category: 'integration', status: 'ready', description: 'Event registration', icon: '🎫' },
      { id: 'calendar', name: 'Event Calendar', category: 'frontend', status: 'ready', description: 'Schedule display', icon: '📆' },
    ],
    community: [
      { id: 'auth', name: 'Authentication', category: 'backend', status: 'ready', description: 'Member login', icon: '🔐' },
      { id: 'forum', name: 'Discussion Forum', category: 'integration', status: 'pending', description: 'Community chat', icon: '💬' },
    ],
    saas: [
      { id: 'auth', name: 'Auth0', category: 'backend', status: 'ready', description: 'User authentication', icon: '🔐' },
      { id: 'api', name: 'REST API', category: 'backend', status: 'ready', description: 'Backend services', icon: '🔌' },
    ],
    business: [
      { id: 'forms', name: 'Contact Forms', category: 'integration', status: 'ready', description: 'Lead capture', icon: '📋' },
      { id: 'crm', name: 'CRM Integration', category: 'integration', status: 'pending', description: 'Customer management', icon: '👥' },
    ],
    landing: [
      { id: 'ab-testing', name: 'A/B Testing', category: 'integration', status: 'pending', description: 'Conversion optimization', icon: '🧪' },
      { id: 'analytics', name: 'Analytics', category: 'integration', status: 'ready', description: 'Conversion tracking', icon: '📈' },
    ],
  }

  return [...baseStack, ...(siteSpecific[siteType] || [])]
}

const statusColors = {
  active: 'bg-green-500 shadow-green-500/50',
  building: 'bg-yellow-500 shadow-yellow-500/50 animate-pulse',
  ready: 'bg-blue-500 shadow-blue-500/50',
  pending: 'bg-gray-500 shadow-gray-500/50',
}

const categoryColors = {
  frontend: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
  backend: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
  ai: 'from-rocket-red/20 to-accent/20 border-rocket-red/30',
  hosting: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
  email: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30',
  database: 'from-indigo-500/20 to-violet-500/20 border-indigo-500/30',
  integration: 'from-teal-500/20 to-cyan-500/20 border-teal-500/30',
}

export default function TechStackVisualization({ siteType, designStyle, businessName }: TechStackVisualizationProps) {
  const [techStack, setTechStack] = useState<TechNode[]>([])
  const [activeConnections, setActiveConnections] = useState<Set<string>>(new Set())

  useEffect(() => {
    setTechStack(getTechStack(siteType))
  }, [siteType])

  useEffect(() => {
    // Animate connections
    const interval = setInterval(() => {
      setActiveConnections(prev => {
        const newSet = new Set(prev)
        const randomNode = techStack[Math.floor(Math.random() * techStack.length)]
        if (randomNode) {
          if (newSet.has(randomNode.id)) {
            newSet.delete(randomNode.id)
          } else {
            newSet.add(randomNode.id)
          }
        }
        return newSet
      })
    }, 1500)

    return () => clearInterval(interval)
  }, [techStack])

  const groupedStack = techStack.reduce((acc, node) => {
    if (!acc[node.category]) acc[node.category] = []
    acc[node.category].push(node)
    return acc
  }, {} as Record<string, TechNode[]>)

  return (
    <div className="w-full h-full bg-dark-bg rounded-xl border-2 border-dark-lighter p-6 overflow-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text-light mb-2">
          {businessName ? `${businessName}'s` : 'Your'} Technology Stack
        </h2>
        <p className="text-text-gray text-sm">
          Powered by cutting-edge tools and AI infrastructure
        </p>
      </div>

      {/* Architecture Diagram */}
      <div className="space-y-6">
        {/* Row 1: Hosting & Infrastructure */}
        {groupedStack.hosting && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-text-gray uppercase tracking-wider">Infrastructure & Deployment</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {groupedStack.hosting.map(node => (
                <TechNodeCard key={node.id} node={node} isActive={activeConnections.has(node.id)} />
              ))}
            </div>
          </div>
        )}

        {/* Row 2: Frontend */}
        {groupedStack.frontend && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-text-gray uppercase tracking-wider">Frontend Layer</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {groupedStack.frontend.map(node => (
                <TechNodeCard key={node.id} node={node} isActive={activeConnections.has(node.id)} />
              ))}
            </div>
          </div>
        )}

        {/* Row 3: AI & Intelligence */}
        {groupedStack.ai && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-text-gray uppercase tracking-wider">AI & Intelligence Layer</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {groupedStack.ai.map(node => (
                <TechNodeCard key={node.id} node={node} isActive={activeConnections.has(node.id)} />
              ))}
            </div>
          </div>
        )}

        {/* Row 4: Backend Services */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-text-gray uppercase tracking-wider">Backend Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {groupedStack.database?.map(node => (
              <TechNodeCard key={node.id} node={node} isActive={activeConnections.has(node.id)} />
            ))}
            {groupedStack.email?.map(node => (
              <TechNodeCard key={node.id} node={node} isActive={activeConnections.has(node.id)} />
            ))}
            {groupedStack.backend?.map(node => (
              <TechNodeCard key={node.id} node={node} isActive={activeConnections.has(node.id)} />
            ))}
          </div>
        </div>

        {/* Row 5: Integrations */}
        {groupedStack.integration && groupedStack.integration.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-text-gray uppercase tracking-wider">Integrations & Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {groupedStack.integration.map(node => (
                <TechNodeCard key={node.id} node={node} isActive={activeConnections.has(node.id)} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="mt-8 pt-6 border-t border-dark-lighter">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-rocket-red">{techStack.length}</div>
            <div className="text-xs text-text-gray">Technologies</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-500">{techStack.filter(n => n.status === 'active' || n.status === 'ready').length}</div>
            <div className="text-xs text-text-gray">Ready to Deploy</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-500">~47s</div>
            <div className="text-xs text-text-gray">Build Time</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent">99.9%</div>
            <div className="text-xs text-text-gray">Uptime SLA</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TechNodeCard({ node, isActive }: { node: TechNode; isActive: boolean }) {
  return (
    <div
      className={`relative p-4 rounded-lg bg-gradient-to-br ${categoryColors[node.category]} border-2 transition-all duration-300 ${
        isActive ? 'scale-105 shadow-lg' : ''
      }`}
    >
      {/* Status Indicator */}
      <div className="absolute top-2 right-2">
        <div className={`w-2 h-2 rounded-full ${statusColors[node.status]} shadow-lg`}></div>
      </div>

      {/* Icon & Name */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{node.icon}</span>
        <div>
          <h4 className="font-bold text-text-light text-sm">{node.name}</h4>
          <p className="text-[10px] text-text-gray uppercase tracking-wide">{node.category}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-text-gray leading-relaxed">{node.description}</p>

      {/* Active Pulse */}
      {isActive && (
        <div className="absolute inset-0 rounded-lg border-2 border-rocket-red/50 animate-ping"></div>
      )}
    </div>
  )
}
