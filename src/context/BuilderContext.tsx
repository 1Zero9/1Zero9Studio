'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { BuilderState, INITIAL_BUILDER_STATE, SiteType, DesignStyle, ColorScheme, Typography, SectionConfig, UserContent } from '@/types/builder'

interface BuilderContextType {
  state: BuilderState
  currentStep: number
  setCurrentStep: (step: number) => void
  updateState: (updates: Partial<BuilderState>) => void
  setSiteType: (type: SiteType) => void
  setPurposeDescription: (description: string) => void
  setDesignStyle: (style: DesignStyle) => void
  setColorScheme: (scheme: ColorScheme) => void
  setTypography: (typography: Typography) => void
  updateSections: (sections: SectionConfig[]) => void
  updateUserContent: (content: Partial<UserContent>) => void
  updateContactInfo: (contact: Partial<BuilderState['contactInfo']>) => void
  resetBuilder: () => void
  saveToLocalStorage: () => void
  loadFromLocalStorage: () => void
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined)

export function BuilderProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BuilderState>(INITIAL_BUILDER_STATE)
  const [currentStep, setCurrentStep] = useState(0)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('builder-state')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Only load if the session was actually started
        if (parsed.started) {
          setState({ ...INITIAL_BUILDER_STATE, ...parsed })
          console.log('📂 Loaded saved builder state')
        }
      } catch (error) {
        console.error('Failed to load saved state:', error)
        localStorage.removeItem('builder-state')
      }
    }
  }, [])

  // Auto-save to localStorage whenever state changes
  useEffect(() => {
    if (state.started) {
      localStorage.setItem('builder-state', JSON.stringify(state))
    }
  }, [state])

  const updateState = useCallback((updates: Partial<BuilderState>) => {
    setState(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }))
  }, [])

  const setSiteType = useCallback((type: SiteType) => {
    updateState({ siteType: type })
  }, [updateState])

  const setPurposeDescription = useCallback((description: string) => {
    updateState({ purposeDescription: description })
  }, [updateState])

  const setDesignStyle = useCallback((style: DesignStyle) => {
    updateState({ designStyle: style })
  }, [updateState])

  const setColorScheme = useCallback((scheme: ColorScheme) => {
    updateState({ colorScheme: scheme })
  }, [updateState])

  const setTypography = useCallback((typography: Typography) => {
    updateState({ typography })
  }, [updateState])

  const updateSections = useCallback((sections: SectionConfig[]) => {
    updateState({ selectedSections: sections })
  }, [updateState])

  const updateUserContent = useCallback((content: Partial<UserContent>) => {
    setState(prev => ({
      ...prev,
      userContent: { ...prev.userContent, ...content },
      updatedAt: new Date().toISOString(),
    }))
  }, [])

  const updateContactInfo = useCallback((contact: Partial<BuilderState['contactInfo']>) => {
    setState(prev => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, ...contact },
      updatedAt: new Date().toISOString(),
    }))
  }, [])

  const resetBuilder = useCallback(() => {
    console.log('🔄 Resetting builder state...')
    setState(INITIAL_BUILDER_STATE)
    setCurrentStep(0)
    localStorage.removeItem('builder-state')
    console.log('✅ Builder state reset complete')
  }, [])

  const saveToLocalStorage = useCallback(() => {
    localStorage.setItem('builder-state', JSON.stringify(state))
  }, [state])

  const loadFromLocalStorage = useCallback(() => {
    const saved = localStorage.getItem('builder-state')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setState({ ...INITIAL_BUILDER_STATE, ...parsed })
      } catch (error) {
        console.error('Failed to load saved state:', error)
      }
    }
  }, [])

  return (
    <BuilderContext.Provider
      value={{
        state,
        currentStep,
        setCurrentStep,
        updateState,
        setSiteType,
        setPurposeDescription,
        setDesignStyle,
        setColorScheme,
        setTypography,
        updateSections,
        updateUserContent,
        updateContactInfo,
        resetBuilder,
        saveToLocalStorage,
        loadFromLocalStorage,
      }}
    >
      {children}
    </BuilderContext.Provider>
  )
}

export function useBuilder() {
  const context = useContext(BuilderContext)
  if (context === undefined) {
    throw new Error('useBuilder must be used within a BuilderProvider')
  }
  return context
}
