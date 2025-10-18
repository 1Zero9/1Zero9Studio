# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

1Zero9 Studio is a modern Next.js 15 portfolio/marketing website for a web design studio. The site features a dark theme with red accent colors ("rocket-red"), smooth animations using Framer Motion, and a landing page experience.

## Development Commands

```bash
# Development server (runs on http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom dark theme
- **Animations**: Framer Motion (installed but currently using CSS animations and Intersection Observer)
- **Fonts**: Google Fonts (Inter, Poppins, Orbitron)

## Architecture & Code Organization

### App Router Structure

The project uses Next.js App Router with the following route structure:

- `src/app/page.tsx` - Main home page with hero, about, services, and contact form sections
- `src/app/layout.tsx` - Root layout with metadata and font setup
- `src/app/portfolio/page.tsx` - Portfolio page with Netflix-style grid layout
- `src/app/globals.css` - Global styles with custom Tailwind components
- **Legacy pages** (not in active use): `services/page.tsx`, `about/page.tsx`, `contact/page.tsx`

### Component Architecture

**Landing Page System:**

1. **MainApp Component** (`src/components/MainApp.tsx`)
   - Minimal wrapper component managing the landing page transition
   - Controls session-based landing page display (shows only on first visit)
   - After landing page, simply renders children without any wrapper markup
   - Wraps all route content via `layout.tsx`

2. **LandingPage Component** (`src/components/LandingPage.tsx`)
   - Animated intro screen with circular 109 logo (`109-logo-circle-white2.png`)
   - Displays for 3 seconds on first visit, then fades out
   - Uses `sessionStorage` to track if user has already seen it
   - Fixed issue: Removed `onComplete` from useEffect dependencies to prevent infinite loop

**Home Page Features:**
- **Scroll-Reactive Logo**: Large circular logo (250px) at top center with responsive behavior:
  - **Mobile**: Fades out completely when scrolling (`opacity-0`), stays centered
  - **Desktop/Tablet**: Scales down to 30% and moves to top-left when scrolling
  - Smooth 500ms transitions for all changes
  - Starts at 75% scale on mobile, 100% on desktop
  - Fixed position with z-50, uses `priority` prop for faster loading
- **Scroll-Triggered Navigation**: Minimal nav bar appears on scroll
  - Slides down from top-right when user scrolls past 100px
  - Contains "Portfolio" link and "Contact" button
  - Backdrop blur effect with dark card background
  - Fully responsive with smaller text/padding on mobile
- **Neon Pulsing Background**: Heartbeat logo (109-logo1.png) in hero section
  - Large (800px) with custom neon-glow effect using drop-shadows
  - Animates with 3s pulse cycle, intensifying red glow
  - Scaled down (50%) and lower opacity (5%) on mobile
  - Positioned absolutely, non-interactive (`pointer-events-none`)
- **Contact Form Integration**: Professional multi-field form with validation
  - Replaces simple CTA buttons with full contact form
  - Located at `#contact` section, linked from hero buttons
  - Form details in ContactForm component section below
- **Mobile Optimizations**:
  - Responsive typography scaling (5xl → 6xl → 7xl)
  - Hero section top padding on mobile to accommodate logo
  - Stats with shorter labels on mobile
  - Decorative side card hidden on mobile (`hidden lg:block`)
  - Better spacing and button sizes for touch targets
- **Sections**: Hero, About, Services, Contact Form, Footer all inline in single page component

**Portfolio Page** (`src/app/portfolio/page.tsx`)
- **Netflix-Style Design**: Dark theme with grid layout
- **Category Filtering**: Sticky filter bar at top with categories:
  - All, E-Commerce, Corporate, Portfolio, SaaS, Hospitality, Mobile
  - Active category highlighted in rocket-red
  - Smooth transitions on filter change
- **Project Grid**:
  - Responsive grid: `sm:grid-cols-2 lg:grid-cols-3`
  - 6 sample projects with real metadata structure
  - Hover effects: scale-105, shadow-2xl, title color change
  - Play button overlay appears on hover
  - Each project card shows: title, description, tags (max 3 visible), category badge, year
- **Navigation**: Clickable logo at top returns to homepage
- **CTA Section**: Links back to main page contact form
- **Mobile Optimized**: Touch-friendly cards, proper spacing, responsive typography

**ContactForm Component** (`src/components/ContactForm.tsx`)
- **Fields**: Name*, Email*, Phone, Company, Project Type*, Message*
- **Project Types**: Website, Mobile App, E-commerce, Redesign, Maintenance, Consulting, Other
- **Validation**: HTML5 required fields, email type validation
- **States**: idle, submitting (with spinner), success (with animation), error
- **Features**:
  - Loading spinner during submission
  - Success animation with checkmark and auto-reset
  - Error handling with user feedback
  - Form reset after successful submission
  - Auto-close support for modal usage
  - Fully responsive grid layout
