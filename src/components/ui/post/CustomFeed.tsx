
'use client'
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"

import InfiniteFeed from "./InfiniteFeed"
import PostOut from "./PostOut"
import axios from "axios"
import { PostUserDto } from "@/types/post"

interface PostFeedProps {
    initialPosts: PostUserDto[]
}

export default function CustomFeed({ initialPosts }: PostFeedProps) {
    const fetcher = async (cursor: string | null) => {
        const params = new URLSearchParams({
            limit: INFINITE_SCROLLING_PAGINATION_RESULTS.toString(),
            ...(cursor && { cursorId: cursor }),
        })
        const res = await axios.get(`/api/feed/home?${params.toString()}`)
        return res.data as PostUserDto[]
    }

    return (
        <InfiniteFeed
            queryKey={['posts', 'home']}
            initialData={initialPosts}
            limit={INFINITE_SCROLLING_PAGINATION_RESULTS}
            fetcher={fetcher}
            getKey={(p) => p.id.toString()}
            getCursor={post => post.id.toString()}
            renderItem={post => (
                <PostOut post={post} displayType="both" />
            )}
        />
    )
}