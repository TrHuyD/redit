"use client"

import { Button } from "@/components/ui/Button"
import { loginToast } from "@/lib/customToast"
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
export const SubscribeLeaveToggle = ({subreddit,}: {subreddit: SubredditToggleProps}) => {
  const { id, name, isMember, isCreator } = subreddit
  const router = useRouter()

  const payload: SubscribeToSubredditPayload = {
    subredditId: id,
  }

  const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post("/api/subreddit/subscribe", payload)
      return data as string
    },

    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }
      }

      toast.error("There was a problem. Please try again.")
    },

    onSuccess: () => {
      startTransition(() => {
        router.refresh()
      })

      toast.success(`You are now subscribed to r/${name}`)
    },
  })

  const { mutate: unsubscribe, isLoading: isUnsubLoading } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post("/api/subreddit/unsubscribe", payload)
      return data as string
    },

    onError: (err: AxiosError) => {
      toast.error((err.response?.data as string) || "Something went wrong")
    },

    onSuccess: () => {
      startTransition(() => {
        router.refresh()
      })

      toast.success(`You are now unsubscribed from r/${name}`)
    },
  })

  if (isCreator) return (
    <p className="w-full mt-1 mb-4">
      You created this community
    </p>
  )
  
  return isMember ? (
    <Button
      className="w-full mt-1 mb-4"
      disabled={isUnsubLoading}
      onClick={() => unsubscribe()}
    >
      Leave community
    </Button>
  ) : (
    <Button
      className="w-full mt-1 mb-4"
      disabled={isSubLoading}
      onClick={() => subscribe()}
    >
      Join to post
    </Button>
  )
}