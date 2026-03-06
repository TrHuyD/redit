import { cn } from '@/lib/utils'
import '@/styles/globals.css'
import {Inter} from 'next/font/google'
import Navbar from '@/components/ui/Navbar'
export const metadata = {
  title: 'Redit',
  description: 'A Reddit clone built with Next.js and TypeScript.',
}

const inter = Inter ( { subsets : ['latin']})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' className= {cn('text-slate-900 bg-white antialiased light', inter.className)}>
      <body className ={cn('min-h-screen pt-12 bg-slate-50 antialiased')}>
       <Navbar/>
        <div className={cn('container max-w-7x1 mx-auto h-full pt-12')}>
          
          {children}
        </div>

      </body>
    </html>
  )
}
