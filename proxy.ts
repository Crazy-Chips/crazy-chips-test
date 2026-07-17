import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname

  // Skip auth in development for easy testing
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next()
  }

  // Protect admin routes (except login)
  if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
    const cookieName = '__Secure-next-auth.session-token-admin'
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      cookieName,
    })
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
