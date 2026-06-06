import { NextResponse } from 'next/server'

const sessionCookie = 'media_guide_session'
const maxSessionAgeSeconds = 60 * 60 * 24 * 30

type LoginPayload = {
  password?: string
}

export async function POST(request: Request) {
  const payload = (await request.json()) as LoginPayload
  const password = process.env.MEDIA_GUIDE_PASSWORD
  const secret = process.env.MEDIA_GUIDE_SESSION_SECRET ?? password

  if (!password || !secret) {
    return NextResponse.json({ error: 'Media Guide password is not configured.' }, { status: 500 })
  }

  if (payload.password !== password) {
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 })
  }

  const issuedAt = String(Date.now())
  const signature = await signToken(issuedAt, password, secret)
  const response = NextResponse.json({ ok: true })

  response.cookies.set(sessionCookie, `${issuedAt}.${signature}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: maxSessionAgeSeconds,
  })

  return response
}

async function signToken(issuedAt: string, password: string, secret: string) {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
  ])
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(`media-guide:${issuedAt}:${password}`))
  return bytesToBase64Url(new Uint8Array(signature))
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
}
