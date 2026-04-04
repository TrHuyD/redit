
'use client'
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"

import InfiniteFeed from "./InfiniteFeed"
import PostOut from "./PostOut"
import axios from "axios"
import { PostUserDto } from "@/types/post"
import { SortBy } from "@/types/enum"

interface PostFeedProps {
    initialPosts: PostUserDto[]
    subredditName: string
    sortBy:SortBy
}

export default function PostFeed({ initialPosts, subredditName,sortBy }: PostFeedProps) {
    const fetcher = async (cursor: string | null) => {
        const params = new URLSearchParams({
            limit: INFINITE_SCROLLING_PAGINATION_RESULTS.toString(),
            ...(cursor && { cursorId: cursor }),
            ...(subredditName && { subredditName }),
        })
        const res = await axios.get(`/api/posts/${sortBy}?${params.toString()}`)
        return res.data as PostUserDto[]
    }

    return (
        <InfiniteFeed 
            queryKey={['posts', subredditName]}
            initialData={initialPosts}
            limit={INFINITE_SCROLLING_PAGINATION_RESULTS}
            fetcher={fetcher}
            getCursor={post => post.id.toString()}
            getKey={(p) => p.id.toString()}
            renderItem={post => (
                <PostOut post={post} displayType="user" />
            )}
        />
    )
}