// Monitoring et analytics professionnel
export interface PerformanceMetrics {
  pageLoad: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  cumulativeLayoutShift: number
  firstInputDelay: number
  timeToInteractive: number
}

export interface UserSession {
  id: string
  userId?: string
  startTime: number
  endTime?: number
  pageViews: string[]
  interactions: Array<{
    type: 'click' | 'scroll' | 'form_submit' | 'download'
    element: string
    timestamp: number
    metadata?: Record<string, any>
  }>
  performance: PerformanceMetrics
  errors: Array<{
    message: string
    stack?: string
    timestamp: number
    userAgent: string
    url: string
  }>
}

export class AdvancedMonitoring {
  private static instance: AdvancedMonitoring
  private session: UserSession
  private performanceObserver?: PerformanceObserver

  static getInstance(): AdvancedMonitoring {
    if (!AdvancedMonitoring.instance) {
      AdvancedMonitoring.instance = new AdvancedMonitoring()
    }
    return AdvancedMonitoring.instance
  }

  constructor() {
    this.session = this.initializeSession()
    this.setupPerformanceMonitoring()
    this.setupErrorTracking()
    this.setupUserInteractionTracking()
  }

  private initializeSession(): UserSession {
    return {
      id: this.generateSessionId(),
      startTime: Date.now(),
      pageViews: ['/'],
      interactions: [],
      performance: {
        pageLoad: 0,
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
        cumulativeLayoutShift: 0,
        firstInputDelay: 0,
        timeToInteractive: 0
      },
      errors: []
    }
  }

  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  private setupPerformanceMonitoring(): void {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          switch (entry.entryType) {
            case 'navigation':
              const navEntry = entry as PerformanceNavigationTiming
              this.session.performance.pageLoad = navEntry.loadEventEnd - navEntry.loadEventStart
              this.session.performance.timeToInteractive = navEntry.domInteractive - navEntry.fetchStart
              break
            case 'paint':
              const paintEntry = entry as PerformancePaintTiming
              if (paintEntry.name === 'first-contentful-paint') {
                this.session.performance.firstContentfulPaint = paintEntry.startTime
              }
              break
            case 'largest-contentful-paint':
              const lcpEntry = entry as any
              this.session.performance.largestContentfulPaint = lcpEntry.startTime
              break
            case 'layout-shift':
              const lsEntry = entry as any
              if (!lsEntry.hadRecentInput) {
                this.session.performance.cumulativeLayoutShift += lsEntry.value
              }
              break
            case 'first-input':
              const fidEntry = entry as any
              this.session.performance.firstInputDelay = fidEntry.processingStart - fidEntry.startTime
              break
          }
        }
      })

      this.performanceObserver.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'layout-shift', 'first-input'] })
    }
  }

  private setupErrorTracking(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.session.errors.push({
          message: event.message,
          stack: event.error?.stack,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      })

      window.addEventListener('unhandledrejection', (event) => {
        this.session.errors.push({
          message: `Unhandled Promise Rejection: ${event.reason}`,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      })
    }
  }

  private setupUserInteractionTracking(): void {
    if (typeof document !== 'undefined') {
      // Tracking des clics
      document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement
        this.session.interactions.push({
          type: 'click',
          element: target.tagName + (target.className ? '.' + target.className : ''),
          timestamp: Date.now(),
          metadata: {
            x: event.clientX,
            y: event.clientY,
            text: target.textContent?.slice(0, 50)
          }
        })
      })

      // Tracking des scrolls
      let scrollTimeout: NodeJS.Timeout
      document.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout)
        scrollTimeout = setTimeout(() => {
          this.session.interactions.push({
            type: 'scroll',
            element: 'window',
            timestamp: Date.now(),
            metadata: {
              scrollY: window.scrollY,
              scrollHeight: document.documentElement.scrollHeight
            }
          })
        }, 100)
      })
    }
  }

  // Envoyer les données analytics
  async sendAnalytics(): Promise<void> {
    this.session.endTime = Date.now()
    
    try {
      // Envoyer à votre service d'analytics
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.session)
      })
    } catch (error) {
      console.error('Failed to send analytics:', error)
    }
  }

  // Tracking des performances de formulaire
  trackFormPerformance(formName: string, duration: number, success: boolean): void {
    this.session.interactions.push({
      type: 'form_submit',
      element: formName,
      timestamp: Date.now(),
      metadata: { duration, success }
    })
  }

  // Tracking des téléchargements
  trackDownload(fileName: string, fileSize: number): void {
    this.session.interactions.push({
      type: 'download',
      element: fileName,
      timestamp: Date.now(),
      metadata: { fileSize }
    })
  }

  // Obtenir les métriques en temps réel
  getRealTimeMetrics(): Partial<UserSession> {
    return {
      ...this.session,
      endTime: Date.now(),
      performance: this.session.performance
    }
  }
}
