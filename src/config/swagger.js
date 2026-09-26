import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Photography & Cinematography API",
      version: "1.0.0",
      description:
        "REST API for the Photography & Cinematography website. The API provides authentication, projects, services, bookings, messages, and admin functionality.",
    },

    servers: [
      {
        url: "http://localhost:5001",
        description: "Local development server",
      },
      {
        url: "https://photography-api-88wq.onrender.com",
        description: "Production server",
      },
    ],

    tags: [
      {
        name: "Authentication",
        description: "User registration, email verification and authentication",
      },
      {
        name: "Projects",
        description: "Photography and cinematography projects",
      },
      {
        name: "Services",
        description: "Photography and cinematography services",
      },
      {
        name: "Bookings",
        description: "Client bookings and admin booking management",
      },
      {
        name: "Messages",
        description: "Client messages and admin message management",
      },
      {
        name: "Admin",
        description: "Administrator dashboard and protected operations",
      },
      {
        name: "Users",
        description: "User-related operations",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Internal server error",
            },
          },
        },

        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            name: {
              type: "string",
              example: "John Doe",
            },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            role: {
              type: "string",
              enum: ["CLIENT", "ADMIN"],
              example: "CLIENT",
            },
            emailVerified: {
              type: "boolean",
              example: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        Project: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            title: {
              type: "string",
              example: "Wedding Cinematography",
            },
            slug: {
              type: "string",
              example: "wedding-cinematography",
            },
            type: {
              type: "string",
              enum: ["PHOTOGRAPHY", "CINEMATOGRAPHY"],
              example: "PHOTOGRAPHY",
            },
            category: {
              type: "string",
              nullable: true,
              example: "Wedding",
            },
            description: {
              type: "string",
              nullable: true,
            },
            coverImage: {
              type: "string",
              nullable: true,
              example: "https://example.com/image.jpg",
            },
            videoUrl: {
              type: "string",
              nullable: true,
              example: "https://example.com/video.mp4",
            },
            featured: {
              type: "boolean",
              example: false,
            },
            published: {
              type: "boolean",
              example: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        Service: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            name: {
              type: "string",
              example: "Wedding Photography",
            },
            description: {
              type: "string",
              nullable: true,
            },
            price: {
              type: "number",
              format: "float",
              nullable: true,
              example: 250000,
            },
            duration: {
              type: "string",
              nullable: true,
              example: "6 hours",
            },
            active: {
              type: "boolean",
              example: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        Booking: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            clientId: {
              type: "string",
              format: "uuid",
            },
            serviceId: {
              type: "string",
              format: "uuid",
              nullable: true,
            },
            bookingDate: {
              type: "string",
              format: "date-time",
              example: "2026-10-15T10:00:00.000Z",
            },
            bookingTime: {
              type: "string",
              nullable: true,
              example: "10:00 AM",
            },
            location: {
              type: "string",
              nullable: true,
              example: "Lagos, Nigeria",
            },
            notes: {
              type: "string",
              nullable: true,
            },
            status: {
              type: "string",
              enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"],
              example: "PENDING",
            },
            paymentStatus: {
              type: "string",
              nullable: true,
              example: "UNPAID",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        Message: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            name: {
              type: "string",
              example: "John Doe",
            },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            phone: {
              type: "string",
              nullable: true,
              example: "+2348012345678",
            },
            subject: {
              type: "string",
              nullable: true,
              example: "Photography Booking",
            },
            message: {
              type: "string",
              example: "I would like to book a photography session.",
            },
            status: {
              type: "string",
              enum: ["UNREAD", "READ", "REPLIED"],
              example: "UNREAD",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
      },
    },
  },

  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
