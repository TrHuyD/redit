export const rediskey = {
    post: {
      stats: (id: bigint) => `post:stats:${id}`,
      statsAll: "post:stats:*",
      content: (id: bigint) => `post:${id}`,
    },
    user: {
      nameParse:(name:string) => `idPrase:user:${name}`,
      baseInfo: (id: bigint) => `user:base:${id}`,
      profileInfo:(id:bigint) => `user:profile:${id}`,
      subHistory : (id:bigint) => `user:subhistory:${id}`,
      subHistoryLimit : 5
    },
    subreddit:{
        autocomplete:"autocomplete:subreddit",
        metadata:(id:bigint)=>`subreddit:metadata:${id}`,
        membercount:(id:bigint)=> `subreddit:membercount:${id}`,
        hotrank:(id:bigint)=>`subreddit:hotrank:${id}`,
        hotrankall:'subreddit:hotrank:*',
        toprank:(id:bigint)=>`subreddit:toprank:${id}`
    },
    comment:{
      stats: (id: bigint) => `comment:stats:${id}`
    }
  };