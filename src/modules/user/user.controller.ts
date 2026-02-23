import { Request, Response } from "express";
import { pool } from "../../config/db";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  const { name, email, password, phone, role } = req.body;
  try {
    const result = await userServices.createUser(
      name,
      email,
      password,
      phone,
      role,
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
};

const getAllUsers = async (req: Request, res: Response) => {
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
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getUserById(req.params.userId as string);
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
};

const updateUserById = async (req: Request, res: Response) => {
  const { name, email, password, phone, role } = req.body;
  try {
    const result = await userServices.updateUserById(
      name,
      email,
      password,
      phone,
      role,
      req.params.userId as string,
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
};

const deleteUserById = async (req: Request, res: Response) => {
  try {
    const result = await userServices.deleteUserById(
      req.params.userId as string,
    );
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
};

export const userControllers = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
