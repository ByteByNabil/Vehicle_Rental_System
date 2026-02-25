import express from "express";
import { vehiclesControllers } from "./vehicles.controllers";
import logger from "../../middleware/logger";
import auth from "../../middleware/auth";

// ===============================
// VEHICLES ROUTER
// ===============================
/**
 * vehiclesRoutes
 * - Defines all API routes for vehicle management
 * - Applies logger middleware to log requests
 * - Applies auth middleware for role-based access control
 * - Routes:
 *    POST /api/v1/vehicles         -> Create vehicle (Admin only)
 *    GET /api/v1/vehicles          -> Get all vehicles
 *    GET /api/v1/vehicles/:vehicleId -> Get single vehicle by ID
 *    PUT /api/v1/vehicles/:vehicleId -> Update vehicle (Admin only)
 *    DELETE /api/v1/vehicles/:vehicleId -> Delete vehicle (Admin only)
 */
const router = express.Router();

// ===============================
// CREATE VEHICLE (ADMIN ONLY)
// ===============================
/**
 * POST /
 * - Endpoint: /api/v1/vehicles
 * - Middleware:
 *    logger -> logs the request
 *    auth("admin") -> only admin can create vehicles
 * - Controller: vehiclesControllers.createVehicles
 * - Creates a new vehicle record in the database
 */
router.post("/", logger, auth("admin"), vehiclesControllers.createVehicles);

// ===============================
// GET ALL VEHICLES
// ===============================
/**
 * GET /
 * - Endpoint: /api/v1/vehicles
 * - Middleware:
 *    logger -> logs the request
 * - Controller: vehiclesControllers.getAllVehicles
 * - Returns list of all vehicles
 */
router.get("/", logger, vehiclesControllers.getAllVehicles);

// ===============================
// GET VEHICLE BY ID
// ===============================
/**
 * GET /:vehicleId
 * - Endpoint: /api/v1/vehicles/:vehicleId
 * - Middleware:
 *    logger -> logs the request
 * - Controller: vehiclesControllers.getVehiclesById
 * - Returns a single vehicle by ID
 */
router.get("/:vehicleId", logger, vehiclesControllers.getVehiclesById);

// ===============================
// UPDATE VEHICLE (ADMIN ONLY)
// ===============================
/**
 * PUT /:vehicleId
 * - Endpoint: /api/v1/vehicles/:vehicleId
 * - Middleware:
 *    logger -> logs the request
 *    auth("admin") -> only admin can update vehicles
 * - Controller: vehiclesControllers.updateVehicleById
 * - Updates vehicle information for the given ID
 */
router.put(
  "/:vehicleId",
  logger,
  auth("admin"),
  vehiclesControllers.updateVehicleById,
);

// ===============================
// DELETE VEHICLE (ADMIN ONLY)
// ===============================
/**
 * DELETE /:vehicleId
 * - Endpoint: /api/v1/vehicles/:vehicleId
 * - Middleware:
 *    logger -> logs the request
 *    auth("admin") -> only admin can delete vehicles
 * - Controller: vehiclesControllers.deleteVehicleById
 * - Deletes the vehicle with the given ID
 */
router.delete(
  "/:vehicleId",
  logger,
  auth("admin"),
  vehiclesControllers.deleteVehicleById,
);

// ===============================
// EXPORT VEHICLES ROUTER
// ===============================
/**
 * vehiclesRoutes
 * - Exports the router with all vehicle-related endpoints
 */
export const vehiclesRoutes = router;
