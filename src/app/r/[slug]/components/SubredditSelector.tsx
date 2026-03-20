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

type SubredditSelectorProps = {
  slug?: string
}

export function SubredditSelector({ slug }: SubredditSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState<string | undefined>(
    slug ?? 'reactjs'
  )
  const [search, setSearch] = React.useState('')
  const [subreddits, setSubreddits] = React.useState<
    { value: string; label: string }[]
  >([])

  const containerRef = React.useRef<HTMLDivElement>(null)

  // Close on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Sync slug (important if route changes)
  React.useEffect(() => {
    if (slug) setValue(slug)
  }, [slug])

  // 🔥 Simulate dynamic API filtering
  React.useEffect(() => {
    const all = [
      { value: 'reactjs', label: 'r/reactjs' },
      { value: 'nextjs', label: 'r/nextjs' },
      { value: 'webdev', label: 'r/webdev' },
      { value: 'javascript', label: 'r/javascript' },
      { value: 'programming', label: 'r/programming' },
    ]

    const filtered = all.filter((s) =>
      s.label.toLowerCase().includes(search.toLowerCase())
    )

    setSubreddits(filtered)
  }, [search])

  // ✅ Always derive selected from value (NOT list)
  const selected = value
    ? { value, label: `r/${value}` }
    : null

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className="h-[48px] w-full">

        {/* CLOSED */}
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="w-full h-[48px] px-4 rounded-full border bg-muted hover:bg-muted/80 transition text-base flex items-center gap-2"
          >
            <div className="w-6 h-6 rounded-full bg-primary/20 shrink-0" />
            <span className="flex-1 text-left">
              {selected?.label || 'Select a community'}
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          </Button>
        )}

        {/* OPEN */}
        {open && (
          <Command
            shouldFilter={false} // ❗ important
            className="h-[48px] w-full rounded-full border bg-background overflow-hidden
              [&_[cmdk-input-wrapper]]:flex
              [&_[cmdk-input-wrapper]]:items-center
              [&_[cmdk-input-wrapper]]:w-full
              [&_[cmdk-input-wrapper]]:h-full
              [&_[cmdk-input-wrapper]]:px-4
              [&_[cmdk-input-wrapper]]:gap-2
              [&_[cmdk-input-wrapper]_svg]:hidden"
          >
            {/* INPUT ROW */}
            <div className="flex items-center h-full w-full">
              <CommandInput
                autoFocus
                placeholder="Select a community"
                value={search}
                onValueChange={setSearch}
                className="flex-1 min-w-0 h-full bg-transparent border-none outline-none shadow-none p-0 text-base focus:ring-0"
              />

              {search.length > 0 && (
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setSearch('')
                  }}
                  className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-muted-foreground/30 hover:bg-muted-foreground/50 transition"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* DROPDOWN */}
            <CommandList className="absolute top-[52px] left-0 w-full max-h-72 overflow-y-auto rounded-xl border bg-popover shadow-md z-50">
              <CommandEmpty>No community found.</CommandEmpty>

              <CommandGroup>
        
          

                {subreddits.map((s) => (
                  <CommandItem
                    key={s.value}
                    value={s.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue)
                      setSearch('')
                      setOpen(false)
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-base cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 shrink-0" />
                    <span className="flex-1">{s.label}</span>
                    <Check
                      className={cn(
                        'h-4 w-4 transition-opacity text-muted-foreground',
                        value === s.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        )}
      </div>
    </div>
  )
}