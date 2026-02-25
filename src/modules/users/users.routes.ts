import express from "express";
import { userControllers } from "./users.controllers";
import logger from "../../middleware/logger";
import auth from "../../middleware/auth";

// ===============================
// USERS ROUTER
// ===============================
/**
 * userRoutes
 * - Defines all API routes for user management
 * - Applies logger middleware to log requests
 * - Applies auth middleware for role-based access control
 * - Routes:
 *    GET /api/v1/users         -> Get all users (Admin only)
 *    GET /api/v1/users/:userId -> Get single user (Admin or Own customer)
 *    PUT /api/v1/users/:userId -> Update user (Admin or Own customer)
 *    DELETE /api/v1/users/:userId -> Delete user (Admin only)
 */
const router = express.Router();

// ===============================
// GET ALL USERS
// ===============================
/**
 * GET /
 * - Endpoint: /api/v1/users
 * - Middleware:
 *    logger -> logs the request
 *    auth("admin") -> only admin can access
 * - Controller: userControllers.getAllUsers
 * - Returns a list of all users in the system
 */
router.get("/", logger, auth("admin"), userControllers.getAllUsers);

// ===============================
// GET USER BY ID
// ===============================
/**
 * GET /:userId
 * - Endpoint: /api/v1/users/:userId
 * - Middleware:
 *    logger -> logs the request
 *    auth("admin", "customer") -> admin can access any user, customer can access own data
 * - Controller: userControllers.getUserById
 * - Returns single user details based on userId
 */
router.get(
  "/:userId",
  logger,
  auth("admin", "customer"),
  userControllers.getUserById,
);

// ===============================
// UPDATE USER BY ID
// ===============================
/**
 * PUT /:userId
 * - Endpoint: /api/v1/users/:userId
 * - Middleware:
 *    logger -> logs the request
 *    auth("admin", "customer") -> admin can update any user, customer can update own profile
 * - Controller: userControllers.updateUserById
 * - Updates user data for the given userId
 */
router.put(
  "/:userId",
  logger,
  auth("admin", "customer"),
  userControllers.updateUserById,
);

// ===============================
// DELETE USER BY ID
// ===============================
/**
 * DELETE /:userId
 * - Endpoint: /api/v1/users/:userId
 * - Middleware:
 *    logger -> logs the request
 *    auth("admin") -> only admin can delete users
 * - Controller: userControllers.deleteUserById
 * - Deletes user record for the given userId
 */
router.delete(
  "/:userId",
  logger,
  auth("admin"),
  userControllers.deleteUserById,
);

// ===============================
// EXPORT ROUTER
// ===============================
/**
 * userRoutes
 * - Exports the router with all user-related endpoints
 */
export const userRoutes = router;
