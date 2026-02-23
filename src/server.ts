import express, { Request, Response } from "express";
import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/user/user.routes";
import { vehiclesRoutes } from "./modules/vehicle/vehicles.routes";
import { bookingsRoutes } from "./modules/booking/booking.routes";

const app = express();
const port = config.port;

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
