import NextAuth from 'next-auth'
import { customerAuthOptions } from '@/lib/customer-auth'
import { NextRequest } from 'next/server'

const handler = (req: NextRequest, ctx: any) => {
  const originalUrl = process.env.NEXTAUTH_URL
  if (originalUrl) {
    process.env.NEXTAUTH_URL = `${originalUrl}/api/customer-auth`
  }
  try {
    return NextAuth(customerAuthOptions)(req as any, ctx)
  } finally {
    process.env.NEXTAUTH_URL = originalUrl
  }
}

export { handler as GET, handler as POST }

