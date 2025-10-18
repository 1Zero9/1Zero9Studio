'use client'

import React from 'react'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  stepNames: string[]
}

export default function StepIndicator({ currentStep, totalSteps, stepNames }: StepIndicatorProps) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-dark-lighter z-0">
          <div
            className="h-full bg-rocket-red transition-all duration-500"
            style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
          />
        </div>

        {/* Step circles */}
        {stepNames.map((name, index) => (
          <div key={index} className="flex flex-col items-center relative z-10">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                index < currentStep
                  ? 'bg-rocket-red text-white scale-110'
                  : index === currentStep
                  ? 'bg-rocket-red text-white scale-125 shadow-lg shadow-rocket-red/50'
                  : 'bg-dark-card text-text-gray border-2 border-dark-lighter'
              }`}
            >
              {index < currentStep ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <span
              className={`mt-2 text-xs md:text-sm text-center max-w-[80px] transition-colors duration-300 ${
                index === currentStep ? 'text-rocket-red font-semibold' : 'text-text-gray'
              }`}
            >
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
