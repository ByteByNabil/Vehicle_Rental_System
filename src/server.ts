// ===============================
// SERVER ENTRY POINT
// ===============================
/**
 * server.ts
 * - Starts the Express application
 * - Reads port configuration from config
 * - Logs successful startup
 */

import app from "./app";
import config from "./config";

// ===============================
// PORT CONFIGURATION
// ===============================
/**
 * port
 * - Reads the port number from config
 * - Fallback could be added if needed (e.g., process.env.PORT)
 */
const port = config.port;

// ===============================
// START SERVER
// ===============================
/**
 * app.listen()
 * - Launches the Express server on the configured port
 * - Logs message when server is ready
 */
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
