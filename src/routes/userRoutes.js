import { Router } from "express";
import { prisma } from "../config/db.js";
import { auth_middleware } from "../middlewares/authMiddleware.js";
import { admin_middleware } from "../middlewares/adminMiddleware.js";

export const userRoute = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Returns the list of registered users. Admin access is required.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: user retrived successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: John Doe
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: john@example.com
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       404:
 *         description: No users found
 *       500:
 *         description: Internal server error
 */
userRoute.get("/", auth_middleware, admin_middleware, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    if (!users.length) {
      return res.status(404).json({
        msg: "no user found",
      });
    }

    return res.status(200).json({
      msg: "user retrieved successfully",
      data: users,
    });
  } catch (error) {
    console.log("[GET /users] error:", error.message);

    return res.status(500).json({
      msg: "Internal server error",
    });
  }
});
