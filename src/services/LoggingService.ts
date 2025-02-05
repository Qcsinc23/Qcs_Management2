enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: Record<string, unknown>
}

class LoggingService {
  private static instance: LoggingService
  private currentLogLevel: LogLevel = LogLevel.INFO
  private logEntries: LogEntry[] = []

  private constructor() {}

  public static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService()
    }
    return LoggingService.instance
  }

  public setLogLevel(level: LogLevel): void {
    this.currentLogLevel = level
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    // Only log if the current log level allows it
    const logLevels = [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG]
    if (logLevels.indexOf(level) > logLevels.indexOf(this.currentLogLevel)) {
      return
    }

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    }

    this.logEntries.push(logEntry)

    // In production, use a more sophisticated logging mechanism
    if (import.meta.env.PROD) {
      this.productionLog(logEntry)
    }
    else {
      this.developmentLog(logEntry)
    }
  }

  private developmentLog(entry: LogEntry): void {
    switch (entry.level) {
      case LogLevel.ERROR:
        console.error(entry.message, entry.context)
        break
      case LogLevel.WARN:
        console.warn(entry.message, entry.context)
        break
      case LogLevel.INFO:
        console.info(entry.message, entry.context)
        break
      case LogLevel.DEBUG:
        console.debug(entry.message, entry.context)
        break
    }
  }

  private productionLog(entry: LogEntry): void {
    // In production, send logs to a backend service or logging platform
    // This is a placeholder - replace with actual production logging mechanism
    if (entry.level === LogLevel.ERROR) {
      // Example: Send error to error tracking service
      // errorTrackingService.captureException(new Error(entry.message), entry.context);
    }
  }

  public error(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, context)
  }

  public warn(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, context)
  }

  public info(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context)
  }

  public debug(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, context)
  }

  public getLogEntries(): LogEntry[] {
    return [...this.logEntries]
  }

  public clearLogs(): void {
    this.logEntries = []
  }
}

export { LoggingService, LogLevel }
