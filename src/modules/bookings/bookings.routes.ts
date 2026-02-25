import express from "express";
import { bookingsControllers } from "./bookings.controllers";
import logger from "../../middleware/logger";
import auth from "../../middleware/auth";

// ===============================
// BOOKINGS ROUTER
// ===============================
/**
 * bookingsRoutes
 * - Defines all API routes for booking management
 * - Applies logger middleware to log requests
 * - Applies auth middleware for role-based access control
 * - Routes:
 *    POST /api/v1/bookings         -> Create a booking (Admin or Customer)
 *    GET /api/v1/bookings          -> Get all bookings (Admin or Customer)
 *    PUT /api/v1/bookings/:bookingId -> Update a booking (Admin or Customer)
 */
const router = express.Router();

// ===============================
// CREATE BOOKING (ADMIN OR CUSTOMER)
// ===============================
/**
 * POST /
 * - Endpoint: /api/v1/bookings
 * - Middleware:
 *    logger -> logs the request
 *    auth("admin", "customer") -> Admin and Customer can create bookings
 * - Controller: bookingsControllers.createBookings
 * - Creates a new booking in the database
 */
router.post(
  "/",
  logger,
  auth("admin", "customer"),
  bookingsControllers.createBookings,
);

// ===============================
// GET BOOKINGS (ADMIN OR CUSTOMER)
// ===============================
/**
 * GET /
 * - Endpoint: /api/v1/bookings
 * - Middleware:
 *    logger -> logs the request
 *    auth("admin", "customer") -> Admin can see all bookings, Customer sees own bookings
 * - Controller: bookingsControllers.getBookings
 * - Returns list of bookings
 */
router.get(
  "/",
  logger,
  auth("admin", "customer"),
  bookingsControllers.getBookings,
);

// ===============================
// UPDATE BOOKING (ADMIN OR CUSTOMER)
// ===============================
/**
 * PUT /:bookingId
 * - Endpoint: /api/v1/bookings/:bookingId
 * - Middleware:
 *    logger -> logs the request
 *    auth("admin", "customer") -> Admin can update any booking, Customer can update own booking
 * - Controller: bookingsControllers.updateBookings
 * - Updates a booking record by ID
 */
router.put(
  "/:bookingId",
  logger,
  auth("admin", "customer"),
  bookingsControllers.updateBookings,
);

// ===============================
// EXPORT BOOKINGS ROUTER
// ===============================
/**
 * bookingsRoutes
 * - Exports the router with all booking-related endpoints
 */
export const bookingsRoutes = router;
