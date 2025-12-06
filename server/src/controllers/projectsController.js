const Project = require("../models/Project");
const { projects: defaultProjects } = require("../data/projects");

const getProjects = async (req, res, next) => {
  try {
    // Try to get projects from MongoDB first (only if connected)
    if (process.env.MONGODB_URI) {
      const mongoose = require("mongoose");
      // Only query if mongoose is connected (readyState 1 = connected)
      if (mongoose.connection.readyState === 1) {
        try {
          // Add timeout to prevent hanging
          const dbQuery = Project.find().sort({ order: 1, createdAt: -1 }).limit(100).lean();
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Database query timeout")), 2000)
          );
          
          const dbProjects = await Promise.race([dbQuery, timeoutPromise]);
          if (dbProjects && dbProjects.length > 0) {
            return res.json(dbProjects);
          }
        } catch (dbError) {
          // If database query fails or times out, fall back to default projects
          console.warn("⚠️  Database query failed, using default projects:", dbError.message);
        }
      } else {
        console.log("📦 MongoDB not connected, using default projects");
      }
    }
    
    // Fallback to default projects if MongoDB is not configured, not connected, or empty
    res.json(defaultProjects);
  } catch (error) {
    // If anything fails, return default projects instead of error
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

