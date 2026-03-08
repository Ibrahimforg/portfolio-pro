// API Handlers avancés avec validation, rate limiting et logging
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { SecurityManager } from './security'
import { cacheManager } from './cache'

export interface ApiHandlerConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  requireAuth?: boolean
  requireAdmin?: boolean
  rateLimit?: {
    requests: number
    window: number // en secondes
  }
  cache?: {
    ttl: number
    key?: string
  }
  validation?: z.ZodSchema
  bodyLimit?: number // en bytes
}

export function createApiHandler<T = any>(
  handler: (req: NextRequest, context: { user?: any; body?: T }) => Promise<NextResponse>,
  config: ApiHandlerConfig = {}
) {
  return async (req: NextRequest) => {
    try {
      // 1. Vérification de la méthode HTTP
      if (config.method && req.method !== config.method) {
        return NextResponse.json(
          { error: 'Method not allowed' },
          { status: 405 }
        )
      }

      // 2. Rate limiting
      if (config.rateLimit) {
        const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
        const rateLimitKey = `rate_limit_${clientIp}_${req.url}`
        
        const currentRequests = cacheManager.userCache.get(rateLimitKey) || 0
        
        if (currentRequests >= config.rateLimit.requests) {
          return NextResponse.json(
            { error: 'Too many requests' },
            { status: 429 }
          )
        }

        cacheManager.userCache.set(rateLimitKey, currentRequests + 1, config.rateLimit.window)
      }

      // 3. Vérification de l'authentification
      let user = null
      if (config.requireAuth || config.requireAdmin) {
        const authHeader = req.headers.get('authorization')
        if (!authHeader?.startsWith('Bearer ')) {
          return NextResponse.json(
            { error: 'Authorization required' },
            { status: 401 }
          )
        }

        try {
          // Valider le token et récupérer l'utilisateur
          user = await validateAuthToken(authHeader.substring(7))
          
          if (!user) {
            return NextResponse.json(
              { error: 'Invalid token' },
              { status: 401 }
            )
          }

          if (config.requireAdmin && !user.isAdmin) {
            return NextResponse.json(
              { error: 'Admin access required' },
              { status: 403 }
            )
          }
        } catch (authError) {
          return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 401 }
          )
        }
      }

      // 4. Validation du body (pour POST/PUT/PATCH)
      let body: T | undefined
      if (['POST', 'PUT', 'PATCH'].includes(req.method || '') && config.validation) {
        try {
          const rawBody = await req.text()
          
          // Vérifier la taille du body
          if (config.bodyLimit && rawBody.length > config.bodyLimit) {
            return NextResponse.json(
              { error: 'Request body too large' },
              { status: 413 }
            )
          }

          body = config.validation.parse(JSON.parse(rawBody)) as T
        } catch (validationError) {
          return NextResponse.json(
            { 
              error: 'Validation failed',
              details: validationError instanceof Error ? validationError.message : 'Invalid data'
            },
            { status: 400 }
          )
        }
      }

      // 5. Cache check (pour GET)
      if (req.method === 'GET' && config.cache) {
        const cacheKey = config.cache.key || req.url
        const cached = cacheManager.apiCache.get(cacheKey)
        
        if (cached) {
          return NextResponse.json(cached, {
            headers: {
              'X-Cache': 'HIT',
              'Cache-Control': `max-age=${config.cache.ttl}`
            }
          })
        }
      }

      // 6. Exécuter le handler
      const response = await handler(req, { user, body })

      // 7. Mettre en cache la réponse (pour GET)
      if (req.method === 'GET' && config.cache && response.status === 200) {
        const cacheKey = config.cache.key || req.url
        const responseData = await response.json()
        cacheManager.apiCache.set(cacheKey, responseData, config.cache.ttl)
        
        response.headers.set('X-Cache', 'MISS')
        response.headers.set('Cache-Control', `max-age=${config.cache.ttl}`)
      }

      // 8. Logging
      await logApiRequest(req, response, user)

      return response

    } catch (error) {
      console.error('API Handler Error:', error)
      
      return NextResponse.json(
        { 
          error: 'Internal server error',
          requestId: generateRequestId()
        },
        { status: 500 }
      )
    }
  }
}

