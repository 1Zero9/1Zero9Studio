# 1Zero9 Website Builder - Implementation Guide

## ✅ Completed Components

### 1. Type System (`/src/types/builder.ts`)
- Complete TypeScript definitions for all builder state
- Predefined color schemes for 4 design styles
- Typography presets for each style
- Default section configurations per site type
- Section metadata with icons and descriptions

### 2. State Management (`/src/context/BuilderContext.tsx`)
- React Context with full CRUD operations
- LocalStorage persistence (auto-save)
- Type-safe state updates
- Step navigation control

### 3. UI Components
**Navigation:**
- `StepIndicator.tsx` - Visual progress bar with step names
- `NavigationControls.tsx` - Back/Next buttons with validation

**Wizard Steps:**
- `WelcomeStep.tsx` - Landing page with feature highlights
- `PurposeStep.tsx` - Site type selection (Portfolio, Store, Blog, Business, Landing)
- `StyleStep.tsx` - Three-tab interface for style, colors, and typography

## 🚧 Next Steps to Complete

### Step 4: Features Selection
Create `/src/components/builder/steps/FeaturesStep.tsx`:
- Display section cards based on selected site type
- Drag-and-drop reordering (optional for MVP)
- Toggle sections on/off
- Preview section count

### Step 5: Content Upload
Create `/src/components/builder/steps/ContentStep.tsx`:
- Business name input
- Tagline input
- Logo upload (with preview)
- Primary color picker (override)
- Social links (optional)

### Step 6: Preview & Summary
Create `/src/components/builder/steps/PreviewStep.tsx`:
- Live mock-up display using preview components
- AI-generated summary (integrate Claude)
- Screenshot capture (html2canvas)
- Edit mode toggle

### Step 7: CTA & Contact
Create `/src/components/builder/steps/CTAStep.tsx`:
- Name, email, phone capture
- Project notes textarea
- Consultation booking calendar
- Email export button
- Save design button (Supabase)

### Main Builder Page
Create `/src/app/builder/page.tsx`:
```tsx
'use client'

import { BuilderProvider, useBuilder } from '@/context/BuilderContext'
import StepIndicator from '@/components/builder/StepIndicator'
import NavigationControls from '@/components/builder/NavigationControls'
import WelcomeStep from '@/components/builder/steps/WelcomeStep'
import PurposeStep from '@/components/builder/steps/PurposeStep'
import StyleStep from '@/components/builder/steps/StyleStep'
// ... import other steps

const STEP_NAMES = ['Welcome', 'Purpose', 'Style', 'Features', 'Content', 'Preview', 'Submit']

function BuilderContent() {
  const { state, currentStep, setCurrentStep, updateState, setSiteType, setDesignStyle, setColorScheme, setTypography } = useBuilder()

  const handleNext = () => {
    if (currentStep < STEP_NAMES.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onStart={() => { updateState({ started: true }); setCurrentStep(1) }} />
      case 1:
        return <PurposeStep selectedType={state.siteType} onSelect={setSiteType} />
      case 2:
        return <StyleStep
          selectedStyle={state.designStyle}
          selectedColorScheme={state.colorScheme}
          selectedTypography={state.typography}
          onSelectStyle={setDesignStyle}
          onSelectColorScheme={setColorScheme}
          onSelectTypography={setTypography}
        />
      // ... other cases
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {currentStep > 0 && (
        <StepIndicator currentStep={currentStep - 1} totalSteps={STEP_NAMES.length - 1} stepNames={STEP_NAMES.slice(1)} />
      )}

      <div className="pb-24">
        {renderStep()}
      </div>

      {currentStep > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-dark-bg/95 backdrop-blur-md border-t border-dark-lighter">
          <NavigationControls
            currentStep={currentStep - 1}
            totalSteps={STEP_NAMES.length - 1}
            onNext={handleNext}
            onPrevious={handlePrevious}
            nextDisabled={!canProceed()}
          />
        </div>
      )}
    </div>
  )
}

export default function BuilderPage() {
  return (
    <BuilderProvider>
      <BuilderContent />
    </BuilderProvider>
  )
}
```

