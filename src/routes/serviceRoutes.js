import { Router } from "express";
import {
  createService,
  getServices,
  getService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";
import { auth_middleware } from "../middlewares/authMiddleware.js";
import { admin_middleware } from "../middlewares/adminMiddleware.js";

export const serviceRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Photography and cinematography services
 */

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Get all active services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: List of available services
 *       500:
 *         description: Internal server error
 */
serviceRoutes.get("/", getServices);

/**
 * @swagger
 * /services/{id}:
 *   get:
 *     summary: Get a service by ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service retrieved successfully
 *       404:
 *         description: Service not found
 *       500:
 *         description: Internal server error
 */
serviceRoutes.get("/:id", getService);

/**
 * @swagger
 * /services:
 *   post:
 *     summary: Create a new service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Wedding Photography
 *               description:
 *                 type: string
 *                 example: Professional photography coverage for weddings.
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 250000
 *               duration:
 *                 type: string
 *                 example: 6 hours
 *               active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Service created successfully
 *       400:
 *         description: Invalid service data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Internal server error
 */
serviceRoutes.post("/", auth_middleware, admin_middleware, createService);

/**
 * @swagger
 * /services/{id}:
 *   patch:
 *     summary: Update a service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Service ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Premium Wedding Photography
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 350000
 *               duration:
 *                 type: string
 *                 example: 8 hours
 *               active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Service updated successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Service not found
 *       500:
 *         description: Internal server error
 */
serviceRoutes.patch("/:id", auth_middleware, admin_middleware, updateService);

/**
 * @swagger
 * /services/{id}:
 *   delete:
 *     summary: Delete a service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Service not found
 *       500:
 *         description: Internal server error
 */
serviceRoutes.delete("/:id", auth_middleware, admin_middleware, deleteService);
