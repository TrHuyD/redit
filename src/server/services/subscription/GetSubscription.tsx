import { db } from "@/lib/db"

export async function getSubscription(slug: string, userId: string) {
    return db.subscription.findFirst({
      where: {
        subreddit: { name: slug },
        userId,
      },
    })
  }
  
  export async function isMember(slug: string, userId: string): Promise<boolean> {
    const subscription = await getSubscription(slug, userId)
    return !!subscription
  }