// Validation schemas avec Zod
export const schemas = {
  user: {
    login: z.object({
      email: z.string().email(),
      password: z.string().min(8)
    }),
    
    register: z.object({
      email: z.string().email(),
      password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
      fullName: z.string().min(2).max(100)
    }),
    
    update: z.object({
      fullName: z.string().min(2).max(100).optional(),
      bio: z.string().max(500).optional(),
      website: z.string().url().optional()
    })
  },
  
  project: {
    create: z.object({
      title: z.string().min(1).max(200),
      description: z.string().min(10).max(2000),
      categoryId: z.number().positive(),
      technologies: z.array(z.string()).max(20),
      githubUrl: z.string().url().optional(),
      demoUrl: z.string().url().optional()
    }),
    
    update: z.object({
      title: z.string().min(1).max(200).optional(),
      description: z.string().min(10).max(2000).optional(),
      categoryId: z.number().positive().optional(),
      technologies: z.array(z.string()).max(20).optional(),
      githubUrl: z.string().url().optional(),
      demoUrl: z.string().url().optional(),
      published: z.boolean().optional()
    })
  },
  
  contact: {
    submit: z.object({
      name: z.string().min(2).max(100),
      email: z.string().email(),
      subject: z.string().min(5).max(200),
      message: z.string().min(10).max(2000),
      phone: z.string().regex(/^[+]?[\d\s-()]+$/).optional(),
      company: z.string().max(100).optional()
    })
  }
}

// Fonctions utilitaires
async function validateAuthToken(token: string): Promise<any> {
  // Implémenter la validation du token avec Supabase
  try {
    const { supabase } = await import('./supabase')
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) return null
    
    // Vérifier si l'utilisateur est admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('user_id', user.id)
      .single()
    
    return {
      ...user,
      isAdmin: profile?.is_admin || false
    }
  } catch (error) {
    return null
  }
}

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

async function logApiRequest(req: NextRequest, response: NextResponse, user?: any): Promise<void> {
  const logData = {
    method: req.method,
    url: req.url,
    status: response.status,
    userAgent: req.headers.get('user-agent'),
    ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
    userId: user?.id,
    timestamp: new Date().toISOString(),
    duration: Date.now() - parseInt(req.headers.get('x-request-start') || '0')
  }

  // Envoyer à votre service de logging
  console.log('API Request:', logData)
}

// Middleware pour les headers de sécurité
export function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  return response
}

// Exemples d'utilisation
export const apiHandlers = {
  // GET /api/projects
  getProjects: createApiHandler(
    async (req, { user }) => {
      // Logique pour récupérer les projets
      return NextResponse.json({ projects: [] })
    },
    {
      method: 'GET',
      cache: { ttl: 300 }, // 5 minutes
      rateLimit: { requests: 100, window: 60 }
    }
  ),

  // POST /api/projects
  createProject: createApiHandler(
    async (req, { user, body }) => {
      // Logique pour créer un projet
      return NextResponse.json({ success: true })
    },
    {
      method: 'POST',
      requireAuth: true,
      requireAdmin: true,
      validation: schemas.project.create,
      rateLimit: { requests: 10, window: 60 }
    }
  ),

  // POST /api/contact
  submitContact: createApiHandler(
    async (req, { body }) => {
      // Logique pour soumettre un formulaire de contact
      return NextResponse.json({ success: true })
    },
    {
      method: 'POST',
      validation: schemas.contact.submit,
      rateLimit: { requests: 5, window: 300 }, // 5 requêtes par 5 minutes
      bodyLimit: 10240 // 10KB
    }
  )
}
