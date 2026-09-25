import { prisma } from "../config/db.js";

// GET ALL ACTIVE SERVICES
export const getServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: {
        active: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      message: "Services retrieved successfully",
      data: services,
    });
  } catch (error) {
    console.log("[getServices] error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// GET ONE SERVICE
export const getService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({
      where: {
        id,
      },
    });

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    return res.status(200).json({
      message: "Service retrieved successfully",
      data: service,
    });
  } catch (error) {
    console.log("[getService] error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// CREATE SERVICE
export const createService = async (req, res) => {
  try {
    const { name, description, price, duration, active } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Service name is required",
      });
    }

    const service = await prisma.service.create({
      data: {
        name,
        description,
        price: price !== undefined ? Number(price) : null,
        duration,
        active: active ?? true,
      },
    });

    return res.status(201).json({
      message: "Service created successfully",
      data: service,
    });
  } catch (error) {
    console.log("[createService] error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// UPDATE SERVICE
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, description, price, duration, active } = req.body;

    const existingService = await prisma.service.findUnique({
      where: {
        id,
      },
    });

    if (!existingService) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    const service = await prisma.service.update({
      where: {
        id,
      },

      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && {
          price: price === null ? null : Number(price),
        }),
        ...(duration !== undefined && { duration }),
        ...(active !== undefined && { active }),
      },
    });

    return res.status(200).json({
      message: "Service updated successfully",
      data: service,
    });
  } catch (error) {
    console.log("[updateService] error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// DELETE SERVICE
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const existingService = await prisma.service.findUnique({
      where: {
        id,
      },
    });

    if (!existingService) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    await prisma.service.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.log("[deleteService] error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
