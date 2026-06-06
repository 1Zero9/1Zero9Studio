import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import MediaGuide from './MediaGuide'
import { hasMediaGuideSession } from '@/lib/media-guide-auth'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Media Guide | 1Zero9 Studio',
  description: 'Personal Ireland media guide for TV, streaming, cinema releases, and tracked shows.',
}

export default async function MediaGuidePage() {
  if (!(await hasMediaGuideSession())) {
    redirect('/media-guide/login')
  }

  return <MediaGuide />
}
