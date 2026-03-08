// Logging Sécurité Complet
import { supabase } from '@/lib/supabase'

export interface SecurityLogEntry {
  timestamp: string
  level: 'info' | 'warning' | 'error' | 'critical'
  event: string
  email?: string
  ip?: string
  success?: boolean
  userAgent?: string
  details?: Record<string, any>
  userId?: string
}

export class SecurityLogger {
  static logLoginAttempt(email: string, ip: string, success: boolean, userAgent?: string, userId?: string): void {
    const logEntry: SecurityLogEntry = {
      timestamp: new Date().toISOString(),
      level: success ? 'info' : 'warning',
      event: 'login_attempt',
      email,
      ip,
      success,
      userAgent,
      userId
    }
    
    // Envoyer à un service de logging (Sentry, LogRocket, etc.)
    console.log(JSON.stringify(logEntry))
    
    // Enregistrer en base de données pour analyse
    this.persistSecurityEvent(logEntry)
  }

  static logSecurityEvent(event: string, details: Record<string, any>, level: 'warning' | 'error' | 'critical' = 'warning'): void {
    const logEntry: SecurityLogEntry = {
      timestamp: new Date().toISOString(),
      level,
      event,
      details
    }
    
    console.log(`[SECURITY] ${event}:`, details)
    this.persistSecurityEvent(logEntry)
    
    // Alertes pour événements critiques
    if (level === 'critical') {
      this.sendAlert(logEntry)
    }
  }

  static logCSRFViolation(ip: string, userAgent: string, method: string): void {
    const logEntry: SecurityLogEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      event: 'csrf_violation',
      ip,
      userAgent,
      details: { method }
    }
    
