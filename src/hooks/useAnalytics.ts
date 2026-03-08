/**
 * Hook React pour Analytics - Niveau Professionnel
 * Intégration facile du tracking dans les composants React
 */

'use client'

import { useEffect, useCallback, useRef, useState } from 'react'
import { analytics } from '@/lib/analytics'

interface UseAnalyticsOptions {
  trackPageViews?: boolean
  trackTimeOnPage?: boolean
  trackScrollDepth?: boolean
  trackClicks?: boolean
}

export const useAnalytics = (options: UseAnalyticsOptions = {}) => {
  const {
    trackPageViews = true,
    trackTimeOnPage = true,
    trackScrollDepth = false
  } = options

  const [startTime] = useState<number>(() => Date.now())
  const [maxScrollDepth, setMaxScrollDepth] = useState<number>(0)
  const hasTrackedPageView = useRef<boolean>(false)

  const trackPageView = useCallback((pageUrl?: string, pageTitle?: string) => {
    analytics.trackPageView(pageUrl, pageTitle)
  }, [])

  const trackEvent = useCallback((eventName: string, properties?: Record<string, unknown>) => {
    analytics.trackCustomEvent(eventName, properties)
  }, [])

  const trackClick = useCallback((element: string, properties?: Record<string, unknown>) => {
    analytics.trackEvent({
      eventType: 'click',
      category: 'interaction',
      action: 'click',
      label: element,
      customProperties: properties
    })
  }, [])

  const trackTimeOnPageEnd = useCallback(() => {
    const duration = Date.now() - startTime
    analytics.trackEngagement('time_on_page', duration)
  }, [startTime])

  const trackScrollDepthFn = useCallback(() => {
    analytics.trackEvent({
      eventType: 'scroll_depth',
      category: 'engagement',
      action: 'scroll',
      label: `${Math.round(maxScrollDepth)}%`,
      value: Math.round(maxScrollDepth)
    })
  }, [maxScrollDepth])

  const trackEngagement = useCallback((metrics: Record<string, unknown>) => {
    analytics.trackEvent({
      eventType: 'engagement',
      category: 'user',
      action: 'interact',
      customProperties: metrics
    })
  }, [])

  const trackFormInteraction = useCallback((formName: string, action: string, properties?: Record<string, unknown>) => {
    analytics.trackEvent({
      eventType: 'form_interaction',
      category: 'conversion',
      action,
      label: formName,
      customProperties: {
        formType: formName,
        ...properties
      }
    })
  }, [])

  const trackPerformance = useCallback((metrics: Record<string, unknown>) => {
    analytics.trackPerformance(metrics as any)
  }, [])

  const trackError = useCallback((error: Error, context?: Record<string, unknown>) => {
    analytics.trackError({
      type: 'react_error',
      message: error.message,
      stack: error.stack,
      ...context
    })
  }, [])

  const trackUserInteraction = useCallback((interaction: string, properties?: Record<string, unknown>) => {
    analytics.trackEvent({
      eventType: 'user_interaction',
      category: 'engagement',
      action: interaction,
      customProperties: properties
    })
  }, [])

  const trackConversion = useCallback((conversionType: string, properties?: Record<string, unknown>) => {
    analytics.trackConversion(conversionType, undefined, undefined)
  }, [])

  const trackCustomEvent = useCallback((eventName: string, properties?: Record<string, unknown>, value?: number) => {
    analytics.trackEvent({
      eventType: 'custom_event',
      category: 'custom',
      action: eventName,
      label: eventName,
      value,
      customProperties: properties
    })
  }, [])

  // Track project clicks
  const trackProjectClick = useCallback((projectId: string, projectName: string) => {
    analytics.trackProjectClick(projectId, projectName)
  }, [])

  // Track CV download
  const trackCVDownload = useCallback(() => {
    analytics.trackCVDownload()
  }, [])

  // Track contact form
  const trackContactForm = useCallback((formData: Record<string, unknown>) => {
    analytics.trackContactForm(formData)
  }, [])

  useEffect(() => {
    if (trackPageViews && !hasTrackedPageView.current) {
      trackPageView()
      hasTrackedPageView.current = true
    }
  }, [trackPageViews, trackPageView])

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const currentScroll = window.scrollY
      const scrollPercentage = (currentScroll / scrollHeight) * 100
      
      if (scrollPercentage > maxScrollDepth) {
        setMaxScrollDepth(scrollPercentage)
        if (trackScrollDepth) {
          trackScrollDepthFn()
        }
      }
    }

    if (trackScrollDepth) {
      window.addEventListener('scroll', handleScroll, { passive: true })
      return () => window.removeEventListener('scroll', handleScroll)
    }
    return undefined
  }, [trackScrollDepth, trackScrollDepthFn, maxScrollDepth])

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (trackTimeOnPage) {
        trackTimeOnPageEnd()
      }
    }

    if (trackTimeOnPage) {
      window.addEventListener('beforeunload', handleBeforeUnload)
      return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }
    return () => {}
  }, [trackTimeOnPage, trackTimeOnPageEnd])

  return {
    trackPageView,
    trackEvent,
    trackClick,
    trackTimeOnPageEnd,
    trackScrollDepth: trackScrollDepthFn,
    trackEngagement,
    trackFormInteraction,
    trackPerformance,
    trackError,
    trackUserInteraction,
    trackConversion,
    trackCustomEvent,
    trackProjectClick,
    trackCVDownload,
    trackContactForm,
    startTime,
    maxScrollDepth
  }
}
