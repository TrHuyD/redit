'use client'
import { usePathname } from "next/navigation"

export function IsInAPost()
{
  const pathname = usePathname()
  const pathParts = pathname.split('/')
  return pathParts.length >= 5 && pathParts[1] === 'r' && pathParts[3] === 'comments'
}