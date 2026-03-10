
import { getServerSession, NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import { nanoid } from "nanoid"

import { db } from "./db"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/sign-in",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // If user just signed in
      if (user) {
        token.id = user.id
      }

      const dbUser = await db.user.findUnique({
        where: {
          email: token.email!,
        },
      })

      if (!dbUser) {
        return token
      }

      if (!dbUser.username) {
        await db.user.update({
          where: { id: dbUser.id },
          data: {
            username: nanoid(10),
          },
        })
      }

      return {
        ...token,
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
      }
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.name = token.name
        session.user.email = token.email
        session.user.username=token.username
      }

      return session
    },
    redirect(){
        return '/'
    }
  },
}
export const getAuthSession = () => getServerSession(authOptions)