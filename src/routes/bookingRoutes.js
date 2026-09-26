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

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Client bookings and admin booking management
 */

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingDate
 *             properties:
 *               serviceId:
 *                 type: string
 *                 format: uuid
 *                 example: 7d2c5a4a-1234-4567-8901-123456789abc
 *               bookingDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-10-15T10:00:00.000Z
 *               bookingTime:
 *                 type: string
 *                 example: "10:00 AM"
 *               location:
 *                 type: string
 *                 example: Lagos, Nigeria
 *               notes:
 *                 type: string
 *                 example: Outdoor wedding photography
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Invalid booking information
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Service not found
 *       500:
 *         description: Internal server error
 */
bookingRoutes.post("/", auth_middleware, createBooking);

/**
 * @swagger
 * /bookings/my:
 *   get:
 *     summary: Get the authenticated user's bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User bookings retrieved successfully
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Internal server error
 */
bookingRoutes.get("/my", auth_middleware, getMyBookings);

/**
 * @swagger
 * /bookings/my/{id}:
 *   get:
 *     summary: Get one of the authenticated user's bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking retrieved successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */
bookingRoutes.get("/my/:id", auth_middleware, getMyBooking);

/**
 * @swagger
 * /bookings/my/{id}/cancel:
 *   patch:
 *     summary: Cancel one of the authenticated user's bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       400:
 *         description: Booking cannot be cancelled
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */
bookingRoutes.patch("/my/:id/cancel", auth_middleware, cancelMyBooking);

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     description: Admin-only endpoint for viewing all client bookings.
 *     responses:
 *       200:
 *         description: All bookings retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Internal server error
 */
bookingRoutes.get("/", auth_middleware, admin_middleware, getAllBookings);

/**
 * @swagger
 * /bookings/admin/{id}:
 *   get:
 *     summary: Get a booking by ID as an administrator
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */
bookingRoutes.get("/admin/:id", auth_middleware, admin_middleware, getBooking);

/**
 * @swagger
 * /bookings/admin/{id}:
 *   patch:
 *     summary: Update a booking as an administrator
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookingDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-10-20T12:00:00.000Z
 *               bookingTime:
 *                 type: string
 *                 example: "12:00 PM"
 *               location:
 *                 type: string
 *                 example: Abuja, Nigeria
 *               notes:
 *                 type: string
 *                 example: Updated booking information
 *               status:
 *                 type: string
 *                 enum:
 *                   - PENDING
 *                   - CONFIRMED
 *                   - CANCELLED
 *                   - COMPLETED
 *                 example: CONFIRMED
 *               paymentStatus:
 *                 type: string
 *                 example: PAID
 *     responses:
 *       200:
 *         description: Booking updated successfully
 *       400:
 *         description: Invalid booking data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */
bookingRoutes.patch(
  "/admin/:id",
  auth_middleware,
  admin_middleware,
  updateBooking,
);

/**
 * @swagger
 * /bookings/admin/{id}:
 *   delete:
 *     summary: Delete a booking as an administrator
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */
bookingRoutes.delete(
  "/admin/:id",
  auth_middleware,
  admin_middleware,
  deleteBooking,
);
