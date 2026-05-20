import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import type { Plan } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      plan: Plan
      email: string
      name: string | null
      image: string | null
    }
  }

  interface User {
    plan: Plan
  }
}


export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      id: 'email-otp',
      name: 'Email OTP',
      credentials: {
        email: { label: 'Email', type: 'email' },
        otp: { label: 'OTP', type: 'text' },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined
        const otp = credentials?.otp as string | undefined

        if (!email || !otp) return null

        const record = await prisma.emailOtp.findFirst({
          where: {
            email,
            otp,
            used: false,
            expires: { gt: new Date() },
          },
          orderBy: { createdAt: 'desc' },
        })

        if (!record) return null

        await prisma.emailOtp.update({
          where: { id: record.id },
          data: { used: true },
        })

        let user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
          user = await prisma.user.create({
            data: { email, emailVerified: new Date() },
          })
        } else if (!user.emailVerified) {
          await prisma.user.update({
            where: { id: user.id },
            data: { emailVerified: new Date() },
          })
        }

        return {
          id: user.id,
          email: user.email!,
          name: user.name,
          image: user.image,
          plan: user.plan,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.sub = user.id
        ;(token as any).plan = (user as any).plan ?? 'FREE'
      }
      if (account && token.sub) {
        const dbUser = await prisma.user.findUnique({ where: { id: token.sub } })
        if (dbUser) (token as any).plan = dbUser.plan
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.sub as string
      session.user.plan = ((token as any).plan ?? 'FREE') as Plan
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
})
