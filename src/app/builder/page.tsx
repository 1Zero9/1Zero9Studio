'use client'

import { BuilderProvider, useBuilder } from '@/context/BuilderContext'
import BuilderHeader from '@/components/builder/BuilderHeader'
import StepIndicator from '@/components/builder/StepIndicator'
import NavigationControls from '@/components/builder/NavigationControls'
import WelcomeStep from '@/components/builder/steps/WelcomeStep'
import PurposeStep from '@/components/builder/steps/PurposeStep'
import StyleStep from '@/components/builder/steps/StyleStep'

const STEP_NAMES = ['Welcome', 'Purpose', 'Style', 'Features', 'Content', 'Preview', 'Submit']

function BuilderContent() {
  const {
    state,
    currentStep,
    setCurrentStep,
    updateState,
    setSiteType,
    setDesignStyle,
    setColorScheme,
    setTypography,
  } = useBuilder()

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

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 0:
        return state.started
      case 1:
        return state.siteType !== null
      case 2:
        return state.designStyle !== null && state.colorScheme !== null && state.typography !== null
      case 3:
        return state.selectedSections.length > 0
      case 4:
        return !!state.userContent.businessName && !!state.userContent.tagline
      case 5:
        return true // Preview step is always passable
      case 6:
        return !!state.contactInfo.name && !!state.contactInfo.email
      default:
        return false
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <WelcomeStep
            onStart={() => {
              updateState({ started: true, createdAt: new Date().toISOString() })
              setCurrentStep(1)
            }}
          />
        )
      case 1:
        return <PurposeStep selectedType={state.siteType} onSelect={setSiteType} />
      case 2:
        return (
          <StyleStep
            selectedStyle={state.designStyle}
            selectedColorScheme={state.colorScheme}
            selectedTypography={state.typography}
            onSelectStyle={setDesignStyle}
            onSelectColorScheme={setColorScheme}
            onSelectTypography={setTypography}
          />
        )
      case 3:
        return (
          <div className="max-w-4xl mx-auto px-4 py-8 text-center">
            <h2 className="text-4xl font-black mb-4">
              <span className="text-text-light">FEATURES STEP </span>
              <span className="text-rocket-red">COMING SOON</span>
            </h2>
            <p className="text-text-gray">This step will let you select website sections</p>
          </div>
        )
      case 4:
        return (
          <div className="max-w-4xl mx-auto px-4 py-8 text-center">
            <h2 className="text-4xl font-black mb-4">
              <span className="text-text-light">CONTENT STEP </span>
              <span className="text-rocket-red">COMING SOON</span>
            </h2>
            <p className="text-text-gray">This step will let you upload your content</p>
          </div>
        )
      case 5:
        return (
          <div className="max-w-4xl mx-auto px-4 py-8 text-center">
            <h2 className="text-4xl font-black mb-4">
              <span className="text-text-light">PREVIEW STEP </span>
              <span className="text-rocket-red">COMING SOON</span>
            </h2>
            <p className="text-text-gray">This step will show your live preview</p>
          </div>
        )
      case 6:
        return (
          <div className="max-w-4xl mx-auto px-4 py-8 text-center">
            <h2 className="text-4xl font-black mb-4">
              <span className="text-text-light">SUBMIT STEP </span>
              <span className="text-rocket-red">COMING SOON</span>
            </h2>
            <p className="text-text-gray">This step will capture your contact info</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <BuilderHeader />

      {/* Step Indicator (hide on welcome screen) */}
      {currentStep > 0 && (
        <div className="pt-20">
          <StepIndicator
            currentStep={currentStep - 1}
            totalSteps={STEP_NAMES.length - 1}
            stepNames={STEP_NAMES.slice(1)}
          />
        </div>
      )}

      {/* Main Content */}
      <div className={`pb-32 ${currentStep === 0 ? 'pt-20' : ''}`}>{renderStep()}</div>

      {/* Navigation Controls (hide on welcome screen) */}
      {currentStep > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-dark-bg/95 backdrop-blur-md border-t border-dark-lighter z-50">
          <NavigationControls
            currentStep={currentStep - 1}
            totalSteps={STEP_NAMES.length - 1}
            onNext={handleNext}
            onPrevious={handlePrevious}
            nextDisabled={!canProceed()}
          />
        </div>
      )}

      {/* Debug Info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-20 right-4 bg-dark-card/90 backdrop-blur-sm border border-dark-lighter rounded-lg p-4 text-xs text-text-gray max-w-xs z-40">
          <h4 className="font-bold text-text-light mb-2">Debug Info</h4>
          <p>Step: {currentStep} ({STEP_NAMES[currentStep]})</p>
          <p>Site Type: {state.siteType || 'Not set'}</p>
          <p>Design Style: {state.designStyle || 'Not set'}</p>
          <p>Can Proceed: {canProceed() ? 'Yes' : 'No'}</p>
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
