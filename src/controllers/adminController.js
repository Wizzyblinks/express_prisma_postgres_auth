import { prisma } from "../config/db.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalProjects,
      totalServices,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      totalMessages,
      unreadMessages,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.project.count(),

      prisma.service.count(),

      prisma.booking.count(),

      prisma.booking.count({
        where: {
          status: "PENDING",
        },
      }),

      prisma.booking.count({
        where: {
          status: "CONFIRMED",
        },
      }),

      prisma.message.count(),

      prisma.message.count({
        where: {
          status: "UNREAD",
        },
      }),
    ]);

    return res.status(200).json({
      message: "Dashboard statistics retrieved successfully",
      data: {
        totalUsers,
        totalProjects,
        totalServices,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        totalMessages,
        unreadMessages,
      },
    });
  } catch (error) {
    console.log("[getDashboardStats] error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
