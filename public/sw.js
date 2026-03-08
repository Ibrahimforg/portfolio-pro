const CACHE_NAME = 'portfolio-v1'
const STATIC_CACHE = 'static-v1'
const DYNAMIC_CACHE = 'dynamic-v1'
const OFFLINE_CACHE = 'offline-v1'
const API_CACHE = 'api-v1'

const STATIC_ASSETS = [
  '/',
  '/about',
  '/projects',
  '/contact',
  '/multimedia',
  '/skills',
  '/services',
  '/_next/static/css/',
  '/_next/static/chunks/',
  '/images/',
  '/offline.html'
]

const API_CACHE_TIME = 5 * 60 * 1000 // 5 minutes
const STATIC_CACHE_TIME = 24 * 60 * 60 * 1000 // 24 hours
const OFFLINE_CACHE_TIME = 7 * 24 * 60 * 60 * 1000 // 7 days

// Performance monitoring
const performanceMetrics = {
  cacheHits: 0,
  cacheMisses: 0,
  networkRequests: 0,
  errors: 0
}

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    }).then(() => {
      console.log('Static assets cached successfully')
      return self.skipWaiting()
    }).catch((error) => {
      console.error('Failed to cache static assets:', error)
    })
  )
})

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => 
            cacheName !== CACHE_NAME && 
            cacheName !== STATIC_CACHE && 
            cacheName !== DYNAMIC_CACHE && 
            cacheName !== OFFLINE_CACHE &&
            cacheName !== API_CACHE
          )
          .map((cacheName) => {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          })
      )
    }).then(() => {
      console.log('Service Worker activated')
      return self.clients.claim()
    })
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip external requests
  if (url.origin !== self.location.origin) {
    performanceMetrics.networkRequests++
    return
  }

  // Handle API requests with specific caching
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request))
    return
  }

  // Handle static assets with cache-first strategy
  if (isStaticAsset(request.url)) {
    event.respondWith(handleStaticAsset(request))
    return
  }

  // Handle page requests with network-first strategy
  if (isPageRequest(request.url)) {
    event.respondWith(handlePageRequest(request))
    return
  }

  // Default: network first with offline fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        performanceMetrics.networkRequests++
        return response
      })
      .catch((error) => {
        performanceMetrics.errors++
        console.error('Network request failed:', error)
        return caches.match(request).catch(() => {
          return getOfflineResponse()
        })
      })
  )
})

async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE)
  const cachedResponse = await cache.match(request)

  // Try network first for API
  try {
    const response = await fetch(request)
    
    if (response.ok) {
      // Cache successful API responses
      const responseToCache = response.clone()
      await cache.put(request, responseToCache)
      performanceMetrics.networkRequests++
      return response
    }
  } catch (error) {
    performanceMetrics.errors++
    console.error('API request failed:', error)
    
    // Fallback to cache
    if (cachedResponse) {
      performanceMetrics.cacheHits++
      return cachedResponse
    }
  }

  // Return error response
  return new Response(
    JSON.stringify({ 
      error: 'Service unavailable',
      timestamp: new Date().toISOString()
    }),
    {
      status: 503,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    }
  )
}

async function handleStaticAsset(request) {
  const cache = await caches.open(STATIC_CACHE)
  const cachedResponse = await cache.match(request)

  if (cachedResponse && !isExpired(cachedResponse, STATIC_CACHE_TIME)) {
    performanceMetrics.cacheHits++
    return cachedResponse
  }

  try {
    const response = await fetch(request)
    
    if (response.ok) {
      const responseToCache = response.clone()
      await cache.put(request, responseToCache)
      performanceMetrics.networkRequests++
      return response
    }
  } catch (error) {
    performanceMetrics.errors++
    console.error('Static asset request failed:', error)
    
    // Return cached version even if expired
    if (cachedResponse) {
      performanceMetrics.cacheHits++
      return cachedResponse
    }
  }

  return new Response('Asset not found', { status: 404 })
}

async function handlePageRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE)
  const cachedResponse = await cache.match(request)

  // Always try network first for pages
  try {
    const response = await fetch(request)
    
    if (response.ok) {
      const responseToCache = response.clone()
      await cache.put(request, responseToCache)
      performanceMetrics.networkRequests++
      return response
    }
  } catch (error) {
    performanceMetrics.errors++
    console.error('Page request failed:', error)
    
    // Fallback to cache
    if (cachedResponse) {
      performanceMetrics.cacheHits++
      return cachedResponse
    }
  }

  // Fallback to offline page
  return getOfflineResponse()
}

