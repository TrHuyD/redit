import { getToken, type JWT } from "next-auth/jwt"
import { NextRequest } from "next/server"

export function withAuth(
  handler: (req: NextRequest, token: JWT) => Promise<Response>
) {
  return async (req: NextRequest) => {
    const token = await getToken({ req })

    if (!token?.id) {
      return new Response("Unauthorized", { status: 401 })
    }
    return handler(req, token)
  }
}