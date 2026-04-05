'use client'

import { useState } from "react"
import { Clipboard } from "lucide-react"

interface ShareButtonProps {
  link: string
}

export default function ShareButton({ link }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const handleClick = async () => {
    try {
    if (typeof window === "undefined") return 
    var trueLink = `${window.location.origin}${link}?source=share`
    await navigator.clipboard.writeText(trueLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500) 
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }
  return (
    <button
      onClick={handleClick}
      className="w-fit flex items-center gap-1 px-3 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs text-gray-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
    >
      <Clipboard className="h-3.5 w-3.5" />
      <span>{copied ? "Copied!" : "Share"}</span>
    </button>
  )
}