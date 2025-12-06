const express = require("express");
const router = express.Router();
const { getHero } = require("../controllers/heroController");

// Public route to get hero settings
router.get("/", getHero);

module.exports = router;

