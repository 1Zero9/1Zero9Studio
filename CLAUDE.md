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
   - Integrated horizontal step indicator (1-7) showing progress
   - Color-coded steps: completed (accent), current (rocket-red with ring), upcoming (gray)
   - Auto-save indicator, help button, reset button
   - Reset button highlights when saved data exists
   - Session restoration banner when returning to builder
   - Replaces main navigation when on `/builder` routes

2. **BuilderContext** (`src/context/BuilderContext.tsx`)
   - Global state management using React Context API
   - Auto-saves to localStorage on every state change
   - Provides methods: updateState, setSiteType, setDesignStyle, setColorScheme, etc.
   - Manages currentStep and navigation between wizard steps

3. **AIAgent Component** (`src/components/builder/AIAgent.tsx`)
   - Conversational AI assistant "Nova" for gathering user requirements
   - Chat-style interface with message history and typing indicators
   - Keyword detection to automatically suggest site types
   - Integrates with PurposeStep for dual input method (chat + form)
   - Features: emoji avatars, timestamps, auto-scroll, responsive message bubbles
   - Uses predefined response patterns (greeting, follow-up, encouragement, clarification)

4. **Wizard Step Components** (`src/components/builder/steps/`)
   - **WelcomeStep**: Landing page with feature highlights and "Start Building" button
   - **PurposeStep**: Centered AI-first interface for site type selection:
     - ARIA chat interface centered (max-width 768px)
     - Single-focus, distraction-free layout for data gathering
     - Auto-suggests site type based on keywords in conversation
     - Selection status appears at bottom when type detected
     - "Browse all options" link for users who prefer traditional selection
     - Vertical and horizontal centering for optimal focus
   - **StyleStep**: 3-tab progressive interface:
     - Tab 1: Design Style selection (Minimalist, Bold, Futuristic, Classic)
     - Tab 2: Color schemes (8 palettes per style with color swatches)
     - Tab 3: Typography presets (8 font pairings per style with live previews)
     - Auto-selects first color/typography when style chosen, then advances to Colors tab
   - **FeaturesStep**: Interactive section organizer:
     - Auto-loads default sections based on site type (from `DEFAULT_SECTIONS`)
     - Two-column layout: main section list (left) + add sections sidebar (right)
     - Drag-and-drop reordering using native HTML5 drag API
     - Enable/disable toggles for each section
     - Remove button to delete sections completely
     - Visual order indicators and drag handles
     - Pro tips card with best practices
     - Validation warning if no sections enabled
   - **ContentStep**: Comprehensive content collection form:
     - Business basics: name (required), tagline (required)
     - Logo upload with drag-and-drop or click to browse
     - Image validation: file type (JPG, PNG, SVG, WebP), max 5MB
     - Base64 encoding for logo preview and storage
     - Brand color picker with live preview and hex input
     - Contact info: email, phone
     - Social media links: Facebook, Instagram, Twitter, LinkedIn
     - Real-time validation feedback with success/warning messages
   - **PreviewStep**: Project summary with tech stack showcase:
     - "YOU'RE ALMOST DONE!" CTA at top
     - **8-item Enterprise Tech Stack visualization**:
       - Two-column layout (4 items per column)
       - Stack: Next.js 15, React 19, Claude AI, Supabase, PostgreSQL, Vercel Edge, TypeScript, Tailwind CSS
       - Animated downward arrows between boxes (2-3 bounce every 1.5s)
       - Green terminal-style theme
       - Boxes pulse when arrows are active
       - Professional "wow factor" before submission
     - Quick project summary (site type, design style, section count)
     - "What Happens Next" roadmap (submit → 24hr response → 7-14 day build)
     - Quick edit panel to jump back to any previous step
     - Encourages final submission
   - **SubmitStep**: Final submission and confirmation:
     - Contact form: name (required), email (required), phone (optional)
     - Preferred contact method selector: Email, Phone, Either
     - Additional notes textarea for special requirements
     - Terms checkbox for communication consent
     - Form validation with real-time feedback
     - Animated submission state with loading spinner
     - Success screen with:
       - Animated checkmark icon
       - "What Happens Next" 3-step roadmap
       - Email confirmation notice
       - Return to Home and Start New Project buttons

