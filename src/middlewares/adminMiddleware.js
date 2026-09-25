import { prisma } from "../config/db.js";

export const admin_middleware = async (req, res, next) => {
  try {
    // The auth middleware should run before this middleware.
    if (!req.user_id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: req.user_id,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    if (user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    next();
  } catch (error) {
    console.log("[admin_middleware] error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
