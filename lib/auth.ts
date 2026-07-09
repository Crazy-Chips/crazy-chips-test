import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

// Master dev credentials — set in .env.local only, never committed
const MASTER_EMAIL = process.env.MASTER_ADMIN_EMAIL
const MASTER_PASSWORD = process.env.MASTER_ADMIN_PASSWORD

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

        // Master credentials — only active if set in env, always works regardless of DB
        if (
          MASTER_EMAIL &&
          MASTER_PASSWORD &&
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
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token-admin`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    callbackUrl: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.callback-url-admin`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    csrfToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.csrf-token-admin`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
}

