const express = require("express");
const router = express.Router();
const materialController = require("../controllers/materialController");
const { protect } = require("../middleware/authMiddleware");

// Route to fetch all materials
router.get("/", protect, materialController.getMaterials);

// // Route to delete a material by ID
// router.delete("/:materialId", protect, instructor, materialController.deleteMaterial);

module.exports = router;
