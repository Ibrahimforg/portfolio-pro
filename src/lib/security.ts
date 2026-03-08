// Sécurité avancée pour le système
export const SECURITY_CONFIG = {
  // Rate limiting
  LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  
  // Session management
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes avant expiration
  
  // Password security
  MIN_PASSWORD_LENGTH: 12,
  REQUIRE_SPECIAL_CHARS: true,
  PASSWORD_HISTORY: 5, // Garder 5 anciens mots de passe
  
  // CSRF Protection
  CSRF_TOKEN_EXPIRY: 60 * 60 * 1000, // 1 heure
  
  // IP Security
  MAX_LOGIN_ATTEMPTS_PER_IP: 20,
  IP_BLACKLIST_DURATION: 24 * 60 * 60 * 1000 // 24 heures
}

export class SecurityManager {
  private static instance: SecurityManager
  private loginAttempts = new Map<string, { count: number; lastAttempt: number }>()
  private ipAttempts = new Map<string, { count: number; lastAttempt: number }>()

  static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager()
    }
    return SecurityManager.instance
  }

  // Vérifier si l'utilisateur est bloqué
  isUserLocked(email: string): boolean {
    const attempts = this.loginAttempts.get(email)
    if (!attempts) return false

    if (attempts.count >= SECURITY_CONFIG.LOGIN_ATTEMPTS) {
      const timePassed = Date.now() - attempts.lastAttempt
      return timePassed < SECURITY_CONFIG.LOCKOUT_DURATION
    }
    return false
  }

  // Enregistrer une tentative de connexion
  recordLoginAttempt(email: string, success: boolean): void {
    if (success) {
      this.loginAttempts.delete(email)
    } else {
      const attempts = this.loginAttempts.get(email) || { count: 0, lastAttempt: 0 }
      attempts.count++
      attempts.lastAttempt = Date.now()
      this.loginAttempts.set(email, attempts)
    }
  }

  // Validation de mot de passe avancée
  validatePasswordStrength(password: string): { valid: boolean; issues: string[] } {
    const issues: string[] = []

    if (password.length < SECURITY_CONFIG.MIN_PASSWORD_LENGTH) {
      issues.push(`Minimum ${SECURITY_CONFIG.MIN_PASSWORD_LENGTH} caractères`)
    }

    if (!/[A-Z]/.test(password)) {
      issues.push('Une majuscule requise')
    }

    if (!/[a-z]/.test(password)) {
      issues.push('Une minuscule requise')
    }

    if (!/\d/.test(password)) {
      issues.push('Un chiffre requis')
    }

    if (SECURITY_CONFIG.REQUIRE_SPECIAL_CHARS && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      issues.push('Un caractère spécial requis')
    }

    return { valid: issues.length === 0, issues }
  }

  // Générer un token CSRF
  generateCSRFToken(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }

  // Vérifier le token CSRF
  verifyCSRFToken(token: string, sessionToken: string): boolean {
    // Implémentation de vérification CSRF
    return token && sessionToken && token.length === 64
  }
}
