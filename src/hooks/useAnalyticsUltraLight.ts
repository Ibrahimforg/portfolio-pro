/**
 * Hook Analytics Ultra-Light - ZERO Rechargement
 * Hook minimaliste sans aucun effet de bord
 */

'use client'

import { useCallback } from 'react'
import { analyticsUltraLight } from '@/lib/analytics-ultra-light'

export const useAnalyticsUltraLight = () => {
  const trackPageView = useCallback(() => {
    analyticsUltraLight.trackPageView()
  }, [])

  const trackClick = useCallback((element: string) => {
    analyticsUltraLight.trackClick(element)
  }, [])

  const trackDownload = useCallback((file: string) => {
    analyticsUltraLight.trackDownload(file)
  }, [])

  const track = useCallback((eventType: string, data?: Record<string, unknown>) => {
    analyticsUltraLight.track(eventType, data)
  }, [])

  return {
    trackPageView,
    trackClick,
    trackDownload,
    track
  }
}
