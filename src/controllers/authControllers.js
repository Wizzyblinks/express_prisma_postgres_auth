import { prisma } from "../config/db.js";
import bcrypt from "bcrypt";
import { generate_jwt } from "../middlewares/authMiddleware.js";
import { messenger } from "../config/email.js";
import { generateOTP } from "../utils/otp.js";
import { sendVerificationEmail } from "../utils/sendVerificationEmail.js";

// =========================
// REGISTER
// =========================
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: false,
      },
    });

    const otp = generateOTP();

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.emailVerification.create({
      data: {
        userId: user.id,
        otp,
        expiresAt,
      },
    });

    await sendVerificationEmail(user.email, user.name, otp);

    return res.status(201).json({
      message:
        "Registration successful. A verification code has been sent to your email.",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    console.log("[register] error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// =========================
// VERIFICATION
// =========================

export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        message: "Email is already verified",
      });
    }

    const verification = await prisma.emailVerification.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!verification) {
      return res.status(400).json({
        message: "Verification code not found. Please request a new code.",
      });
    }

    if (new Date() > verification.expiresAt) {
      await prisma.emailVerification.delete({
        where: {
          id: verification.id,
        },
      });

      return res.status(400).json({
        message: "Verification code has expired. Please request a new code.",
      });
    }

    if (verification.otp !== otp) {
      return res.status(400).json({
        message: "Invalid verification code",
      });
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerified: true,
      },
    });

    await prisma.emailVerification.delete({
      where: {
        id: verification.id,
      },
    });

    return res.status(200).json({
      message: "Email verified successfully",
    });
  } catch (error) {
    console.log("[verifyEmail] error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// =========================
// RESEND EMAIL
// =========================

export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        message: "Email is already verified",
      });
    }

    const otp = generateOTP();

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.emailVerification.upsert({
      where: {
        userId: user.id,
      },
      update: {
        otp,
        expiresAt,
      },
      create: {
        userId: user.id,
        otp,
        expiresAt,
      },
    });

    await sendVerificationEmail(user.email, user.name, otp);

    return res.status(200).json({
      message: "A new verification code has been sent to your email",
    });
  } catch (error) {
    console.log("[resendVerificationEmail] error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// =========================
// LOGIN
// =========================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Check if the user's email has been verified
    if (!user.emailVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in",
      });
    }

    const token = await generate_jwt({
      user_id: user.id,
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("[/login] error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// =========================
// GET CURRENT USER
// =========================
export const me = async (req, res) => {
  try {
    const userId = req.user_id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        profile: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.log("[/auth/me] error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// =========================
// CHANGE PASSWORD
// =========================
export const change_password = async (req, res) => {
  try {
    const userId = req.user_id;
    const { password } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    return res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log("[/change-password] error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
