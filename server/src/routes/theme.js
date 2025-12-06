const express = require("express");
const router = express.Router();
const { getTheme, updateTheme } = require("../controllers/themeController");
const adminAuth = require("../middleware/adminAuth");

// Public route to get theme
router.get("/", getTheme);

// Admin route to update theme
router.put("/", adminAuth, updateTheme);

module.exports = router;