    console.error(`[CRITICAL] CSRF Violation from ${ip}`)
    this.persistSecurityEvent(logEntry)
    this.sendAlert(logEntry)
  }

  static logRateLimitViolation(email: string, ip: string, reason: string): void {
    const logEntry: SecurityLogEntry = {
      timestamp: new Date().toISOString(),
      level: 'warning',
      event: 'rate_limit_violation',
      email,
      ip,
      details: { reason }
    }
    
    console.warn(`[SECURITY] Rate limit violation: ${reason} for ${email} from ${ip}`)
    this.persistSecurityEvent(logEntry)
  }

  static log2FAEvent(userId: string, event: 'enabled' | 'disabled' | 'verified' | 'failed', success: boolean, details?: Record<string, any>): void {
    const logEntry: SecurityLogEntry = {
      timestamp: new Date().toISOString(),
      level: success ? 'info' : 'warning',
      event: `2fa_${event}`,
      userId,
      success,
      details
    }
    
    console.log(`[SECURITY] 2FA ${event} for user ${userId}: ${success ? 'success' : 'failed'}`)
    this.persistSecurityEvent(logEntry)
  }

  static logDataAccess(userId: string, resource: string, action: string, success: boolean): void {
    const logEntry: SecurityLogEntry = {
      timestamp: new Date().toISOString(),
      level: success ? 'info' : 'warning',
      event: 'data_access',
      userId,
      details: { resource, action, success }
    }
    
    console.log(`[SECURITY] Data access: ${action} on ${resource} by user ${userId}`)
    this.persistSecurityEvent(logEntry)
  }

  static logSuspiciousActivity(ip: string, userAgent: string, pattern: string, details: Record<string, any>): void {
    const logEntry: SecurityLogEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      event: 'suspicious_activity',
      ip,
      userAgent,
      details: { pattern, ...details }
    }
    
    console.error(`[CRITICAL] Suspicious activity detected: ${pattern} from ${ip}`)
    this.persistSecurityEvent(logEntry)
    this.sendAlert(logEntry)
  }

  private static async persistSecurityEvent(logEntry: SecurityLogEntry): Promise<void> {
    try {
      await supabase
        .from('security_logs')
        .insert(logEntry)
    } catch (error) {
      console.error('Erreur logging security event:', error)
      // Fallback: envoyer vers un service externe
      this.sendToExternalService(logEntry)
    }
  }

  private static sendAlert(logEntry: SecurityLogEntry): void {
    // Envoyer une alerte aux administrateurs
    const alertMessage = `
🚨 ALERT SÉCURITÉ - ${logEntry.level.toUpperCase()} 🚨
Événement: ${logEntry.event}
Timestamp: ${logEntry.timestamp}
IP: ${logEntry.ip || 'N/A'}
Email: ${logEntry.email || 'N/A'}
Détails: ${JSON.stringify(logEntry.details, null, 2)}
    `.trim()

    console.error(alertMessage)
    
    // TODO: Intégrer avec un service de notification (email, Slack, Discord, etc.)
    // this.sendNotification(alertMessage)
  }

  private static sendToExternalService(logEntry: SecurityLogEntry): void {
    // Fallback vers un service externe si Supabase échoue
    try {
      // Envoyer vers un endpoint de logging externe
      fetch('/api/security-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logEntry)
      }).catch(() => {
        // Dernier fallback: console uniquement
        console.error('Failed to send security log to external service')
      })
    } catch (error) {
      console.error('Error in external logging fallback:', error)
    }
  }

  // Méthodes d'analyse des logs
  static async getSecurityStats(timeframe: '1h' | '24h' | '7d' | '30d' = '24h'): Promise<{
    totalEvents: number
    criticalEvents: number
    failedLogins: number
    suspiciousActivities: number
    topIPs: Array<{ ip: string; count: number }>
  }> {
    try {
      const timeAgo = new Date()
      switch (timeframe) {
        case '1h': timeAgo.setHours(timeAgo.getHours() - 1); break
        case '24h': timeAgo.setDate(timeAgo.getDate() - 1); break
        case '7d': timeAgo.setDate(timeAgo.getDate() - 7); break
        case '30d': timeAgo.setDate(timeAgo.getDate() - 30); break
      }

      const { data: events } = await supabase
        .from('security_logs')
        .select('*')
        .gte('timestamp', timeAgo.toISOString())

      const totalEvents = events?.length || 0
      const criticalEvents = events?.filter(e => e.level === 'critical').length || 0
      const failedLogins = events?.filter(e => e.event === 'login_attempt' && !e.success).length || 0
      const suspiciousActivities = events?.filter(e => e.event === 'suspicious_activity').length || 0

      // Top IPs par nombre d'événements
      const ipCounts: Record<string, number> = {}
      events?.forEach(event => {
        if (event.ip) {
          ipCounts[event.ip] = (ipCounts[event.ip] || 0) + 1
        }
      })

      const topIPs = Object.entries(ipCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([ip, count]) => ({ ip, count }))

      return {
        totalEvents,
        criticalEvents,
        failedLogins,
        suspiciousActivities,
        topIPs
      }
    } catch (error) {
      console.error('Erreur getting security stats:', error)
      return {
        totalEvents: 0,
        criticalEvents: 0,
        failedLogins: 0,
        suspiciousActivities: 0,
        topIPs: []
      }
    }
  }

  static async detectAnomalies(): Promise<{
    detected: boolean
    anomalies: string[]
    recommendations: string[]
  }> {
    const stats = await this.getSecurityStats('24h')
    const anomalies: string[] = []
    const recommendations: string[] = []

    // Détection d'anomalies
    if (stats.failedLogins > 50) {
      anomalies.push(`Nombre élevé de connexions échouées: ${stats.failedLogins}`)
      recommendations.push('Considérer bloquer temporairement les IPs suspectes')
    }

    if (stats.criticalEvents > 5) {
      anomalies.push(`Nombre élevé d'événements critiques: ${stats.criticalEvents}`)
      recommendations.push('Vérifier immédiatement les logs de sécurité')
    }

    if (stats.suspiciousActivities > 10) {
      anomalies.push(`Activités suspectes détectées: ${stats.suspiciousActivities}`)
      recommendations.push('Renforcer les mesures de sécurité')
    }

    // IPs avec activité inhabituelle
    const highActivityIPs = stats.topIPs.filter(ip => ip.count > 100)
    if (highActivityIPs.length > 0) {
      anomalies.push(`IPs avec activité inhabituelle: ${highActivityIPs.map(ip => ip.ip).join(', ')}`)
      recommendations.push('Analyser le trafic depuis ces IPs')
    }

    return {
      detected: anomalies.length > 0,
      anomalies,
      recommendations
    }
  }
}
