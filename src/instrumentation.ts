import { redis } from "./server/lib/redis"
import { seedSubredditAutocomplete } from "./server/services/subreddit/loader"
import { rediskey } from "./types/rediskey"

export async function register() {
    if (process.env.NEXT_RUNTIME !== "nodejs") return
    const exists = await redis.exists(rediskey.subreddit.autocomplete)
    if (!exists) {
        console.log("[startup] seeding subreddit autocomplete...")
        await seedSubredditAutocomplete()
        console.log("[startup] done")
    }
}