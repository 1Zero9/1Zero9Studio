// Core types for the Website Builder App

export type SiteType = 'portfolio' | 'store' | 'blog' | 'business' | 'landing'

export type DesignStyle = 'minimalist' | 'bold' | 'futuristic' | 'classic'

export type ColorScheme = {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
}

export type Typography = {
  headingFont: string
  bodyFont: string
  scale: 'small' | 'medium' | 'large'
}

export type SectionType =
  | 'hero'
  | 'about'
  | 'services'
  | 'gallery'
  | 'portfolio'
  | 'testimonials'
  | 'blog'
  | 'contact'
  | 'newsletter'
  | 'team'
  | 'pricing'
  | 'faq'

export interface SectionConfig {
  id: string
  type: SectionType
  enabled: boolean
  order: number
  customContent?: {
    heading?: string
    description?: string
    images?: string[]
  }
}

export interface UserContent {
  businessName?: string
  tagline?: string
  logo?: string
  primaryColor?: string
  email?: string
  phone?: string
  socialLinks?: {
    facebook?: string
    instagram?: string
    twitter?: string
    linkedin?: string
  }
}

export interface BuilderState {
  // Step 1: Welcome
  started: boolean

  // Step 2: Purpose
  siteType: SiteType | null

  // Step 3: Style
  designStyle: DesignStyle | null
  colorScheme: ColorScheme | null
  typography: Typography | null

  // Step 4: Features
  selectedSections: SectionConfig[]

  // Step 5: Content
  userContent: UserContent

  // Step 6: Preview & Summary
  aiSummary?: string
  mockupScreenshot?: string

  // Step 7: Contact & CTA
  contactInfo: {
    name?: string
    email?: string
    phone?: string
    preferredContact?: 'email' | 'phone' | 'either'
    notes?: string
  }

  // Metadata
  createdAt?: string
  updatedAt?: string
  sessionId?: string
}

// Predefined color schemes
export const COLOR_SCHEMES: Record<DesignStyle, ColorScheme[]> = {
  minimalist: [
    {
      primary: '#1a1a1a',
      secondary: '#f5f5f5',
      accent: '#dc2626',
      background: '#ffffff',
      text: '#1a1a1a',
    },
    {
      primary: '#0f172a',
      secondary: '#e2e8f0',
      accent: '#3b82f6',
      background: '#f8fafc',
      text: '#0f172a',
    },
  ],
  bold: [
    {
      primary: '#dc2626',
      secondary: '#0f172a',
      accent: '#fbbf24',
      background: '#1a1a1a',
      text: '#ffffff',
    },
    {
      primary: '#7c3aed',
      secondary: '#1e293b',
      accent: '#f59e0b',
      background: '#0f172a',
      text: '#f1f5f9',
    },
  ],
  futuristic: [
    {
      primary: '#06b6d4',
      secondary: '#0f172a',
      accent: '#a855f7',
      background: '#020617',
      text: '#f0f9ff',
    },
    {
      primary: '#10b981',
      secondary: '#1e293b',
      accent: '#ec4899',
      background: '#0f172a',
      text: '#ecfdf5',
    },
  ],
  classic: [
    {
      primary: '#92400e',
      secondary: '#fef3c7',
      accent: '#dc2626',
      background: '#fffbeb',
      text: '#78350f',
    },
    {
      primary: '#1e40af',
      secondary: '#dbeafe',
      accent: '#dc2626',
      background: '#eff6ff',
      text: '#1e3a8a',
    },
  ],
}

// Typography presets
export const TYPOGRAPHY_PRESETS: Record<DesignStyle, Typography> = {
  minimalist: {
    headingFont: 'Inter',
    bodyFont: 'Inter',
    scale: 'medium',
  },
  bold: {
    headingFont: 'Bebas Neue',
    bodyFont: 'Open Sans',
    scale: 'large',
  },
  futuristic: {
    headingFont: 'Orbitron',
    bodyFont: 'Rajdhani',
    scale: 'medium',
  },
  classic: {
    headingFont: 'Playfair Display',
    bodyFont: 'Lora',
    scale: 'medium',
  },
}

// Default sections for each site type
export const DEFAULT_SECTIONS: Record<SiteType, SectionType[]> = {
  portfolio: ['hero', 'about', 'portfolio', 'testimonials', 'contact'],
  store: ['hero', 'gallery', 'about', 'testimonials', 'newsletter', 'contact'],
  blog: ['hero', 'blog', 'about', 'newsletter', 'contact'],
  business: ['hero', 'about', 'services', 'team', 'testimonials', 'contact'],
  landing: ['hero', 'services', 'testimonials', 'contact'],
}

// Section metadata
export const SECTION_METADATA: Record<SectionType, { name: string; description: string; icon: string }> = {
  hero: {
    name: 'Hero Section',
    description: 'Eye-catching intro with headline and call-to-action',
    icon: '🎯',
  },
  about: {
    name: 'About',
    description: 'Tell your story and mission',
    icon: '📖',
  },
  services: {
    name: 'Services',
    description: 'Showcase what you offer',
    icon: '⚡',
  },
  gallery: {
    name: 'Gallery',
    description: 'Image showcase or product grid',
    icon: '🖼️',
  },
  portfolio: {
    name: 'Portfolio',
    description: 'Highlight your best work',
    icon: '💼',
  },
  testimonials: {
    name: 'Testimonials',
    description: 'Client reviews and social proof',
    icon: '⭐',
  },
  blog: {
    name: 'Blog',
    description: 'Latest articles and updates',
    icon: '📝',
  },
  contact: {
    name: 'Contact',
    description: 'Get in touch form and details',
    icon: '📬',
  },
  newsletter: {
    name: 'Newsletter',
    description: 'Email signup for updates',
    icon: '📧',
  },
  team: {
    name: 'Team',
    description: 'Meet your team members',
    icon: '👥',
  },
  pricing: {
    name: 'Pricing',
    description: 'Plans and pricing options',
    icon: '💰',
  },
  faq: {
    name: 'FAQ',
    description: 'Frequently asked questions',
    icon: '❓',
  },
}

// Initial builder state
export const INITIAL_BUILDER_STATE: BuilderState = {
  started: false,
  siteType: null,
  designStyle: null,
  colorScheme: null,
  typography: null,
  selectedSections: [],
  userContent: {},
  contactInfo: {},
}

// Export format for Supabase
export interface SavedDesign extends BuilderState {
  id: string
  user_email?: string
  created_at: string
  updated_at: string
}
