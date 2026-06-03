// Logger structuré pour remplacer console.log
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: string
  userId?: string
  metadata?: Record<string, unknown>
}

class Logger {
  private static instance: Logger
  private logLevel: LogLevel = process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG
  private logs: LogEntry[] = []
  private maxLogs = 1000

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel
  }

  private formatLog(entry: LogEntry): string {
    const timestamp = entry.timestamp
    const level = LogLevel[entry.level].padEnd(5)
    const context = entry.context ? `[${entry.context}]` : ''
    const userId = entry.userId ? ` [user:${entry.userId}]` : ''
    const metadata = entry.metadata ? ` ${JSON.stringify(entry.metadata)}` : ''
    
    return `${timestamp} ${level}${context}${userId} ${entry.message}${metadata}`
  }

  private writeLog(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) return

    const formatted = this.formatLog(entry)
    
    // En développement, utiliser console
    if (process.env.NODE_ENV === 'development') {
      switch (entry.level) {
        case LogLevel.DEBUG:
          console.debug(formatted)
          break
        case LogLevel.INFO:
          console.info(formatted)
          break
        case LogLevel.WARN:
          console.warn(formatted)
          break
        case LogLevel.ERROR:
          console.error(formatted)
          break
      }
    }

    // Stocker en mémoire pour analytics
    this.logs.push(entry)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    // En production, envoyer à service externe
    if (process.env.NODE_ENV === 'production' && entry.level >= LogLevel.ERROR) {
      this.sendToExternalService(entry)
    }
  }

  private async sendToExternalService(_entry: LogEntry): Promise<void> {
    try {
      // TODO: Intégrer avec service externe (Sentry, LogRocket, etc.)
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entry)
      // })
    } catch {
      // Silent fail pour éviter boucle infinie
    }
  }

  debug(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.writeLog({
      level: LogLevel.DEBUG,
      message,
      timestamp: new Date().toISOString(),
      context,
      metadata
    })
  }

  info(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.writeLog({
      level: LogLevel.INFO,
      message,
      timestamp: new Date().toISOString(),
      context,
      metadata
    })
  }

  warn(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.writeLog({
      level: LogLevel.WARN,
      message,
      timestamp: new Date().toISOString(),
      context,
      metadata
    })
  }

  error(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.writeLog({
      level: LogLevel.ERROR,
      message,
      timestamp: new Date().toISOString(),
      context,
      metadata
    })
  }

  security(event: string, userId?: string, metadata?: Record<string, unknown>): void {
    this.writeLog({
      level: LogLevel.ERROR,
      message: `SECURITY: ${event}`,
      timestamp: new Date().toISOString(),
      context: 'security',
      userId,
      metadata
    })
  }

  performance(operation: string, duration: number, metadata?: Record<string, unknown>): void {
    this.writeLog({
      level: LogLevel.INFO,
      message: `Performance: ${operation} took ${duration}ms`,
      timestamp: new Date().toISOString(),
      context: 'performance',
      metadata: { ...metadata, duration }
    })
  }

  getLogs(level?: LogLevel, context?: string): LogEntry[] {
    return this.logs.filter(log => {
      if (level && log.level !== level) return false
      if (context && log.context !== context) return false
      return true
    })
  }

  clearLogs(): void {
    this.logs = []
  }

  setLogLevel(level: LogLevel): void {
    this.logLevel = level
  }
}

export const logger = Logger.getInstance()

// Export pour compatibilité avec code existant
export const log = {
  debug: (message: string, context?: string, metadata?: Record<string, unknown>) => logger.debug(message, context, metadata),
  info: (message: string, context?: string, metadata?: Record<string, unknown>) => logger.info(message, context, metadata),
  warn: (message: string, context?: string, metadata?: Record<string, unknown>) => logger.warn(message, context, metadata),
  error: (message: string, context?: string, metadata?: Record<string, unknown>) => logger.error(message, context, metadata),
  security: (event: string, userId?: string, metadata?: Record<string, unknown>) => logger.security(event, userId, metadata),
  performance: (operation: string, duration: number, metadata?: Record<string, unknown>) => logger.performance(operation, duration, metadata)
}
