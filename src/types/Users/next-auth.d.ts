import { DefaultSession } from "next-auth"

type UserId = string

declare module "next-auth/jwt" {
interface JWT {
  id: UserId
  username?: string | null
  image?: string | null
  name?: string | null
  email?: string | null
}
}

declare module "next-auth" {
interface Session {
  user: {
    id: UserId
    username?: string | null
    image?: string | null
  } & DefaultSession["user"]
}

interface User {
  id: UserId
  username?: string | null
  image?: string | null
}
}
