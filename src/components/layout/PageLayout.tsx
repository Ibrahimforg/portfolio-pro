'use client'

import { ReactNode } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'

interface PageLayoutProps {
  children: ReactNode
  showThemeSwitcher?: boolean
  className?: string
}

export default function PageLayout({ children, showThemeSwitcher = true, className = '' }: PageLayoutProps) {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      {showThemeSwitcher && <ThemeSwitcher />}
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        {children}
      </main>
      
      <Footer />
    </div>
  )
}
