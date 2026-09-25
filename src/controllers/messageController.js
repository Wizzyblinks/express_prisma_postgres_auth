import { prisma } from "../config/db.js";

// SEND MESSAGE
export const createMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Name, email and message are required",
      });
    }

    const newMessage = await prisma.message.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
      },
    });

    return res.status(201).json({
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.log("[createMessage] error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ADMIN: GET ALL MESSAGES
export const getAllMessages = async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      message: "Messages retrieved successfully",
      data: messages,
    });
  } catch (error) {
    console.log("[getAllMessages] error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ADMIN: GET ONE MESSAGE
export const getMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await prisma.message.findUnique({
      where: { id },
    });

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    return res.status(200).json({
      message: "Message retrieved successfully",
      data: message,
    });
  } catch (error) {
    console.log("[getMessage] error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ADMIN: UPDATE MESSAGE STATUS
export const updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["UNREAD", "READ", "REPLIED"];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid message status",
      });
    }

    const existingMessage = await prisma.message.findUnique({
      where: { id },
    });

    if (!existingMessage) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    const updatedMessage = await prisma.message.update({
      where: { id },
      data: {
        status,
      },
    });

    return res.status(200).json({
      message: "Message status updated successfully",
      data: updatedMessage,
    });
  } catch (error) {
    console.log("[updateMessageStatus] error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ADMIN: DELETE MESSAGE
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const existingMessage = await prisma.message.findUnique({
      where: { id },
    });

    if (!existingMessage) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    await prisma.message.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.log("[deleteMessage] error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
