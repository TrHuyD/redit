'use client'
import { useIntersection } from "@mantine/hooks"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useEffect, useRef } from "react"
import { Loader2 } from "lucide-react"
import { SortBy } from "@/types/enum"

interface InfiniteFeedProps<T> {
    queryKey: string[]
    initialData: T[]
    limit: number
    fetcher: (cursor: string | null) => Promise<T[]>
    renderItem: (item: T, index: number) => React.ReactNode
    getCursor: (lastItem: T) => string | null
}

export default function InfiniteFeed<T>({
    queryKey,
    initialData,
    limit,
    fetcher,
    renderItem,
    getCursor,
}: InfiniteFeedProps<T>) {
    let mode : SortBy;
    mode = SortBy.NEW
    const lastItemRef = useRef<HTMLDivElement>(null)
    const { ref, entry } = useIntersection({
        root: lastItemRef.current,
        threshold: 1
    })
    
    const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey,
        queryFn: ({ pageParam }) => fetcher(pageParam as string | null),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage: T[]) => {
            if (lastPage.length < limit) return undefined
            const lastItem = lastPage[lastPage.length - 1]
            return lastItem ? getCursor(lastItem) : undefined
        },
        initialData: {
            pages: [initialData],
            pageParams: [null],
        },
        staleTime: 60*10,
    })

    useEffect(() => {
        if (entry?.isIntersecting) fetchNextPage()
    }, [entry, fetchNextPage])

    const items = data?.pages.flatMap(page => page) ?? []

    return (
        <ul className="flex flex-col col-span-2 space-y-6">
            {items.map((item, index) => (
                <li
                    key={index}
                    ref={index === items.length - 1 ? ref : undefined}
                >
                    {renderItem(item, index)}
                </li>
            ))}

            {isFetchingNextPage && (
                <li className="flex justify-center">
                    <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
                </li>
            )}
        </ul>
    )
}