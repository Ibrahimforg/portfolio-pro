/**
 * API Analytics Ultra-Light - ZERO Rechargement
 * Endpoint minimaliste pour recevoir les événements
 */

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Lecture silencieuse des données
    const body = await request.json()
    
    // Validation minimale
    if (!body || !Array.isArray(body.events)) {
      return NextResponse.json({ success: false }, { status: 400 })
    }

    // Logging silencieux uniquement en développement
    if (process.env.NODE_ENV === 'development') {
      console.log('Ultra-Light Analytics:', {
        sessionId: body.sessionId,
        eventCount: body.events.length,
        timestamp: new Date().toISOString()
      })
    }

    // Réponse immédiate - aucun traitement
    return NextResponse.json({ success: true, received: body.events.length })
    
  } catch (error) {
    // Erreur silencieuse
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

export async function GET() {
  // Données mockées ultra-simples pour le dashboard
  return NextResponse.json({
    totalVisitors: 847,
    totalPageViews: 3256,
    totalSessions: 612,
    avgSessionDuration: 145,
    bounceRate: 28,
    topPages: [
      { page: '/', views: 523 },
      { page: '/projects', views: 387 },
      { page: '/skills', views: 298 },
      { page: '/services', views: 234 },
      { page: '/contact', views: 189 }
    ],
    deviceBreakdown: [
      { device: 'Desktop', count: 512, percentage: 62 },
      { device: 'Mobile', count: 289, percentage: 35 },
      { device: 'Tablet', count: 26, percentage: 3 }
    ],
    trafficSources: [
      { source: 'Direct', count: 345, percentage: 42 },
      { source: 'Google', count: 267, percentage: 33 },
      { source: 'Social', count: 156, percentage: 19 },
      { source: 'Referral', count: 61, percentage: 6 }
    ],
    lastUpdated: new Date().toISOString()
  })
}
