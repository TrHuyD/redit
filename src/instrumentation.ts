import { redis } from "./server/lib/redis"
import { seedSubredditAutocomplete } from "./server/services/subreddit/loader"
import { rediskey } from "./types/rediskey"

export async function register() {
    if (process.env.NEXT_RUNTIME !== "nodejs") return
    await seedSubredditAutocomplete()
    return
    const subParserExists = await redis.exists(rediskey.subreddit.autocomplete)
    if (!subParserExists) {
        console.log("[startup] seeding subreddit autocomplete...")
        await seedSubredditAutocomplete()
        console.log("[startup] done")
    }
}