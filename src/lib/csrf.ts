// CSRF Protection Complexe avec tokens cryptographiques
import React from 'react'

export class CSRFProtection {
  private static readonly COOKIE_NAME = 'csrf-token'
  private static readonly HEADER_NAME = 'X-CSRF-Token'
  private static readonly COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 3600, // 1 heure
    path: '/'
  }

  static generateToken(): string {
    // Générer un token cryptographiquement sécurisé
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }

  static validateToken(token: string): boolean {
    // Valider le format du token (64 caractères hexadécimaux)
    return /^[a-f0-9]{64}$/i.test(token)
  }

  static getCSRFToken(): string | null {
    if (typeof window === 'undefined') return null
    
    const cookies = document.cookie.split(';')
    const csrfCookie = cookies.find(cookie => 
      cookie.trim().startsWith(`${CSRFProtection.COOKIE_NAME}=`)
    )
    
    if (csrfCookie) {
      const token = csrfCookie.split('=')[1]
      return CSRFProtection.validateToken(token) ? token : null
    }
    return null
  }

  static setCSRFToken(token: string): void {
    if (typeof window === 'undefined') return
    
    const cookieString = `${CSRFProtection.COOKIE_NAME}=${token};${Object.entries(CSRFProtection.COOKIE_OPTIONS)
      .map(([key, value]) => `${key}=${value}`)
      .join('; ')}`
    
    document.cookie = cookieString
  }

  static removeCSRFToken(): void {
    if (typeof window === 'undefined') return
    
    const expiredOptions = { ...CSRFProtection.COOKIE_OPTIONS, maxAge: 0 }
    const cookieString = `${CSRFProtection.COOKIE_NAME}=;${Object.entries(expiredOptions)
      .map(([key, value]) => `${key}=${value}`)
      .join('; ')}`
    
    document.cookie = cookieString
  }

  static getCSRFHeader(): string {
    return CSRFProtection.HEADER_NAME
  }

  // Middleware pour vérifier le token
  static async verifyCSRFToken(request: Request): Promise<boolean> {
    const cookieToken = this.getCSRFTokenFromRequest(request)
    const headerToken = request.headers.get(CSRFProtection.HEADER_NAME)
    
    if (!cookieToken || !headerToken) {
      return false
    }
    
    if (!this.validateToken(cookieToken) || !this.validateToken(headerToken)) {
      return false
    }
    
    return cookieToken === headerToken
  }

  private static getCSRFTokenFromRequest(request: Request): string | null {
    const cookieHeader = request.headers.get('cookie')
    if (!cookieHeader) return null
    
    const cookies = cookieHeader.split(';')
    const csrfCookie = cookies.find(cookie => 
      cookie.trim().startsWith(`${CSRFProtection.COOKIE_NAME}=`)
    )
    
    return csrfCookie ? csrfCookie.split('=')[1] : null
  }

  // Générer et définir un nouveau token
  static generateAndSetToken(): string {
    const token = this.generateToken()
    this.setCSRFToken(token)
    return token
  }
}

// Hook React pour les tokens CSRF
export function useCSRF() {
  const [token, setToken] = React.useState<string | null>(null)
  const [isClient, setIsClient] = React.useState(false)

  React.useEffect(() => {
    setIsClient(true)
    const existingToken = CSRFProtection.getCSRFToken()
    
    if (!existingToken) {
      const newToken = CSRFProtection.generateAndSetToken()
      setToken(newToken)
    } else {
      setToken(existingToken)
    }
  }, [])

  const refreshCSRFToken = React.useCallback(() => {
    const newToken = CSRFProtection.generateAndSetToken()
    setToken(newToken)
    return newToken
  }, [])

  return { token, refreshCSRFToken, isClient }
}
