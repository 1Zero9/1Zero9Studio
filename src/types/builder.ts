// Core types for the Website Builder App

export type SiteType = 'portfolio' | 'store' | 'blog' | 'business' | 'landing' | 'restaurant' | 'nonprofit' | 'education' | 'events' | 'community' | 'saas'

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
  purposeDescription?: string // Free-text user input

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

// Predefined color schemes with names
export const COLOR_SCHEMES: Record<DesignStyle, Array<ColorScheme & { name: string }>> = {
  minimalist: [
    {
      name: 'Monochrome',
      primary: '#1a1a1a',
      secondary: '#f5f5f5',
      accent: '#dc2626',
      background: '#ffffff',
      text: '#1a1a1a',
    },
    {
      name: 'Slate Blue',
      primary: '#0f172a',
      secondary: '#e2e8f0',
      accent: '#3b82f6',
      background: '#f8fafc',
      text: '#0f172a',
    },
    {
      name: 'Forest Green',
      primary: '#064e3b',
      secondary: '#d1fae5',
      accent: '#10b981',
      background: '#f0fdf4',
      text: '#065f46',
    },
    {
      name: 'Warm Gray',
      primary: '#57534e',
      secondary: '#fafaf9',
      accent: '#ea580c',
      background: '#fafaf9',
      text: '#44403c',
    },
    {
      name: 'Arctic White',
      primary: '#ffffff',
      secondary: '#e5e7eb',
      accent: '#059669',
      background: '#f9fafb',
      text: '#111827',
    },
    {
      name: 'Soft Lavender',
      primary: '#6366f1',
      secondary: '#f3f4f6',
      accent: '#8b5cf6',
      background: '#faf5ff',
      text: '#4338ca',
    },
    {
      name: 'Rose Quartz',
      primary: '#f43f5e',
      secondary: '#fef2f2',
      accent: '#be123c',
      background: '#fff1f2',
      text: '#881337',
    },
    {
      name: 'Ocean Mist',
      primary: '#0891b2',
      secondary: '#ecfeff',
      accent: '#14b8a6',
      background: '#f0fdfa',
      text: '#134e4a',
    },
  ],
  bold: [
    {
      name: 'Crimson Night',
      primary: '#dc2626',
      secondary: '#0f172a',
      accent: '#fbbf24',
      background: '#1a1a1a',
      text: '#ffffff',
    },
    {
      name: 'Purple Power',
      primary: '#7c3aed',
      secondary: '#1e293b',
      accent: '#f59e0b',
      background: '#0f172a',
      text: '#f1f5f9',
    },
    {
      name: 'Electric Orange',
      primary: '#ea580c',
      secondary: '#18181b',
      accent: '#facc15',
      background: '#09090b',
      text: '#fafafa',
    },
    {
      name: 'Hot Pink',
      primary: '#ec4899',
      secondary: '#18181b',
      accent: '#06b6d4',
      background: '#0c0a09',
      text: '#fafafa',
    },
    {
      name: 'Lime Punch',
      primary: '#84cc16',
      secondary: '#27272a',
      accent: '#f59e0b',
      background: '#18181b',
      text: '#fafafa',
    },
    {
      name: 'Royal Blue',
      primary: '#2563eb',
      secondary: '#1e293b',
      accent: '#f97316',
      background: '#0c1222',
      text: '#f8fafc',
    },
    {
      name: 'Sunset Red',
      primary: '#ef4444',
      secondary: '#18181b',
      accent: '#fb923c',
      background: '#0a0a0a',
      text: '#fef2f2',
    },
    {
      name: 'Emerald Fire',
      primary: '#10b981',
      secondary: '#1c1917',
      accent: '#fbbf24',
      background: '#0c0a09',
      text: '#ecfdf5',
    },
  ],
  futuristic: [
    {
      name: 'Cyber Cyan',
      primary: '#06b6d4',
      secondary: '#0f172a',
      accent: '#a855f7',
      background: '#020617',
      text: '#f0f9ff',
    },
    {
      name: 'Neon Green',
      primary: '#10b981',
      secondary: '#1e293b',
      accent: '#ec4899',
      background: '#0f172a',
      text: '#ecfdf5',
    },
    {
      name: 'Matrix',
      primary: '#22c55e',
      secondary: '#020617',
      accent: '#8b5cf6',
      background: '#000000',
      text: '#4ade80',
    },
    {
      name: 'Tron Blue',
      primary: '#3b82f6',
      secondary: '#0c0a09',
      accent: '#f97316',
      background: '#030712',
      text: '#dbeafe',
    },
    {
      name: 'Hologram Purple',
      primary: '#a855f7',
      secondary: '#0f172a',
      accent: '#06b6d4',
      background: '#050b1f',
      text: '#f3e8ff',
    },
    {
      name: 'Plasma Pink',
      primary: '#f472b6',
      secondary: '#1e1b4b',
      accent: '#22d3ee',
      background: '#0a0a1e',
      text: '#fce7f3',
    },
    {
      name: 'Laser Red',
      primary: '#f87171',
      secondary: '#0c0a09',
      accent: '#34d399',
      background: '#000000',
      text: '#fee2e2',
    },
    {
      name: 'Aurora',
      primary: '#60a5fa',
      secondary: '#1e1b4b',
      accent: '#c084fc',
      background: '#0f0a1f',
      text: '#dbeafe',
    },
  ],
  classic: [
    {
      name: 'Golden Brown',
      primary: '#92400e',
      secondary: '#fef3c7',
      accent: '#dc2626',
      background: '#fffbeb',
      text: '#78350f',
    },
    {
      name: 'Navy & Cream',
      primary: '#1e40af',
      secondary: '#dbeafe',
      accent: '#dc2626',
      background: '#eff6ff',
      text: '#1e3a8a',
    },
    {
      name: 'Burgundy',
      primary: '#881337',
      secondary: '#fce7f3',
      accent: '#ca8a04',
      background: '#fdf2f8',
      text: '#831843',
    },
    {
      name: 'Forest & Tan',
      primary: '#14532d',
      secondary: '#d1fae5',
      accent: '#b45309',
      background: '#f0fdf4',
      text: '#166534',
    },
    {
      name: 'Vintage Olive',
      primary: '#65a30d',
      secondary: '#fef9c3',
      accent: '#b91c1c',
      background: '#fefce8',
      text: '#3f6212',
    },
    {
      name: 'Royal Purple',
      primary: '#6b21a8',
      secondary: '#f3e8ff',
      accent: '#d97706',
      background: '#faf5ff',
      text: '#581c87',
    },
    {
      name: 'Tuscan Terracotta',
      primary: '#b45309',
      secondary: '#ffedd5',
      accent: '#4338ca',
      background: '#fff7ed',
      text: '#7c2d12',
    },
    {
      name: 'Sage & Ivory',
      primary: '#059669',
      secondary: '#f0fdf4',
      accent: '#b45309',
      background: '#fdfdf9',
      text: '#065f46',
    },
  ],
}

