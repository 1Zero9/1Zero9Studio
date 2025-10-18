'use client'

import React from 'react'

interface NavigationControlsProps {
  currentStep: number
  totalSteps: number
  onNext: () => void
  onPrevious: () => void
  onSkip?: () => void
  nextLabel?: string
  previousLabel?: string
  showSkip?: boolean
  nextDisabled?: boolean
}

export default function NavigationControls({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onSkip,
  nextLabel = 'Next',
  previousLabel = 'Back',
  showSkip = false,
  nextDisabled = false,
}: NavigationControlsProps) {
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === totalSteps - 1

  return (
    <div className="flex items-center justify-between w-full max-w-4xl mx-auto px-4 py-6">
      {/* Previous button */}
      <button
        onClick={onPrevious}
        disabled={isFirstStep}
        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
          isFirstStep
            ? 'opacity-0 pointer-events-none'
            : 'text-text-gray hover:text-white hover:bg-dark-card border border-dark-lighter'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span>{previousLabel}</span>
      </button>

      {/* Skip button (optional) */}
      {showSkip && onSkip && (
        <button
          onClick={onSkip}
          className="text-text-gray hover:text-rocket-red transition-colors text-sm font-medium"
        >
          Skip this step
        </button>
      )}

      {/* Next button */}
      <button
        onClick={onNext}
        disabled={nextDisabled}
        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
          nextDisabled
            ? 'bg-dark-card text-text-gray cursor-not-allowed opacity-50'
            : 'bg-rocket-red text-white hover:bg-red-700 shadow-lg hover:shadow-xl'
        }`}
      >
        <span>{isLastStep ? 'Finish' : nextLabel}</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}
