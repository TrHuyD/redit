'use client'
import * as React from 'react'
import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

export function SubredditSelector() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('reactjs')

  const subreddits = [
    { value: 'reactjs', label: 'r/reactjs' },
    { value: 'nextjs', label: 'r/nextjs' },
    { value: 'webdev', label: 'r/webdev' },
  ]

  const selected = subreddits.find((s) => s.value === value)
  const containerRef = React.useRef<HTMLDivElement>(null)
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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  return (
    <div ref={containerRef} className="w-full max-w-2xl">
      {!open ? (
        //  CLOSED STATE
        <button
          onClick={() => setOpen(true)}
          className="w-full text-left px-4 py-3 rounded-full border bg-muted hover:bg-muted/80 transition text-lg"
        >
          {selected?.label || 'Select subreddit'}
        </button>
      ) : (
        //  OPEN STATE 
        <div className="relative w-full">
          <Command className="rounded-full border bg-background">
            <CommandInput
              autoFocus
              placeholder="Search subreddit..."
              className="h-[48px] text-lg px-4 rounded-full"
            />

            <CommandList className="absolute top-full left-0 w-full mt-2 max-h-60 overflow-y-auto rounded-md border bg-background shadow-md z-50">
              <CommandEmpty>No subreddit found.</CommandEmpty>

              <CommandGroup>
                {subreddits.map((s) => (
                  <CommandItem
                    key={s.value}
                    value={s.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue)
                      setOpen(false)
                    }}
                    className="text-base"
                  >
                    {s.label}

                    <Check
                      className={cn(
                        'ml-auto h-4 w-4 transition-opacity',
                        value === s.value
                          ? 'opacity-100 text-muted-foreground'
                          : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  )
}