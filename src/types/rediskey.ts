export const rediskey = {
    post: {
      stats: (id: bigint) => `post:stats:${id}`,
      statsAll: "post:stats:*",
      content: (id: bigint) => `post:${id}`,
    },
    user: {
      info: (id: bigint) => `user:${id}:metadata`,
      subHistory : (id:bigint) => `user:${id}:subhistory`,
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
      stats: (id: bigint) => `comment:${id}:stats`
    }
  };