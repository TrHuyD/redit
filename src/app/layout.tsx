import { cn } from '@/lib/utils'
import '@/styles/globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/ui/Navbar'
import { Providers } from '@/components/ui/provider'
import { getAuthToken } from '@/lib/auth'
import { AuthProvider } from '@/components/ui/providers/auth-provider'

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
          <div className="w-full h-full pt-14">
            {children}
          </div>
          
        </Providers>
        </AuthProvider>
        </div>
      </body>
    </html>
  )
}