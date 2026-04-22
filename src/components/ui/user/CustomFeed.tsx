"use client";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";

import { PostUserDto } from "@/types/post";
import axios from "axios";
import InfiniteFeed from "../post/InfiniteFeed";
import PostOut from "../post/PostOut";

interface PostFeedProps {
  initialPosts: PostUserDto[];
  username:string;
}

export default function CustomFeed({ initialPosts,username }: PostFeedProps) {
  const fetcher = async (cursor: string | null) => {
    const params = new URLSearchParams({
      limit: INFINITE_SCROLLING_PAGINATION_RESULTS.toString(),
        username:username,
      ...(cursor && { cursorId: cursor }),
    });
    const res = await axios.get(`/api/user/posts?${params.toString()}`);
    return res.data as PostUserDto[];
  };

  return (
    <InfiniteFeed
      queryKey={["posts", "user",username]}
      initialData={initialPosts}
      limit={INFINITE_SCROLLING_PAGINATION_RESULTS}
      fetcher={fetcher}
      getKey={(p) => p.id.toString()}
      getCursor={(post) => post.id.toString()}
      renderItem={(post) => <PostOut post={post} displayType="both" />}
    />
  );
}
