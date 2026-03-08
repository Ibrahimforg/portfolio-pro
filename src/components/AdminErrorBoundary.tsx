'use client'

import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface AdminErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface AdminErrorBoundaryProps {
  children: React.ReactNode
}

export class AdminErrorBoundary extends React.Component<AdminErrorBoundaryProps, AdminErrorBoundaryState> {
  constructor(props: AdminErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): AdminErrorBoundaryState {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('AdminErrorBoundary caught an error:', error, errorInfo)
    // Log les erreurs admin pour monitoring
    if (typeof window !== 'undefined') {
      console.error('Admin Error Details:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString()
      })
    }
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="text-center max-w-lg bg-surface rounded-lg p-8 border border-red-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-4">
              Erreur Administration
            </h1>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 font-mono text-sm">
                {this.state.error?.message || "Une erreur est survenue dans le panneau d&apos;administration"}
              </p>
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-2">
                  <summary className="text-red-700 cursor-pointer text-sm font-medium">
                    Détails techniques
                  </summary>
                  <pre className="mt-2 text-xs text-red-600 overflow-auto">
                    {this.state.error?.stack}
                  </pre>
                </details>
              )}
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => this.setState({ hasError: false, error: undefined })}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Réessayer
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 bg-surface border border-border rounded-lg hover:bg-surface-elevated transition-colors"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default AdminErrorBoundary
