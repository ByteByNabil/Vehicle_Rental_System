import { Request, Response } from "express";
import { bookingServices } from "./bookings.services";

// ===============================
// BOOKINGS CONTROLLERS
// ===============================
/**
 * bookingsControllers
 * - Handles all booking-related API requests
 * - Calls corresponding bookingServices functions
 * - Handles role-based access (Admin vs Customer)
 * - Handles success, error, and not found responses
 */

// ===============================
// CREATE BOOKING (ADMIN OR CUSTOMER)
// ===============================
/**
 * createBookings
 * - Endpoint: POST /api/v1/bookings
 * - Role restrictions:
 *    Customer → can create booking for themselves only
 *    Admin → can create booking for any customer
 * - total_price is calculated automatically in service, not from request body
 * - Parameters: req.body (vehicle_id, rent_start_date, rent_end_date)
 * - Returns 201 with newly created booking on success
 * - Returns 400 if required fields are missing or validation fails
 * - Returns 401 if user is unauthorized
 */
const createBookings = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const result = await bookingServices.createBookings({
      ...req.body,
      customer_id: user.role === "customer" ? user.id : req.body.customer_id,
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// ===============================
// GET BOOKINGS (ADMIN OR CUSTOMER)
// ===============================
/**
 * getBookings
 * - Endpoint: GET /api/v1/bookings
 * - Role restrictions:
 *    Admin → can view all bookings
 *    Customer → can view only their own bookings
 * - Returns 200 with array of bookings on success
 * - Returns 401 if user is unauthorized
 * - Returns 500 on internal server error
 */
const getBookings = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    let result;

    if (user.role === "admin") {
      result = await bookingServices.getAllBookings();
    } else {
      result = await bookingServices.getBookingsByCustomer(user.id);
    }

    res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===============================
// UPDATE BOOKING (ADMIN OR CUSTOMER)
// ===============================
/**
 * updateBookings
 * - Endpoint: PUT /api/v1/bookings/:bookingId
 * - Role restrictions:
 *    Customer → can update only their own bookings
 *    Admin → can update any booking
 * - Parameters:
 *    req.body → fields to update (status, rent_end_date, etc.)
 *    bookingId → booking ID to update
 * - Returns 200 with updated booking on success
 * - Returns 401 if user is unauthorized
 * - Returns 403 if customer tries to update another customer's booking
 * - Returns 404 if booking not found
 * - Returns 400 if update fails due to validation or service error
 */
const updateBookings = async (req: Request, res: Response) => {
  const user = req.user;
  const bookingId = req.params.bookingId;

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    // Check if booking exists
    const existing = await bookingServices.getBookingById(bookingId as string);

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const booking = existing.rows[0];

    // Customer cannot update others' booking
    if (user.role === "customer" && booking.customer_id !== user.id) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You can only update your own booking",
      });
    }

    const result = await bookingServices.updateBookings(
      req.body,
      bookingId as string,
      user.role,
    );

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// ===============================
// EXPORT BOOKINGS CONTROLLERS
// ===============================
/**
 * bookingsControllers
 * - Exports all booking controller functions
 */
export const bookingsControllers = {
  createBookings,
  getBookings,
  updateBookings,
};
