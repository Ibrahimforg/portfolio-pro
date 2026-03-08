'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Send } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
  errorId: string
  retryCount: number
}

export class AdvancedErrorBoundary extends Component<Props, State> {
  private maxRetries = 3
  private retryTimeout: NodeJS.Timeout | null = null

  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      errorId: this.generateErrorId(),
      retryCount: 0
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    }
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    // Logging avancé
    this.logError(error, errorInfo)

    // Notification du parent
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Envoi à un service externe
    this.sendErrorToService(error, errorInfo)
  }

  private generateErrorId(): string {
    return `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private logError(error: Error, errorInfo: ErrorInfo): void {
    const logData = {
      errorId: this.state.errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getUserId(),
      sessionId: this.getSessionId()
    }

    console.error('Advanced Error Boundary:', logData)

    // Envoyer à votre service de logging
    this.sendToLoggingService(logData)
  }

  private async sendErrorToService(error: Error, errorInfo: ErrorInfo): Promise<void> {
    try {
      await fetch('/api/error-reporting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          errorId: this.state.errorId,
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
          buildVersion: process.env.NEXT_PUBLIC_BUILD_VERSION || 'unknown'
        })
      })
    } catch (reportingError) {
      console.error('Failed to send error report:', reportingError)
    }
  }

  private async sendToLoggingService(logData: Record<string, unknown>): Promise<void> {
    // Implémenter l'envoi à votre service de logging (Sentry, LogRocket, etc.)
    console.log('Sending to logging service:', logData)
  }

  private getUserId(): string | null {
    // Récupérer l'ID utilisateur depuis votre système d'auth
    return localStorage.getItem('userId') || null
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('sessionId')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('sessionId', sessionId)
    }
    return sessionId
  }

  private handleRetry = (): void => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        retryCount: prevState.retryCount + 1
      }))

      // Timeout pour éviter les boucles infinies
      this.retryTimeout = setTimeout(() => {
        window.location.reload()
      }, 1000)
    }
  }

  private handleSendReport = async (): Promise<void> => {
    try {
      await this.sendErrorToService(
        this.state.error!,
        this.state.errorInfo!
      )
      alert('Rapport d\'erreur envoyé avec succès')
    } catch (error) {
      alert('Échec de l\'envoi du rapport')
    }
  }

  override componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout)
    }
  }

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            
            <h1 className="text-xl font-bold text-center text-gray-900 mb-2">
              Une erreur est survenue
            </h1>
            
            <p className="text-gray-600 text-center mb-6">
              Nous sommes désolés, une erreur inattendue s'est produite. 
              Notre équipe a été notifiée et travaille sur une solution.
            </p>

            <div className="bg-gray-100 rounded-lg p-3 mb-6">
              <p className="text-sm text-gray-600 mb-2">
                <strong>ID d'erreur:</strong> {this.state.errorId}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Heure:</strong> {new Date().toLocaleString('fr-FR')}
              </p>
              {this.state.retryCount > 0 && (
                <p className="text-sm text-orange-600 mt-2">
                  Tentatives de récupération: {this.state.retryCount}/{this.maxRetries}
                </p>
              )}
            </div>

            <div className="space-y-3">
              {this.state.retryCount < this.maxRetries && (
                <button
                  onClick={this.handleRetry}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Réessayer
                </button>
              )}

              <button
                onClick={this.handleSendReport}
                className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <Send className="w-4 h-4" />
                Envoyer un rapport détaillé
              </button>

              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Retour à l'accueil
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6">
                <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                  Détails techniques (développement)
                </summary>
                <div className="mt-2 p-3 bg-red-50 rounded text-xs font-mono text-red-800 overflow-auto max-h-40">
                  <p className="font-bold mb-2">Error:</p>
                  <p className="mb-2">{this.state.error.message}</p>
                  <p className="font-bold mb-2">Stack:</p>
                  <pre className="whitespace-pre-wrap">
                    {this.state.error.stack}
                  </pre>
                </div>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook personnalisé pour les erreurs asynchrones
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Async Error:', error, errorInfo)
    
    // Envoyer au service de logging
    fetch('/api/error-reporting', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        type: 'async'
      })
    }).catch(() => {
      // Silently fail
    })
  }
}

// Composant pour les erreurs de chargement
export function LoadingError({ message, onRetry }: { 
  message: string
  onRetry?: () => void 
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-yellow-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Erreur de chargement
      </h3>
      
      <p className="text-gray-600 mb-4">
        {message}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Réessayer
        </button>
      )}
    </div>
  )
}
