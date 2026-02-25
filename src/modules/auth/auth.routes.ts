import express from "express";
import { authController } from "./auth.controllers";

// ===============================
// AUTH ROUTES
// ===============================
/**
 * AUTH ROUTER
 * - Handles authentication-related endpoints
 * - Includes user registration and login
 */
const router = express.Router();

// ===============================
// USER SIGN UP
// ===============================
/**
 * POST /signup
 * - Register new user (default role: customer)
 * - Creates account with hashed password
 */
router.post("/signup", authController.signUpUser);

// ===============================
// USER SIGN IN
// ===============================
/**
 * POST /signin
 * - Authenticate user
 * - Returns JWT token on successful login
 */
router.post("/signin", authController.signInUser);

// ===============================
// EXPORT AUTH ROUTES
// ===============================
export const authRoutes = router;
