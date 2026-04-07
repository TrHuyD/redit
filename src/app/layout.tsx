import { cn } from '@/lib/utils'
import '@/styles/globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/ui/Navbar'
import { Providers } from '@/components/ui/provider'
import { getAuthToken } from '@/lib/auth'
import { AuthProvider } from '@/components/ui/providers/auth-provider'
import { SpeedInsights } from '@vercel/speed-insights/next'
import TopLoader from '@/components/ui/TopLoader'

import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { LeftTab } from '@/components/ui/subreddit/LeftTab'
import NextTopLoader from 'nextjs-toploader';
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Redit',
  description: 'A Reddit clone built with Next.js and TypeScript.',
}
export default async function RootLayout({
  children,
  popModal,
}: {
  children: React.ReactNode
  popModal: React.ReactNode
}) {
  const session = await getAuthToken()

  return (
    <html lang="en" >
      <body className={cn(' antialiased', inter.className)}>
        <div className="min-h-screen antialiased">
          <AuthProvider isLoggedIn={!!session}>
          <Providers>
  <TopLoader />
  <NextTopLoader color="#f97316" />
  <Navbar />
  <div className='pt-14'>
  <SidebarProvider>
    <LeftTab/>
    <SidebarInset>
      <main className="px-8 ">
        {children}
      </main>
    </SidebarInset>
  </SidebarProvider>
  </div>
  {popModal}
  <SpeedInsights />
</Providers>
          </AuthProvider>
        </div>
      </body>
    </html>
  )
}