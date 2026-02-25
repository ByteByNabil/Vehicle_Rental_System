import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

// ===============================
// AUTH SERVICES
// ===============================
/**
 * authServices
 * - Contains all authentication-related business logic
 * - Handles signup, signin, password hashing, and JWT token generation
 * - Interacts directly with the database
 */

// ===============================
// SIGN UP SERVICE
// ===============================
/**
 * signUpUser
 * - Registers a new user in the system
 * - Validates required fields: name, email, password, phone
 * - Ensures password length >= 6
 * - Checks if email already exists (must be unique)
 * - Hashes password before storing
 * - Inserts new user as 'customer'
 * - Returns newly created user record
 */
const signUpUser = async (
  name: string,
  email: string,
  password: string,
  phone: string,
) => {
  // ===============================
  // VALIDATE REQUIRED FIELDS
  // ===============================
  /**
   * Throws error if any field is missing
   */
  if (!name || !email || !password || !phone) {
    throw new Error("Missing required fields");
  }

  // ===============================
  // PASSWORD LENGTH VALIDATION
  // ===============================
  /**
   * Ensures password is at least 6 characters
   */
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  // ===============================
  // NORMALIZE EMAIL
  // ===============================
  /**
   * Converts email to lowercase to maintain uniqueness
   */
  const normalizedEmail = email.toLowerCase();

  // ===============================
  // CHECK EMAIL EXISTENCE
  // ===============================
  /**
   * Queries DB to check if email is already registered
   * Throws error if email exists
   */
  const existingUser = await pool.query(
    `SELECT id FROM users WHERE email = $1`,
    [normalizedEmail],
  );

  if (existingUser.rows.length > 0) {
    throw new Error("Email already exists");
  }

  // ===============================
  // HASH PASSWORD
  // ===============================
  /**
   * Uses bcrypt to hash password securely
   * Salt rounds = 10
   */
  const hashedPass = await bcrypt.hash(password, 10);

  // ===============================
  // INSERT NEW USER INTO DATABASE
  // ===============================
  /**
   * Inserts user into 'users' table
   * Role is always 'customer' on signup
   * Returns inserted user record
   */
  const result = await pool.query(
    `
    INSERT INTO users (name, email, password, phone, role)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *
    `,
    [name, normalizedEmail, hashedPass, phone, "customer"],
  );

  return result;
};

// ===============================
// SIGN IN SERVICE
// ===============================
/**
 * signInUser
 * - Authenticates an existing user
 * - Validates email and password presence
 * - Checks user exists in DB
 * - Verifies password
 * - Generates JWT token if authentication succeeds
 * - Returns user info without password + token
 */
const signInUser = async (email: string, password: string) => {
  // ===============================
  // VALIDATE REQUIRED FIELDS
  // ===============================
  /**
   * Throws error if email or password is missing
   */
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  // ===============================
  // NORMALIZE EMAIL
  // ===============================
  /**
   * Converts email to lowercase for DB lookup
   */
  const normalizedEmail = email.toLowerCase();

  // ===============================
  // FETCH USER FROM DATABASE
  // ===============================
  /**
   * Queries 'users' table for user by email
   * Throws error if user not found
   */
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    normalizedEmail,
  ]);

  if (result.rows.length === 0) {
    throw new Error("Invalid credentials");
  }

  const user = result.rows[0];

  // ===============================
  // VERIFY PASSWORD
  // ===============================
  /**
   * Compares provided password with hashed password in DB
   * Throws error if mismatch
   */
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("Invalid credentials");
  }

  // ===============================
  // CHECK JWT SECRET CONFIG
  // ===============================
  /**
   * Ensures JWT secret exists in config
   */
  if (!config.jwtSecret) {
    throw new Error("JWT secret not configured");
  }

  // ===============================
  // GENERATE JWT TOKEN
  // ===============================
  /**
   * Creates token containing user id, name, email, and role
   * Token expires in 7 days
   */
  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: "7d" },
  );

  // ===============================
  // REMOVE PASSWORD FROM RESPONSE
  // ===============================
  /**
   * Excludes password field before returning user info
   */
  const { password: _, ...userWithoutPassword } = user;

  // ===============================
  // RETURN TOKEN AND USER INFO
  // ===============================
  /**
   * Returns object with JWT token and user details
   */
  return { token, user: userWithoutPassword };
};

// ===============================
// EXPORT AUTH SERVICES
// ===============================
/**
 * authServices
 * - Exports signUpUser and signInUser functions
 */
export const authServices = {
  signUpUser,
  signInUser,
};