function isStaticAsset(url) {
  return url.includes('/_next/static/') || 
         url.includes('/images/') || 
         url.includes('.css') || 
         url.includes('.js') || 
         url.includes('.woff') || 
         url.includes('.ttf') ||
         url.includes('.png') ||
         url.includes('.jpg') ||
         url.includes('.svg')
}

function isPageRequest(url) {
  const pathname = new URL(url).pathname
  return pathname === '/' || 
         pathname.startsWith('/about') || 
         pathname.startsWith('/projects') || 
         pathname.startsWith('/contact') || 
         pathname.startsWith('/multimedia') ||
         pathname.startsWith('/skills') ||
         pathname.startsWith('/services')
}

function isExpired(response, maxAge) {
  if (!response.headers.get('date')) {
    return false
  }

  const responseDate = new Date(response.headers.get('date'))
  const now = new Date()
  const age = (now - responseDate) / 1000 // Convert to seconds

  return age > maxAge
}

function getOfflineResponse() {
  return caches.match('/offline.html').then(response => {
    return response || new Response(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hors ligne - Portfolio Ibrahim FORGO</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }
          .offline-container {
            text-align: center;
            max-width: 400px;
            background: rgba(255, 255, 255, 0.1);
            padding: 40px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          }
          .offline-icon {
            font-size: 64px;
            margin-bottom: 20px;
            animation: pulse 2s infinite;
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          h1 {
            margin-bottom: 10px;
            color: white;
            font-size: 24px;
            font-weight: 600;
          }
          p {
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.6;
            margin-bottom: 20px;
          }
          .retry-btn {
            background: #3B82F6;
            color: white;
            border: none;
            padding: 16px 32px;
            border-radius: 12px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
          }
          .retry-btn:hover {
            background: #2563EB;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
          }
          .status-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            background: #EF4444;
            border-radius: 50%;
            margin-right: 8px;
            animation: blink 1s infinite;
          }
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.3; }
          }
        </style>
      </head>
      <body>
        <div class="offline-container">
          <div class="offline-icon">📱</div>
          <h1><span class="status-indicator"></span>Vous êtes hors ligne</h1>
          <p>Votre portfolio n'est pas accessible actuellement.</p>
          <p>Vos données seront synchronisées automatiquement lorsque la connexion sera rétablie.</p>
          <button class="retry-btn" onclick="window.location.reload()">
            Réessayer
          </button>
        </div>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    })
  })
}

// Background sync pour offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE)
    const pendingRequests = await cache.keys()
    
    for (const request of pendingRequests) {
      if (request.url.includes('/api/')) {
        try {
          await fetch(request)
          await cache.delete(request)
          console.log('Synced request:', request.url)
        } catch (error) {
          console.log('Failed to sync:', error)
        }
      }
    }
  } catch (error) {
    console.log('Background sync failed:', error)
  }
}

// Push notification handler
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.body || 'Nouvelle notification du portfolio',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    image: event.data?.image,
    vibrate: [100, 50, 100],
    data: {
      url: event.data?.url || '/',
      timestamp: new Date().toISOString(),
      priority: event.data?.priority || 'normal'
    },
    requireInteraction: event.data?.requireInteraction || false,
    silent: event.data?.silent || false,
    actions: [
      {
        action: 'open',
        title: 'Ouvrir',
        icon: '/icons/open-96x96.png'
      },
      {
        action: 'dismiss',
        title: 'Ignorer',
        icon: '/icons/close-96x96.png'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification(
      event.data?.title || 'Portfolio Ibrahim FORGO',
      options
    )
  )
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  if (event.action === 'open' && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    )
  } else if (event.action === 'dismiss') {
    // Fermer la notification
  } else {
    // Comportement par défaut : ouvrir l'URL
    if (event.notification.data.url) {
      event.waitUntil(
        clients.openWindow(event.notification.data.url)
      )
    }
  }
})

// Message handler pour communication avec le client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'GET_METRICS') {
    event.ports[0].postMessage(performanceMetrics)
  }
})

// Cache cleanup périodique
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => 
            cacheName !== CACHE_NAME && 
            cacheName !== STATIC_CACHE && 
            cacheName !== DYNAMIC_CACHE && 
            cacheName !== OFFLINE_CACHE &&
            cacheName !== API_CACHE
          )
          .map((cacheName) => {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          })
      )
    })
  )
})
