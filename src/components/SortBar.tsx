'use client'


import { SortBy } from '@/types/enum'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/Button'
import {  ChevronDown } from 'lucide-react'
import { useRouterWithLoader } from '@/lib/utilui'

interface SortBarProps {
  subredditId: string
  currentSort: SortBy
}

const sortLabel = {
  [SortBy.HOT]: 'Hot',
  [SortBy.TOP]: 'Top',
  [SortBy.NEW]: 'New',
}

export default function SortBar({ subredditId, currentSort }: SortBarProps) {
  const {push} = useRouterWithLoader()

  const handleChange = (sort: SortBy) => {
    if (sort === currentSort) return
    push(`/r/${subredditId}/${sort}`)

  }

  return (
    <div className="">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="text-sm border-hidden    ">
            {sortLabel[currentSort]} 
            <ChevronDown/>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => handleChange(SortBy.HOT)}>
            Hot
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleChange(SortBy.TOP)}>
             Top
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleChange(SortBy.NEW)}>
            New
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}