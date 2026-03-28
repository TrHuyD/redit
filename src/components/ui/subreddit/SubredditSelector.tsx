'use client'
import * as React from 'react'
import { Check, ChevronDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Button } from '@/components/ui/Button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SubRedditDto } from '@/types/subreddit'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type SubredditSelectorProps = {
  slug?: string
  initialImage?: string
}

const SubredditAvatar = ({ image, name }: { image?: string; name?: string }) => (
  <Avatar className="w-7 h-7 shrink-0">
    <AvatarImage src={image} alt={name ?? ''} />
    <AvatarFallback className="text-xs bg-primary/20">
      {name?.[0]?.toUpperCase() ?? 'r'}
    </AvatarFallback>
  </Avatar>
)

export function SubredditSelector({ slug, initialImage }: SubredditSelectorProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState<string | undefined>(slug)
  const [selectedImage, setSelectedImage] = React.useState<string | undefined>(initialImage)
  const [search, setSearch] = React.useState('')
  const [subreddits, setSubreddits] = React.useState<SubRedditDto[]>([])
  const [loading, setLoading] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const abortRef = React.useRef<AbortController | null>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node))
        setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
        const res = await fetch(
          `/api/subreddit/where-to-post?name=${encodeURIComponent(search)}`,
          { signal: controller.signal }
        )
        const data: SubRedditDto[] = await res.json()
        setSubreddits(data)
      } catch (e: any) {
        if (e.name !== 'AbortError') setSubreddits([])
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      if (abortRef.current) abortRef.current.abort()
    }
  }, [search, open])

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className="h-[48px] w-full">

        {/* CLOSED */}
        {!open && (
          <Button
            onClick={() => setOpen(true)}
            variant="secondary"
            className="w-full h-[48px] px-4 rounded-full border transition text-base flex items-center gap-2"
          >
            <SubredditAvatar image={selectedImage} name={value} />
            <span className="flex-1 text-left">
              {value ? `r/${value}` : 'Select a community'}
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          </Button>
        )}

        {/* OPEN */}
        {open && (
          <Command
            shouldFilter={false}
            className="h-[48px] w-full rounded-full border bg-background overflow-hidden"
          >
            <div className="flex items-center h-full w-full">
              <CommandInput
                autoFocus
                placeholder="Search communities..."
                value={search}
                onValueChange={setSearch}
                className="flex-1 min-w-0 h-full bg-transparent border-none outline-none shadow-none p-0 text-base focus:ring-0"
              />
              {search.length > 0 && (
                <Button
                  type="button"
                  onMouseDown={e => { e.preventDefault(); e.stopPropagation() }}
                  onClick={e => { e.preventDefault(); e.stopPropagation(); setSearch('') }}
                  className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full transition"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            <CommandList className="absolute top-[52px] left-0 w-full max-h-72 overflow-y-auto rounded-xl border bg-popover shadow-md z-50">
              {loading && (
                <div className="py-3 text-center text-sm text-muted-foreground">Searching...</div>
              )}
              {!loading && search.length > 0 && subreddits.length === 0 && (
                <CommandEmpty></CommandEmpty>
              )}
              {!loading && search.length === 0 && (
                <div className="py-3 text-center text-sm text-muted-foreground">
                  Type to search communities
                </div>
              )}
              <CommandGroup>
                {subreddits.map(s => (
                  <Link href={`/r/${s.name}/submit`}>
                  <CommandItem
                    key={s.Id.toString()}
                    value={s.name}
                    onSelect={() => {
                      setValue(s.name)
                      setSelectedImage(s.image)
                      setSearch('')
                      setOpen(false)
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-base cursor-pointer"
                  >
                    <SubredditAvatar image={s.image} name={s.name} />
                    <span className="flex-1">r/{s.name}</span>
                    <Check className={cn(
                      'h-4 w-4 transition-opacity text-muted-foreground',
                      value === s.name ? 'opacity-100' : 'opacity-0'
                    )} />
                  </CommandItem>
                  </Link>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        )}
      </div>
    </div>
  )
}