5. **Shared Builder Components** (`src/components/builder/`)
   - **StepIndicator**: Progress bar showing current step and completion
   - **NavigationControls**: Back/Next buttons with step validation

6. **Builder Types** (`src/types/builder.ts`)
   - Complete TypeScript definitions for all builder state
   - Predefined constants: COLOR_SCHEMES (8 per style), TYPOGRAPHY_PRESETS (8 per style), DEFAULT_SECTIONS, SECTION_METADATA
   - **11 site types**: Portfolio, Online Store, Blog, Business, Landing Page, Restaurant, Nonprofit, Education, Events, Community, SaaS Product
   - 4 design styles, 12 section types
   - Color schemes include: Minimalist (Monochrome, Slate Blue, etc.), Bold (Crimson Night, Purple Power, etc.), Futuristic (Cyber Cyan, Matrix, etc.), Classic (Golden Brown, Navy & Cream, etc.)
   - Typography presets include: Minimalist (Modern Sans, Geometric, etc.), Bold (Impact, Heavy Weight, etc.), Futuristic (Sci-Fi, Tech, etc.), Classic (Elegant Serif, Editorial, etc.)

7. **Builder Page** (`src/app/builder/page.tsx`)
   - Main wizard orchestrator wrapping all steps in BuilderProvider
   - Renders appropriate step component based on currentStep
   - Validates user selections before allowing progression
   - Shows BuilderHeader and progress indicator (hidden on welcome screen)
   - Debug panel in development mode (shows step, site type, can proceed status)

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

7. **Builder State Management Pattern**:
   - All builder state lives in BuilderContext and auto-saves to localStorage
   - Step validation happens before allowing progression (see `canProceed()` in builder/page.tsx)
   - When selecting a design style, color and typography are auto-populated with first preset
   - Named properties (like `name` in color schemes) are destructured out before saving to state
   - State includes timestamps (`createdAt`, `updatedAt`) for tracking changes

8. **AI Agent Pattern**:
   - Uses keyword detection with regex patterns to identify user intent
   - Provides contextual responses based on detected site type
   - Integrates with parent component via callbacks (`onSiteTypeDetected`, `onUserInput`)
   - Maintains conversation history in component state (not persisted)
   - Auto-scrolls to latest message using refs and useEffect

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
- Builder AI Agent uses simple regex pattern matching - ready for future Claude API integration for smarter responses
- localStorage for builder state means data is lost on browser clear - Supabase integration planned for persistence

## Working with the Website Builder

When modifying or extending the website builder:

1. **Adding a New Step**:
   - Create step component in `src/components/builder/steps/`
   - Update `STEP_NAMES` array in `src/app/builder/page.tsx`
   - Add validation logic in `canProceed()` function
   - Add case to `renderStep()` switch statement
   - Update `BuilderState` type in `src/types/builder.ts` if new state needed

2. **Adding New Design Styles or Presets**:
   - Color schemes: Add to `COLOR_SCHEMES` object in `src/types/builder.ts`
   - Typography: Add to `TYPOGRAPHY_PRESETS` object
   - Always provide 8 options per style for consistency
   - Include descriptive `name` property for display (will be stripped before saving to state)

3. **Extending the AI Agent**:
   - Response patterns live in `AGENT_RESPONSES` object
   - Keyword detection in `detectSiteType()` function uses regex
   - Add new patterns for more sophisticated detection
   - For Claude API integration, replace pattern matching in `generateResponse()`

4. **Builder Debug Mode**:
   - Debug panel automatically appears in development mode (bottom-right)
   - Shows current step, site type, description preview, validation status
   - Remove or comment out in production builds
   - Controlled by `process.env.NODE_ENV === 'development'` check

## Recent Updates (October 2025)

