'use client'

import React, { useState, useEffect } from 'react'
import { SiteType } from '@/types/builder'

interface ArchitectureDiagramProps {
  siteType: SiteType
  businessName?: string
}

interface ServiceNode {
  id: string
  name: string
  layer: 'client' | 'edge' | 'application' | 'data' | 'ai' | 'external'
  status: 'active' | 'ready' | 'standby'
  connections: string[] // IDs of connected services
  icon?: string
  description: string
}

const getArchitecture = (siteType: SiteType): ServiceNode[] => {
  const baseArchitecture: ServiceNode[] = [
    // Client Layer
    {
      id: 'browser',
      name: 'Browser',
      layer: 'client',
      status: 'active',
      connections: ['nextjs', 'vercel'],
      icon: '🌐',
      description: 'User client'
    },

    // Edge Layer
    {
      id: 'vercel',
      name: 'Vercel Edge',
      layer: 'edge',
      status: 'active',
      connections: ['nextjs', 'cloudflare'],
      icon: '▲',
      description: 'Global CDN'
    },
    {
      id: 'cloudflare',
      name: 'Cloudflare',
      layer: 'edge',
      status: 'ready',
      connections: ['vercel'],
      icon: '☁️',
      description: 'DDoS Protection'
    },

    // Application Layer
    {
      id: 'nextjs',
      name: 'Next.js 15',
      layer: 'application',
      status: 'active',
      connections: ['react', 'supabase', 'claude', 'resend'],
      icon: '⚡',
      description: 'React Framework'
    },
    {
      id: 'react',
      name: 'React 19',
      layer: 'application',
      status: 'ready',
      connections: ['nextjs'],
      icon: '⚛️',
      description: 'UI Library'
    },

    // Data Layer
    {
      id: 'supabase',
      name: 'Supabase',
      layer: 'data',
      status: 'ready',
      connections: ['postgres'],
      icon: '🗄️',
      description: 'Database Platform'
    },
    {
      id: 'postgres',
      name: 'PostgreSQL',
      layer: 'data',
      status: 'ready',
      connections: [],
      icon: '🐘',
      description: 'Relational DB'
    },

    // AI Layer
    {
      id: 'claude',
      name: 'Claude Sonnet 4',
      layer: 'ai',
      status: 'active',
      connections: ['puter'],
      icon: '🤖',
      description: 'AI Model'
    },
    {
      id: 'puter',
      name: 'Puter.com',
      layer: 'ai',
      status: 'ready',
      connections: [],
      icon: '🧠',
      description: 'AI Infrastructure'
    },

    // External Services
    {
      id: 'resend',
      name: 'Resend',
      layer: 'external',
      status: 'ready',
      connections: [],
      icon: '📧',
      description: 'Email API'
    },
    {
      id: 'github',
      name: 'GitHub',
      layer: 'external',
      status: 'active',
      connections: ['vercel'],
      icon: '📦',
      description: 'Version Control'
    },
  ]

  // Add site-specific services
  if (siteType === 'store') {
    baseArchitecture.push({
      id: 'stripe',
      name: 'Stripe',
      layer: 'external',
      status: 'ready',
      connections: ['nextjs'],
      icon: '💳',
      description: 'Payment Processing'
    })
  }

  return baseArchitecture
}

