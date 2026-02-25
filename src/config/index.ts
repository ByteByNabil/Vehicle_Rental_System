// ===============================
// ENVIRONMENT CONFIGURATION SETUP
// ===============================

/**
 * Load Environment Variables
 * - Uses dotenv to load variables from .env file
 * - Ensures secure configuration management
 * - Keeps sensitive data outside source code
 */

import dotenv from "dotenv";
import path from "path";

// Load .env file from project root directory
dotenv.config({ path: path.join(process.cwd(), ".env") });

// ===============================
// APPLICATION CONFIG OBJECT
// ===============================

/**
 * Centralized Configuration Object
 * - connection_str → PostgreSQL connection string
 * - port → Server port (default 5000 if not provided)
 * - jwtSecret → Secret key used for JWT authentication
 *
 * NOTE:
 * - All sensitive values must be defined inside .env
 * - Never hardcode secrets in production
 */
const config = {
  connection_str: process.env.CONNECTION_STRING,
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET,
};

// ===============================
// EXPORT CONFIG
// ===============================
/**
 * Export configuration
 * - Used across entire application
 * - Keeps config centralized and maintainable
 */
export default config;
