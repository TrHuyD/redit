'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { QueryProvider } from "@/components/ui/providers/query-provider"
import { ModalProvider } from "@/components/ui/providers/modal-provider"
import { Toaster } from 'sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light">
        <QueryProvider>
          <ModalProvider>
            {children}
            <Toaster />
          </ModalProvider>
        </QueryProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}