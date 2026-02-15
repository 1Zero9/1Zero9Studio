'use client'

import { usePathname } from 'next/navigation'
import Navigation from './Navigation'

export default function ConditionalNavigation() {
  const pathname = usePathname()

  // Don't show global navigation on full-app experiences
  if (
    pathname?.startsWith('/builder') ||
    pathname?.startsWith('/parkrun') ||
    pathname?.startsWith('/holiday-agent')
  ) {
    return null
  }

  return <Navigation />
}
