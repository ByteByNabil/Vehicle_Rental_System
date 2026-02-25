import { pool } from "../../config/db";

// ===============================
// BOOKINGS SERVICES
// ===============================
/**
 * bookingServices
 * - Handles all database operations for bookings
 * - Includes creation, retrieval, update, and automatic status updates
 * - Handles role-based restrictions (Admin vs Customer)
 * - Automatically updates vehicle availability
 */

// ===============================
// AUTO RETURN EXPIRED BOOKINGS
// ===============================
/**
 * autoReturnExpiredBookings
 * - Checks for active bookings whose rent_end_date has passed
 * - Marks such bookings as 'returned'
 * - Updates associated vehicle availability_status to 'available'
 * - Runs automatically before fetching bookings
 */
const autoReturnExpiredBookings = async () => {
  // Update bookings that have expired
  const expired = await pool.query(`
    UPDATE bookings
    SET status = 'returned'
    WHERE status = 'active'
      AND rent_end_date < CURRENT_DATE
    RETURNING vehicle_id
  `);

  // Update vehicles to available
  for (const row of expired.rows) {
    await pool.query(
      `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
      [row.vehicle_id],
    );
  }
};

// ===============================
// CREATE BOOKING
// ===============================
/**
 * createBookings
 * - Inserts a new booking into the database
 * - Role restrictions enforced by controller
 * - Validates required fields: customer_id, vehicle_id, rent_start_date, rent_end_date
 * - Checks vehicle existence and availability
 * - Checks for overlapping active bookings
 * - Calculates total_price based on days and vehicle.daily_rent_price
 * - Updates vehicle availability_status to 'booked'
 * - Returns newly created booking
 */
const createBookings = async (data: any) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = data;

  if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
    throw new Error("Missing required fields");
  }

  const start = new Date(rent_start_date);
  const end = new Date(rent_end_date);

  if (end <= start) {
    throw new Error("Invalid rental dates");
  }

  // Check vehicle exists & is available
  const vehicleRes = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [
    vehicle_id,
  ]);

  if (vehicleRes.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  const vehicle = vehicleRes.rows[0];

  if (vehicle.availability_status !== "available") {
    throw new Error("Vehicle is not available");
  }

  // Check for overlapping bookings
  const overlapCheck = await pool.query(
    `
    SELECT id FROM bookings
    WHERE vehicle_id = $1
      AND status = 'active'
      AND NOT (
        $3 <= rent_start_date
        OR
        $2 >= rent_end_date
      )
    `,
    [vehicle_id, rent_end_date, rent_start_date],
  );

  if (overlapCheck.rows.length > 0) {
    throw new Error("Vehicle already booked for selected dates");
  }

  // Calculate total price
  const days = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );

  const total_price = days * Number(vehicle.daily_rent_price);

  // Insert booking
  const booking = await pool.query(
    `
    INSERT INTO bookings
    (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
    VALUES ($1,$2,$3,$4,$5,'active')
    RETURNING *
    `,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price],
  );

  // Update vehicle availability
  await pool.query(
    `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
    [vehicle_id],
  );

  return booking;
};

// ===============================
// GET ALL BOOKINGS (ADMIN)
// ===============================
/**
 * getAllBookings
 * - Fetches all bookings with customer and vehicle details
 * - Calls autoReturnExpiredBookings() before fetching
 * - Returns bookings ordered by id DESC
 */
const getAllBookings = async () => {
  await autoReturnExpiredBookings();

  return await pool.query(`
    SELECT 
      b.id,
      b.customer_id,
      b.vehicle_id,
      b.rent_start_date,
      b.rent_end_date,
      b.total_price,
      b.status,
      json_build_object(
        'name', u.name,
        'email', u.email
      ) AS customer,
      json_build_object(
        'vehicle_name', v.vehicle_name,
        'registration_number', v.registration_number
      ) AS vehicle
    FROM bookings b
    JOIN users u ON b.customer_id = u.id
    JOIN vehicles v ON b.vehicle_id = v.id
    ORDER BY b.id DESC
  `);
};

// ===============================
// GET CUSTOMER BOOKINGS
// ===============================
/**
 * getBookingsByCustomer
 * - Fetches bookings for a specific customer
 * - Calls autoReturnExpiredBookings() before fetching
 * - Returns bookings ordered by id DESC
 */
const getBookingsByCustomer = async (customerId: number) => {
  await autoReturnExpiredBookings();

  return await pool.query(
    `
    SELECT 
      b.id,
      b.vehicle_id,
      b.rent_start_date,
      b.rent_end_date,
      b.total_price,
      b.status,
      json_build_object(
        'vehicle_name', v.vehicle_name,
        'registration_number', v.registration_number,
        'type', v.type
      ) AS vehicle
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.customer_id = $1
    ORDER BY b.id DESC
    `,
    [customerId],
  );
};

// ===============================
// GET BOOKING BY ID
// ===============================
/**
 * getBookingById
 * - Fetches a single booking by its ID
 * - Returns the raw booking record
 */
const getBookingById = async (bookingId: string) => {
  return await pool.query(`SELECT * FROM bookings WHERE id = $1`, [bookingId]);
};

// ===============================
// UPDATE BOOKING
// ===============================
/**
 * updateBookings
 * - Role-based booking update:
 *    Customer → can only cancel before start date
 *    Admin → can only mark as returned
 * - Updates booking status and vehicle availability accordingly
 * - Throws error if operation is invalid
 * - Returns updated booking
 */
const updateBookings = async (data: any, bookingId: string, role: string) => {
  const bookingRes = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [
    bookingId,
  ]);

  if (bookingRes.rows.length === 0) {
    throw new Error("Booking not found");
  }

  const booking = bookingRes.rows[0];

  // ===============================
  // CUSTOMER → Cancel Before Start
  // ===============================
  if (role === "customer") {
    if (data.status !== "cancelled") {
      throw new Error("Customer can only cancel booking");
    }

    const today = new Date();
    const startDate = new Date(booking.rent_start_date);

    if (today >= startDate) {
      throw new Error("Cannot cancel after rental has started");
    }

    const updated = await pool.query(
      `
      UPDATE bookings
      SET status = 'cancelled'
      WHERE id = $1
      RETURNING *
      `,
      [bookingId],
    );

    await pool.query(
      `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
      [booking.vehicle_id],
    );

    return updated;
  }

  // ===============================
  // ADMIN → Mark Returned
  // ===============================
  if (role === "admin") {
    if (data.status !== "returned") {
      throw new Error("Admin can only mark booking as returned");
    }

    const updated = await pool.query(
      `
      UPDATE bookings
      SET status = 'returned'
      WHERE id = $1
      RETURNING *
      `,
      [bookingId],
    );

    await pool.query(
      `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
      [booking.vehicle_id],
    );

    return updated;
  }

  throw new Error("Invalid operation");
};

// ===============================
// EXPORT BOOKING SERVICES
// ===============================
/**
 * bookingServices
 * - Exports all booking service functions
 */
export const bookingServices = {
  createBookings,
  getAllBookings,
  getBookingsByCustomer,
  getBookingById,
  updateBookings,
};
