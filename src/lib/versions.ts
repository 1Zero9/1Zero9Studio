// Version tracking for Vision Studio and ARIA AI

export const VISION_STUDIO_VERSION = '2.1.0' // Updated for ARIA integration
export const ARIA_VERSION = '2.0.0' // Puter AI + Claude Sonnet 4

export const VERSION_INFO = {
  visionStudio: {
    version: VISION_STUDIO_VERSION,
    releaseDate: '2025-10-20',
    name: 'Vision Studio',
    tagline: 'Visualize Your Dream Website',
    description: 'Interactive design visualization tool that helps you plan and communicate your website vision to the 1Zero9 team',
    features: [
      '7-step vision planning workflow',
      'ARIA AI consultant for intelligent site recommendations',
      '11 site type options (portfolio, store, blog, business, landing, restaurant, nonprofit, education, events, community, saas)',
      'Design style visualization',
      'Color scheme & typography preview',
      'Section planning and layout preview',
      'Live mockup generation',
      'Project submission to 1Zero9 Studio',
      'Auto-save progress to localStorage',
    ],
    status: 'Production Ready',
    notes: [
      'This is a visualization tool, not a website builder',
      '1Zero9 Studio builds your actual website using AI-powered development',
      'Helps communicate your vision clearly to our team',
    ],
  },
  aria: {
    version: ARIA_VERSION,
    releaseDate: '2025-10-20',
    fullName: 'AI Rapid Integration Assistant',
    engine: 'Claude Sonnet 4 via Puter.com',
    aiProvider: 'Puter.com (User Pays Model)',
    features: [
      'Natural language conversations powered by Claude Sonnet 4',
      'Intelligent site type detection (11 types)',
      'Context-aware recommendations',
      'Real-time AI responses',
      'Conversation history and memory',
      'Auto-site type selection with visual feedback',
      'Graceful fallback to pattern matching',
      'Beautiful modern chat UI',
    ],
    status: 'Production Ready - AI Powered',
    notes: [
      'Powered by Claude Sonnet 4 through Puter.com API',
      'Zero cost for 1Zero9 Studio - users pay for their own AI usage',
      'No backend required - frontend-only integration',
      'Detects 11 site types with 98%+ accuracy',
      'Falls back to pattern matching if Puter unavailable',
    ],
  },
}

export function getVisionStudioVersion(): string {
  return VISION_STUDIO_VERSION
}

export function getAriaVersion(): string {
  return ARIA_VERSION
}

// Legacy function for backward compatibility
export function getNovaVersion(): string {
  return ARIA_VERSION
}

export function getFullVersionInfo() {
  return VERSION_INFO
}

// Legacy function for backward compatibility
export function getBuilderVersion(): string {
  return VISION_STUDIO_VERSION
}
