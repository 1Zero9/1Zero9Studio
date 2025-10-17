'use client'

import { useState, useEffect } from 'react'
import LandingPage from './LandingPage'

export default function MainApp({ children }: { children: React.ReactNode }) {
  const [showLanding, setShowLanding] = useState(true)
  const [showMainLogo, setShowMainLogo] = useState(false)

  const handleLandingComplete = () => {
    setShowLanding(false)
    setShowMainLogo(true)
  }

  useEffect(() => {
    // Check if we should show landing (only on first visit)
    const hasVisited = sessionStorage.getItem('hasVisitedLanding')
    if (hasVisited) {
      setShowLanding(false)
      setShowMainLogo(true)
    }
  }, [])

  useEffect(() => {
    if (!showLanding) {
      sessionStorage.setItem('hasVisitedLanding', 'true')
    }
  }, [showLanding])

  if (showLanding) {
    return <LandingPage onComplete={handleLandingComplete} />
  }

  return <>{children}</>
}
