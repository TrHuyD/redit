"use client"
import { Button } from "@/components/ui/Button"
import { loginToast } from "@/lib/customToast"
import { withToast } from "@/lib/withToast" // your withToast wrapper
import { SubscribeToSubredditPayload } from "@/lib/validators/subreddit"
import { SubredditWithMembership } from "@/types/subreddit"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { useRouter } from "next/navigation"
import { startTransition } from "react"
import { toast } from "sonner"

type SubredditToggleProps = Pick<
  SubredditWithMembership,
  "id" | "name" | "isMember" | "isCreator"
>

export const SubscribeLeaveToggle = ({ subreddit }: { subreddit: SubredditToggleProps }) => {
  const { id, name, isMember, isCreator } = subreddit
  const router = useRouter()

  const payload: SubscribeToSubredditPayload = { subredditId: id }

  const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
    mutationFn: withToast(async () => {
      const { data } = await axios.post("/api/subreddit/subscribe", payload)
      return data as string
    }),
    onSuccess: () => {
      toast.success(`You are now subscribed to r/${name}`)
      startTransition(() => router.refresh())
    },
  })

  const { mutate: unsubscribe, isLoading: isUnsubLoading } = useMutation({
    mutationFn: withToast(async () => {
      const { data } = await axios.post("/api/subreddit/unsubscribe", payload)
      return data as string
    }),
    onSuccess: () => {
      toast.success(`You are now unsubscribed to r/${name}`)
      startTransition(() => router.refresh())
    },
  })

  if (isCreator) return (
    <p className="w-full">
      <Button className="w-full" disabled>Owner</Button>
    </p>
  )

  return isMember ? (
    <p className="w-full">
      <Button className="w-full" disabled={isUnsubLoading} onClick={() => unsubscribe()}>
        Leave
      </Button>
    </p>
  ) : (
    <p className="w-full">
      <Button className="w-full" disabled={isSubLoading} onClick={() => subscribe()}>
        Join
      </Button>
    </p>
  )
}