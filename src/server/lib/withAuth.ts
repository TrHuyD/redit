import { getServerSession } from "next-auth"

export function withAuth<T extends (...args: any[]) => any>(handler: T) {
  return async (...args: Parameters<T>) => {
    const session = await getServerSession()

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }

    return handler(...args)
  }
}