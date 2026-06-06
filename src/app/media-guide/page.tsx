import type { Metadata } from 'next'
import MediaGuide from './MediaGuide'

export const metadata: Metadata = {
  title: 'Media Guide | 1Zero9 Studio',
  description: 'Personal Ireland media guide for TV, streaming, cinema releases, and tracked shows.',
}

export default function MediaGuidePage() {
  return <MediaGuide />
}
