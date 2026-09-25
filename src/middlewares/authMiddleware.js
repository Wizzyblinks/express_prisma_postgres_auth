import jwt from "jsonwebtoken";
import "dotenv/config";

export const generate_jwt = async (payload) => {
  const jwt_secret = process.env.JWT_SECRET;

  if (!jwt_secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  const token = jwt.sign(payload, jwt_secret, {
    expiresIn: "7d",
  });

  return token;
};

export const auth_middleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header is required",
      });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
      return res.status(401).json({
        message: "Invalid authorization format",
      });
    }

    const token = parts[1];

    const jwt_secret = process.env.JWT_SECRET;

    if (!jwt_secret) {
      return res.status(500).json({
        message: "JWT secret is not configured",
      });
    }

    const decoded = jwt.verify(token, jwt_secret);

    req.user_id = decoded.user_id;

    next();
  } catch (error) {
    console.log("[auth_middleware] error:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
