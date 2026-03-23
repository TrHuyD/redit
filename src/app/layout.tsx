import { cn } from '@/lib/utils'
import '@/styles/globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/ui/Navbar'
import { Providers } from '@/components/ui/provider'
import { getAuthToken } from '@/lib/auth'
import { AuthProvider } from '@/components/ui/providers/auth-provider'
import { SpeedInsights } from '@vercel/speed-insights/next';
import { LeftTab } from '@/components/ui/subreddit/LeftTab'
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
    <html
      lang="en"
      className={cn('text-slate-900 antialiased', inter.className)}
    >
      <body className="data-[scroll-locked]:!overflow-visible">
        <div className="min-h-screen antialiased">
          <AuthProvider isLoggedIn={!!session}>
            <Providers>
              <Navbar />
              {/* MAIN LAYOUT  */}
              <div className="pt-14 grid grid-cols-[16rem_minmax(0,1fr)] min-h-screen">
                {/* LEFT TAB */}
                <div className="hidden lg:block border-r border-zinc-100">
                  <LeftTab joinedSubreddits={[]} recentSubreddits={[]} />
                </div>
                {/* RIGHT CONTENT */}
                <div className="w-full">
                  {children}
                </div>
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