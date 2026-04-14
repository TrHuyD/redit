import { withAuth } from '@/server/lib/withAuth'
import { withErrorHandler } from '@/server/lib/withErrorHandler'
import { NextRequest, NextResponse } from 'next/server'

import { SearchSubreditACValidator } from '@/lib/validators/subreddit'
import { searchSubredditAutocomplete } from '@/server/services/subreddit/loader'

export  const GET =  withErrorHandler( withAuth(async (req: NextRequest,token)  =>{
    try {
        const { searchParams } = req.nextUrl
        const raw = Object.fromEntries(searchParams)
        const parsed = SearchSubreditACValidator.parse(raw)
        const subreddits = await searchSubredditAutocomplete(parsed.name)
        return new NextResponse(JSON.stringify(subreddits))
    } catch (error) {
        return new Response(`Internal Server Error ${error}`, { status: 500 })
    }
}))