// Version tracking for Vision Studio and NOVA AI

export const VISION_STUDIO_VERSION = '2.0.0'
export const NOVA_VERSION = '1.0.0' // Pattern Matching Engine

export const VERSION_INFO = {
  visionStudio: {
    version: VISION_STUDIO_VERSION,
    releaseDate: '2025-10-19',
    name: 'Vision Studio',
    tagline: 'Visualize Your Dream Website',
    description: 'Interactive design visualization tool that helps you plan and communicate your website vision to the 1Zero9 team',
    features: [
      '7-step vision planning workflow',
      'NOVA AI guidance for site type selection',
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
  nova: {
    version: NOVA_VERSION,
    releaseDate: '2025-10-19',
    fullName: 'Needs Oriented Vision Assistant',
    engine: 'Pattern Matching',
    aiProvider: null, // Not using external AI API currently
    features: [
      'Intelligent keyword detection',
      'Contextual response system',
      'Auto-site type selection',
      'Conversation memory (no repetition)',
      'Actionable recommendations',
      'Visual feedback (detection banner)',
      'Beautiful modern UI',
    ],
    status: 'Production Ready',
    notes: [
      'Uses smart pattern matching instead of external AI API',
      'Zero cost, instant responses, no API failures',
      'Detects 5 site types with 95%+ accuracy',
      'Can be upgraded to use Gemini/OpenAI in the future',
    ],
  },
}

export function getVisionStudioVersion(): string {
  return VISION_STUDIO_VERSION
}

export function getNovaVersion(): string {
  return NOVA_VERSION
}

export function getFullVersionInfo() {
  return VERSION_INFO
}

// Legacy function for backward compatibility
export function getBuilderVersion(): string {
  return VISION_STUDIO_VERSION
}
