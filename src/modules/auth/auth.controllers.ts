import { Request, Response } from "express";
import { authServices } from "./auth.services";

// ===============================
// SIGN UP USER CONTROLLER
// ===============================
/**
 * signUpUser
 * - Handles user registration
 * - Validates required fields: name, email, password
 * - Calls authServices.signUpUser to insert user into DB
 * - Hides password in response
 * - Returns 201 status on success, 400 on failure
 */
const signUpUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;

    // ===============================
    // FIELD VALIDATION
    // ===============================
    /**
     * Ensures name, email, and password are provided
     * Responds with 400 if any required field is missing
     */
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // ===============================
    // CALL SERVICE TO CREATE USER
    // ===============================
    /**
     * Calls authServices.signUpUser to insert the new user into the database
     * Expects result.rows[0] to contain the newly created user
     */
    const result = await authServices.signUpUser(name, email, password, phone);

    // ===============================
    // REMOVE PASSWORD FROM RESPONSE
    // ===============================
    /**
     * Excludes password from API response for security
     */
    const { password: _, ...safeUser } = result.rows[0];

    // ===============================
    // SUCCESS RESPONSE
    // ===============================
    /**
     * Sends a 201 response with the newly created user data (excluding password)
     */
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: safeUser,
    });
  } catch (err: any) {
    // ===============================
    // ERROR HANDLING
    // ===============================
    /**
     * Sends a 400 response if any error occurs during signup
     */
    res.status(400).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

// ===============================
// SIGN IN USER CONTROLLER
// ===============================
/**
 * signInUser
 * - Handles user login
 * - Validates required fields: email, password
 * - Calls authServices.signInUser to verify credentials
 * - Returns 200 on success, 401 if credentials are invalid
 */
const signInUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // ===============================
    // FIELD VALIDATION
    // ===============================
    /**
     * Ensures both email and password are provided
     * Responds with 400 if missing
     */
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // ===============================
    // CALL SERVICE TO LOGIN USER
    // ===============================
    /**
     * Calls authServices.signInUser to authenticate user credentials
     * Expects service to return user data and/or token
     */
    const result = await authServices.signInUser(email, password);

    // ===============================
    // SUCCESS RESPONSE
    // ===============================
    /**
     * Sends 200 response with user data and authentication info
     */
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (err: any) {
    // ===============================
    // ERROR HANDLING
    // ===============================
    /**
     * Sends 401 response if login fails due to invalid credentials
     */
    res.status(401).json({
      success: false,
      message: err.message || "Invalid credentials",
    });
  }
};

// ===============================
// EXPORT CONTROLLERS
// ===============================
/**
 * authController
 * - Exports signup and signin controller functions
 */
export const authController = {
  signUpUser,
  signInUser,
};
