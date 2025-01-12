export interface ILogger {
  info(message: string, context?: Record<string, unknown>): void;
  error(
    message: string,
    error?: Error,
    context?: Record<string, unknown>
  ): void;
  warn(message: string, context?: Record<string, unknown>): void;
  debug(message: string, context?: Record<string, unknown>): void;
}

export class Logger implements ILogger {
  private static instance: Logger;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  info(message: string, context?: Record<string, unknown>): void {
    console.log(
      JSON.stringify(
        {
          level: "info",
          timestamp: new Date().toISOString(),
          message,
          ...context,
        },
        null,
        2
      )
    );
  }

  error(
    message: string,
    error?: Error,
    context?: Record<string, unknown>
  ): void {
    console.error(
      JSON.stringify(
        {
          level: "error",
          timestamp: new Date().toISOString(),
          message,
          error: error?.stack,
          ...context,
        },
        null,
        2
      )
    );
  }

  warn(message: string, context?: Record<string, unknown>): void {
    console.warn(
      JSON.stringify(
        {
          level: "warn",
          timestamp: new Date().toISOString(),
          message,
          ...context,
        },
        null,
        2
      )
    );
  }

  debug(message: string, context?: Record<string, unknown>): void {
    console.debug(
      JSON.stringify(
        {
          level: "debug",
          timestamp: new Date().toISOString(),
          message,
          ...context,
        },
        null,
        2
      )
    );
  }
}
