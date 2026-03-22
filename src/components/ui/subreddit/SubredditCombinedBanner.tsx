'use client'
import { SubredditWithMembership } from "@/types/subreddit"
import { SubredditBanner } from "./SubredditBanner"
import { SubredditHeader } from "./SubredditHeader"
import { usePathname } from "next/navigation"
import { useMemo } from "react"

interface Props {
  subreddit: SubredditWithMembership
}

export function SubredditCombinedHeader({ subreddit }: Props) {
    const pathname = usePathname()
  
    const hideHeader = useMemo(() => {
      const segments = pathname.split('/')
      return (
        segments.length > 3 &&
        (segments[3] === 'comments' || segments[3] === 'submit')
      )
    }, [pathname])
  
    return (
      <>
        {!hideHeader && (
          <>
            <SubredditBanner subreddit={subreddit} />
            <SubredditHeader subreddit={subreddit} />
          </>
        )}
      </>
    )
  }