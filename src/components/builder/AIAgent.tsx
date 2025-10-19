'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { SiteType } from '@/types/builder'
import { getNovaVersion } from '@/lib/versions'

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
    "Hi! I'm Nova from 1Zero9 Studio. 🚀 Tell me about your business and vision - I'll recommend the perfect website solution tailored to your goals. We specialize in turning ideas into stunning digital experiences. What are you looking to build?",
    "Welcome to 1Zero9 Studio! I'm Nova, your AI consultant. Whether you need to sell products, showcase creative work, or establish your brand - we'll design the perfect site for you. Our team combines cutting-edge tech with award-winning design. What's your vision?",
    "Hey there! I'm Nova from 1Zero9 Studio. Not sure which website type fits your business? That's exactly what we're here for! Share your goals and I'll match you with the ideal solution from our proven templates. Let's build something amazing together!",
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
  const novaVersion = getNovaVersion()

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
    if (/(business|company|agency|service|professional|consult|corporate)/i.test(lowerText)) {
      return 'business'
    }

    // Landing keywords
    if (/(landing|launch|campaign|event|convert|promote|single page)/i.test(lowerText)) {
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
      // Call Claude API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
          siteType: currentSiteType,
        }),
      })

      const data = await response.json()

      // Handle site type detection
      if (data.siteType && !currentSiteType && onSiteTypeDetected) {
        onSiteTypeDetected(data.siteType as SiteType)
      }

      // Add Claude's response
      const agentMessage: Message = {
        id: Date.now().toString(),
        role: 'agent',
        content: data.response || "I'm here to help! Tell me more about your project.",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, agentMessage])
      setIsTyping(false)
    } catch (error) {
      console.error('Error calling Claude API:', error)

      // Fallback to pattern matching if API fails
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
            alt="NOVA"
            width={48}
            height={48}
            className="w-full h-full"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white text-xl tracking-wide">NOVA</h3>
            <span className="text-xs font-normal text-white/70">v{novaVersion}</span>
          </div>
          <p className="text-white/90 text-xs font-medium tracking-wide">
            <span className="font-bold">N</span>eeds <span className="font-bold">O</span>riented <span className="font-bold">V</span>ision <span className="font-bold">A</span>ssistant
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
              <p className="font-bold text-accent text-base">How NOVA Helps:</p>
            </div>
            <ul className="space-y-2.5 ml-2">
              <li className="flex items-start gap-3">
                <span className="text-rocket-red text-lg mt-0.5">→</span>
                <span>Understands your <span className="font-semibold text-rocket-red">Needs</span> through natural conversation</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rocket-red text-lg mt-0.5">→</span>
                <span>Recommends the ideal solution <span className="font-semibold text-rocket-red">Oriented</span> to your goals</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rocket-red text-lg mt-0.5">→</span>
                <span>Matches you with the perfect <span className="font-semibold text-rocket-red">Vision</span> for your site</span>
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
                  alt="NOVA"
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
                alt="NOVA"
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
