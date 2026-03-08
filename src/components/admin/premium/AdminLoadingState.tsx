'use client'

interface AdminLoadingStateProps {
  message?: string
}

export default function AdminLoadingState({ message = 'Chargement...' }: AdminLoadingStateProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
        <p className="text-text-secondary">{message}</p>
      </div>
    </div>
  )
}
