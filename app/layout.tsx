'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/theme-provider'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { useState, useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [showSidebar, setShowSidebar] = useState(true)
  const [isQuizActive, setIsQuizActive] = useState(false)

  useEffect(() => {
    const handleQuizStateChange = ((event: CustomEvent) => {
      setIsQuizActive(event.detail.isActive)
      setShowSidebar(!event.detail.isActive)
    }) as EventListener

    window.addEventListener('quizStateChange', handleQuizStateChange)
    return () => window.removeEventListener('quizStateChange', handleQuizStateChange)
  }, [])

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background">
            <Navbar toggleSidebar={() => setShowSidebar(!showSidebar)} />
            <div className="flex">
              {showSidebar && !isQuizActive && <Sidebar />}
              <main className="flex-1">
                {children}
              </main>
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
