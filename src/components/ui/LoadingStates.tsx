'use client'

import { Loader2, Sparkles } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
    </div>
  )
}

interface SkeletonProps {
  className?: string
  children?: React.ReactNode
}

export function Skeleton({ className = '', children }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-surface rounded-md ${className}`}>
      <div className="bg-surface-elevated rounded-md h-full w-full" />
      {children}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="card animate-fadeInUp">
      <Skeleton className="h-48 mb-4" />
      <Skeleton className="h-4 mb-2 w-3/4" />
      <Skeleton className="h-4 mb-4 w-1/2" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  )
}

export function ProjectCardSkeleton() {
  return (
    <div className="card hover-lift animate-fadeInUp">
      <Skeleton className="h-48 mb-4 rounded-t-lg" />
      <div className="space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-12 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <Sparkles className="w-12 h-12 text-primary animate-pulse-slow mx-auto mb-4" />
          <div className="absolute inset-0 w-12 h-12 bg-primary/20 rounded-full animate-ping" />
        </div>
        <LoadingSpinner size="lg" className="mb-4" />
        <p className="text-text-secondary animate-fadeInUp">Chargement en cours...</p>
      </div>
    </div>
  )
}

interface LoadingButtonProps {
  children: React.ReactNode
  loading?: boolean
  className?: string
  disabled?: boolean
  onClick?: () => void
}

export function LoadingButton({ 
  children, 
  loading = false, 
  className = '', 
  disabled = false,
  onClick 
}: LoadingButtonProps) {
  return (
    <button
      className={`btn-primary relative overflow-hidden ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      <span className={`transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </span>
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="sm" />
        </div>
      )}
    </button>
  )
}
