import { cn } from '@/lib/utils'
import '@/styles/globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/ui/Navbar'
import { Providers } from '@/components/ui/provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Redit',
  description: 'A Reddit clone built with Next.js and TypeScript.',
}

export default function RootLayout({
  children,
  popModal,
}: {
  children: React.ReactNode
  popModal: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cn('text-slate-900 antialiased', inter.className)}
    >
      <body className="min-h-screen antialiased">
        <Providers>
          <Navbar />
          {popModal}
          <div className="w-full h-full pt-14">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}