import { getAuthToken } from "@/lib/auth";
import { getIdnull } from "@/lib/utils";
import { getComments } from "@/server/services/subreddit/Get";
import PostComment from "./PostComment";

const CommentsSection = async ({ postId }: { postId: bigint }) => {
  const userId = getIdnull(await getAuthToken());
  const comments = await getComments({ postId, userId });

  return (
    <div className="flex flex-col gap-y-2 mt-2">
      <hr className="w-full h-px my-6" />
      <div className="flex flex-col gap-y-2 mt-2">
        {comments.map((comment) => (
          <div key={comment.id} className="flex flex-col">
            <div className="mb-2">
              <PostComment comment={comment} postId={postId} />
            </div>
            {comment.replies
              ?.sort((a, b) => b.voteAmt - a.voteAmt)
              .map((reply) => (
                <div key={reply.id} className="ml-2 py-2 pl-4 border-l-2 border-zinc-200">
                  <PostComment comment={reply} parentsId={comment.id} postId={postId} />
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;
