import type { Metadata, Viewport } from 'next'
import { redirect } from 'next/navigation'
import MediaGuide from './MediaGuide'
import { hasMediaGuideSession } from '@/lib/media-guide-auth'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Media Guide | 1Zero9 Studio',
  description: 'Personal Ireland media guide for TV, streaming, cinema releases, and tracked shows.',
  manifest: '/media-guide.webmanifest',
  icons: {
    icon: [
      { url: '/media-guide-icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/media-guide-icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/media-guide-icon-180.png', sizes: '180x180', type: 'image/png' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Media Guide',
  },
}

export const viewport: Viewport = {
  themeColor: '#31e6b7',
  viewportFit: 'cover',
}

export default async function MediaGuidePage() {
  if (!(await hasMediaGuideSession())) {
    redirect('/media-guide/login')
  }

  return <MediaGuide />
}
