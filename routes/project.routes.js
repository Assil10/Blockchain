const express = require("express");
const router = express.Router();
const controller = require("../controllers/project.controller");

// Public routes
router.get("/", controller.getAllProjects);
router.get("/:id", controller.getProjectById);

// Admin routes (add auth later)
router.post("/", controller.createProject);
router.put("/:id", controller.updateProject);
router.delete("/:id", controller.deleteProject);

module.exports = router;
