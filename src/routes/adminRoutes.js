import { Router } from "express";

import { getDashboardStats } from "../controllers/adminController.js";

import { auth_middleware } from "../middlewares/authMiddleware.js";
import { admin_middleware } from "../middlewares/adminMiddleware.js";

export const adminRoutes = Router();

adminRoutes.get(
  "/dashboard",
  auth_middleware,
  admin_middleware,
  getDashboardStats,
);
