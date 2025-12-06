const express = require("express");
const router = express.Router();
const { getSettings, updateSettings } = require("../controllers/settingsController");
const adminAuth = require("../middleware/adminAuth");

// Public route to get settings
router.get("/", getSettings);

// Admin route to update settings
router.put("/", adminAuth, updateSettings);

module.exports = router;

