import { admin_middleware } from "./middlewares/adminMiddleware.js";
import express from "express";
import { userRoute } from "./routes/userRoutes.js";
import { authRoutes } from "./routes/authRoutes.js";
import { logger } from "./middlewares/logger.js";
import { auth_middleware } from "./middlewares/authMiddleware.js";
import { projectRoutes } from "./routes/projectRoutes.js";
import { serviceRoutes } from "./routes/serviceRoutes.js";
import { bookingRoutes } from "./routes/bookingRoutes.js";
import { messageRoutes } from "./routes/messageRoutes.js";
import { adminRoutes } from "./routes/adminRoutes.js";
import cors from "cors";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger);
// app.use(auth_middleware);

app.use("/users", userRoute);
app.use("/projects", projectRoutes);
app.use("/services", serviceRoutes);
app.use("/bookings", bookingRoutes);
app.use("/messages", messageRoutes);
app.use("/admin", adminRoutes);
app.use(cors());

app.use("/auth", authRoutes);
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Photography & Cinematography API is running",
  });
});
app.get("/admin/test", auth_middleware, admin_middleware, (req, res) => {
  return res.status(200).json({
    message: "Admin access granted",
  });
});
