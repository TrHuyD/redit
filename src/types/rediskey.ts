export const key = {
    post: {
      stats: (id: bigint) => `post:${id}:stats`,
      content: (id: bigint) => `post:${id}`,
    },
    user: {
      info: (id: bigint) => `user:${id}:info`,
      subHistory : (id:bigint) => `user:${id}:subhistory`,
      subHistoryLimit : 5
    }
  };