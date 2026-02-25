import { NextFunction, Request, Response } from "express";

// ===============================
// REQUEST LOGGER MIDDLEWARE
// ===============================
/**
 * LOGGER MIDDLEWARE
 * - Logs incoming HTTP requests
 * - Displays timestamp, method, and route path
 * - Helps with debugging and monitoring
 *
 * Example Log Output:
 * [2026-02-26T08:30:00.000Z] GET /api/v1/users
 */
const logger = (req: Request, res: Response, next: NextFunction) => {
  // ===============================
  // LOG REQUEST INFORMATION
  // ===============================
  /**
   * Logs:
   * - Current ISO timestamp
   * - HTTP method (GET, POST, PUT, DELETE)
   * - Request path
   */
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}\n`);

  next();
};

export default logger;
