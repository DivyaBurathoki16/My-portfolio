const express = require("express");
const { getProjects, getProjectById } = require("../controllers/projectsController");

const router = express.Router();

router.get("/", getProjects);
router.get("/:id", getProjectById);

module.exports = router;

