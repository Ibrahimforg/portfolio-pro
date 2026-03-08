// Middleware de Sécurité Global
import { NextRequest, NextResponse } from 'next/server'
import { RateLimiter } from '@/lib/rate-limiter'
import { CSRFProtection } from '@/lib/csrf'
import { SecurityLogger } from '@/lib/security-logging'
import { validateRequest } from '@/lib/validation'
import { loginSchema } from '@/lib/validation'

const rateLimiter = RateLimiter.getInstance()

export async function securityMiddleware(
  req: NextRequest,
  res: NextResponse
): Promise<NextResponse | void> {
  const ip = req.headers.get('x-forwarded-for') || 
            req.headers.get('x-real-ip') || 
            req.headers.get('cf-connecting-ip') || 
            'unknown'
  const userAgent = req.headers.get('user-agent') || 'unknown'
  const url = req.url
  const method = req.method

  // Logging de base pour toutes les requêtes
  console.log(`[${method}] ${url} from ${ip}`)

  // Rate limiting global
  if (method !== 'GET') {
    const rateLimitResult = await rateLimiter.checkRateLimit('global', ip)
    if (!rateLimitResult.allowed) {
      SecurityLogger.logRateLimitViolation('global', ip, rateLimitResult.reason || 'unknown')
      
      return new NextResponse('Too Many Requests', { 
        status: 429,
        headers: {
          'Retry-After': rateLimitResult.timeLeft ? rateLimitResult.timeLeft.toString() : '60'
        }
      })
    }
  }

  // CSRF protection pour les requêtes POST/PUT/DELETE/PATCH
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    const csrfValid = await CSRFProtection.verifyCSRFToken(req)
    
    if (!csrfValid) {
      SecurityLogger.logCSRFViolation(ip, userAgent, method)
      
      return new NextResponse('Invalid CSRF Token', { 
        status: 419,
        headers: {
          'Content-Type': 'application/json',
          'X-Error': 'CSRF validation failed'
        }
      })
    }
  }

  // Validation spécifique aux routes d'authentification
  if (url.includes('/api/auth/login') && method === 'POST') {
    try {
      const body = await req.clone().json()
      const validation = validateRequest(loginSchema, body)
      
      if (!validation.success) {
        SecurityLogger.logSecurityEvent('login_validation_failed', {
          ip,
          userAgent,
          errors: 'validation_failed'
        }, 'warning')
        
        return new NextResponse(JSON.stringify({ error: 'Validation failed' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      // Rate limiting spécifique aux tentatives de connexion
      const { email } = validation.data
      const loginRateLimit = await rateLimiter.checkRateLimit(email, ip)
      
      if (!loginRateLimit.allowed) {
        SecurityLogger.logLoginAttempt(email, ip, false, userAgent)
        SecurityLogger.logRateLimitViolation(email, ip, loginRateLimit.reason || 'user_locked')
        
        const message = loginRateLimit.reason === 'user_locked' 
          ? `Compte temporairement bloqué. Réessayez dans ${loginRateLimit.timeLeft} minutes.`
          : `Trop de tentatives. Veuillez réessayer plus tard.`
        
        return new NextResponse(JSON.stringify({ 
          error: message,
          blocked: true,
          timeLeft: loginRateLimit.timeLeft
        }), {
          status: 429,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      // Enregistrer la tentative de connexion
      rateLimiter.recordAttempt(email, ip, false) // Sera mis à jour après la réponse
      
    } catch (error) {
      SecurityLogger.logSecurityEvent('login_parsing_error', {
        ip,
        userAgent,
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 'error')
      
      return new NextResponse('Invalid request format', { status: 400 })
    }
  }

  // Détection d'activités suspectes
  const suspiciousPatterns = [
    /\.\./,  // Path traversal
    /<script/i,  // XSS attempts
    /union.*select/i,  // SQL injection attempts
    /javascript:/i,  // JavaScript protocol
    /data:.*base64/i  // Base64 encoded data
  ]

  const isSuspicious = suspiciousPatterns.some(pattern => 
    pattern.test(url) || 
    pattern.test(userAgent) ||
    pattern.test(JSON.stringify(req.headers))
  )

  if (isSuspicious) {
    SecurityLogger.logSuspiciousActivity(ip, userAgent, 'pattern_match', {
      url,
      method,
      headers: Object.fromEntries(req.headers.entries())
    })
    
    // Pour les activités très suspectes, bloquer la requête
    if (/<script|union.*select/i.test(url)) {
      return new NextResponse('Forbidden', { status: 403 })
    }
  }

  // Headers de sécurité additionnels
  const response = NextResponse.next()
  
  // Ajouter des headers de sécurité à chaque réponse
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Enlever les headers sensibles
  response.headers.delete('x-powered-by')
  response.headers.delete('server')
  
  return response
}

export function createSecurityWrapper(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const securityResult = await securityMiddleware(req, new NextResponse())
      
      // Si le middleware a retourné une réponse (erreur), la retourner
      if (securityResult && securityResult.status !== 200) {
        return securityResult
      }
      
      // Sinon, continuer avec le handler original
      return await handler(req)
    } catch (error) {
      SecurityLogger.logSecurityEvent('middleware_error', {
        url: req.url,
        method: req.method,
        ip: req.headers.get('x-forwarded-for') || 'unknown',
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 'error')
      
      return new NextResponse('Internal Server Error', { status: 500 })
    }
  }
}

// Export pour utilisation dans les routes API
export { securityMiddleware as securityMiddlewareFunction }
