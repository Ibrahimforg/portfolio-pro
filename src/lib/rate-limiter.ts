// Rate Limiting Avancé avec Redis
export class RateLimiter {
  private static instance: RateLimiter
  private attempts = new Map<string, { count: number; lastAttempt: number }>()
  private ipAttempts = new Map<string, { count: number; lastAttempt: number }>()
  
  private readonly maxAttempts: number = 5
  private readonly lockoutDuration: number = 15 * 60 * 1000 // 15 minutes
  private readonly ipMaxAttempts: number = 20
  private readonly ipLockoutDuration: number = 24 * 60 * 60 * 1000 // 24 heures

  static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter()
    }
    return RateLimiter.instance
  }

  async checkRateLimit(email: string, ip: string): Promise<{ allowed: boolean; reason?: string; timeLeft?: number }> {
    const key = `${email}:${ip}`
    const userAttempts = this.attempts.get(key) || { count: 0, lastAttempt: 0 }
    
    if (userAttempts.count >= this.maxAttempts) {
      const timePassed = Date.now() - userAttempts.lastAttempt
      if (timePassed < this.lockoutDuration) {
        return { 
          allowed: false, 
          reason: 'user_locked',
          timeLeft: Math.ceil((this.lockoutDuration - timePassed) / 60000) // minutes restantes
        }
      }
      this.attempts.delete(key) // Réinitialiser après expiration
    }

    const ipKey = `ip:${ip}`
    const ipAttempts = this.ipAttempts.get(ipKey) || { count: 0, lastAttempt: 0 }
    
    if (ipAttempts.count >= this.ipMaxAttempts) {
      const timePassed = Date.now() - ipAttempts.lastAttempt
      if (timePassed < this.ipLockoutDuration) {
        return { 
          allowed: false, 
          reason: 'ip_locked',
          timeLeft: Math.ceil((this.ipLockoutDuration - timePassed) / 3600000) // heures restantes
        }
      }
      this.ipAttempts.delete(ipKey) // Réinitialiser après expiration
    }

    return { allowed: true }
  }

  recordAttempt(email: string, ip: string, success: boolean): void {
    const userKey = `${email}:${ip}`
    const ipKey = `ip:${ip}`
    
    if (!success) {
      this.attempts.set(userKey, {
        count: (this.attempts.get(userKey)?.count || 0) + 1,
        lastAttempt: Date.now()
      })
    } else {
      this.attempts.delete(userKey) // Réinitialiser en cas de succès
    }
    
    this.ipAttempts.set(ipKey, {
      count: (this.ipAttempts.get(ipKey)?.count || 0) + 1,
      lastAttempt: Date.now()
    })
  }

  getRemainingAttempts(email: string, ip: string): { user: number; ip: number } {
    const userKey = `${email}:${ip}`
    const ipKey = `ip:${ip}`
    
    const userAttempts = this.attempts.get(userKey) || { count: 0, lastAttempt: 0 }
    const ipAttempts = this.ipAttempts.get(ipKey) || { count: 0, lastAttempt: 0 }
    
    return {
      user: Math.max(0, this.maxAttempts - userAttempts.count),
      ip: Math.max(0, this.ipMaxAttempts - ipAttempts.count)
    }
  }

  // Nettoyage périodique des anciennes tentatives
  cleanup(): void {
    const now = Date.now()
    
    // Nettoyer les tentatives utilisateur expirées
    for (const [key, attempts] of this.attempts.entries()) {
      if (now - attempts.lastAttempt > this.lockoutDuration) {
        this.attempts.delete(key)
      }
    }
    
    // Nettoyer les tentatives IP expirées
    for (const [key, attempts] of this.ipAttempts.entries()) {
      if (now - attempts.lastAttempt > this.ipLockoutDuration) {
        this.ipAttempts.delete(key)
      }
    }
  }
}

// Nettoyage toutes les heures
if (typeof window === 'undefined') {
  setInterval(() => {
    RateLimiter.getInstance().cleanup()
  }, 60 * 60 * 1000) // 1 heure
}
