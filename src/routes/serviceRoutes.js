import { Router } from "express";

import {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";

import { auth_middleware } from "../middlewares/authMiddleware.js";
import { admin_middleware } from "../middlewares/adminMiddleware.js";

export const serviceRoutes = Router();

// Public routes
serviceRoutes.get("/", getServices);

serviceRoutes.get("/:id", getService);

// Admin routes
serviceRoutes.post("/", auth_middleware, admin_middleware, createService);

serviceRoutes.patch("/:id", auth_middleware, admin_middleware, updateService);

serviceRoutes.delete("/:id", auth_middleware, admin_middleware, deleteService);
