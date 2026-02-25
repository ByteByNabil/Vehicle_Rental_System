import { pool } from "../../config/db";
import bcrypt from "bcryptjs";

// ===============================
// USER SERVICES
// ===============================
/**
 * userServices
 * - Contains all user-related database operations
 * - Never returns password in any response
 * - Handles admin and customer restrictions at controller level
 */

// ===============================
// GET ALL USERS (ADMIN ONLY)
// ===============================
/**
 * getAllUsers
 * - Fetches all users from the database
 * - Admin-only endpoint (role checked in controller)
 * - Returns: id, name, email, phone, role, created_at
 * - Orders by id ascending
 */
const getAllUsers = async () => {
  const result = await pool.query(
    `
    SELECT id, name, email, phone, role, created_at
    FROM users
    ORDER BY id ASC
    `,
  );

  return result;
};

// ===============================
// GET USER BY ID
// ===============================
/**
 * getUserById
 * - Fetches single user by ID
 * - Admin or Own profile (checked in controller)
 * - Never returns password
 * - Returns: id, name, email, phone, role, created_at
 */
const getUserById = async (userId: string) => {
  const result = await pool.query(
    `
    SELECT id, name, email, phone, role, created_at
    FROM users
    WHERE id = $1
    `,
    [userId],
  );

  return result;
};

// ===============================
// UPDATE USER (ADMIN OR OWN)
// ===============================
/**
 * updateUserById
 * - Updates user fields in the database
 * - Hashes password if provided
 * - Only admin can update role (controller ensures this)
 * - Never returns password
 * - Uses COALESCE to only update provided fields
 */
const updateUserById = async (
  name: string | undefined,
  email: string | undefined,
  password: string | undefined,
  phone: string | undefined,
  role: string | undefined,
  userId: string,
) => {
  // ===============================
  // HASH PASSWORD IF PROVIDED
  // ===============================
  let hashedPassword: string | undefined;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  // ===============================
  // UPDATE USER IN DATABASE
  // ===============================
  const result = await pool.query(
    `
    UPDATE users
    SET
      name = COALESCE($1, name),
      email = COALESCE($2, email),
      password = COALESCE($3, password),
      phone = COALESCE($4, phone),
      role = COALESCE($5, role),
      updated_at = NOW()
    WHERE id = $6
    RETURNING id, name, email, phone, role, updated_at
    `,
    [name, email, hashedPassword, phone, role, userId],
  );

  return result;
};

// ===============================
// DELETE USER (ADMIN ONLY)
// ===============================
/**
 * deleteUserById
 * - Deletes a user safely
 * - Admin-only (role checked in controller)
 * - Cannot delete if user has active bookings
 * - Never returns password
 */
const deleteUserById = async (userId: string) => {
  // ===============================
  // CHECK ACTIVE BOOKINGS
  // ===============================
  /**
   * Queries bookings table for active bookings
   * Throws error if any active booking exists
   */
  const bookingCheck = await pool.query(
    `
    SELECT id
    FROM bookings
    WHERE customer_id = $1
      AND status = 'active'
    `,
    [userId],
  );

  if (bookingCheck.rows.length > 0) {
    throw new Error("User has active bookings and cannot be deleted");
  }

  // ===============================
  // DELETE USER FROM DATABASE
  // ===============================
  const result = await pool.query(
    `
    DELETE FROM users
    WHERE id = $1
    RETURNING id, name, email, phone, role
    `,
    [userId],
  );

  return result;
};

// ===============================
// EXPORT USER SERVICES
// ===============================
/**
 * userServices
 * - Exports all service functions for user management
 */
export const userServices = {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
