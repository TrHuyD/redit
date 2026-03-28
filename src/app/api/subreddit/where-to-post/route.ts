import { NextRequest, NextResponse } from 'next/server'
import { withErrorHandler } from '@/server/lib/withErrorHandler'
import { withAuth } from '@/server/lib/withAuth'
import { getId } from '@/lib/utils'

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
        return new Response('Internal Server Error', { status: 500 })
    }
}))