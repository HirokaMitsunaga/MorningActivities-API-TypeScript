import { Context, Next } from "hono";
import { Logger } from "../utils/Logger.js";

export const customLogger = async (c: Context, next: Next) => {
  const start = Date.now();
  const requestId = c.get("requestId");
  const logger = Logger.getInstance();

  // リクエスト開始時のログ
  logger.info("Request started", {
    requestId,
    method: c.req.method,
    path: c.req.path,
  });

  try {
    await next();
  } catch (error) {
    logger.error(
      "Request failed",
      error instanceof Error ? error : new Error("Unknown error"),
      {
        requestId,
        method: c.req.method,
        path: c.req.path,
      }
    );
    throw error;
  }

  // リクエスト終了時のログ
  logger.info("Request completed", {
    requestId,
    method: c.req.method,
    path: c.req.path,
    status: c.res.status,
    userAgent: c.req.header("user-agent"),
    responseTime: `${Date.now() - start}ms`,
  });
};
