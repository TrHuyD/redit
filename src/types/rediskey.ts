export const rediskey = {
    post: {
      stats: (id: bigint) => `post:${id}:stats`,
      content: (id: bigint) => `post:${id}`,
    },
    user: {
      info: (id: bigint) => `user:${id}:info`,
      subHistory : (id:bigint) => `user:${id}:subhistory`,
      subHistoryLimit : 5
    },
    subreddit:{
        autocomplete:"autocomplete:subreddit",
        membercount:(id:bigint)=> `subreddit:${id}:membercount`
    },
    comment:{
      stats: (id: bigint) => `comment:${id}:stats`
    }
  };