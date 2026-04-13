const express = require("express");
const router = express.Router();
const materialController = require("../controllers/materialController");
const { protect, instructor } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Route to upload materials for a specific course
router.post(
  "/courses/:courseId/materials",
  protect,
  upload.single("file"),
  materialController.uploadMaterial
);

// Route to fetch all materials
router.get("/", protect, materialController.getMaterials);

// // Route to delete a material by ID
// router.delete("/:materialId", protect, instructor, materialController.deleteMaterial);

module.exports = router;
