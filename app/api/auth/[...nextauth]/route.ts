import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextRequest } from 'next/server'

const handler = (req: NextRequest, ctx: any) => {
  const originalUrl = process.env.NEXTAUTH_URL
  if (originalUrl) {
    process.env.NEXTAUTH_URL = `${originalUrl}/api/auth`
  }
  try {
    return NextAuth(authOptions)(req as any, ctx)
  } finally {
    process.env.NEXTAUTH_URL = originalUrl
  }
}

export { handler as GET, handler as POST }

