import { Router } from "express";
import { getDashboardStats } from "../controllers/adminController.js";
import { auth_middleware } from "../middlewares/authMiddleware.js";
import { admin_middleware } from "../middlewares/adminMiddleware.js";

export const adminRoutes = Router();

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Get admin dashboard statistics
 *     description: Returns statistics about users, projects, services, bookings, and messages. Admin access is required.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Dashboard statistics retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: integer
 *                       example: 25
 *                     totalProjects:
 *                       type: integer
 *                       example: 12
 *                     totalServices:
 *                       type: integer
 *                       example: 6
 *                     totalBookings:
 *                       type: integer
 *                       example: 30
 *                     pendingBookings:
 *                       type: integer
 *                       example: 8
 *                     confirmedBookings:
 *                       type: integer
 *                       example: 15
 *                     totalMessages:
 *                       type: integer
 *                       example: 20
 *                     unreadMessages:
 *                       type: integer
 *                       example: 5
 *       401:
 *         description: Unauthorized or invalid token
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Internal server error
 */
adminRoutes.get(
  "/dashboard",
  auth_middleware,
  admin_middleware,
  getDashboardStats,
);
