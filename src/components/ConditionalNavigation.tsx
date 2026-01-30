'use client'

import { usePathname } from 'next/navigation'
import Navigation from './Navigation'

export default function ConditionalNavigation() {
  const pathname = usePathname()

  // Don't show navigation on builder or parkrun pages
  if (pathname?.startsWith('/builder') || pathname?.startsWith('/parkrun')) {
    return null
  }

  return <Navigation />
}
