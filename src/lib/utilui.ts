'use client'
import { useRouter, usePathname } from 'next/navigation'
import { useCallback } from 'react'

export function useRouterWithLoader() {
  const router = useRouter()
  const pathname = usePathname()
  const push = useCallback((href: string) => {
    if (href === pathname) return 
    window.dispatchEvent(new Event('toploader:start'))
    router.push(href)
  }, [router, pathname])

  return { ...router, push }
}