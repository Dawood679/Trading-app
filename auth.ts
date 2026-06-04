import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
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
      allowDangerousEmailAccountLinking: true,
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
