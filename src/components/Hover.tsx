"use client"

import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"
import { createContext, useContext, useState, ReactNode } from "react"
import { useQuery, UseQueryResult } from "@tanstack/react-query"

type HoverContextType<T> = UseQueryResult<T>
const HoverContext = createContext<HoverContextType<any> | null>(null)

export function useHoverData<T>() {
  const ctx = useContext(HoverContext)
  if (!ctx) throw new Error("useHoverData must be used inside <Hover>")
  return ctx as HoverContextType<T>
}
type HoverProps<T> = {
  queryKey: unknown[]
  queryFn: () => Promise<T>
  children: ReactNode
  content: ReactNode
  className?: string
  openDelay?: number
  closeDelay?: number
}
export function Hover<T>({ queryKey, queryFn, children, content, className = "w-72", openDelay = 200, closeDelay = 100 }: HoverProps<T>) {
  const [open, setOpen] = useState(false)
  const query = useQuery({ queryKey, queryFn, enabled: open, staleTime: 60000 })
  return (
    <HoverContext.Provider value={query}>
      <HoverCard onOpenChange={setOpen} openDelay={openDelay} closeDelay={closeDelay}>
        <HoverCardTrigger asChild>{children}</HoverCardTrigger>
        <HoverCardContent className={className}>{content}</HoverCardContent>
      </HoverCard>
    </HoverContext.Provider>
  )
}