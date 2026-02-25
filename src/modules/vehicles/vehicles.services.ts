import { pool } from "../../config/db";

// ===============================
// VEHICLES SERVICES
// ===============================
/**
 * vehiclesServices
 * - Handles all database operations for vehicles
 * - Includes create, read, update, delete (CRUD) operations
 * - Checks for active bookings before deletion
 * - Returns full vehicle data from DB, service never handles role checks
 */

// ===============================
// CREATE VEHICLE
// ===============================
/**
 * createVehicles
 * - Inserts a new vehicle into the vehicles table
 * - Parameters: vehicle_name, type, registration_number, daily_rent_price, availability_status
 * - Returns: full newly created vehicle record
 */
const createVehicles = async (
  vehicle_name: string,
  type: string,
  registration_number: string,
  daily_rent_price: string,
  availability_status: string,
) => {
  const result = await pool.query(
    `
    INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) 
    VALUES($1,$2,$3,$4,$5) 
    RETURNING *
    `,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ],
  );
  return result;
};

// ===============================
// GET ALL VEHICLES
// ===============================
/**
 * getAllVehicles
 * - Fetches all vehicles from the database
 * - Returns: array of vehicle records
 */
const getAllVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles`);
  return result;
};

// ===============================
// GET VEHICLE BY ID
// ===============================
/**
 * getVehiclesById
 * - Fetches a single vehicle by its ID
 * - Parameters: vehicleId
 * - Returns: vehicle record if found
 */
const getVehiclesById = async (vehicleId: string) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [
    vehicleId,
  ]);
  return result;
};

// ===============================
// UPDATE VEHICLE BY ID
// ===============================
/**
 * updateVehicleById
 * - Updates vehicle fields
 * - Parameters: vehicle_name, type, registration_number, daily_rent_price, availability_status, vehicleId
 * - Uses COALESCE to only update provided fields
 * - Updates updated_at timestamp
 * - Returns: updated vehicle record
 */
const updateVehicleById = async (
  vehicle_name: string,
  type: string,
  registration_number: string,
  daily_rent_price: string,
  availability_status: string,
  vehicleId: string,
) => {
  const result = await pool.query(
    `
    UPDATE vehicles
    SET
      vehicle_name = COALESCE($1, vehicle_name),
      type = COALESCE($2, type),
      registration_number = COALESCE($3, registration_number),
      daily_rent_price = COALESCE($4, daily_rent_price),
      availability_status = COALESCE($5, availability_status),
      updated_at = NOW()
    WHERE id = $6
    RETURNING *
    `,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      vehicleId,
    ],
  );
  return result;
};

// ===============================
// DELETE VEHICLE BY ID
// ===============================
/**
 * deleteVehicleById
 * - Deletes a vehicle safely
 * - Checks for active bookings before deletion
 * - Throws error if active bookings exist
 * - Parameters: vehicleId
 * - Returns: deleted vehicle record
 */
const deleteVehicleById = async (vehicleId: string) => {
  // ===============================
  // CHECK ACTIVE BOOKINGS
  // ===============================
  const bookingCheck = await pool.query(
    `
    SELECT * FROM bookings 
    WHERE vehicle_id = $1 AND status = 'active'
    `,
    [vehicleId],
  );

  if (bookingCheck.rows.length > 0) {
    throw new Error("Vehicle has active bookings");
  }

  // ===============================
  // DELETE VEHICLE
  // ===============================
  const result = await pool.query(
    `
    DELETE FROM vehicles 
    WHERE id = $1 
    RETURNING *
    `,
    [vehicleId],
  );

  return result;
};

// ===============================
// EXPORT VEHICLES SERVICES
// ===============================
/**
 * vehiclesServices
 * - Exports all vehicle database operations
 */
export const vehiclesServices = {
  createVehicles,
  getAllVehicles,
  getVehiclesById,
  updateVehicleById,
  deleteVehicleById,
};
