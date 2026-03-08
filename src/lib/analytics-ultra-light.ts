/**
 * Analytics Ultra-Light - ZERO Rechargement
 * Version minimaliste absolue sans aucun effet de bord
 */

// Interface ultra-simple
interface UltraLightEvent {
  type: string
  data?: Record<string, unknown>
  timestamp: number
}

class AnalyticsUltraLight {
  private static instance: AnalyticsUltraLight
  private queue: UltraLightEvent[] = []
  private isProcessing = false

  private constructor() {
    // Initialisation silencieuse - aucun effet de bord
    this.setupSilentProcessing()
  }

  static getInstance(): AnalyticsUltraLight {
    if (!AnalyticsUltraLight.instance) {
      AnalyticsUltraLight.instance = new AnalyticsUltraLight()
    }
    return AnalyticsUltraLight.instance
  }

  private setupSilentProcessing(): void {
    // Traitement uniquement quand le navigateur est inactif
    if (typeof window === 'undefined') return

    // Utiliser requestIdleCallback si disponible
    const processWhenIdle = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => this.processQueue())
      } else {
        // Fallback avec setTimeout très long
        setTimeout(() => this.processQueue(), 10000)
      }
    }

    // Traiter uniquement lors des transitions de page
    let lastProcess = 0
    const checkProcess = () => {
      const now = Date.now()
      if (now - lastProcess > 30000 && this.queue.length > 0) { // 30 secondes minimum
        this.processQueue()
        lastProcess = now
      }
    }

    // Vérifier uniquement lors d'événements utilisateur rares
    const handleUserEvent = () => {
      setTimeout(checkProcess, 5000) // 5 secondes après l'événement
    }

    // Écouteurs très limités
    window.addEventListener('click', handleUserEvent, { passive: true, once: true })
    window.addEventListener('keydown', handleUserEvent, { passive: true, once: true })
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) return

    this.isProcessing = true

    try {
      // Traitement par lots très petits
      const batch = this.queue.splice(0, 3) // Maximum 3 événements à la fois
      await this.sendBatch(batch)
    } catch (error) {
      // Ignorer silencieusement les erreurs
      console.debug('Analytics batch failed:', error)
    } finally {
      this.isProcessing = false
    }
  }

  private async sendBatch(events: UltraLightEvent[]): Promise<void> {
    // Utiliser uniquement sendBeacon - jamais fetch
    if (!('sendBeacon' in navigator)) return

    const data = JSON.stringify({
      events,
      sessionId: this.getSessionId(),
      timestamp: Date.now()
    })

    // sendBeacon est synchrone et non-bloquant
    navigator.sendBeacon('/api/analytics/ultra-light', data)
  }

  private getSessionId(): string {
    // Session ID persistant mais sans localStorage
    if (typeof window === 'undefined') return 'server'
    
    // Utiliser sessionStorage uniquement si disponible
    try {
      let sessionId = sessionStorage.getItem('ultra_session')
      if (!sessionId) {
        sessionId = 'ultra_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
        sessionStorage.setItem('ultra_session', sessionId)
      }
      return sessionId
    } catch {
      // Fallback si sessionStorage n'est pas disponible
      return 'fallback_' + Date.now()
    }
  }

  // API publique ultra-minimaliste

  public track(eventType: string, data?: Record<string, unknown>): void {
    // Ajouter à la file sans traitement immédiat
    this.queue.push({
      type: eventType,
      data,
      timestamp: Date.now()
    })

    // Limiter la taille de la file
    if (this.queue.length > 50) {
      this.queue = this.queue.slice(-30) // Garder seulement les 30 plus récents
    }
  }

  public trackPageView(): void {
    this.track('page_view', {
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      title: typeof document !== 'undefined' ? document.title : 'Unknown'
    })
  }

  public trackClick(element: string): void {
    this.track('click', { element })
  }

  public trackDownload(file: string): void {
    this.track('download', { file })
  }

  // Cleanup silencieux
  public destroy(): void {
    // Envoyer les événements restants si possible
    if (this.queue.length > 0 && 'sendBeacon' in navigator) {
      try {
        navigator.sendBeacon('/api/analytics/ultra-light', JSON.stringify({
          events: this.queue,
          sessionId: this.getSessionId(),
          timestamp: Date.now()
        }))
      } catch {
        // Ignorer les erreurs de cleanup
      }
    }
    this.queue = []
  }
}

// Export singleton
export const analyticsUltraLight = AnalyticsUltraLight.getInstance()

// Hook ultra-simple
export const useAnalyticsUltraLight = () => {
  return {
    trackPageView: analyticsUltraLight.trackPageView.bind(analyticsUltraLight),
    trackClick: analyticsUltraLight.trackClick.bind(analyticsUltraLight),
    trackDownload: analyticsUltraLight.trackDownload.bind(analyticsUltraLight),
    track: analyticsUltraLight.track.bind(analyticsUltraLight)
  }
}
