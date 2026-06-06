import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set('media_guide_session', '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  })
  response.headers.set('Cache-Control', 'no-store')
  return response
}
