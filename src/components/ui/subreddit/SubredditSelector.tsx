'use client'

import * as React from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SubRedditDto } from '@/types/subreddit'
import { useRouterWithLoader } from '@/lib/utilui'

type SubredditSelectorProps = {
  slug?: string
  initialImage?: string
  onBeforeChange?: () => Promise<void>
}

const SubredditAvatar = ({image,name,}: {image?: string,name?: string}) => (
  <Avatar className="w-7 h-7 shrink-0">
    <AvatarImage src={image} alt={name ?? ''} />
    <AvatarFallback className="text-xs bg-primary/20">
      {name?.[0]?.toUpperCase() ?? 'r'}
    </AvatarFallback>
  </Avatar>
)

export function SubredditSelector({
  slug,
  initialImage,
  onBeforeChange,
}: SubredditSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState<string | undefined>(slug)
  const [selectedImage, setSelectedImage] = React.useState<string | undefined>(initialImage)
  const [search, setSearch] = React.useState('')
  const [subreddits, setSubreddits] = React.useState<SubRedditDto[]>([])
  const [loading, setLoading] = React.useState(false)

  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const abortRef = React.useRef<AbortController | null>(null)

  React.useEffect(() => {
    if (slug) setValue(slug)
    if (initialImage) setSelectedImage(initialImage)
  }, [slug, initialImage])

  React.useEffect(() => {
    if (!open) return

    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (abortRef.current) abortRef.current.abort()

    if (!search.trim()) {
      setSubreddits([])
      return
    }

    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController()
      abortRef.current = controller
      setLoading(true)
      try {
        const res = await fetch(`/api/subreddit/where-to-post?name=${encodeURIComponent(search)}`,{ signal: controller.signal })
        const data: SubRedditDto[] = await res.json()
        setSubreddits(data)
      } 
      catch (e: any) {if (e.name !== 'AbortError') setSubreddits([])} 
      finally {setLoading(false)}
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      if (abortRef.current) abortRef.current.abort()
    }
  }, [search, open])

  const { push } = useRouterWithLoader()

  return (
    <div className="relative w-full max-w-xl">
      <div className="h-[48px] w-full">
        <Button
          onClick={() => setOpen(true)}
          variant="secondary"
          className="w-full h-[48px] px-4 rounded-full border transition text-base flex items-center gap-2">
          <SubredditAvatar image={selectedImage} name={value} />
          <span className="flex-1 text-left">
            {value ? `r/${value}` : 'Select a community'}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        </Button>
        </div>

        <CommandDialog open={open} onOpenChange={setOpen} className='lg:max-w-xl'>
          <Command shouldFilter={false} >
            <CommandInput placeholder="Search communities..." value={search} onValueChange={setSearch} className='bg-transparent outline-none focus:outline-none ring-0 focus:ring-0'/>
            <CommandList>
            <CommandEmpty>No result found</CommandEmpty>
              <CommandGroup >
                {subreddits.map((s) => (
                  <CommandItem key={s.Id.toString()} value={s.name} data-checked={value === s.name}
                    onSelect={async () => {
                      await onBeforeChange?.()
                      setValue(s.name)
                      setSelectedImage(s.image)
                      setSearch('')
                      setOpen(false)
                      push(`/r/${s.name}/submit`)}}>
                    <div className="flex items-center w-full -ml-1">
                      <SubredditAvatar image={s.image} name={s.name} />
                      <span className="px-1">r/{s.name}</span>
                    </div>
                      {/* <Check className={cn('h-4 w-4',value === s.name ? 'opacity-100' : 'opacity-0')}/> */}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </CommandDialog>
      </div>
  )
}