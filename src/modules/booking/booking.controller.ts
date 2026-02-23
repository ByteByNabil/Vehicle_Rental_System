import { Request, Response } from "express";
import { bookingServices } from "./booking.service";

const createBookings = async (req: Request, res: Response) => {
  const {
    customer_id,
    vehicle_id,
    rent_start_date,
    rent_end_date,
    total_price,
    status,
  } = req.body;

  try {
    const result = await bookingServices.createBookings(
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      status,
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
};

const getBookings = async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.getBookings();
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
};

const updateBookings = async (req: Request, res: Response) => {
  const {
    customer_id,
    vehicle_id,
    rent_start_date,
    rent_end_date,
    total_price,
    status,
  } = req.body;
  try {
    const result = await bookingServices.updateBookings(
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      status,
      req.params.bookingId as string,
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
};

export const bookingsControllers = {
  createBookings,
  getBookings,
  updateBookings,
};
