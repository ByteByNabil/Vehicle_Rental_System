import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

// ===============================
// AUTHENTICATION & AUTHORIZATION MIDDLEWARE
// ===============================
/**
 * AUTH MIDDLEWARE
 * - Verifies JWT token
 * - Attaches authenticated user to req.user
 * - Performs optional role-based access control
 *
 * Example Usage:
 *   auth() → Any logged-in user
 *   auth("admin") → Admin only
 *   auth("admin", "customer") → Specific roles allowed
 */
const auth = (...roles: ("admin" | "customer")[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // ===============================
      // AUTH HEADER VALIDATION
      // ===============================
      /**
       * Check if Authorization header exists
       * Expected format: Bearer <token>
       */
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: No token provided",
        });
      }

      // Extract token from header
      const token = authHeader.split(" ")[1];

      // ===============================
      // JWT VERIFICATION
      // ===============================
      /**
       * Verify token using JWT secret
       * Decode payload and cast to typed user object
       */
      const decoded = jwt.verify(
        token as string,
        config.jwtSecret as string,
      ) as JwtPayload & {
        id: number;
        name: string;
        email: string;
        role: "admin" | "customer";
      };

      // ===============================
      // ATTACH USER TO REQUEST
      // ===============================
      /**
       * Attach decoded user information
       * Makes authenticated user available in controllers
       */
      req.user = decoded;

      // ===============================
      // ROLE-BASED ACCESS CONTROL
      // ===============================
      /**
       * If roles are provided:
       * - Check whether user's role is allowed
       * - Deny access if role not included
       */
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You do not have access to this resource",
        });
      }

      next();
    } catch (err: any) {
      // ===============================
      // TOKEN ERROR HANDLING
      // ===============================
      /**
       * Handles:
       * - Invalid token
       * - Expired token
       * - Malformed token
       */
      res.status(401).json({
        success: false,
        message: "Unauthorized: " + (err.message || "Invalid token"),
      });
    }
  };
};

export default auth;
