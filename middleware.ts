import { NextResponse, type NextRequest } from 'next/server'

const sessionCookie = 'media_guide_session'
const maxSessionAgeMs = 1000 * 60 * 60 * 24 * 30

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isMediaGuide = pathname === '/media-guide' || pathname.startsWith('/media-guide/')
  const isMediaGuideApi = pathname.startsWith('/api/media-guide/')

  if (isMediaGuide) {
    const runwayUrl = new URL(request.url)
    runwayUrl.protocol = 'https:'
    runwayUrl.hostname = 'runway.1zero9.com'
    runwayUrl.port = ''
    runwayUrl.pathname = mapRunwayPath(pathname)
    const response = NextResponse.redirect(runwayUrl, 308)
    response.headers.set('Cache-Control', 'no-store')
    return response
  }

  if (!isMediaGuide && !isMediaGuideApi) {
    return NextResponse.next()
  }

  if (
    pathname === '/media-guide/login' ||
    pathname === '/api/media-guide/login' ||
    pathname.startsWith('/media-guide/share/')
  ) {
    return NextResponse.next()
  }

  const password = process.env.MEDIA_GUIDE_PASSWORD
  const secret = process.env.MEDIA_GUIDE_SESSION_SECRET ?? password
  const token = request.cookies.get(sessionCookie)?.value

  if (password && secret && token && (await isValidToken(token, password, secret))) {
    const response = NextResponse.next()
    response.headers.set('Cache-Control', 'no-store')
    return response
  }

  if (isMediaGuideApi) {
    return NextResponse.json(
      { error: 'Media Guide login required.' },
      { status: 401, headers: { 'Cache-Control': 'no-store' } },
    )
  }

  const loginUrl = request.nextUrl.clone()
  loginUrl.pathname = '/media-guide/login'
  loginUrl.searchParams.set('next', pathname)
  const response = NextResponse.redirect(loginUrl)
  response.headers.set('Cache-Control', 'no-store')
  return response
}

export const config = {
  matcher: ['/media-guide/:path*', '/api/media-guide/:path*'],
}

function mapRunwayPath(pathname: string) {
  if (pathname === '/media-guide') return '/'
  if (pathname === '/media-guide/login') return '/login'
  return pathname.replace(/^\/media-guide/, '') || '/'
}

async function isValidToken(token: string, password: string, secret: string) {
  const [issuedAt, signature] = token.split('.')
  const issued = Number(issuedAt)

  if (!issued || !signature || Date.now() - issued > maxSessionAgeMs) {
    return false
  }

  const expected = await signToken(issuedAt, password, secret)
  return signature === expected
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