- **Backend**: Currently simulated with setTimeout, includes TODO comments for API integration

**Website Builder Components** (`src/components/builder/` and `/builder` route):

1. **BuilderHeader** (`src/components/builder/BuilderHeader.tsx`)
   - Fixed header for builder pages only
   - Logo with link back to home
   - Auto-save indicator, help button, exit button
   - Replaces main navigation when on `/builder` routes

2. **BuilderContext** (`src/context/BuilderContext.tsx`)
   - Global state management using React Context API
   - Auto-saves to localStorage on every state change
   - Provides methods: updateState, setSiteType, setDesignStyle, setColorScheme, etc.
   - Manages currentStep and navigation between wizard steps

3. **Wizard Step Components** (`src/components/builder/steps/`)
   - **WelcomeStep**: Landing page with feature highlights and "Start Building" button
   - **PurposeStep**: Site type selection (Portfolio, Store, Blog, Business, Landing)
   - **StyleStep**: 3-tab interface for Design Style, Colors, Typography selection
   - Steps 4-6: Placeholder "COMING SOON" screens

4. **Shared Builder Components** (`src/components/builder/`)
   - **StepIndicator**: Progress bar showing current step and completion
   - **NavigationControls**: Back/Next buttons with step validation

5. **Builder Types** (`src/types/builder.ts`)
   - Complete TypeScript definitions for all builder state
   - Predefined constants: COLOR_SCHEMES, TYPOGRAPHY_PRESETS, DEFAULT_SECTIONS, SECTION_METADATA
   - 5 site types, 4 design styles, 12 section types

6. **Builder Page** (`src/app/builder/page.tsx`)
   - Main wizard orchestrator
   - Renders appropriate step component based on currentStep
   - Validates user selections before allowing progression
   - Shows BuilderHeader and progress indicator

**Subpage Components:**
- `SubpageHeader.tsx` - Reusable header for portfolio and other subpages (title, highlight, description, icon)
- `ConditionalNavigation.tsx` - Shows/hides main navigation based on route (hides on `/builder`)

**Other Components:**
- `Header.tsx`, `Footer.tsx` - Legacy components (not currently in use)
- `RocketAnimation.tsx` - Standalone animation component
- `LandingPage.tsx` - Splash screen component (described above)

### Key Design Patterns

**Animation Pattern:**
- Uses custom `useIntersectionObserver` hook in `page.tsx` for scroll-triggered animations
- Sections fade in and slide up when they enter viewport
- Custom CSS animations defined in `globals.css`

