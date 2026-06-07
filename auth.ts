import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { timingSafeEqual } from 'crypto'

function safeCompare(a: string, b: string): boolean {
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ba.length !== bb.length) return false
  return timingSafeEqual(ba, bb)
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email    = credentials?.email    as string | undefined
        const password = credentials?.password as string | undefined

        if (!email || !password) return null

        const adminEmail    = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD

        if (!adminEmail || !adminPassword) return null
        if (!safeCompare(email, adminEmail)) return null
        if (!safeCompare(password, adminPassword)) return null

        return { id: '1', email: adminEmail, name: 'Admin' }
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: { strategy: 'jwt' },
})
