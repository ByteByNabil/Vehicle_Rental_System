import { Request, Response } from "express";
import { authServices } from "./auth.services";

const signUpUser = async (req: Request, res: Response) => {
  const { name, email, password, phone, role } = req.body;
  try {
    const result = await authServices.signUpUser(
      name,
      email,
      password,
      phone,
      role,
    );
    // console.log(result.rows[0]);
    // const { password, ...userWithoutPassword } = result.rows[0];
    // res.status(201).json({
    //   success: true,
    //   message: "User Registered Successfully",
    //   data: userWithoutPassword,
    // });
    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "internal server error",
    });
  }
};

const signInUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await authServices.signInUser(email, password);
    // console.log(result.rows[0]);
    res.status(200).json({
      success: true,
      message: "Login Successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "internal server error",
    });
  }
};

export const authController = {
  signUpUser,
  signInUser,
};
