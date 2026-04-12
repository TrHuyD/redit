import { getServerSession, NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { nanoid } from "nanoid"
import { cache } from "react"
import { db } from "./db"
import { cookies } from "next/headers"
import { getToken, JWT } from "next-auth/jwt"
import { generateUserId } from "@/server/services/Snowflake"
import slugify from "slugify";


export const authOptions: NextAuthOptions = {
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
    async jwt({ token, account, profile }) {
      if (account?.provider === "google" && profile) {
        const googleProfile = profile as {
          sub: string         
          name?: string
          email?: string
          picture?: string
        }

        const googleId = googleProfile.sub

        let dbUser = await db.user.findUnique({
          where: { googleId },
        })
        if (!dbUser && googleProfile.email) {
          dbUser = await db.user.findUnique({
            where: { email: googleProfile.email },
          })

          if (dbUser) {
            dbUser = await db.user.update({
              where: { id: dbUser.id },
              data: { googleId },
            })
          }
        }
        var id =generateUserId()
        var name =  googleProfile.name??id.toString()
        if (!dbUser) {
          let attempt = 0;
          while (true) {
            const username =generateSlug(name);
            try {
              dbUser = await db.user.create({
                data: {
                  id,
                  email: googleProfile.email!,
                  googleId,
                  name: username,
                  image: googleProfile.picture ?? "",
                  username,
                },
              });
              break; 
            } catch (err: any) {
              if (err.code === "P2002") {
                attempt++;
                continue; 
              }
              throw err; 
            }
          }
        }
        token.id = dbUser.id.toString()
        token.image = dbUser.image
        token.username = dbUser.username
        token.name = dbUser.name
        token.email = dbUser.email
      }

      return token
    },

    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id
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

// export const getAuthSession = cache(() => getServerSession(authOptions))

export const getAuthToken = cache(async (): Promise<JWT | null> => {
  const cookieStore = await cookies()

  const token = await getToken({
    req: {
      cookies: Object.fromEntries(
        cookieStore.getAll().map(({ name, value }) => [name, value])
      ),
      headers: {},
    } as any,
  })

  if (!token?.id) return null
  return token
})

function generateSlug(input:string) {
  const slug = slugify(input, {
    lower: true,   
    strict: true,   
    locale: "vi",    
    trim: true
  });
  const random = Math.random().toString(36).substring(2, 6);

  return `${slug}-${random}`;
}