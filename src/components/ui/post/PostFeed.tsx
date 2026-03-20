'use client'
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { ExtendedPost } from "@/types/db";
import {useIntersection} from "@mantine/hooks"
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

import { useRef } from "react";
import PostOut from "./PostOut";
import { Loader2 } from "lucide-react";
interface PostFeedProps{
    initialPosts: ExtendedPost[];
    subredditName : string;

}
export default function PostFeed({initialPosts,subredditName}: PostFeedProps) {
    const lastPostRef = useRef<HTMLDivElement>(null)
    const {ref, entry} = useIntersection({
        root: lastPostRef.current,
        threshold: 1
    })

    const {data, fetchNextPage, isFetchingNextPage}= useInfiniteQuery(['infinite-query'],
            async ({pageParam = 1})=>{
                const params = new URLSearchParams({
                    limit: INFINITE_SCROLLING_PAGINATION_RESULTS.toString(),
                    page: pageParam.toString(),
                    ...(subredditName && { subredditName }),
                })
                const query = `/api/posts?${params.toString()}`
                const {data}= await axios.get(query)
                return data as ExtendedPost[]
                },{
                    getNextPageParam: (_, pages) => {
                        return pages.length + 1
                    },
                    initialData: {
                        pages: [initialPosts],
                        pageParams: [1]
                    }
                })
                const posts = data?.pages.flatMap(page => page) ?? initialPosts

    return (
        <ul className="flex flex-col col-span-2 space-y-6">
            {posts.map((post, index) => {
                const voteAmt= post.votes.reduce((acc, vote) => {
                    if(vote.type === 'UP')
                        return acc + 1
                    if(vote.type === 'DOWN')
                        return acc - 1
                    return acc},0) 
            const currentVote = post.votes.find(vote => vote.userId === 'currentUserId')   
            if(index === posts.length - 1){
            return (
            <li key={post.id} ref={ref}> 
                <PostOut 
                            key={post.id}
                            post={post}
                            commentAmt={post.comments.length}
                            subreddit={post.subreddit}
                            votesAmt={voteAmt}
                            currentVote={currentVote}
                />
            </li>)
            }
            else
            {
                return (
                <li key={post.id}> 
                    <PostOut 
                        key={post.id}
                        post={post}
                        commentAmt={post.comments.length}
                        subreddit={post.subreddit}
                        votesAmt={voteAmt}
                        currentVote={currentVote}
                    />
                </li> )
            }
            })}   
            {isFetchingNextPage && (
            <li className='flex justify-center'>
            <Loader2 className='w-6 h-6 text-zinc-500 animate-spin' />
            </li>
      )}
        </ul>
    )
}
