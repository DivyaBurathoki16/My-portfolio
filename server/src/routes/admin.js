const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject
} = require("../controllers/adminController");
const { updateHero } = require("../controllers/heroController");
const { getMessages, deleteMessage, replyToMessage } = require("../controllers/messagesController");
const { getAnalytics } = require("../controllers/analyticsController");

// All admin routes require authentication
router.use(adminAuth);

router.get("/projects", getAllProjects);
router.post("/projects", createProject);
router.put("/projects/:id", updateProject);
router.delete("/projects/:id", deleteProject);

// Hero settings update
router.put("/hero", updateHero);

// Messages
router.get("/messages", getMessages);
router.delete("/messages/:id", deleteMessage);
router.post("/messages/:id/reply", replyToMessage);

// Analytics
router.get("/analytics", getAnalytics);

module.exports = router;

