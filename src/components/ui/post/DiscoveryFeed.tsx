
'use client'
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import { PostUserDto } from "@/types/post"
import InfiniteFeed from "./InfiniteFeed"
import PostOut from "./PostOut"
import axios from "axios"

interface PostFeedProps {
    initialPosts: PostUserDto[]
}

export default function DiscoveryFeed({ initialPosts }: PostFeedProps) {
    const fetcher = async (cursor: string | null) => {
        const params = new URLSearchParams({
            limit: INFINITE_SCROLLING_PAGINATION_RESULTS.toString(),
            ...(cursor && { cursorId: cursor }),
        })
        const res = await axios.get(`/api/feed/all?${params.toString()}`)
        return res.data as PostUserDto[]
    }

    return (
        <InfiniteFeed
            queryKey={['posts', 'all']}
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