'use client'

import { Button } from "@/components/ui/Button"
import { withToast } from "@/lib/withToast"
import { SubscribeToSubredditPayload } from "@/lib/validators/subreddit"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useRouter } from "next/navigation"
import { startTransition, useState } from "react"
import { toast } from "sonner"
import { UserSubredditBaseMd } from "@/types/subreddit"


type SubredditToggleProps = Pick<
  UserSubredditBaseMd,
  "Id" | "name" | "isMember" | "isCreator"
>
export const SubscribeLeaveToggle = ({ subreddit }: { subreddit: SubredditToggleProps }) => {
  const { Id, name, isMember, isCreator } = subreddit
  const router = useRouter()

  const [member, setMember] = useState(isMember)

  const payload: SubscribeToSubredditPayload = { subredditId: Id }

  const { mutate: subscribe, isPending: isSubLoading } = useMutation({
    mutationFn: withToast(async () => {
      const { data } = await axios.post("/api/subreddit/subscribe", payload)
      return data as string
    }),
    onSuccess: () => {
      setMember(true) 
      startTransition(() => router.refresh())
    },
  })

  const { mutate: unsubscribe, isPending: isUnsubLoading } = useMutation({
    mutationFn: withToast(async () => {
      const { data } = await axios.post("/api/subreddit/unsubscribe", payload)
      return data as string
    }),
    onSuccess: () => {
      setMember(false) 
      startTransition(() => router.refresh())
    },
  })

  const isLoading = isSubLoading || isUnsubLoading
  
  if (isCreator) {
    return (
      <p className="w-full">
        <Button className="w-full" disabled>
          Owner
        </Button>
      </p>
    )
  }

  return member ? (
    <p className="w-full">
      <Button
        className="w-full"
        disabled={isLoading}
        onClick={() => unsubscribe()}
      >
        {isLoading ? "Leaving..." : "Leave"}
      </Button>
    </p>
  ) : (
    <p className="w-full">
      <Button
        className="w-full"
        disabled={isLoading}
        onClick={() => subscribe()}
      >
        {isLoading ? "Joining..." : "Join"}
      </Button>
    </p>
  )
}