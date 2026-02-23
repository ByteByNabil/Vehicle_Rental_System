import express from "express";
import { vehiclesControllers } from "./vehicles.controller";
const router = express.Router();

router.post("/", vehiclesControllers.createVehicles);

router.get("/", vehiclesControllers.getAllVehicles);

router.get("/:vehicleId", vehiclesControllers.getVehiclesById);

router.put("/:vehicleId", vehiclesControllers.updateVehicleById);

router.delete("/:vehicleId", vehiclesControllers.deleteVehicleById);

export const vehiclesRoutes = router;
