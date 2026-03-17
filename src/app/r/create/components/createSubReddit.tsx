"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { use, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { createSubreddit } from "@/lib/api/Subreddit/Create"
import { withToast } from "@/lib/withToast"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function CreateSubReddit() {
  const [inputName, setInputName] = useState("")
  var router = useRouter()
  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: withToast(createSubreddit),
    onSuccess: () => {
        toast.success("Community created successfully! fowarding to community page")
        router.push(`/r/${inputName}`)
        
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return  
    if (!inputName.trim()) return

    createCommunity({ name: inputName })
  }

  return (
    <div className="container flex items-center h-full max-w-3xl mx-auto">
      <div className="relative bg-white w-full h-fit p-4 rounded-lg space-y-6">

        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Create a community</h1>
        </div>

        <hr className="bg-zinc-500 h-px" />

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <p className="text-lg font-medium">Name</p>
            <p className="text-sm pb-2">
              Community names including capitalization cannot be changed.
            </p>
          </div>

          <div className="relative">
            <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400">
              r/
            </p>
            <Input
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className="pl-6"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="submit"
              disabled={isLoading}
            >
              Submit
            </Button>
          </div>

        </form>

      </div>
    </div>
  )
}