export const rediskey = {
    post: {
      stats: (id: bigint) => `post:stats:${id}`,
      statsAll: "post:stats:*",
      content: (id: bigint) => `post:${id}`,
    },
    user: {
      baseInfo: (id: bigint) => `user:base:${id}`,
      profileInfo:(id:bigint) => `user:profile:${id}`,
      subHistory : (id:bigint) => `user:subhistory:${id}`,
      subHistoryLimit : 5
    },
    subreddit:{
        autocomplete:"autocomplete:subreddit",
        membercount:(id:bigint)=> `subreddit:membercount:${id}`,
        hotrank:(id:bigint)=>`subreddit:hotrank:${id}`,
        hotrankall:'subreddit:hotrank:*',
        metadata:(id:bigint)=>`subreddit:metadata:${id}`,
        toprank:(id:bigint)=>`subreddit:toprank:${id}`
    },
    comment:{
      stats: (id: bigint) => `comment:stats:${id}`
    }
  };