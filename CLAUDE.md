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

- `src/app/page.tsx` - Home page with hero, about, services, and CTA sections
- `src/app/layout.tsx` - Root layout with metadata and font setup
- `src/app/services/page.tsx` - Services page
- `src/app/portfolio/page.tsx` - Portfolio page
- `src/app/about/page.tsx` - About page
- `src/app/contact/page.tsx` - Contact page
- `src/app/globals.css` - Global styles with custom Tailwind components

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
- **Neon Pulsing Background**: Heartbeat logo (109-logo1.png) in hero section
  - Large (800px) with custom neon-glow effect using drop-shadows
  - Animates with 3s pulse cycle, intensifying red glow
  - Scaled down (50%) and lower opacity (5%) on mobile
  - Positioned absolutely, non-interactive (`pointer-events-none`)
- **Mobile Optimizations**:
  - Responsive typography scaling (5xl → 6xl → 7xl)
  - Hero section top padding on mobile to accommodate logo
  - Stats with shorter labels on mobile
  - Decorative side card hidden on mobile (`hidden lg:block`)
  - Better spacing and button sizes for touch targets
- **No Navigation Header**: Clean, immersive design without fixed nav bar
- **Sections**: Hero, About, Services, CTA, Footer all inline in single page component

**Other Components:**
- `Header.tsx`, `Footer.tsx` - Legacy components (not currently in use)
- `RocketAnimation.tsx` - Standalone animation component

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

## Roadmap / Next Steps

The following features are planned for future development:

1. **Contact Form**: Interactive form for user inquiries and project submissions

2. **AI Integration Section**: Content explaining how the studio uses AI to collaborate with clients and streamline development

3. **Launch Project App**: An intelligent guided wizard that helps users who don't know what they need:
   - Multi-step questionnaire to understand requirements
   - AI-powered recommendations for services, features, and solutions
   - Guides users to appropriate offerings: information pages, services, contact forms, booking systems, custom apps
   - Personalized project scope and pricing estimates
   - Progressive disclosure to avoid overwhelming non-technical users
