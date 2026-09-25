import { Router } from "express";

import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";

import { auth_middleware } from "../middlewares/authMiddleware.js";
import { admin_middleware } from "../middlewares/adminMiddleware.js";

export const projectRoutes = Router();

// Public routes
projectRoutes.get("/", getProjects);
projectRoutes.get("/:id", getProject);

// Admin routes
projectRoutes.post("/", auth_middleware, admin_middleware, createProject);

projectRoutes.patch("/:id", auth_middleware, admin_middleware, updateProject);

projectRoutes.delete("/:id", auth_middleware, admin_middleware, deleteProject);
