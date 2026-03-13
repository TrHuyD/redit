import { getAuthSession } from "@/lib/auth"


export function withAuth<T extends (...args: any[]) => any>(handler: T) {
  return async (...args: Parameters<T>) => {
    const session = await getAuthSession()

    if (!session?.user|| !session.user.id) {
      return new Response("Unauthorized "+session?.user.id, { status: 500 })
    }

    return handler(...args)
  }
}