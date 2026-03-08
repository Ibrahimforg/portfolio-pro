/**
 * Analytics Service Avancé - Niveau Professionnel
 * Tracking complet, performance monitoring, et analytics temps réel
 */

interface AnalyticsEvent {
  eventType: string
  category?: string
  action?: string
  label?: string
  value?: number
  customProperties?: Record<string, unknown>
}

interface PerformanceMetrics {
  loadTime?: number
  domContentLoaded?: number
  firstContentfulPaint?: number
  largestContentfulPaint?: number
  firstInputDelay?: number
  cumulativeLayoutShift?: number
  timeToInteractive?: number
}

interface DeviceInfo {
  deviceType: 'desktop' | 'mobile' | 'tablet'
  browser: string
  os: string
  screenResolution: string
  viewportSize: string
  language: string
}

interface UTMParameters {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
}

class AnalyticsService {
  private sessionId: string
  private userId: string | null = null
  private isInitialized = false
  private queue: AnalyticsEvent[] = []
  private performanceObserver: PerformanceObserver | null = null
  private errorListener: ((event: ErrorEvent) => void) | null = null

  constructor() {
    this.sessionId = this.generateSessionId()
    this.initialize()
  }

  private generateSessionId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  private async initialize(): Promise<void> {
    if (this.isInitialized || typeof window === 'undefined') return

    try {
      // Récupérer l'utilisateur depuis Supabase
      const { data: { user } } = await this.getSupabaseUser()
      this.userId = user?.id || null

      // Initialiser le tracking
      this.setupPerformanceMonitoring()
      this.setupErrorTracking()
      this.setupPageVisibilityTracking()
      this.setupUnloadTracking()

      // Envoyer les événements en attente
      this.processQueue()

      // Tracker la session start
      this.trackSessionStart()

      this.isInitialized = true
    } catch (error) {
      console.error('Analytics initialization failed:', error)
    }
  }

  private async getSupabaseUser() {
    // Import dynamique pour éviter les erreurs SSR
    const { supabase } = await import('./supabase')
    return supabase.auth.getUser()
  }