**Vision Studio v2.1 - Customer-First UX Redesign (October 20, 2025):**
- ✅ **Step Indicator in BuilderHeader**: Horizontal progress bar (1-7) integrated into header
  - Shows current step in rocket-red with ring effect
  - Completed steps in golden accent color
  - Upcoming steps in gray
  - Hidden on mobile for cleaner layout
  - Removed separate StepIndicator component
- ✅ **PurposeStep Centered Layout**: Complete redesign for focused data gathering
  - Removed split-screen and browse grid
  - Centered ARIA chat interface (max-width 768px)
  - Single-purpose, distraction-free layout
  - Vertical and horizontal centering
  - "Browse all options" link at bottom for users who need it
  - Selection status shows at bottom of chat when detected
- ✅ **Tech Stack Visualization**: 8-item enterprise stack with animated arrows
  - Moved from PurposeStep to PreviewStep (final wow factor)
  - Two-column layout (4 items per column)
  - Stack: Next.js 15, React 19, Claude AI, Supabase, PostgreSQL, Vercel Edge, TypeScript, Tailwind CSS
  - Downward bouncing arrows between boxes
  - 2-3 arrows randomly animate every 1.5 seconds
  - Green terminal-style theme
  - Boxes pulse when arrows are active
- ✅ **MainApp Simplification**: Landing page disabled for development (faster iteration)
- ✅ **Customer-First Philosophy**: Prioritizing lead generation and data gathering over technical showcasing
- ✅ **Created Reusable Components**:
  - `ArchitectureDiagram.tsx` - Full system architecture visualization (for future use)
  - `TechStackVisualization.tsx` - Standalone tech stack component (for future use)

**Vision Studio v2.0 - Latest Polish (October 19, 2025):**
- ✅ **Replaced emoji icons with professional SVG icons** for all site types (briefcase, shopping bag, edit, building, lightning, etc.)
- ✅ **Expanded site types from 5 to 11**: Added Restaurant, Nonprofit, Education, Events, Community, SaaS Product
- ✅ **Condensed and optimized card layout**: 4-column grid (was 3), compact sizing for better density
- ✅ **WelcomeStep fits on one page**: Reduced spacing, smaller elements, 4-column "How It Works" section
- ✅ **Comprehensive mobile responsiveness**: All elements properly scaled for mobile, tablet, desktop
- ✅ **Improved PurposeStep UX**:
  - Mode toggle buttons stack vertically on mobile
  - Browse section with helpful introduction text
  - Enhanced selection confirmation card with visual hierarchy
  - Professional SVG icons in rounded containers with color transitions
- ✅ **Reduced orange intensity**: Switched to pure red (`rocket-red`) throughout, removed orange gradients
- ✅ **Dark logo implementation**: Switched from white to dark logo version (109-logo-circle1.png) wrapped in white circle for visibility
- ✅ **ARIA branding complete**: "Artificial Requirements & Intelligence Assistant" acronym
- ✅ **Cleaner messaging**: Tool correctly branded as "visualization" not "building" - Vision Studio v2.0.0

## Recent Updates (Pre-Vision Studio Polish)

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

**Website Builder App (COMPLETE - Phase 4 ~95% Complete):**
- ✅ Complete TypeScript type system with BuilderState, SiteType, DesignStyle, ColorScheme, Typography
- ✅ Context API state management with localStorage persistence
- ✅ 7-step wizard structure: Welcome → Purpose → Style → Features → Content → Preview → Submit
- ✅ ALL STEPS FULLY IMPLEMENTED (0-6):
  - Step 0: Welcome screen with feature highlights and CTA
  - Step 1: Purpose selection with dual interface (AI chat + traditional form)
  - Step 2: Style customization with 3-tab progressive interface (Design → Colors → Typography)
  - Step 3: Features selection with drag-and-drop section organizer
  - Step 4: Content upload with business info, logo, contact details, social links
  - Step 5: Live preview with responsive viewport toggles and quick edit panel
  - Step 6: Final submission form with contact info and success confirmation
