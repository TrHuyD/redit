import { getServerSession, NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import { nanoid } from "nanoid"
import { cache } from "react"
import { db } from "./db"
import { headers } from "next/headers"
import { NextRequest } from "next/server"
import { getToken, JWT } from "next-auth/jwt"

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
      // first login
      if (user) {
        token.id = user.id
        token.image = user.image
      }

      const dbUser = await db.user.findUnique({
        where: {
          email: token.email!,
        },
      })

      if (!dbUser) return token

      // create username if missing
      if (!dbUser.username) {
        const updatedUser = await db.user.update({
          where: { id: dbUser.id },
          data: {
            username: nanoid(10),
          },
        })

        dbUser.username = updatedUser.username
      }

      return {
        ...token,
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        image: dbUser.image,
        username: dbUser.username,
      }
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.image as string
        session.user.username = token.username as string
      }

      return session
    },

    redirect() {
      return "/"
    },
  },
}

export const getAuthSession = cache(() =>
  getServerSession(authOptions)
)
export const getAuthToken = cache(async (): Promise<JWT | null> => {
  const headersList = await headers()
  const req = new NextRequest("http://localhost", {
    headers: headersList,
  })

  const token = await getToken({ req })

  if (!token?.id) return null

  return token
})