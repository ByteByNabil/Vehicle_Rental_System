import { Request, Response } from "express";
import { pool } from "../../config/db";
import { userServices } from "./users.services";

// ===============================
// USER CONTROLLERS
// ===============================
/**
 * userControllers
 * - Handles all user-related API requests
 * - Calls corresponding userServices functions
 * - Handles role-based access, ownership checks, and error responses
 */

// ===============================
// GET ALL USERS (ADMIN ONLY)
// ===============================
/**
 * getAllUsers
 * - Endpoint: GET /api/v1/users
 * - Role restriction: Admin only
 * - Returns list of all users in the system
 */
const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Call service to fetch all users
    const result = await userServices.getAllUsers();

    // Respond with 200 and user list
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: result.rows,
    });
  } catch (err: any) {
    // Internal server error handling
    res.status(500).json({
      success: false,
      message: err.message || "internal server error",
      details: err,
    });
  }
};

// ===============================
// GET USER BY ID (ADMIN OR OWN PROFILE)
// ===============================
/**
 * getUserById
 * - Endpoint: GET /api/v1/users/:userId
 * - Role restriction: Admin can view any user; customer can view own profile only
 * - Returns single user data or error if not found
 */
const getUserById = async (req: Request, res: Response) => {
  const requestedUserId = req.params.userId;
  const loggedInUser = req.user;

  // ===============================
  // AUTH CHECK
  // ===============================
  if (!loggedInUser) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  // ===============================
  // OWNERSHIP CHECK FOR CUSTOMER
  // ===============================
  if (
    loggedInUser.role === "customer" &&
    Number(loggedInUser.id) !== Number(requestedUserId)
  ) {
    return res.status(403).json({
      success: false,
      message: "Forbidden: You can only view your own profile",
    });
  }

  try {
    // Call service to fetch user by ID
    const result = await userServices.getUserById(requestedUserId as string);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Respond with user data
    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    // Internal server error handling
    res.status(500).json({
      success: false,
      message: err.message || "internal server error",
      details: err,
    });
  }
};

// ===============================
// UPDATE USER BY ID (ADMIN OR OWN PROFILE)
// ===============================
/**
 * updateUserById
 * - Endpoint: PUT /api/v1/users/:userId
 * - Role restriction: Admin can update any user; customer can update own profile only
 * - Only admin can update role
 * - Updates user data in DB and returns updated record
 */
const updateUserById = async (req: Request, res: Response) => {
  const { name, email, password, phone, role } = req.body;
  const requestedUserId = req.params.userId;
  const loggedInUser = req.user;

  // ===============================
  // AUTH CHECK
  // ===============================
  if (!loggedInUser) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  // ===============================
  // OWNERSHIP CHECK FOR CUSTOMER
  // ===============================
  if (
    loggedInUser.role === "customer" &&
    Number(loggedInUser.id) !== Number(requestedUserId)
  ) {
    return res.status(403).json({
      success: false,
      message: "Forbidden: You can only update your own profile",
    });
  }

  // Only admin can update role
  const roleToUpdate = loggedInUser.role === "admin" ? role : undefined;

  try {
    // Call service to update user
    const result = await userServices.updateUserById(
      name,
      email,
      password,
      phone,
      roleToUpdate,
      requestedUserId as string,
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Respond with updated user data
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    // Internal server error handling
    res.status(500).json({
      success: false,
      message: err.message || "internal server error",
      details: err,
    });
  }
};

// ===============================
// DELETE USER BY ID (ADMIN ONLY, NO ACTIVE BOOKINGS)
// ===============================
/**
 * deleteUserById
 * - Endpoint: DELETE /api/v1/users/:userId
 * - Role restriction: Admin only
 * - Checks if user has active bookings before deletion
 * - Deletes user from DB and returns confirmation
 */
const deleteUserById = async (req: Request, res: Response) => {
  const requestedUserId = req.params.userId;
  const loggedInUser = req.user;

  // ===============================
  // AUTH CHECK
  // ===============================
  if (!loggedInUser) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  if (loggedInUser.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Only admin can delete users",
    });
  }

  try {
    // ===============================
    // CHECK ACTIVE BOOKINGS
    // ===============================
    /**
     * User cannot be deleted if they have active bookings
     */
    const bookingCheck = await pool.query(
      `SELECT id FROM bookings WHERE customer_id = $1 AND status = 'active'`,
      [Number(requestedUserId)],
    );

    if (bookingCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User has active bookings and cannot be deleted",
      });
    }

    // Call service to delete user
    const result = await userServices.deleteUserById(requestedUserId as string);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Respond with success
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: result.rows,
    });
  } catch (err: any) {
    // Internal server error handling
    res.status(500).json({
      success: false,
      message: err.message || "internal server error",
      details: err,
    });
  }
};

// ===============================
// EXPORT USER CONTROLLERS
// ===============================
/**
 * userControllers
 * - Exports all user controller functions
 */
export const userControllers = {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
