'use client'

import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export function LoadingSpinner({ size = 'md', text, className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
        {text && (
          <p className="text-sm text-text-secondary animate-fade-in">{text}</p>
        )}
      </div>
    </div>
  )
}

export function PageLoader({ text = "Chargement..." }: { text?: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <LoadingSpinner size="lg" text={text} />
    </div>
  )
}

export function SkeletonLoader({ lines = 3 }: { lines?: number }) {
  const widths = ['w-full', 'w-4/5', 'w-3/4', 'w-5/6', 'w-2/3']
  
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`loading-skeleton h-4 rounded-md ${widths[i % widths.length]}`}
        />
      ))}
    </div>
  )
}
