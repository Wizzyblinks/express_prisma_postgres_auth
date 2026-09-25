import { Router } from "express";

import {
  createMessage,
  getAllMessages,
  getMessage,
  updateMessageStatus,
  deleteMessage,
} from "../controllers/messageController.js";

import { auth_middleware } from "../middlewares/authMiddleware.js";
import { admin_middleware } from "../middlewares/adminMiddleware.js";

export const messageRoutes = Router();

// Public route — anyone can send a message
messageRoutes.post("/", createMessage);

// Admin routes
messageRoutes.get("/", auth_middleware, admin_middleware, getAllMessages);

messageRoutes.get("/:id", auth_middleware, admin_middleware, getMessage);

messageRoutes.patch(
  "/:id/status",
  auth_middleware,
  admin_middleware,
  updateMessageStatus,
);

messageRoutes.delete("/:id", auth_middleware, admin_middleware, deleteMessage);
