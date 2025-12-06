// Migration script to move projects from data/projects.js to MongoDB
// Run this once: node src/utils/migrateProjects.js

require("dotenv").config();
const mongoose = require("mongoose");
const Project = require("../models/Project");
const { projects } = require("../data/projects");

const migrateProjects = async () => {
  if (!process.env.MONGODB_URI) {
    console.error("❌ MONGODB_URI not set in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      autoIndex: true
    });
    console.log("✅ Connected to MongoDB");

    // Check if projects already exist
    const existingCount = await Project.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  Found ${existingCount} existing projects in database.`);
      console.log("   Skipping migration to avoid duplicates.");
      console.log("   Delete existing projects manually if you want to re-migrate.");
      process.exit(0);
    }

    // Transform and insert projects
    const projectsToInsert = projects.map((project, index) => ({
      title: project.title,
      description: project.description,
      tech: project.tech || [],
      github: project.github || "",
      live: project.live || "",
      image: project.image || "",
      featured: false,
      order: index
    }));

    await Project.insertMany(projectsToInsert);
    console.log(`✅ Successfully migrated ${projectsToInsert.length} projects to MongoDB`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
};

migrateProjects();

