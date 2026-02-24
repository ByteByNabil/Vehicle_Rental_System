import express from "express";
import { vehiclesControllers } from "./vehicles.controllers";
import logger from "../../middleware/logger";
import auth from "../../middleware/auth";
const router = express.Router();

router.post("/", logger, auth("admin"), vehiclesControllers.createVehicles);

router.get("/", logger, vehiclesControllers.getAllVehicles);
router.get("/:vehicleId", logger, vehiclesControllers.getVehiclesById);

router.put(
  "/:vehicleId",
  logger,
  auth("admin"),
  vehiclesControllers.updateVehicleById,
);

router.delete(
  "/:vehicleId",
  logger,
  auth("admin"),
  vehiclesControllers.deleteVehicleById,
);

export const vehiclesRoutes = router;