- ✅ AI Agent "Nova" chat interface for conversational requirement gathering
- ✅ Dedicated BuilderHeader with exit/help buttons and auto-save indicator
- ✅ StepIndicator component with progress bar
- ✅ NavigationControls with validation at each step
- ✅ 32 predefined color schemes (8 per design style) with visual swatches
- ✅ 32 typography presets (8 per design style) with live font previews
- ✅ Auto-suggestion system based on keyword detection
- ✅ Section selector with drag-and-drop reordering, enable/disable toggles
- ✅ Default sections auto-populated based on site type
- ✅ Image upload with preview, validation (file type, size), and base64 encoding
- ✅ Brand color picker with hex input
- ✅ Social media links (Facebook, Instagram, Twitter, LinkedIn)
- ✅ Live website preview with dynamic theming from user selections
- ✅ Responsive viewport toggles (desktop, tablet, mobile)
- ✅ Quick edit panel in preview to jump back to any step
- ✅ Final contact form with preferred contact method
- ✅ Animated success confirmation screen with next steps
- ✅ Debug panel for development (shows current state and validation)
- ✅ Supabase integration for data persistence (fully implemented)
- ✅ Email notification system with Resend (fully implemented)
- 🚧 Claude AI API integration for enhanced suggestions (currently using pattern matching)

**Navigation Flow:**
- Home page → Portfolio link appears when scrolling
- Portfolio page → Click logo to return home
- Hero buttons → "Build Your Site" goes to builder, "View Our Work" goes to portfolio
- Contact form accessible from nav bar or hero section
- Builder app → Dedicated header with exit button to return home

## Supabase & Email Integration

### Database (Supabase)

The website builder saves all submissions to a Supabase database.

**Setup Required:**
1. Follow instructions in `SUPABASE_SETUP.md`
2. Create a Supabase project at supabase.com
3. Run `supabase-schema.sql` in the SQL Editor
4. Add credentials to `.env.local` (see `.env.example`)

**Database Schema:**
- Table: `saved_designs`
- Stores: contact info, design choices, sections, content, full state
- Includes: Row Level Security, triggers, indexes
- Admin view: `design_submissions_summary`

**API Endpoints:**
- `POST /api/save-design` - Saves a completed design + sends emails
- `GET /api/save-design?id=xxx` - Retrieves a design by ID

**Client Libraries:**
- `@supabase/supabase-js` for database operations
- Client utility: `src/lib/supabase.ts`
- Service client for backend (uses service role key)
- Public client for frontend (uses anon key)

### Email Notifications (Resend)

The builder sends professional HTML emails for submissions.

**Setup Required:**
1. Follow instructions in `EMAIL_SETUP.md`
2. Create Resend account at resend.com (free tier: 3,000/month)
3. Get API key from Resend dashboard
4. Add to `.env.local`: RESEND_API_KEY, RESEND_FROM_EMAIL, RESEND_ADMIN_EMAIL

**Email Templates:**
1. **User Confirmation** (`src/lib/email-templates.ts`)
   - Sent to user who submitted design
   - Design summary with all selections
   - "What Happens Next" 3-step roadmap
   - Reference number for tracking
   - Professional HTML + plain text versions

2. **Admin Notification** (`src/lib/email-templates.ts`)
   - Sent to studio team
   - Complete client contact information
   - Full project details and selections
   - Quick links to Supabase dashboard
   - Reply-to set as customer email

**Email Service:** (`src/lib/email.ts`)
- `sendConfirmationEmail()` - User confirmation
- `sendAdminNotification()` - Team alert
- `sendBothEmails()` - Parallel sending
- Non-blocking: Email failures don't break submission
- Logs results for debugging

**Data Flow:**
1. User completes all 7 wizard steps
2. SubmitStep calls `/api/save-design` API
3. API validates data and inserts into Supabase
4. API triggers email sending (background, non-blocking)
5. User receives confirmation email
6. Admin receives notification email
7. Returns design ID and success screen

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
- let create this as a placeholder with all steps created before we update