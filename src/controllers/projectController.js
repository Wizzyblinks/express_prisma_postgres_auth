import { prisma } from "../config/db.js";

// GET ALL PROJECTS
export const getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        published: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      message: "Projects retrieved successfully",
      data: projects,
    });
  } catch (error) {
    console.log("[getProjects] error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// GET ONE PROJECT
export const getProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: {
        id,
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    return res.status(200).json({
      message: "Project retrieved successfully",
      data: project,
    });
  } catch (error) {
    console.log("[getProject] error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// CREATE PROJECT
export const createProject = async (req, res) => {
  try {
    const {
      title,
      slug,
      type,
      category,
      description,
      coverImage,
      videoUrl,
      featured,
      published,
    } = req.body;

    // Validate required fields
    if (!title || !slug || !type) {
      return res.status(400).json({
        message: "Title, slug and type are required",
      });
    }

    // Validate project type
    if (!["PHOTOGRAPHY", "CINEMATOGRAPHY"].includes(type)) {
      return res.status(400).json({
        message: "Invalid project type",
      });
    }

    // Check if slug already exists
    const existingProject = await prisma.project.findUnique({
      where: {
        slug,
      },
    });

    if (existingProject) {
      return res.status(409).json({
        message: "A project with this slug already exists",
      });
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        title,
        slug,
        type,
        category,
        description,
        coverImage,
        videoUrl,
        featured: featured ?? false,
        published: published ?? true,
      },
    });

    return res.status(201).json({
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    console.log("[createProject] error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// UPDATE PROJECT
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      slug,
      type,
      category,
      description,
      coverImage,
      videoUrl,
      featured,
      published,
    } = req.body;

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: {
        id,
      },
    });

    if (!existingProject) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Validate type if provided
    if (type && !["PHOTOGRAPHY", "CINEMATOGRAPHY"].includes(type)) {
      return res.status(400).json({
        message: "Invalid project type",
      });
    }

    // Update only fields that were provided
    const project = await prisma.project.update({
      where: {
        id,
      },

      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(type !== undefined && { type }),
        ...(category !== undefined && { category }),
        ...(description !== undefined && { description }),
        ...(coverImage !== undefined && { coverImage }),
        ...(videoUrl !== undefined && { videoUrl }),
        ...(featured !== undefined && { featured }),
        ...(published !== undefined && { published }),
      },
    });

    return res.status(200).json({
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    console.log("[updateProject] error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// DELETE PROJECT
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: {
        id,
      },
    });

    if (!existingProject) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Delete project
    await prisma.project.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.log("[deleteProject] error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
