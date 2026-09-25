import { Router } from "express";

import {
  createBooking,
  getMyBookings,
  getMyBooking,
  cancelMyBooking,
  getAllBookings,
  getBooking,
  updateBooking,
  deleteBooking,
} from "../controllers/bookingController.js";

import { auth_middleware } from "../middlewares/authMiddleware.js";
import { admin_middleware } from "../middlewares/adminMiddleware.js";

export const bookingRoutes = Router();

// Client routes

bookingRoutes.post("/", auth_middleware, createBooking);

bookingRoutes.get("/my", auth_middleware, getMyBookings);

bookingRoutes.get("/my/:id", auth_middleware, getMyBooking);

bookingRoutes.patch("/my/:id/cancel", auth_middleware, cancelMyBooking);

// Admin routes

bookingRoutes.get("/", auth_middleware, admin_middleware, getAllBookings);

bookingRoutes.get("/admin/:id", auth_middleware, admin_middleware, getBooking);

bookingRoutes.patch(
  "/admin/:id",
  auth_middleware,
  admin_middleware,
  updateBooking,
);

bookingRoutes.delete(
  "/admin/:id",
  auth_middleware,
  admin_middleware,
  deleteBooking,
);
