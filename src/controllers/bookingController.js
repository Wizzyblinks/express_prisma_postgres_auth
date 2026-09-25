import { prisma } from "../config/db.js";

// CREATE BOOKING
export const createBooking = async (req, res) => {
  try {
    const clientId = req.user_id;

    const { serviceId, bookingDate, bookingTime, location, notes } = req.body;

    if (!bookingDate) {
      return res.status(400).json({
        message: "Booking date is required",
      });
    }

    // Check service if a service was selected
    if (serviceId) {
      const service = await prisma.service.findUnique({
        where: {
          id: serviceId,
        },
      });

      if (!service) {
        return res.status(404).json({
          message: "Service not found",
        });
      }

      if (!service.active) {
        return res.status(400).json({
          message: "This service is currently unavailable",
        });
      }
    }

    const booking = await prisma.booking.create({
      data: {
        clientId,
        serviceId: serviceId || null,
        bookingDate: new Date(bookingDate),
        bookingTime,
        location,
        notes,
      },
      include: {
        service: true,
      },
    });

    return res.status(201).json({
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    console.log("[createBooking] error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// GET MY BOOKINGS
export const getMyBookings = async (req, res) => {
  try {
    const clientId = req.user_id;

    const bookings = await prisma.booking.findMany({
      where: {
        clientId,
      },
      include: {
        service: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      message: "Bookings retrieved successfully",
      data: bookings,
    });
  } catch (error) {
    console.log("[getMyBookings] error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// GET ONE OF MY BOOKINGS
export const getMyBooking = async (req, res) => {
  try {
    const clientId = req.user_id;
    const { id } = req.params;

    const booking = await prisma.booking.findFirst({
      where: {
        id,
        clientId,
      },
      include: {
        service: true,
      },
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      message: "Booking retrieved successfully",
      data: booking,
    });
  } catch (error) {
    console.log("[getMyBooking] error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// CANCEL MY BOOKING
export const cancelMyBooking = async (req, res) => {
  try {
    const clientId = req.user_id;
    const { id } = req.params;

    const booking = await prisma.booking.findFirst({
      where: {
        id,
        clientId,
      },
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.status === "COMPLETED" || booking.status === "CANCELLED") {
      return res.status(400).json({
        message: "This booking cannot be cancelled",
      });
    }

    const updatedBooking = await prisma.booking.update({
      where: {
        id,
      },
      data: {
        status: "CANCELLED",
      },
    });

    return res.status(200).json({
      message: "Booking cancelled successfully",
      data: updatedBooking,
    });
  } catch (error) {
    console.log("[cancelMyBooking] error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ADMIN: GET ALL BOOKINGS
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        service: true,
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      message: "All bookings retrieved successfully",
      data: bookings,
    });
  } catch (error) {
    console.log("[getAllBookings] error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ADMIN: GET ONE BOOKING
export const getBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: {
        id,
      },
      include: {
        service: true,
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: true,
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      message: "Booking retrieved successfully",
      data: booking,
    });
  } catch (error) {
    console.log("[getBooking] error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ADMIN: UPDATE BOOKING
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const { status, paymentStatus, bookingDate, bookingTime, location, notes } =
      req.body;

    const existingBooking = await prisma.booking.findUnique({
      where: {
        id,
      },
    });

    if (!existingBooking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const validStatuses = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid booking status",
      });
    }

    const booking = await prisma.booking.update({
      where: {
        id,
      },
      data: {
        ...(status !== undefined && { status }),
        ...(paymentStatus !== undefined && { paymentStatus }),
        ...(bookingDate !== undefined && {
          bookingDate: new Date(bookingDate),
        }),
        ...(bookingTime !== undefined && { bookingTime }),
        ...(location !== undefined && { location }),
        ...(notes !== undefined && { notes }),
      },
      include: {
        service: true,
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.status(200).json({
      message: "Booking updated successfully",
      data: booking,
    });
  } catch (error) {
    console.log("[updateBooking] error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ADMIN: DELETE BOOKING
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const existingBooking = await prisma.booking.findUnique({
      where: {
        id,
      },
    });

    if (!existingBooking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    await prisma.booking.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.log("[deleteBooking] error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
