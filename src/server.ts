import express, { NextFunction, Request, Response } from "express";
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

// logger middleware
const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}\n`);
  next();
};

// parser
app.use(express.json());

app.get("/", logger, (req: Request, res: Response) => {
  res.send("Hello Next Level Developers!");
});

// User CRUD Operations

// Post Users CRUD Operations
app.post("/api/v1/users", async (req: Request, res: Response) => {
  const { name, email, password, phone, role } = req.body;
  try {
    const result = await pool.query(
      `
      INSERT INTO users (name, email, password, phone,role) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [name, email, password, phone, role],
    );
    // console.log(result.rows[0]);
    res.status(201).json({
      success: true,
      message: "Users Created Successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "internal server error",
    });
  }
});

// Get Users CRUD Operations
app.get("/api/v1/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users`);
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "internal server error",
      details: err,
    });
  }
});

// Get User by ID CRUD Operations
app.get("/api/v1/users/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      req.params.id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "internal server error",
      details: err,
    });
  }
});

// Update User by ID CRUD Operations
app.put("/api/v1/users/:userId", async (req: Request, res: Response) => {
  const { name, email, password, phone, role } = req.body;
  try {
    const result = await pool.query(
      `UPDATE users SET name = $1, email = $2, password = $3, phone = $4, role = $5 WHERE id = $6 RETURNING *`,
      [name, email, password, phone, role, req.params.userId],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Users updated successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "internal server error",
      details: err,
    });
  }
});

// Delete User by ID CRUD Operations
app.delete("/api/v1/users/:userId", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`DELETE FROM users WHERE id = $1 `, [
      req.params.userId,
    ]);
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Users deleted successfully",
        data: result.rows,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "internal server error",
      details: err,
    });
  }
});

// Vehicles CRUD Operations

//Post vehicles CRUD operations
app.post("/api/v1/vehicles", async (req: Request, res: Response) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1,$2,$3,$4,$5) RETURNING *`,
      [
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status,
      ],
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
});

// Get vehicles CRUD operations
app.get("/api/v1/vehicles", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM vehicles`);
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
});

// Get vehicle by ID CRUD operations
app.get("/api/v1/vehicles/:vehicleId", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [
      req.params.vehicleId,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle fetched successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "internal server error",
      details: err,
    });
  }
});

// Update vehicle by ID CRUD operations
app.put("/api/v1/vehicles/:vehicleId", async (req: Request, res: Response) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = req.body;
  try {
    const result = await pool.query(
      `UPDATE vehicles SET vehicle_name = $1, type = $2, registration_number = $3, daily_rent_price = $4, availability_status = $5 WHERE id = $6 RETURNING *`,
      [
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status,
        req.params.vehicleId,
      ],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicles updated successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "internal server error",
      details: err,
    });
  }
});

// Delete vehicle by ID CRUD operations
app.delete(
  "/api/v1/vehicles/:vehicleId",
  async (req: Request, res: Response) => {
    try {
      const result = await pool.query(`DELETE FROM vehicles WHERE id = $1 `, [
        req.params.vehicleId,
      ]);
      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Vehicle not found",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Vehicles deleted successfully",
          data: result.rows,
        });
      }
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message || "internal server error",
        details: err,
      });
    }
  },
);

// Bookings CRUD Operations

// Post bookings CRUD operations
app.post("/api/v1/bookings", async (req: Request, res: Response) => {
  const {
    customer_id,
    vehicle_id,
    rent_start_date,
    rent_end_date,
    total_price,
    status,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
      [
        customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date,
        total_price,
        status,
      ],
    );
    res.status(201).json({
      success: true,
      message: "Bookings Created Successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "internal server error",
    });
  }
});

// Get bookings CRUD operations
app.get("/api/v1/bookings", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM bookings`);
    res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "internal server error",
      details: err,
    });
  }
});

// Put booking by ID CRUD operations
app.put("/api/v1/bookings/:bookingId", async (req: Request, res: Response) => {
  const {
    customer_id,
    vehicle_id,
    rent_start_date,
    rent_end_date,
    total_price,
    status,
  } = req.body;
  try {
    const result = await pool.query(
      `UPDATE bookings SET customer_id = $1, vehicle_id = $2, rent_start_date = $3, rent_end_date = $4, total_price = $5, status = $6 WHERE id = $7 RETURNING *`,
      [
        customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date,
        total_price,
        status,
        req.params.bookingId,
      ],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Bookings updated successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "internal server error",
      details: err,
    });
  }
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
