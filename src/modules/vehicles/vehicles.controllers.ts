import { Request, Response } from "express";
import { vehiclesServices } from "./vehicles.services";

// ===============================
// VEHICLES CONTROLLERS
// ===============================
/**
 * vehiclesControllers
 * - Handles all vehicle-related API requests
 * - Calls corresponding vehiclesServices functions
 * - Handles success, error, and not found responses
 * - Role-based access is enforced in routes via auth middleware
 */

// ===============================
// CREATE VEHICLE (ADMIN ONLY)
// ===============================
/**
 * createVehicles
 * - Endpoint: POST /api/v1/vehicles
 * - Role restriction: Admin only (checked in route)
 * - Body parameters: vehicle_name, type, registration_number, daily_rent_price, availability_status
 * - Calls vehiclesServices.createVehicles to insert a new vehicle
 * - Returns 201 with created vehicle data on success
 * - Returns 500 on internal server error
 */
const createVehicles = async (req: Request, res: Response) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = req.body;

  try {
    const result = await vehiclesServices.createVehicles(
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    );

    res.status(201).json({
      success: true,
      message: "Vehicles Created Successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "internal server error",
    });
  }
};

// ===============================
// GET ALL VEHICLES
// ===============================
/**
 * getAllVehicles
 * - Endpoint: GET /api/v1/vehicles
 * - Returns list of all vehicles
 * - Calls vehiclesServices.getAllVehicles
 * - Returns 200 with array of vehicles
 * - Returns 500 on internal server error
 */
const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.getAllVehicles();
    res.status(200).json({
      success: true,
      message: "Vehicles fetched successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "internal server error",
      details: err,
    });
  }
};

// ===============================
// GET VEHICLE BY ID
// ===============================
/**
 * getVehiclesById
 * - Endpoint: GET /api/v1/vehicles/:vehicleId
 * - Returns a single vehicle by ID
 * - Calls vehiclesServices.getVehiclesById
 * - Returns 404 if vehicle not found
 * - Returns 200 with vehicle data if found
 * - Returns 500 on internal server error
 */
const getVehiclesById = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.getVehiclesById(
      req.params.vehicleId as string,
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle fetched successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "internal server error",
      details: err,
    });
  }
};

// ===============================
// UPDATE VEHICLE BY ID (ADMIN ONLY)
// ===============================
/**
 * updateVehicleById
 * - Endpoint: PUT /api/v1/vehicles/:vehicleId
 * - Role restriction: Admin only (checked in route)
 * - Body parameters: vehicle_name, type, registration_number, daily_rent_price, availability_status
 * - Calls vehiclesServices.updateVehicleById
 * - Returns 404 if vehicle not found
 * - Returns 200 with updated vehicle data if successful
 * - Returns 500 on internal server error
 */
const updateVehicleById = async (req: Request, res: Response) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = req.body;

  try {
    const result = await vehiclesServices.updateVehicleById(
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      req.params.vehicleId as string,
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicles updated successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "internal server error",
      details: err,
    });
  }
};

// ===============================
// DELETE VEHICLE BY ID (ADMIN ONLY)
// ===============================
/**
 * deleteVehicleById
 * - Endpoint: DELETE /api/v1/vehicles/:vehicleId
 * - Role restriction: Admin only (checked in route)
 * - Calls vehiclesServices.deleteVehicleById
 * - Cannot delete vehicle if it has active bookings (service throws error)
 * - Returns 404 if vehicle not found
 * - Returns 400 if vehicle has active bookings
 * - Returns 200 with deleted vehicle data if successful
 * - Returns 500 on internal server error
 */
const deleteVehicleById = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.deleteVehicleById(
      req.params.vehicleId as string,
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    if (err.message === "Vehicle has active bookings") {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ===============================
// EXPORT VEHICLES CONTROLLERS
// ===============================
/**
 * vehiclesControllers
 * - Exports all vehicle controller functions
 */
export const vehiclesControllers = {
  createVehicles,
  getAllVehicles,
  getVehiclesById,
  updateVehicleById,
  deleteVehicleById,
};
