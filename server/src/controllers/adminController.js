const Project = require("../models/Project");

const getAllProjects = async (req, res, next) => {
  try {
    if (!process.env.MONGODB_URI) {
      return res.status(400).json({ error: "MongoDB not configured" });
    }
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

const createProject = async (req, res, next) => {
  try {
    if (!process.env.MONGODB_URI) {
      return res.status(400).json({ error: "MongoDB not configured" });
    }

    const { title, description, tech, github, live, image, featured, order } = req.body;

    if (!title || !description || !tech || !Array.isArray(tech)) {
      return res.status(400).json({ error: "Title, description, and tech array are required" });
    }

    const project = new Project({
      title,
      description,
      tech,
      github: github || "",
      live: live || "",
      image: image || "",
      featured: featured || false,
      order: order || 0
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    if (!process.env.MONGODB_URI) {
      return res.status(400).json({ error: "MongoDB not configured" });
    }

    const { id } = req.params;
    const updates = req.body;

    const project = await Project.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    if (!process.env.MONGODB_URI) {
      return res.status(400).json({ error: "MongoDB not configured" });
    }

    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject
};

