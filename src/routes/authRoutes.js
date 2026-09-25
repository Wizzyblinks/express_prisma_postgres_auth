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

authRoutes.post("/register", register);
authRoutes.post("/verify-email", verifyEmail);
authRoutes.post("/resend-verification", resendVerificationEmail);
authRoutes.post("/login", login);
authRoutes.get("/me", auth_middleware, me);
authRoutes.post("/change-password", auth_middleware, change_password);
