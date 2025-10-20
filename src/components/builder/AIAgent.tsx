'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { SiteType } from '@/types/builder'
import { getAriaVersion } from '@/lib/versions'

// Puter.js types (loaded via script tag in layout)
declare global {
  interface PuterAIMessage {
    role: 'system' | 'user' | 'assistant'
    content: string
  }

  interface PuterAIChatOptions {
    model?: string
    temperature?: number
    max_tokens?: number
  }

  interface PuterAIChatResponse {
    message: {
      content: string | { text: string }[]
    }
  }

  interface Window {
    puter?: {
      ai: {
        chat(
          messages: PuterAIMessage[] | string,
          imageUrl?: string,
          options?: PuterAIChatOptions
        ): Promise<PuterAIChatResponse>
      }
    }
  }
}

interface Message {
  id: string
  role: 'agent' | 'user'
  content: string
  timestamp: Date
}

interface AIAgentProps {
  onSiteTypeDetected?: (type: SiteType) => void
  onUserInput?: (input: string) => void
  currentSiteType?: SiteType | null
}

const AGENT_RESPONSES = {
  greeting: [
    "Hi! I'm ARIA from 1Zero9 Studio. 🚀 Tell me about your business and vision - I'll recommend the perfect website solution tailored to your goals. We specialize in turning ideas into stunning digital experiences. What are you looking to build?",
    "Welcome to 1Zero9 Studio! I'm ARIA, your AI consultant. Whether you need to sell products, showcase creative work, or establish your brand - we'll design the perfect site for you. Our team combines cutting-edge tech with award-winning design. What's your vision?",
    "Hey there! I'm ARIA from 1Zero9 Studio. Not sure which website type fits your business? That's exactly what we're here for! Share your goals and I'll match you with the ideal solution from our proven templates. Let's build something amazing together!",
  ],
  followUp: {
    portfolio: [
      "A portfolio site sounds perfect! What kind of work do you want to showcase? Photography, design, development, or something else?",
      "Great choice! Are you looking to display client work, personal projects, or both?",
      "Excellent! Will you need features like case studies, testimonials, or a contact form?",
    ],
    store: [
      "An online store - exciting! How many products are you planning to sell initially?",
      "Perfect! Are these physical products, digital downloads, or services?",
      "Great! Do you already have inventory, or are you just getting started?",
    ],
    blog: [
      "A blog is a fantastic way to share your voice! What topics will you be covering?",
      "Awesome! How often are you planning to publish new content?",
      "Great choice! Will you be the sole author, or will you have multiple contributors?",
    ],
    business: [
      "A professional business site - smart move! What services does your company offer?",
      "Perfect! Is this for a new business or an established company looking to upgrade?",
      "Excellent! Will you need features like team profiles, testimonials, or a service catalog?",
    ],
    landing: [
      "A landing page - perfect for conversions! What are you launching or promoting?",
      "Great! What's the main action you want visitors to take?",
      "Excellent! Is this for a product launch, event registration, or lead generation?",
    ],
    restaurant: [
      "A restaurant website - delicious! Will you need online ordering or just menu display?",
      "Great! Do you want reservation booking integrated?",
      "Perfect! Will you showcase your location, hours, and chef's specials?",
    ],
    nonprofit: [
      "A nonprofit site - wonderful mission! What cause are you supporting?",
      "Excellent! Will you need donation processing and volunteer signup?",
      "Great! Do you want to highlight impact stories and upcoming events?",
    ],
    education: [
      "An education site - fantastic! Are you offering courses, training, or tutorials?",
      "Great! Will students need accounts to track their progress?",
      "Perfect! Do you want video lessons, quizzes, or downloadable resources?",
    ],
    events: [
      "An events site - exciting! Is this for conferences, concerts, or community gatherings?",
      "Great! Will you need ticket sales and attendee registration?",
      "Perfect! Do you want a schedule, speaker profiles, or venue information?",
    ],
    community: [
      "A community site - amazing! What brings your members together?",
      "Great! Will you need forums, member profiles, or private messaging?",
      "Perfect! Do you want membership tiers or subscription options?",
    ],
    saas: [
      "A SaaS product site - innovative! What problem does your software solve?",
      "Great! Will you need pricing tiers and subscription management?",
      "Perfect! Do you want feature demos, API docs, or a customer dashboard?",
    ],
  },
  encouragement: [
    "That's really interesting! Tell me more...",
    "I love that! What else should I know?",
    "Perfect! Any other details you'd like to share?",
    "Great insight! What's the main goal for this website?",
  ],
  clarification: [
    "Hmm, I'm not quite sure I understand. Could you describe your project in a different way?",
    "Interesting! Can you give me a bit more detail about what you're looking to build?",
    "I want to make sure I get this right. Could you elaborate a bit more?",
  ],
}

