import { auth } from '@/auth'
import { NextResponse } from 'next/server'

const PROTECTED_ROUTES = ['/dashboard', '/charts', '/signals', '/strategies', '/settings', '/backtesting']
const PRO_ROUTES = ['/learn', '/ai-advisor']
const PREMIUM_ROUTES = ['/backtesting']

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r))
  const isPro = PRO_ROUTES.some((r) => pathname.startsWith(r))
  const isPremium = PREMIUM_ROUTES.some((r) => pathname.startsWith(r))

  if ((isProtected || isPro || isPremium) && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (isPro && session?.user.plan === 'FREE') {
    return NextResponse.redirect(new URL('/pricing?upgrade=pro', req.url))
  }

  if (isPremium && session?.user.plan !== 'PREMIUM') {
    return NextResponse.redirect(new URL('/pricing?upgrade=premium', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
