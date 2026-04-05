'use client'
import { useEffect, useState, useRef } from 'react'

export default function TopLoader() {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    const handleStart = () => {
      setLoading((prev) => {
        if (prev) return prev
        return true
      })
      setProgress(5)
      if (intervalRef.current) clearInterval(intervalRef.current)
  
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p < 40) return p + 5
          if (p < 60) return p + 1
          return p
        })
      }, 100)
    }
  
    window.addEventListener('toploader:start', handleStart)
    return () => window.removeEventListener('toploader:start', handleStart)
  }, [])
  useEffect(() => {
    if (!loading) return
    const t = setTimeout(() => {
      setProgress(100)
      setTimeout(() => {
        setLoading(false)
        setProgress(0)
      }, 300)

      if (intervalRef.current) clearInterval(intervalRef.current)
    }, 600) 

    return () => clearTimeout(t)
  }, [loading])

  return (
    <div
      style={{ width: `${progress}%` }}
      className="fixed top-0 left-0 h-[3px] bg-orange-500 z-[9999] transition-all duration-200 ease-out"
    />
  )
}