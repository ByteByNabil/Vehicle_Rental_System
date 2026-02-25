// ===============================
// GLOBAL TYPE EXTENSIONS
// ===============================
/**
 * index.d.ts
 * - Extends Express.Request to include authenticated user information
 * - Used throughout controllers and middleware for type safety
 * - Ensures TypeScript knows the shape of req.user
 */

import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      // ===============================
      // AUTHENTICATED USER
      // ===============================
      /**
       * user
       * - Populated after JWT authentication middleware
       * - Optional: may be undefined if not authenticated
       * - Fields:
       *    - id: number → database user ID
       *    - name: string → user's name
       *    - email: string → user's email
       *    - role: "admin" | "customer" → user's role in the system
       */
      user?: JwtPayload & {
        id: number;
        name: string;
        email: string;
        role: "admin" | "customer";
      };
    }
  }
}
