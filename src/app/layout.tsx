import { cn } from '@/lib/utils'
import '@/styles/globals.css'
import {Inter} from 'next/font/google'
import Navbar from '@/components/ui/Navbar'
import { Toaster } from 'sonner'
export const metadata = {
  title: 'Redit',
  description: 'A Reddit clone built with Next.js and TypeScript.',
}

const inter = Inter ( { subsets : ['latin']})

export default function RootLayout({
  children,
  authModal
}: {
  children: React.ReactNode,
  authModal: React.ReactNode
}) {
  return (
    <html lang='en' className= {cn('text-slate-900 bg-white antialiased light', inter.className)}>
      <body className ={cn('min-h-screen pt-12 bg-slate-50 antialiased')}>
       <Navbar/>
       {authModal}
        <div className={cn('container max-w-7xl mx-auto h-full pt-12')}>
          
          {children}
        </div>
      <Toaster/>
      </body>
    </html>
  )
}
