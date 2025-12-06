const express = require("express");
const router = express.Router();
const { trackView } = require("../controllers/projectViewController");

// Public route to track project views
router.post("/", trackView);

module.exports = router;

