import { Request, Response } from "express";
import { vehiclesServices } from "./vehicles.services";

const createVehicles = async (req: Request, res: Response) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = req.body;

  try {
    const result = await vehiclesServices.createVehicles(
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
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
};

const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.getAllVehicles();
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
};

const getVehiclesById = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.getVehiclesById(
      req.params.vehicleId as string,
    );
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
};

const updateVehicleById = async (req: Request, res: Response) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = req.body;
  try {
    const result = await vehiclesServices.updateVehicleById(
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      req.params.vehicleId as string,
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
};

const deleteVehicleById = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesServices.deleteVehicleById(
      req.params.vehicleId as string,
    );
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
};
export const vehiclesControllers = {
  createVehicles,
  getAllVehicles,
  getVehiclesById,
  updateVehicleById,
  deleteVehicleById,
};
