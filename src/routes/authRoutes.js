import { Router } from "express";
import {
  change_password,
  login,
  me,
  register,
  resendVerificationEmail,
  verifyEmail,
} from "../controllers/authControllers.js";
import { auth_middleware } from "../middlewares/authMiddleware.js";

export const authRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User registration, email verification and authentication
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Name, email and password are required
 *       409:
 *         description: User with this email already exists
 *       500:
 *         description: Internal server error
 */
authRoutes.post("/register", register);

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: Verify a user's email address
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired verification code
 *       404:
 *         description: User or verification record not found
 *       500:
 *         description: Internal server error
 */
authRoutes.post("/verify-email", verifyEmail);

/**
 * @swagger
 * /auth/resend-verification:
 *   post:
 *     summary: Resend email verification code
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *     responses:
 *       200:
 *         description: Verification code sent successfully
 *       400:
 *         description: Email is required
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
authRoutes.post("/resend-verification", resendVerificationEmail);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a verified user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 *       403:
 *         description: Email has not been verified
 *       500:
 *         description: Internal server error
 */
authRoutes.post("/login", login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get the currently authenticated user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user information
 *       401:
 *         description: Unauthorized or invalid token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
authRoutes.get("/me", auth_middleware, me);

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Change the authenticated user's password
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 example: OldPassword123!
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: NewPassword123!
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid password information
 *       401:
 *         description: Unauthorized or incorrect current password
 *       500:
 *         description: Internal server error
 */
authRoutes.post("/change-password", auth_middleware, change_password);