## Preview Components Needed

Create in `/src/components/preview/`:

1. `LivePreview.tsx` - Container with device frame
2. `PreviewHeader.tsx` - Responsive header based on color scheme
3. `PreviewHero.tsx` - Hero section with business name/tagline
4. `PreviewAbout.tsx` - About section placeholder
5. `PreviewGallery.tsx` - Grid layout preview
6. `PreviewContact.tsx` - Contact form preview
7. `PreviewFooter.tsx` - Footer with social links

Each component should:
- Accept `colorScheme`, `typography`, `content` props
- Render placeholder content if not provided
- Match selected design style
- Be fully responsive

## API Routes Needed

### 1. `/api/save-design/route.ts`
```typescript
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function POST(request: Request) {
  const design = await request.json()
  const supabase = createClient()

  const { data, error } = await supabase
    .from('designs')
    .insert([design])
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data[0])
}
```

### 2. `/api/generate-summary/route.ts`
```typescript
import Anthropic from '@anthropic-ai/sdk'

export async function POST(request: Request) {
  const { siteType, designStyle, sections } = await request.json()

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 500,
    messages: [{
      role: 'user',
      content: `Generate a professional 2-3 sentence summary for a ${siteType} website with ${designStyle} design including these sections: ${sections.join(', ')}.`
    }]
  })

  return NextResponse.json({ summary: message.content[0].text })
}
```

### 3. `/api/send-email/route.ts`
Use Resend or SendGrid to email the design summary

## Supabase Schema

```sql
CREATE TABLE designs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_email TEXT,
  site_type TEXT NOT NULL,
  design_style TEXT NOT NULL,
  color_scheme JSONB NOT NULL,
  typography JSONB NOT NULL,
  selected_sections JSONB NOT NULL,
  user_content JSONB,
  contact_info JSONB,
  ai_summary TEXT,
  mockup_screenshot TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX idx_designs_email ON designs(user_email);
CREATE INDEX idx_designs_created ON designs(created_at DESC);
```

## Environment Variables Needed

```.env.local
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Claude AI
ANTHROPIC_API_KEY=your_anthropic_key

# Email (Resend)
RESEND_API_KEY=your_resend_key
```

## Styling Enhancements

Add to `/src/app/globals.css`:

```css
@layer utilities {
  .builder-card {
    @apply bg-dark-card/50 backdrop-blur-sm border border-dark-lighter rounded-xl p-6;
    @apply hover:bg-dark-card/70 hover:shadow-lg transition-all duration-300;
  }

  .builder-card-selected {
    @apply border-rocket-red bg-rocket-red/10 shadow-lg shadow-rocket-red/20;
  }

  .builder-input {
    @apply w-full px-4 py-3 bg-dark-bg border border-dark-lighter rounded-lg;
    @apply text-text-light placeholder-text-gray;
    @apply focus:outline-none focus:border-rocket-red transition-colors;
  }
}
```

## Testing Checklist

- [ ] Step navigation (forward/backward)
- [ ] LocalStorage persistence
- [ ] Style preview updates in real-time
- [ ] Form validation before proceeding
- [ ] Mobile responsiveness
- [ ] Screenshot generation
- [ ] Email delivery
- [ ] Supabase data save
- [ ] Claude AI summary generation
- [ ] Error handling for all API calls

## Deployment

1. Push to GitHub
2. Deploy to Vercel
3. Add environment variables in Vercel dashboard
4. Set up Supabase project
5. Run SQL schema in Supabase SQL editor
6. Test end-to-end flow
7. Add analytics (Vercel Analytics / Plausible)

## Future Enhancements (Phase 2+)

- [ ] Cost estimation based on complexity
- [ ] Admin dashboard to view submissions
- [ ] PDF export of design mockup
- [ ] Figma export integration
- [ ] A/B testing different wizard flows
- [ ] Multi-language support
- [ ] Dark/light mode toggle for preview
- [ ] Template library ("Start from template")
- [ ] Collaboration mode (share design link)
- [ ] Video walkthrough generation
