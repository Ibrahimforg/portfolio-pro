import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals'

interface Metric {
  name: string
  value: number
  id: string
  delta: number
  entries: PerformanceEntry[]
}

function sendToAnalytics(metric: Metric) {
  // Envoyer les métriques à Vercel Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    })
  }

  // Logging pour développement
  console.log(`[Web Vitals] ${metric.name}:`, Math.round(metric.value), metric)
}

export function reportWebVitals() {
  onCLS(sendToAnalytics)
  onINP(sendToAnalytics)
  onFCP(sendToAnalytics)
  onLCP(sendToAnalytics)
  onTTFB(sendToAnalytics)
}

// Interface pour TypeScript
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
  }
}
