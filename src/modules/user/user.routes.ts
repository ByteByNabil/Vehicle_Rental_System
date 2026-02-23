// import { Router } from "express";
import express, { Request, Response } from "express";
import { pool } from "../../config/db";
import { userControllers } from "./user.controller";

const router = express.Router();

// localhost:5000/api/v1/users
router.post("/", userControllers.createUser);

router.get("/", userControllers.getAllUsers);

router.get("/:userId", userControllers.getUserById);

router.put("/:userId", userControllers.updateUserById);

router.delete("/:userId", userControllers.deleteUserById);

export const userRoutes = router;
