import type { Metadata } from 'next'
import { Suspense } from 'react'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: 'Media Guide Login | 1Zero9 Studio',
  description: 'Private Media Guide access.',
}

export default function MediaGuideLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
