import { db } from "@/lib/db"
import { ID } from "@/types/ID"

export async function getSubscription(slug: string, userId: ID) {
    return db.subscription.findFirst({
      where: {
        subreddit: { name: slug },
        userId,
      },
    })
  }
  
  export async function isMember(slug: string, userId: ID): Promise<boolean> {
    const subscription = await getSubscription(slug, userId)
    return !!subscription
  }