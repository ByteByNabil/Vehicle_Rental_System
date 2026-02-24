// import { Router } from "express";
import express, { Request, Response } from "express";
import { userControllers } from "./users.controllers";
import logger from "../../middleware/logger";
import auth from "../../middleware/auth";

const router = express.Router();

// localhost:5000/api/v1/users;

router.get("/", logger, auth("admin"), userControllers.getAllUsers);

router.get(
  "/:userId",
  logger,
  auth("admin", "customer"),
  userControllers.getUserById,
);

router.put(
  "/:userId",
  logger,
  auth("admin", "customer"),
  userControllers.updateUserById,
);
// router.put("/:userId", logger, auth("admin"), userControllers.updateUserById);

router.delete(
  "/:userId",
  logger,
  auth("admin"),
  userControllers.deleteUserById,
);

export const userRoutes = router;
