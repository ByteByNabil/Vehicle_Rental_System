// ===============================
// MAIN EXPRESS APP
// ===============================
/**
 * app.ts
 * - Sets up the Express application
 * - Initializes middleware, routes, and database
 * - Handles unknown routes with 404
 */

import express, { Request, Response } from "express";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/users/users.routes";
import { vehiclesRoutes } from "./modules/vehicles/vehicles.routes";
import { bookingsRoutes } from "./modules/bookings/bookings.routes";
import { authRoutes } from "./modules/auth/auth.routes";

// ===============================
// EXPRESS APP INSTANCE
// ===============================
/**
 * app
 * - Main Express application instance
 * - All routes and middleware are mounted on this
 */
const app = express();

// ===============================
// BODY PARSER MIDDLEWARE
// ===============================
/**
 * express.json()
 * - Parses incoming JSON requests
 * - Populates req.body
 */
app.use(express.json());

// ===============================
// INITIALIZE DATABASE
// ===============================
/**
 * initDB()
 * - Creates tables if they do not exist
 * - Ensures database is ready before API usage
 */
initDB();

// ===============================
// ROOT ROUTE
// ===============================
/**
 * GET /
 * - Health check or welcome route
 * - Uses logger middleware
 */
app.get("/", logger, (req: Request, res: Response) => {
  res.send("Vehicle Rental System Backend API is running!");
});

// ===============================
// API ROUTES
// ===============================

/**
 * /api/v1/users
 * - User CRUD routes
 * - Access controlled by auth middleware
 */
app.use("/api/v1/users", userRoutes);

/**
 * /api/v1/vehicles
 * - Vehicle CRUD routes
 * - Admin-only protected routes via auth middleware
 */
app.use("/api/v1/vehicles", vehiclesRoutes);

/**
 * /api/v1/bookings
 * - Booking CRUD routes
 * - Access controlled based on user role
 */
app.use("/api/v1/bookings", bookingsRoutes);

/**
 * /api/v1/auth
 * - Authentication routes
 * - SignUp / SignIn endpoints
 */
app.use("/api/v1/auth", authRoutes);

// ===============================
// 404 ROUTE HANDLER
// ===============================
/**
 * Catch-all route for unknown paths
 * - Returns 404 JSON response
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

// ===============================
// EXPORT APP
// ===============================
/**
 * Exported for server.ts or test setup
 */
export default app;
