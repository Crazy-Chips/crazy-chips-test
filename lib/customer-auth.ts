import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import AppleProvider from 'next-auth/providers/apple'
import bcrypt from 'bcryptjs'

export const customerAuthOptions: NextAuthOptions = {
  providers: [
    // Google
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),

    // Apple
    ...(process.env.APPLE_ID && process.env.APPLE_TEAM_ID && process.env.APPLE_PRIVATE_KEY && process.env.APPLE_KEY_ID
      ? [
          AppleProvider({
            clientId: process.env.APPLE_ID,
            clientSecret: process.env.APPLE_SECRET ?? '',
          }),
        ]
      : []),

    // Email + Password
    CredentialsProvider({
      id: 'customer-credentials',
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          const { prisma } = await import('./prisma')
          const customer = await prisma.customer.findUnique({
            where: { email: credentials.email },
          })

          if (!customer || !customer.password) return null

          const isValid = await bcrypt.compare(credentials.password, customer.password)
          if (!isValid) return null

          return {
            id: customer.id,
            email: customer.email ?? '',
            name: customer.name ?? '',
            image: customer.image ?? null,
          }
        } catch {
          return null
        }
      },
    }),
  ],

  pages: {
    signIn: '/login',
    newUser: '/account',
  },

  session: { strategy: 'jwt' },

  callbacks: {
    async signIn({ user, account }) {
      // For OAuth sign-ins, upsert the customer record
      if (account?.provider !== 'customer-credentials' && user.email) {
        try {
          const { prisma } = await import('./prisma')
          const existing = await prisma.customer.findUnique({
            where: { email: user.email },
          })
          if (!existing) {
            await prisma.customer.create({
              data: {
                email: user.email,
                name: user.name,
                image: user.image,
                isNewCustomer: true,
              },
            })
          } else if (existing.isNewCustomer) {
            // Mark as returning after first sign-in
            await prisma.customer.update({
              where: { id: existing.id },
              data: { isNewCustomer: false },
            })
          }
        } catch {}
      }
      return true
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
}
