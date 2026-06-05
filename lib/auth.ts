import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

// Master dev credentials — works without a database connection
const MASTER_EMAIL = 'master@crazychips.co.uk'
const MASTER_PASSWORD = 'CrazyChips@Master2025'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // Master credentials — always works regardless of DB
        if (
          credentials.email === MASTER_EMAIL &&
          credentials.password === MASTER_PASSWORD
        ) {
          return { id: 'master', email: MASTER_EMAIL, name: 'Master Admin' }
        }

        // DB-backed admin login
        try {
          const { prisma } = await import('./prisma')
          const admin = await prisma.admin.findUnique({
            where: { email: credentials.email },
          })
          if (!admin) return null
          const isValid = await bcrypt.compare(credentials.password, admin.password)
          if (!isValid) return null
          return { id: admin.id, email: admin.email, name: admin.name ?? '' }
        } catch {
          // DB unavailable — only master credentials work
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
