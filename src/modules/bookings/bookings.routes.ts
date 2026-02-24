import express from "express";
import { bookingsControllers } from "./bookings.controllers";
import logger from "../../middleware/logger";
import auth from "../../middleware/auth";
const router = express.Router();

router.post(
  "/",
  logger,
  auth("admin", "customer"),
  bookingsControllers.createBookings,
);

router.get("/", logger, auth("admin"), bookingsControllers.getBookings);

router.put(
  "/:bookingId",
  logger,
  auth("admin"),
  bookingsControllers.updateBookings,
);

export const bookingsRoutes = router;
