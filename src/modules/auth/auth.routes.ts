import express from "express";
import { authController } from "./auth.controllers";
const router = express.Router();

router.post("/signup", authController.signUpUser);

router.post("/signin", authController.signInUser);

export const authRoutes = router;
