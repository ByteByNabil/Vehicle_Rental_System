import express, { Request, Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });
const app = express();
const port = 5000;

const pool = new Pool({
  connectionString: `${process.env.CONNECTION_STRING}`,
});

// Create Tables if not exists
const initDB = async () => {
  // User Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL CHECK(email = LOWER(email)),
      password VARCHAR(255) NOT NULL CHECK(LENGTH(password)>= 6),
      phone VARCHAR(15),
      role VARCHAR(50) NOT NULL CHECK(role IN ('admin', 'customer')) DEFAULT 'customer'
    );
  `);

  // Vehicles Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS vehicles(
      id SERIAL PRIMARY KEY,
      vehicle_name VARCHAR(100) NOT NULL,
      type VARCHAR(20) NOT NULL CHECK(type IN ('car', 'bike', 'van', 'SUV')),
      registration_number VARCHAR(50) UNIQUE NOT NULL,
      daily_rent_price NUMERIC(10,2) NOT NULL CHECK(daily_rent_price > 0),
      availability_status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK(availability_status IN ('available', 'booked'))
    );
  `);

  // Bookings Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings(
      id SERIAL PRIMARY KEY,
      customer_id INT REFERENCES users(id) ON DELETE CASCADE,
      vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
      rent_start_date DATE NOT NULL,
      rent_end_date DATE NOT NULL CHECK(rent_end_date > rent_start_date),
      total_price NUMERIC(10,2) NOT NULL CHECK(total_price > 0),
      status VARCHAR(15) NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'completed', 'cancelled'))
    );
  `);
};

initDB();

// parser
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Next Level Developers!");
});

app.post("/", (req: Request, res: Response) => {
  console.log(req.body);

  res.status(201).json({
    success: true,
    message: "Api is working fine",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
