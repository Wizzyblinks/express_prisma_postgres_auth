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

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Client messages and admin message management
 */

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Send a message
 *     tags: [Messages]
 *     description: Allows a visitor or client to send a message to the photography business.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               phone:
 *                 type: string
 *                 example: "+2348012345678"
 *               subject:
 *                 type: string
 *                 example: Wedding Photography Inquiry
 *               message:
 *                 type: string
 *                 example: I would like to book your photography service for my wedding.
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       400:
 *         description: Name, email and message are required
 *       500:
 *         description: Internal server error
 */
messageRoutes.post("/", createMessage);

/**
 * @swagger
 * /messages:
 *   get:
 *     summary: Get all messages
 *     tags: [Messages]
 *     description: Admin-only endpoint for viewing messages submitted by clients and visitors.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Internal server error
 */
messageRoutes.get("/", auth_middleware, admin_middleware, getAllMessages);

/**
 * @swagger
 * /messages/{id}:
 *   get:
 *     summary: Get a message by ID
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Message ID
 *     responses:
 *       200:
 *         description: Message retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Message not found
 *       500:
 *         description: Internal server error
 */
messageRoutes.get("/:id", auth_middleware, admin_middleware, getMessage);

/**
 * @swagger
 * /messages/{id}/status:
 *   patch:
 *     summary: Update message status
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Message ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - UNREAD
 *                   - READ
 *                   - REPLIED
 *                 example: READ
 *     responses:
 *       200:
 *         description: Message status updated successfully
 *       400:
 *         description: Invalid message status
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Message not found
 *       500:
 *         description: Internal server error
 */
messageRoutes.patch(
  "/:id/status",
  auth_middleware,
  admin_middleware,
  updateMessageStatus,
);

/**
 * @swagger
 * /messages/{id}:
 *   delete:
 *     summary: Delete a message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Message ID
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Message not found
 *       500:
 *         description: Internal server error
 */
messageRoutes.delete("/:id", auth_middleware, admin_middleware, deleteMessage);
