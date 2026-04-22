import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { getPostsWithMeta } from "../subreddit/post/service";
import { getUserId } from "./loader";
import { getUsersPostIds } from "./repo";

export async function getUsersPosts({ username, orderBy = "desc", take = INFINITE_SCROLLING_PAGINATION_RESULTS, cursor, userId }: { username: string; orderBy?: "asc" | "desc"; take?: number; cursor?: bigint; userId?: bigint }) {
  const Id = await getUserId(username);
  if (!Id) return [];
  const postIds = await getUsersPostIds({ Id, orderBy, take, cursor });
  const posts = await getPostsWithMeta(postIds, userId);
  return posts;
}