  private setupPerformanceMonitoring(): void {
    if (!('PerformanceObserver' in window)) return

    // Observer pour les Core Web Vitals
    try {
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.processPerformanceEntry(entry)
        }
      })

      // Observer différents types d'entrées
      this.performanceObserver.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] })
    } catch (error) {
      console.warn('Performance monitoring not fully supported:', error)
    }
  }

  private processPerformanceEntry(entry: PerformanceEntry): void {
    const metrics: Partial<PerformanceMetrics> = {}

    switch (entry.entryType) {
      case 'navigation':
        const navEntry = entry as PerformanceNavigationTiming
        metrics.loadTime = navEntry.loadEventEnd - navEntry.fetchStart
        metrics.domContentLoaded = navEntry.domContentLoadedEventEnd - navEntry.fetchStart
        metrics.timeToInteractive = navEntry.domInteractive - navEntry.fetchStart
        break

      case 'paint':
        const paintEntry = entry as PerformancePaintTiming
        if (paintEntry.name === 'first-contentful-paint') {
          metrics.firstContentfulPaint = paintEntry.startTime
        }
        break

      case 'largest-contentful-paint':
        const lcpEntry = entry as LargestContentfulPaint
        metrics.largestContentfulPaint = lcpEntry.startTime
        break

      case 'first-input':
        const fidEntry = entry as PerformanceEventTiming
        metrics.firstInputDelay = fidEntry.processingStart - fidEntry.startTime
        break

      case 'layout-shift':
        const clsEntry = entry as PerformanceEntry & { value: number; hadRecentInput: boolean }
        if (!clsEntry.hadRecentInput) {
          metrics.cumulativeLayoutShift = clsEntry.value
        }
        break
    }

    // Envoyer les métriques de performance
    this.trackPerformance(metrics)
  }

  private setupErrorTracking(): void {
    this.errorListener = (event: ErrorEvent) => {
      this.trackError({
        type: 'javascript_error',
        message: event.message,
        stack: event.error?.stack,
        url: event.filename,
        line: event.lineno,
        column: event.colno
      })
    }

    window.addEventListener('error', this.errorListener)

    // Tracker les erreurs réseau
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError({
        type: 'promise_rejection',
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack
      })
    })
  }

  private setupPageVisibilityTracking(): void {
    let hiddenTime = 0
    let visibilityStart = Date.now()

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        hiddenTime = Date.now() - visibilityStart
        this.trackEvent({
          eventType: 'page_hidden',
          category: 'engagement',
          value: hiddenTime
        })
      } else {
        visibilityStart = Date.now()
        this.trackEvent({
          eventType: 'page_visible',
          category: 'engagement'
        })
      }
    })
  }

  private setupUnloadTracking(): void {
    // Envoyer les données avant de quitter la page
    const sendBeacon = () => {
      if (this.queue.length > 0) {
        this.sendEvents(this.queue, true)
      }
    }

    window.addEventListener('beforeunload', sendBeacon)
    window.addEventListener('pagehide', sendBeacon)
  }

  private getDeviceInfo(): DeviceInfo {
    const userAgent = navigator.userAgent
    const screen = window.screen
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    // Détection du type d'appareil
    let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop'
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      deviceType = /iPad/.test(userAgent) ? 'tablet' : 'mobile'
    }

    // Détection du navigateur
    let browser = 'Unknown'
    if (userAgent.includes('Chrome')) browser = 'Chrome'
    else if (userAgent.includes('Firefox')) browser = 'Firefox'
    else if (userAgent.includes('Safari')) browser = 'Safari'
    else if (userAgent.includes('Edge')) browser = 'Edge'

    // Détection de l'OS
    let os = 'Unknown'
    if (userAgent.includes('Windows')) os = 'Windows'
    else if (userAgent.includes('Mac')) os = 'macOS'
    else if (userAgent.includes('Linux')) os = 'Linux'
    else if (userAgent.includes('Android')) os = 'Android'
    else if (userAgent.includes('iOS')) os = 'iOS'

    return {
      deviceType,
      browser,
      os,
      screenResolution: `${screen.width}x${screen.height}`,
      viewportSize: `${viewport.width}x${viewport.height}`,
      language: navigator.language || 'en'
    }
  }

  private getUTMParameters(): UTMParameters {
    const urlParams = new URLSearchParams(window.location.search)
    return {
      utm_source: urlParams.get('utm_source') || undefined,
      utm_medium: urlParams.get('utm_medium') || undefined,
      utm_campaign: urlParams.get('utm_campaign') || undefined,
      utm_term: urlParams.get('utm_term') || undefined,
      utm_content: urlParams.get('utm_content') || undefined
    }
  }

  private async sendEvents(events: AnalyticsEvent[], useBeacon = false): Promise<void> {
    if (events.length === 0) return

    const deviceInfo = this.getDeviceInfo()
    const utmParams = this.getUTMParameters()
    const clientIP = await this.getClientIP()

    const payload = {
      sessionId: this.sessionId,
      userId: this.userId,
      events: events.map(event => ({
        ...event,
        timestamp: new Date().toISOString(),
        pageUrl: window.location.href,
        pageTitle: document.title,
        referrerUrl: document.referrer,
        userAgent: navigator.userAgent,
        ipAddress: clientIP,
        ...deviceInfo,
        ...utmParams
      }))
    }

    try {
      if (useBeacon && 'sendBeacon' in navigator) {
        navigator.sendBeacon('/api/analytics/events', JSON.stringify(payload))
      } else {
        const response = await fetch('/api/analytics/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

        if (!response.ok) {
          throw new Error(`Analytics request failed: ${response.status}`)
        }
      }
    } catch (error) {
      console.error('Failed to send analytics events:', error)
      // Remettre en file d'attente en cas d'erreur
      this.queue.push(...events)
    }
  }

  private async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json() as { ip: string }
      return data.ip
    } catch {
      return 'unknown'
    }
  }

  private processQueue(): void {
    if (this.queue.length > 0) {
      const events = [...this.queue]
      this.queue = []
      this.sendEvents(events)
    }
  }

  // API PUBLIQUE

  public trackEvent(event: AnalyticsEvent): void {
    if (!this.isInitialized) {
      this.queue.push(event)
      return
    }

    this.sendEvents([event])
  }

  public trackPageView(pageUrl?: string, pageTitle?: string): void {
    this.trackEvent({
      eventType: 'page_view',
      category: 'content',
      action: 'view',
      label: pageTitle || document.title,
      customProperties: {
        pageUrl: pageUrl || window.location.href,
        pageTitle: pageTitle || document.title
      }
    })
  }

  public trackProjectClick(projectId: string, projectName: string): void {
    this.trackEvent({
      eventType: 'project_click',
      category: 'engagement',
      action: 'click',
      label: projectName,
      customProperties: {
        projectId,
        projectName
      }
    })
  }

  public trackCVDownload(): void {
    this.trackEvent({
      eventType: 'cv_download',
      category: 'conversion',
      action: 'download',
      label: 'CV',
      value: 1
    })
  }

  public trackContactForm(formData: Record<string, unknown>): void {
    this.trackEvent({
      eventType: 'contact_form_submit',
      category: 'conversion',
      action: 'submit',
      label: 'Contact',
      customProperties: {
        formType: 'contact',
        hasMessage: !!(formData as Record<string, unknown>).message,
        hasEmail: !!(formData as Record<string, unknown>).email
      }
    })
  }

  public trackPerformance(metrics: Partial<PerformanceMetrics>): void {
    this.trackEvent({
      eventType: 'performance_metrics',
      category: 'performance',
      action: 'measure',
      customProperties: metrics
    })
  }

  public trackError(error: {
    type: string
    message: string
    stack?: string
    url?: string
    line?: number
    column?: number
  }): void {
    this.trackEvent({
      eventType: 'error',
      category: 'error',
      action: error.type,
      label: error.message,
      customProperties: {
        stack: error.stack,
        url: error.url,
        line: error.line,
        column: error.column
      }
    })
  }

  public trackCustomEvent(eventName: string, data?: Record<string, unknown>, value?: number): void {
    this.trackEvent({
      eventType: 'custom_event',
      category: 'custom',
      action: eventName,
      label: eventName,
      value,
      customProperties: data
    })
  }

  private trackSessionStart(): void {
    this.trackEvent({
      eventType: 'session_start',
      category: 'session',
      action: 'start',
      customProperties: {
        timestamp: new Date().toISOString(),
        referrer: document.referrer
      }
    })
  }

  public trackSessionEnd(): void {
    this.trackEvent({
      eventType: 'session_end',
      category: 'session',
      action: 'end',
      customProperties: {
        duration: Date.now() - performance.now()
      }
    })
  }

  // Conversion tracking
  public trackConversion(type: string, value?: number, currency: string = 'EUR'): void {
    this.trackEvent({
      eventType: 'conversion',
      category: 'conversion',
      action: type,
      label: type,
      value,
      customProperties: {
        conversionType: type,
        value,
        currency
      }
    })
  }

  // Engagement tracking
  public trackEngagement(action: string, duration?: number): void {
    this.trackEvent({
      eventType: 'engagement',
      category: 'engagement',
      action,
      value: duration
    })
  }

  // Social tracking
  public trackSocial(network: string, action: 'share' | 'like' | 'comment'): void {
    this.trackEvent({
      eventType: 'social_interaction',
      category: 'social',
      action,
      label: network
    })
  }

  // Search tracking
  public trackSearch(query: string, resultsCount?: number): void {
    this.trackEvent({
      eventType: 'search',
      category: 'search',
      action: 'query',
      label: query,
      value: resultsCount,
      customProperties: {
        query,
        resultsCount
      }
    })
  }

  // Cleanup
  public destroy(): void {
    if (this.errorListener) {
      window.removeEventListener('error', this.errorListener)
    }
    if (this.performanceObserver) {
      this.performanceObserver.disconnect()
    }
    this.trackSessionEnd()
  }
}

// Singleton pour l'application
export const analytics = new AnalyticsService()

// Export pour React Hook
export const useAnalytics = () => {
  return analytics
}

// Types pour TypeScript
export type { AnalyticsEvent, PerformanceMetrics, DeviceInfo, UTMParameters }
