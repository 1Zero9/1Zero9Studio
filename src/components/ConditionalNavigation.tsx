'use client'

import { usePathname } from 'next/navigation'
import Navigation from './Navigation'

export default function ConditionalNavigation() {
  const pathname = usePathname()

  // Don't show navigation on builder pages
  if (pathname?.startsWith('/builder')) {
    return null
  }

  return <Navigation />
}
