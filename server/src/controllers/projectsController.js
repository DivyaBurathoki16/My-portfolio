const Project = require("../models/Project");
const { projects: defaultProjects } = require("../data/projects");
const { ensureConnected } = require("../config/db");

const getProjects = async (req, res, next) => {
  try {
    if (process.env.MONGODB_URI) {
      // On serverless, connection may not be ready yet; ensure we're connected
      const connected = await ensureConnected();
      if (connected) {
        try {
          const dbQuery = Project.find().sort({ order: 1, createdAt: -1 }).limit(100).lean();
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Database query timeout")), 5000)
          );

          const dbProjects = await Promise.race([dbQuery, timeoutPromise]);
          if (dbProjects && dbProjects.length > 0) {
            return res.json(dbProjects);
          }
        } catch (dbError) {
          console.warn("⚠️  Database query failed, using default projects:", dbError.message);
        }
      } else {
        console.log("📦 MongoDB not connected, using default projects");
      }
    }

    res.json(defaultProjects);
  } catch (error) {
    console.error("❌ Error fetching projects:", error.message);
    res.json(defaultProjects);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (process.env.MONGODB_URI) {
      const project = await Project.findById(id);
      if (project) {
        return res.json(project);
      }
    }
    
    // Fallback to default projects
    const project = defaultProjects.find(p => p.id === id);
    if (project) {
      return res.json(project);
    }
    
    res.status(404).json({ error: "Project not found" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProjects, getProjectById };

