'use client'
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { useIntersection } from "@mantine/hooks"
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useRef } from "react";
import PostOut from "./PostOut";
import { Loader2 } from "lucide-react";
import { PostDto } from "@/types/dto";

interface PostFeedProps {
    initialPosts: PostDto[];
    subredditName?: string;
}

export default function PostFeed({ initialPosts, subredditName }: PostFeedProps) {
    const lastPostRef = useRef<HTMLDivElement>(null)

    const { ref, entry } = useIntersection({
        root: lastPostRef.current,
        threshold: 1
    })


    const {
        data,
        fetchNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['infinite-query', subredditName],
        queryFn: async ({ pageParam }) => {
            const params = new URLSearchParams({
                limit: INFINITE_SCROLLING_PAGINATION_RESULTS.toString(),
                ...(pageParam && { cursorId: pageParam.toString() }),
                ...(subredditName && { subredditName }),
            })

            const res = await axios.get(`/api/posts?${params.toString()}`)
            return res.data as PostDto[]
        },
        initialPageParam: null as bigint | null,

        getNextPageParam: (lastPage: PostDto[]) => {
            if (lastPage.length < INFINITE_SCROLLING_PAGINATION_RESULTS) return undefined
            return lastPage[lastPage.length - 1]?.id ?? undefined
        },

        initialData: {
            pages: [initialPosts],
            pageParams: [null],
        },

        staleTime: 1000 * 60,
    })

    useEffect(() => {
        if (entry?.isIntersecting) {
            fetchNextPage()
        }
    }, [entry, fetchNextPage])

    const posts = data?.pages.flatMap((page) => page) ?? []

    return (
        <ul className="flex flex-col col-span-2 space-y-6">
            {posts.map((post, index) => {
                return (
                    <li
                        key={String(post.id)}
                        ref={index === posts.length - 1 ? ref : undefined}
                    >
                        <PostOut
                            post={post}
                        />
                    </li>
                )
            })}

            {isFetchingNextPage && (
                <li className='flex justify-center'>
                    <Loader2 className='w-6 h-6 text-zinc-500 animate-spin' />
                </li>
            )}
        </ul>
    )
}