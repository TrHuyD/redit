
import { cn } from '@/lib/utils'
import '@/styles/globals.css'
import {Inter} from 'next/font/google'
import Navbar from '@/components/ui/Navbar'
import { Toaster } from 'sonner'
import { ModalProvider } from "@/components/ui/providers/modal-provider";
import {QueryProvider} from "@/components/ui/providers/query-provider"
import { ThemeProvider } from 'next-themes'

export const metadata = {
  title: 'Redit',
  description: 'A Reddit clone built with Next.js and TypeScript.',
}

const inter = Inter ( { subsets : ['latin']})

export default async function RootLayout({
  children,
  popModal  
}: {
  children: React.ReactNode,
  popModal: React.ReactNode
}) {


  return (
    <html lang='en'  className= {cn('text-slate-900  antialiased', inter.className)}  >
    {/*text-slate-900 bg-white antialiased light', inter.className */}
      <body className ={cn('min-h-screen antialiased')}>
      <ThemeProvider attribute="class" defaultTheme='dark'>

      <QueryProvider>
      <ModalProvider>
       <Navbar/>
       {popModal}
       <div className={cn('w-full h-full pt-14')}>
          {children}
        </div>
      <Toaster/>
      </ModalProvider>
      </QueryProvider>
    </ThemeProvider>

      </body>
    </html>
  )
}
