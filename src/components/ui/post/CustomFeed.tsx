
'use client'
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import { PostDto } from "@/types/dto"
import InfiniteFeed from "./InfiniteFeed"
import PostOut from "./PostOut"
import axios from "axios"

interface PostFeedProps {
    initialPosts: PostDto[]
}

export default function CustomFeed({ initialPosts }: PostFeedProps) {
    const fetcher = async (cursor: string | null) => {
        const params = new URLSearchParams({
            limit: INFINITE_SCROLLING_PAGINATION_RESULTS.toString(),
            ...(cursor && { cursorId: cursor }),
        })
        const res = await axios.get(`/api/feed/home?${params.toString()}`)
        return res.data as PostDto[]
    }

    return (
        <InfiniteFeed
            queryKey={['posts', 'home']}
            initialData={initialPosts}
            limit={INFINITE_SCROLLING_PAGINATION_RESULTS}
            fetcher={fetcher}
            getCursor={post => post.id.toString()}
            renderItem={post => (
                <PostOut post={post} displayType="both" />
            )}
        />
    )
}