**Styling System:**
- Custom Tailwind utilities defined in `globals.css` under `@layer components`
- Reusable classes: `.btn-primary`, `.btn-secondary`, `.card`, `.section-padding`, etc.
- Custom color palette defined in `tailwind.config.js`:
  - `rocket-red`: Primary brand color (#dc2626)
  - `dark-bg`, `dark-card`, `dark-lighter`: Dark theme backgrounds
  - `text-light`, `text-gray`: Text colors
  - `accent`: Golden accent (#fbbf24)

**Font System:**
- Inter: Primary body font
- Poppins: Headings (weights: 400, 500, 600, 700)
- Orbitron: Logo/brand text with `.logo-title` class

### TypeScript Configuration

- Path aliases: `@/*` maps to `./src/*`
- Strict mode enabled
- ES2017 target

### Image Assets

Images are stored in `/public/images/`:
- **Primary Logo**: `109-logo-circle-white2.png` - Circular logo used in landing page and scroll-reactive header
- Logo variations: `109-logo-circle1.png`, `109-logo-circle2.png`, `109-logo1.png`
- Text logo: `109-black-bg-whitetext.png`
- Red rocket logo: `redrocket-logo.jpg` (used in footer and CTA sections)
- Favicon: `/public/favicon.ico` and `/public/apple-touch-icon.png`

## Important Patterns & Conventions

1. **Client Components**: Most interactive components use `'use client'` directive since they rely on hooks and browser APIs

2. **Responsive Design**: Mobile-first approach with breakpoints:
   - Base: Mobile (<640px)
   - `sm:`: Small tablets (≥640px)
   - `md:`: Medium tablets/small desktops (≥768px)
   - `lg:`: Desktops (≥1024px)

3. **Smooth Scrolling**: Implemented via scroll-into-view with `behavior: 'smooth'`

4. **Visual Effects**:
   - `.glow-effect`: Red box-shadow glow for key elements
   - `.neon-glow`: Animated neon effect with pulsing drop-shadows (3s cycle)
   - Custom animations defined in globals.css

5. **Session-based Landing**: Landing page only shows once per browser session using `sessionStorage`

6. **Mobile-First Responsive Patterns**:
   - Logo fades out on mobile when scrolling (stays visible on desktop)
   - Background effects reduced on mobile (lower opacity, smaller scale)
   - Decorative elements hidden on small screens
   - Touch-friendly button sizes and spacing

## Styling Notes

- **Theme**: Dark background (#0f172a) with red accents (#dc2626)
- **Typography**: Large, bold headings with generous spacing
- **Cards**: Dark cards with subtle borders and hover effects
- **Gradients**: Hero section uses dark gradient background
- **Shadows**: Layered shadow effects on cards and buttons

## Known Issues & Considerations

- Framer Motion is installed as a dependency but not actively used in current implementation
- There are unused component files (Header.tsx, Footer.tsx) - may be from previous iterations
- The home page (`page.tsx`) is a large single file with all sections inline - could be refactored into separate section components for better maintainability

## Recent Updates (October 2025)

**Main Site Polish Complete:**
- ✅ Contact form integrated with full validation and states
- ✅ Netflix-style portfolio page with category filtering
- ✅ Scroll-triggered navigation with Portfolio and Contact links
- ✅ All navigation links working (home ↔ portfolio, scroll to contact)
- ✅ Mobile responsiveness verified across all pages
- ✅ Consistent dark theme with rocket-red accents throughout
- ✅ Hero button "View Our Work" now links to portfolio page
- ✅ Contact form rebranded from "Ready to Launch" to "Let's Connect" (separated from builder app identity)
- ✅ Fixed navigation logo overlap on subpages (logo only shows large/centered on homepage)
- ✅ Created reusable SubpageHeader component for consistent subpage layouts

**Navigation Updates:**
- Main navigation now uses `usePathname()` to detect current route
- Logo behavior: Large centered on homepage initial load, small/left on all subpages
- Mobile logo only appears on homepage, hidden on subpages
- ConditionalNavigation wrapper hides main nav on `/builder` routes
- Portfolio page uses SubpageHeader with icon to prevent overlap

**Website Builder App (In Progress - Phase 1 ~40% Complete):**
- ✅ Complete TypeScript type system with BuilderState, SiteType, DesignStyle, ColorScheme, Typography
- ✅ Context API state management with localStorage persistence
- ✅ 7-step wizard structure: Welcome → Purpose → Style → Features → Content → Preview → Submit
- ✅ Steps 0-2 implemented (Welcome, Purpose selection, Style customization)
- ✅ Dedicated BuilderHeader with exit/help buttons and auto-save indicator
- ✅ StepIndicator component with progress bar
- ✅ NavigationControls with validation at each step
- ✅ 8 predefined color schemes (2 per design style)
- ✅ 4 typography presets with auto-matching
- 🚧 Steps 3-6 pending: Features selection, Content upload, Preview, Contact/CTA
- 🚧 Live preview components pending
- 🚧 Tailwind theme system for dynamic styling pending
- 🚧 Supabase integration pending
- 🚧 Claude AI summary generation pending

**Navigation Flow:**
- Home page → Portfolio link appears when scrolling
- Portfolio page → Click logo to return home
- Hero buttons → "Build Your Site" goes to builder, "View Our Work" goes to portfolio
- Contact form accessible from nav bar or hero section
- Builder app → Dedicated header with exit button to return home

## Roadmap / Next Steps

The following features are planned for future development:

1. **Backend Integration for Contact Form**:
   - Create API endpoint at `/api/contact`
   - Integrate with email service (SendGrid, Resend, etc.)
   - Add proper error handling and validation
   - Consider adding rate limiting

2. **Portfolio Content Population**:
   - Replace placeholder images with actual project screenshots
   - Update project descriptions with real case studies
   - Add actual project links (currently pointing to "#")
   - Consider adding project detail pages

3. **AI Integration Section**: Content explaining how the studio uses AI to collaborate with clients and streamline development

4. **Launch Project App**: An intelligent guided wizard that helps users who don't know what they need:
   - Multi-step questionnaire to understand requirements
   - AI-powered recommendations for services, features, and solutions
   - Guides users to appropriate offerings: information pages, services, contact forms, booking systems, custom apps
   - Personalized project scope and pricing estimates
   - Progressive disclosure to avoid overwhelming non-technical users
   - Could be a separate route (e.g., `/launch`) or modal overlay
