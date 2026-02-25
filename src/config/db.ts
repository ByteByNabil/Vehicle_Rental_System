import { Pool } from "pg";
import config from ".";
import bcrypt from "bcryptjs";

// ===============================
// DATABASE CONNECTION SETUP
// ===============================
/**
 * Create PostgreSQL connection pool
 * - Uses connection string from config
 * - Shared across entire application
 */
export const pool = new Pool({
  connectionString: `${config.connection_str}`,
});

// ===============================
// INITIALIZE DATABASE
// ===============================
/**
 * Initialize Database Tables
 * - Creates users, vehicles, bookings tables if not exists
 * - Seeds default admin if not present
 */
const initDB = async () => {
  // ===============================
  // USERS TABLE CREATION
  // ===============================
  /**
   * USERS TABLE
   * - Stores all system users (admin & customer)
   * - Email must be unique and lowercase
   * - Password must be minimum 6 characters
   * - Role restricted to 'admin' or 'customer'
   * - Timestamps auto-generated
   */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL CHECK(email = LOWER(email)),
      password TEXT NOT NULL CHECK(LENGTH(password)>= 6),
      phone VARCHAR(15),
      role VARCHAR(50) NOT NULL CHECK(role IN ('admin', 'customer')) DEFAULT 'customer',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // ===============================
  // DEFAULT ADMIN CHECK & SEED
  // ===============================
  /**
   * Ensure at least one Admin exists
   * - Check if any admin user exists
   * - If not, create a default admin
   * - Password is hashed before storing
   */
  const adminCheck = await pool.query(
    `SELECT * FROM users WHERE role = 'admin' LIMIT 1`,
  );

  if (adminCheck.rows.length === 0) {
    // Hash default password
    const hashedPass = await bcrypt.hash("$2a$10$yourHashedPasswordHere", 10);

    await pool.query(
      `
      INSERT INTO users (name, email, password, phone, role)
      VALUES ($1,$2,$3,$4,$5)
      `,
      [
        "Kamruddin Nabil",
        "nabil873@gmail.com",
        hashedPass,
        "+8801823561868",
        "admin",
      ],
    );

    // console.log("Default admin created.");
  }

  // ===============================
  // VEHICLES TABLE CREATION
  // ===============================
  /**
   * VEHICLES TABLE
   * - Stores all rental vehicles
   * - Type restricted to car, bike, van, SUV
   * - Registration number must be unique
   * - Daily rent must be positive
   * - Availability status controlled by booking system
   */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS vehicles(
      id SERIAL PRIMARY KEY,
      vehicle_name VARCHAR(100) NOT NULL,
      type VARCHAR(20) NOT NULL CHECK(type IN ('car', 'bike', 'van', 'SUV')),
      registration_number VARCHAR(50) UNIQUE NOT NULL,
      daily_rent_price NUMERIC(10,2) NOT NULL CHECK(daily_rent_price > 0),
      availability_status VARCHAR(20) NOT NULL DEFAULT 'available'
      CHECK(availability_status IN ('available', 'booked')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // ===============================
  // BOOKINGS TABLE CREATION
  // ===============================
  /**
   * BOOKINGS TABLE
   * - Links customers to vehicles
   * - rent_end_date must be after rent_start_date
   * - total_price must be positive
   * - Status restricted to active, cancelled, returned
   * - Foreign keys reference users and vehicles
   */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings(
      id SERIAL PRIMARY KEY,
      customer_id INT REFERENCES users(id),
      vehicle_id INT REFERENCES vehicles(id),
      rent_start_date DATE NOT NULL,
      rent_end_date DATE NOT NULL CHECK(rent_end_date > rent_start_date),
      total_price NUMERIC(10,2) NOT NULL CHECK(total_price > 0),
      status VARCHAR(15) NOT NULL DEFAULT 'active'
      CHECK(status IN ('active', 'cancelled', 'returned')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

export default initDB;
