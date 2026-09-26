import { Router } from "express";
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import { auth_middleware } from "../middlewares/authMiddleware.js";
import { admin_middleware } from "../middlewares/adminMiddleware.js";

export const projectRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Photography and cinematography projects
 */

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get all published projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of projects
 *       500:
 *         description: Internal server error
 */
projectRoutes.get("/", getProjects);

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Get a project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project found
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
projectRoutes.get("/:id", getProject);

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - slug
 *               - type
 *             properties:
 *               title:
 *                 type: string
 *                 example: Lagos Wedding Photography
 *               slug:
 *                 type: string
 *                 example: lagos-wedding-photography
 *               type:
 *                 type: string
 *                 enum:
 *                   - PHOTOGRAPHY
 *                   - CINEMATOGRAPHY
 *                 example: PHOTOGRAPHY
 *               category:
 *                 type: string
 *                 example: Wedding
 *               description:
 *                 type: string
 *                 example: Professional wedding photography project.
 *               coverImage:
 *                 type: string
 *                 example: https://example.com/images/wedding.jpg
 *               videoUrl:
 *                 type: string
 *                 example: https://example.com/videos/wedding.mp4
 *               featured:
 *                 type: boolean
 *                 example: false
 *               published:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Invalid project data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Internal server error
 */
projectRoutes.post("/", auth_middleware, admin_middleware, createProject);

/**
 * @swagger
 * /projects/{id}:
 *   patch:
 *     summary: Update a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Wedding Photography
 *               slug:
 *                 type: string
 *                 example: updated-wedding-photography
 *               type:
 *                 type: string
 *                 enum:
 *                   - PHOTOGRAPHY
 *                   - CINEMATOGRAPHY
 *               category:
 *                 type: string
 *                 example: Wedding
 *               description:
 *                 type: string
 *               coverImage:
 *                 type: string
 *               videoUrl:
 *                 type: string
 *               featured:
 *                 type: boolean
 *               published:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
projectRoutes.patch("/:id", auth_middleware, admin_middleware, updateProject);

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
projectRoutes.delete("/:id", auth_middleware, admin_middleware, deleteProject);