// Typography presets with names and multiple options per style
export const TYPOGRAPHY_PRESETS: Record<DesignStyle, Array<Typography & { name: string }>> = {
  minimalist: [
    {
      name: 'Modern Sans',
      headingFont: 'Inter',
      bodyFont: 'Inter',
      scale: 'medium',
    },
    {
      name: 'Clean Helvetica',
      headingFont: 'Helvetica Neue',
      bodyFont: 'Helvetica Neue',
      scale: 'medium',
    },
    {
      name: 'Geometric',
      headingFont: 'Montserrat',
      bodyFont: 'Open Sans',
      scale: 'medium',
    },
    {
      name: 'Swiss Style',
      headingFont: 'Work Sans',
      bodyFont: 'Work Sans',
      scale: 'small',
    },
    {
      name: 'Nordic',
      headingFont: 'Space Grotesk',
      bodyFont: 'DM Sans',
      scale: 'medium',
    },
    {
      name: 'Bauhaus',
      headingFont: 'Lexend',
      bodyFont: 'Inter',
      scale: 'medium',
    },
    {
      name: 'Minimal Mono',
      headingFont: 'JetBrains Mono',
      bodyFont: 'IBM Plex Sans',
      scale: 'small',
    },
    {
      name: 'Refined Sans',
      headingFont: 'Plus Jakarta Sans',
      bodyFont: 'Plus Jakarta Sans',
      scale: 'medium',
    },
  ],
  bold: [
    {
      name: 'Impact',
      headingFont: 'Bebas Neue',
      bodyFont: 'Open Sans',
      scale: 'large',
    },
    {
      name: 'Heavy Weight',
      headingFont: 'Oswald',
      bodyFont: 'Roboto',
      scale: 'large',
    },
    {
      name: 'Display Bold',
      headingFont: 'Anton',
      bodyFont: 'Poppins',
      scale: 'large',
    },
    {
      name: 'Strong Condensed',
      headingFont: 'Archivo Black',
      bodyFont: 'Source Sans Pro',
      scale: 'medium',
    },
    {
      name: 'Block Letters',
      headingFont: 'Alfa Slab One',
      bodyFont: 'Nunito',
      scale: 'large',
    },
    {
      name: 'Wide Impact',
      headingFont: 'Teko',
      bodyFont: 'Lato',
      scale: 'large',
    },
    {
      name: 'Street Bold',
      headingFont: 'Russo One',
      bodyFont: 'Montserrat',
      scale: 'medium',
    },
    {
      name: 'Headline Heavy',
      headingFont: 'Black Ops One',
      bodyFont: 'Barlow',
      scale: 'large',
    },
  ],
  futuristic: [
    {
      name: 'Sci-Fi',
      headingFont: 'Orbitron',
      bodyFont: 'Rajdhani',
      scale: 'medium',
    },
    {
      name: 'Tech',
      headingFont: 'Exo 2',
      bodyFont: 'Roboto',
      scale: 'medium',
    },
    {
      name: 'Digital',
      headingFont: 'Audiowide',
      bodyFont: 'Electrolize',
      scale: 'medium',
    },
    {
      name: 'Cyber',
      headingFont: 'Saira',
      bodyFont: 'Rajdhani',
      scale: 'small',
    },
    {
      name: 'Quantum',
      headingFont: 'Chakra Petch',
      bodyFont: 'Kanit',
      scale: 'medium',
    },
    {
      name: 'Neon Grid',
      headingFont: 'Iceberg',
      bodyFont: 'Chakra Petch',
      scale: 'medium',
    },
    {
      name: 'Space Age',
      headingFont: 'Michroma',
      bodyFont: 'Exo',
      scale: 'small',
    },
    {
      name: 'Circuit',
      headingFont: 'Turret Road',
      bodyFont: 'Titillium Web',
      scale: 'medium',
    },
  ],
  classic: [
    {
      name: 'Elegant Serif',
      headingFont: 'Playfair Display',
      bodyFont: 'Lora',
      scale: 'medium',
    },
    {
      name: 'Traditional',
      headingFont: 'Merriweather',
      bodyFont: 'Merriweather',
      scale: 'medium',
    },
    {
      name: 'Editorial',
      headingFont: 'Cormorant Garamond',
      bodyFont: 'Crimson Text',
      scale: 'large',
    },
    {
      name: 'Refined',
      headingFont: 'EB Garamond',
      bodyFont: 'Source Serif Pro',
      scale: 'medium',
    },
    {
      name: 'Literary',
      headingFont: 'Libre Baskerville',
      bodyFont: 'Libre Baskerville',
      scale: 'medium',
    },
    {
      name: 'Vintage',
      headingFont: 'Cardo',
      bodyFont: 'Gentium Book Basic',
      scale: 'medium',
    },
    {
      name: 'Stately',
      headingFont: 'Cinzel',
      bodyFont: 'Crimson Pro',
      scale: 'large',
    },
    {
      name: 'Old World',
      headingFont: 'Spectral',
      bodyFont: 'Spectral',
      scale: 'medium',
    },
  ],
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
