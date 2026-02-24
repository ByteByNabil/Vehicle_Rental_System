import express, { Request, Response } from "express";
import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/users/users.routes";
import { vehiclesRoutes } from "./modules/vehicles/vehicles.routes";
import { bookingsRoutes } from "./modules/bookings/bookings.routes";
import { authRoutes } from "./modules/auth/auth.routes";

const app = express();

// parser
app.use(express.json());

// initializing DB
initDB();

app.get("/", logger, (req: Request, res: Response) => {
  res.send("Hello Next Level Developers!");
});

// User CRUD Operations
app.use("/api/v1/users", userRoutes);

// Vehicles CRUD Operations
app.use("/api/v1/vehicles", vehiclesRoutes);

// Bookings CRUD Operations
app.use("/api/v1/bookings", bookingsRoutes);

// Authentication Routes
app.use("/api/v1/auth", authRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

export default app;