const layerConfig = {
  client: { name: 'Client Layer', color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30', y: 5 },
  edge: { name: 'Edge Network', color: 'from-green-500/20 to-emerald-500/20 border-green-500/30', y: 50 },
  application: { name: 'Application Layer', color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30', y: 95 },
  data: { name: 'Data Layer', color: 'from-indigo-500/20 to-violet-500/20 border-indigo-500/30', y: 140 },
  ai: { name: 'AI Services', color: 'from-rocket-red/20 to-accent/20 border-rocket-red/30', y: 185 },
  external: { name: 'External Services', color: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30', y: 230 },
}

const statusColors = {
  active: 'bg-green-500',
  ready: 'bg-blue-500',
  standby: 'bg-gray-500',
}

export default function ArchitectureDiagram({ siteType, businessName }: ArchitectureDiagramProps) {
  const [architecture, setArchitecture] = useState<ServiceNode[]>([])
  const [activeFlows, setActiveFlows] = useState<Set<string>>(new Set())

  useEffect(() => {
    setArchitecture(getArchitecture(siteType))
  }, [siteType])

  // Animate data flows
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFlows(prev => {
        const newFlows = new Set<string>()
        // Randomly activate 2-3 connections
        const numFlows = Math.floor(Math.random() * 2) + 2
        const allConnections: string[] = []

        architecture.forEach(node => {
          node.connections.forEach(targetId => {
            allConnections.push(`${node.id}-${targetId}`)
          })
        })

        for (let i = 0; i < numFlows && allConnections.length > 0; i++) {
          const randomIndex = Math.floor(Math.random() * allConnections.length)
          newFlows.add(allConnections[randomIndex])
        }

        return newFlows
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [architecture])

  // Group nodes by layer
  const nodesByLayer = architecture.reduce((acc, node) => {
    if (!acc[node.layer]) acc[node.layer] = []
    acc[node.layer].push(node)
    return acc
  }, {} as Record<string, ServiceNode[]>)

  return (
    <div className="w-full bg-black/40 backdrop-blur-sm border-2 border-green-500/20 rounded-xl p-3 font-mono">
      {/* Terminal Header */}
      <div className="mb-3 pb-2 border-b border-green-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-green-400 text-sm">
              $ architecture-view --site={siteType} --live
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-green-400 text-xs">LIVE</span>
          </div>
        </div>
      </div>

      {/* Architecture Diagram */}
      <div className="relative min-h-[300px] bg-black/20 rounded-lg p-4 border border-green-500/10">
        {/* Layer Labels */}
        {Object.entries(layerConfig).map(([key, config]) => (
          <div
            key={key}
            className="absolute left-0 right-0 h-24 bg-gradient-to-r opacity-10 rounded"
            style={{ top: `${config.y}px` }}
          ></div>
        ))}

        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill="#22c55e" opacity="0.6" />
            </marker>
            <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0" />
              <stop offset="50%" stopColor="#22c55e" stopOpacity="1" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
            </linearGradient>
          </defs>
          {architecture.map(node => {
            const sourceLayer = layerConfig[node.layer]
            const sourceIndex = nodesByLayer[node.layer]?.indexOf(node) || 0
            const sourceTotal = nodesByLayer[node.layer]?.length || 1
            const sourceX = (sourceIndex + 1) * (100 / (sourceTotal + 1))
            const sourceY = sourceLayer.y + 35 // Adjusted for compact layout

            return node.connections.map(targetId => {
              const targetNode = architecture.find(n => n.id === targetId)
              if (!targetNode) return null

              const targetLayer = layerConfig[targetNode.layer]
              const targetIndex = nodesByLayer[targetNode.layer]?.indexOf(targetNode) || 0
              const targetTotal = nodesByLayer[targetNode.layer]?.length || 1
              const targetX = (targetIndex + 1) * (100 / (targetTotal + 1))
              const targetY = targetLayer.y + 35 // Adjusted for compact layout

              const flowKey = `${node.id}-${targetId}`
              const isActive = activeFlows.has(flowKey)

              return (
                <g key={flowKey}>
                  {/* Static connection line */}
                  <line
                    x1={`${sourceX}%`}
                    y1={sourceY}
                    x2={`${targetX}%`}
                    y2={targetY}
                    stroke="#22c55e"
                    strokeWidth="2.5"
                    opacity="0.4"
                    markerEnd="url(#arrowhead)"
                  />
                  {/* Animated data flow */}
                  {isActive && (
                    <line
                      x1={`${sourceX}%`}
                      y1={sourceY}
                      x2={`${targetX}%`}
                      y2={targetY}
                      stroke="url(#flowGradient)"
                      strokeWidth="4"
                      opacity="0.9"
                      className="animate-pulse"
                    />
                  )}
                </g>
              )
            })
          })}
        </svg>

        {/* Service Nodes */}
        {Object.entries(nodesByLayer).map(([layer, nodes]) => {
          const config = layerConfig[layer as keyof typeof layerConfig]
          return (
            <div key={layer} className="relative mb-1" style={{ marginTop: `${config.y}px` }}>
              {/* Layer Label */}
              <div className="absolute -left-6 top-8 -rotate-90 origin-left">
                <span className="text-xs text-green-400/60 uppercase tracking-wider">
                  {config.name}
                </span>
              </div>

              {/* Nodes in this layer */}
              <div className="flex justify-around items-center gap-4 px-12">
                {nodes.map((node, index) => {
                  const isActive = node.status === 'active'
                  const hasActiveConnection = Array.from(activeFlows).some(flow =>
                    flow.startsWith(node.id) || flow.endsWith(node.id)
                  )

                  return (
                    <div
                      key={node.id}
                      className="relative group z-10"
                      style={{ flex: '0 0 auto' }}
                    >
                      {/* Node Container */}
                      <div
                        className={`relative px-2.5 py-1.5 rounded-lg border-2 transition-all duration-300 min-w-[110px] ${
                          hasActiveConnection
                            ? 'border-green-400 bg-green-500/10 shadow-lg shadow-green-500/20 scale-105'
                            : 'border-green-500/30 bg-black/40'
                        }`}
                      >
                        {/* Status Indicator */}
                        <div className="absolute -top-1 -right-1">
                          <div className={`w-2 h-2 rounded-full ${statusColors[node.status]} ${isActive ? 'animate-pulse' : ''}`}></div>
                        </div>

                        {/* Node Content */}
                        <div className="text-center">
                          <div className="text-lg mb-0.5">{node.icon}</div>
                          <div className="text-green-400 text-[10px] font-bold">{node.name}</div>
                        </div>

                        {/* Active pulse */}
                        {hasActiveConnection && (
                          <div className="absolute inset-0 rounded-lg border-2 border-green-400 animate-ping opacity-75"></div>
                        )}
                      </div>

                      {/* Hover Info */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-black border border-green-500/50 rounded text-xs text-green-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {node.name} • {node.status}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* System Stats */}
      <div className="mt-3 pt-2 border-t border-green-500/20 grid grid-cols-4 gap-2 text-center">
        <div>
          <div className="text-green-400 text-sm font-bold">{architecture.length}</div>
          <div className="text-green-600 text-[9px]">Services</div>
        </div>
        <div>
          <div className="text-green-400 text-sm font-bold">
            {architecture.filter(n => n.status === 'active').length}
          </div>
          <div className="text-green-600 text-[9px]">Active</div>
        </div>
        <div>
          <div className="text-green-400 text-sm font-bold">99.9%</div>
          <div className="text-green-600 text-[9px]">Uptime</div>
        </div>
        <div>
          <div className="text-green-400 text-sm font-bold">&lt;50ms</div>
          <div className="text-green-600 text-[9px]">Latency</div>
        </div>
      </div>
    </div>
  )
}
