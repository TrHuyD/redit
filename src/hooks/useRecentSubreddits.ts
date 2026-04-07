import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { SubRedditDto } from '@/types/subreddit'
import { UserSubredditHistory } from '@/lib/validators/user'

export function useRecentSubreddits(enabled: boolean) {
  return useQuery<SubRedditDto[]>({
    queryKey: ['recentSubreddits'],
    queryFn: async () => {
      const res = await axios.get('/api/subreddit/recent')
      const data = res.data as UserSubredditHistory
      return data.subreddits
    },
    enabled,
    staleTime: 1000 * 60 * 5,
  })
}
