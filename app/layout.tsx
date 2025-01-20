'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { useState, useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [showSidebar, setShowSidebar] = useState(true)
  const [isQuizActive, setIsQuizActive] = useState(false)

  // Add keyboard shortcut for toggling sidebar
  useHotkeys('mod+\\', () => {
    if (!isQuizActive) {
      setShowSidebar(prev => !prev)
    }
  })

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
          <div className="bg-background">
            {/* <Navbar toggleSidebar={() => setShowSidebar(!showSidebar)} />
            <div className="flex">
              {showSidebar && !isQuizActive && <Sidebar />}
              <main className="flex-1"> */}
                {children}
              {/* </main>
            </div> */}
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