export default function AIAgent({ onSiteTypeDetected, onUserInput, currentSiteType }: AIAgentProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [userHasInteracted, setUserHasInteracted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const greetingShownRef = useRef(false)
  const ariaVersion = getAriaVersion()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!greetingShownRef.current && messages.length === 0) {
      greetingShownRef.current = true
      setTimeout(() => {
        addAgentMessage(AGENT_RESPONSES.greeting[Math.floor(Math.random() * AGENT_RESPONSES.greeting.length)])
      }, 500)
    }
  }, [])

  const addAgentMessage = (content: string, delay: number = 0) => {
    setIsTyping(true)
    setTimeout(() => {
      const newMessage: Message = {
        id: Date.now().toString(),
        role: 'agent',
        content,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, newMessage])
      setIsTyping(false)
    }, delay)
  }

  const detectSiteType = (text: string): SiteType | null => {
    const lowerText = text.toLowerCase()

    // Restaurant keywords (check first to avoid conflicts with business)
    if (/(restaurant|food|menu|dining|cafe|eatery|chef|cuisine|reserv)/i.test(lowerText)) {
      return 'restaurant'
    }

    // Nonprofit keywords
    if (/(nonprofit|non-profit|charity|donation|cause|volunteer|mission|foundation)/i.test(lowerText)) {
      return 'nonprofit'
    }

    // Education keywords
    if (/(education|course|training|learn|teach|school|tutorial|academy|student)/i.test(lowerText)) {
      return 'education'
    }

    // Events keywords
    if (/(event|conference|concert|ticket|gathering|festival|meetup|summit)/i.test(lowerText)) {
      return 'events'
    }

    // Community keywords
    if (/(community|forum|member|social|group|network|club)/i.test(lowerText)) {
      return 'community'
    }

    // SaaS keywords
    if (/(saas|software|app|platform|subscription|api|service|cloud)/i.test(lowerText)) {
      return 'saas'
    }

    // Portfolio keywords
    if (/(portfolio|showcase|work|design|photo|creative|artist|freelanc)/i.test(lowerText)) {
      return 'portfolio'
    }

    // Store keywords
    if (/(shop|store|sell|product|ecommerce|buy|retail|inventory)/i.test(lowerText)) {
      return 'store'
    }

    // Blog keywords
    if (/(blog|write|article|content|post|journal|publish)/i.test(lowerText)) {
      return 'blog'
    }

    // Business keywords
    if (/(business|company|agency|professional|consult|corporate)/i.test(lowerText)) {
      return 'business'
    }

    // Landing keywords
    if (/(landing|launch|campaign|convert|promote|single page)/i.test(lowerText)) {
      return 'landing'
    }

    return null
  }

  const generateResponse = (userInput: string, detectedType: SiteType | null): string => {
    if (userInput.length < 5) {
      return AGENT_RESPONSES.clarification[Math.floor(Math.random() * AGENT_RESPONSES.clarification.length)]
    }

    if (detectedType && !currentSiteType) {
      const followUps = AGENT_RESPONSES.followUp[detectedType]
      return followUps[Math.floor(Math.random() * followUps.length)]
    }

    if (currentSiteType && detectedType === currentSiteType) {
      return AGENT_RESPONSES.encouragement[Math.floor(Math.random() * AGENT_RESPONSES.encouragement.length)]
    }

    return AGENT_RESPONSES.encouragement[Math.floor(Math.random() * AGENT_RESPONSES.encouragement.length)]
  }

  const handleSend = async () => {
    if (!inputValue.trim()) return

    // Mark that user has interacted
    setUserHasInteracted(true)

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])

    // Notify parent
    onUserInput?.(inputValue)

    // Clear input immediately for better UX
    const userInputCopy = inputValue
    setInputValue('')
    setIsTyping(true)

    try {
      // Check if Puter is available
      if (typeof window !== 'undefined' && window.puter) {
        // Build conversation history for Puter AI
        const conversationHistory: PuterAIMessage[] = [
          {
            role: 'system',
            content: `You are ARIA (AI Rapid Integration Assistant), an AI consultant for 1Zero9 Studio, a web design and development agency.

Your role is to:
1. Have natural, friendly conversations with potential clients
2. Understand their business needs and goals through questions
3. Recommend the perfect website type from these 11 options: portfolio, store, blog, business, landing, restaurant, nonprofit, education, events, community, or saas
4. When you detect what type they need, mention it naturally in conversation

Guidelines:
- Be warm, professional, and enthusiastic about helping them succeed
- Ask clarifying questions to truly understand their vision
- Reference 1Zero9 Studio's expertise and track record
- Keep responses concise (2-3 sentences max)
- When you identify their needs, subtly mention the site type you'd recommend
- Be encouraging and make them feel confident in their project

Current detected site type: ${currentSiteType || 'none yet'}

Available site types and when to recommend them:
- portfolio: For showcasing creative work (designers, photographers, artists, freelancers)
- store: For selling products online (e-commerce, retail, physical/digital goods)
- blog: For content publishing (writers, journalists, thought leaders)
- business: For professional services (agencies, consultants, corporate sites)
- landing: For single-purpose campaigns (product launches, lead generation, events)
- restaurant: For dining establishments (menus, reservations, online ordering)
- nonprofit: For charitable organizations (donations, volunteer signup, impact stories)
- education: For learning platforms (courses, training, tutorials)
- events: For conferences/gatherings (tickets, schedules, speakers)
- community: For member-based sites (forums, social groups, clubs)
- saas: For software products (pricing tiers, feature demos, dashboards)`
          },
          // Add all previous messages
          ...messages.map(msg => ({
            role: msg.role === 'agent' ? 'assistant' as const : 'user' as const,
            content: msg.content
          })),
          // Add the new user message
          {
            role: 'user' as const,
            content: userInputCopy
          }
        ]

        // Call Puter AI with Claude Sonnet 4
        const response = await window.puter.ai.chat(conversationHistory, undefined, {
          model: 'claude-sonnet-4',
          temperature: 0.7,
          max_tokens: 300
        })

        // Extract response content
        let aiResponse = ''
        if (typeof response.message.content === 'string') {
          aiResponse = response.message.content
        } else if (Array.isArray(response.message.content)) {
          aiResponse = response.message.content[0]?.text || ''
        }

        // Detect site type from AI response or user input
        const detectedType = detectSiteType(userInputCopy + ' ' + aiResponse)
        if (detectedType && !currentSiteType && onSiteTypeDetected) {
          onSiteTypeDetected(detectedType)
        }

        // Add AI response to messages
        const agentMessage: Message = {
          id: Date.now().toString(),
          role: 'agent',
          content: aiResponse || "I'm here to help! Tell me more about your project.",
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, agentMessage])
        setIsTyping(false)
      } else {
        // Fallback if Puter not loaded yet
        throw new Error('Puter not available')
      }
    } catch (error) {
      console.error('Error calling Puter AI:', error)

      // Fallback to pattern matching
      const detectedType = detectSiteType(userInputCopy)
      if (detectedType && onSiteTypeDetected) {
        onSiteTypeDetected(detectedType)
      }

      const fallbackResponse = generateResponse(userInputCopy, detectedType)
      const agentMessage: Message = {
        id: Date.now().toString(),
        role: 'agent',
        content: fallbackResponse,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, agentMessage])
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-dark-card to-dark-bg rounded-2xl border-2 border-rocket-red/20 shadow-2xl overflow-hidden">
      {/* Agent Header */}
      <div className="bg-gradient-to-r from-rocket-red to-rocket-red/90 p-5 flex items-center gap-4 shadow-lg">
        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 p-1">
          <Image
            src="/images/109-logo-circle1.png"
            alt="ARIA"
            width={48}
            height={48}
            className="w-full h-full"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white text-xl tracking-wide">ARIA</h3>
            <span className="text-xs font-normal text-white/70">v{ariaVersion}</span>
          </div>
          <p className="text-white/90 text-xs font-medium tracking-wide">
            <span className="font-bold">A</span>I <span className="font-bold">R</span>apid <span className="font-bold">I</span>ntegration <span className="font-bold">A</span>ssistant
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50"></div>
            <span className="text-white/80 text-xs font-medium">Online</span>
          </div>
        </div>
      </div>

      {/* Helper Text - Only show if no messages yet */}
      {messages.length === 0 && (
        <div className="bg-gradient-to-r from-rocket-red/10 to-accent/10 border-b-2 border-rocket-red/20 p-5">
          <div className="text-sm text-text-light space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">💡</span>
              <p className="font-bold text-accent text-base">How ARIA Helps:</p>
            </div>
            <ul className="space-y-2.5 ml-2">
              <li className="flex items-start gap-3">
                <span className="text-rocket-red text-lg mt-0.5">→</span>
                <span>Powered by <span className="font-semibold text-rocket-red">AI</span> (Claude Sonnet 4) for intelligent conversations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rocket-red text-lg mt-0.5">→</span>
                <span>Provides <span className="font-semibold text-rocket-red">Rapid</span> site type recommendations based on your needs</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rocket-red text-lg mt-0.5">→</span>
                <span>Seamlessly <span className="font-semibold text-rocket-red">Integrates</span> with the Vision Studio wizard</span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-dark-bg/50 rounded-lg border border-rocket-red/30">
              <p className="text-xs text-text-gray italic">
                ✨ Your intelligent <span className="font-semibold text-accent">Assistant</span> is ready - just start chatting!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-dark-bg/30">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 animate-fadeIn ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            {message.role === 'agent' && (
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 p-0.5">
                <Image
                  src="/images/109-logo-circle1.png"
                  alt="ARIA"
                  width={32}
                  height={32}
                  className="w-full h-full"
                />
              </div>
            )}
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-dark-lighter border-2 border-rocket-red/30 flex items-center justify-center text-sm flex-shrink-0">
                <svg className="w-5 h-5 text-text-light" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            )}

            {/* Message Bubble */}
            <div className={`flex flex-col max-w-[75%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`rounded-2xl px-4 py-3 ${
                  message.role === 'agent'
                    ? 'bg-dark-card text-text-light border border-dark-lighter'
                    : 'bg-rocket-red text-white'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
              <span className="text-xs text-text-gray/50 mt-1 px-2">{formatTime(message.timestamp)}</span>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-3 animate-fadeIn">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-0.5">
              <Image
                src="/images/109-logo-circle1.png"
                alt="ARIA"
                width={32}
                height={32}
                className="w-full h-full"
              />
            </div>
            <div className="bg-dark-card border border-dark-lighter rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-rocket-red rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-rocket-red rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-rocket-red rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}

        {/* Site Type Detected Banner - only show after user has sent a message */}
        {currentSiteType && userHasInteracted && (
          <div className="sticky bottom-0 left-0 right-0 p-4 bg-gradient-to-r from-rocket-red/20 to-accent/20 border-2 border-rocket-red/40 rounded-xl animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="text-3xl">✨</div>
              <div className="flex-1">
                <p className="font-bold text-accent text-sm">Site Type Detected!</p>
                <p className="text-text-light text-xs">
                  I've selected <span className="font-bold text-rocket-red capitalize">{currentSiteType}</span> for you. Check the options below!
                </p>
              </div>
              <div className="text-2xl animate-pulse">👇</div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t-2 border-rocket-red/20 p-5 bg-gradient-to-r from-dark-card to-dark-bg shadow-inner">
        <div className="flex gap-3">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tell me about your project..."
            className="flex-1 bg-dark-bg/80 border-2 border-dark-lighter rounded-xl px-4 py-3.5 text-text-light
              placeholder:text-text-gray/60 resize-none focus:outline-none focus:border-rocket-red
              focus:ring-2 focus:ring-rocket-red/20 transition-all duration-300 font-medium"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className="bg-gradient-to-r from-rocket-red to-rocket-red/90 text-white px-8 py-3.5 rounded-xl font-bold
              hover:from-rocket-red/90 hover:to-rocket-red disabled:opacity-40 disabled:cursor-not-allowed
              transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-rocket-red/30
              active:scale-95 disabled:hover:scale-100 disabled:hover:shadow-none"
          >
            {isTyping ? '...' : 'Send'}
          </button>
        </div>
        <div className="flex items-center justify-center gap-2 mt-3">
          <span className="text-xs text-text-gray/60">⌨️ Press <kbd className="px-1.5 py-0.5 bg-dark-lighter rounded text-text-light font-mono text-xs">Enter</kbd> to send</span>
        </div>
      </div>
    </div>
  )
}
