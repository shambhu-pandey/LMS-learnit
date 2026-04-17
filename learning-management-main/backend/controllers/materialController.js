const path = require("path");
const Course = require("../models/Course");
const fs = require("fs");

const Material = require("../models/materialModel");

exports.uploadMaterial = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title } = req.body;
    const file = req.file;

    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const timestamp = Date.now();
    const sanitizedTitle = title.trim().replace(/[^\w.-]+/g, "_");
    const fileExtension = path.extname(file.originalname);
    const newFileName = `${sanitizedTitle}_${timestamp}${fileExtension}`;
    const newPath = path.join("uploads", newFileName);

    fs.renameSync(file.path, newPath);

    const material = new Material({
      courseId,
      title,
      fileName: newFileName,
      filePath: newPath,
    });

    await material.save();

    res.status(201).json({
      success: true,
      message: "Material uploaded successfully",
      material,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMaterials = async (req, res) => {
  try {
    const materials = await Material.find().sort({ uploadedAt: -1 });
    res.status(200).json({ success: true, materials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCourseMaterials = async (req, res) => {
  try {
    const { courseId } = req.params;
    const materials = await Material.find({ courseId }).sort({ uploadedAt: -1 });

    res.status(200).json({ success: true, materials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//

// exports.getMaterials = async (req, res) => {
//   try {
//       const { courseId } = req.params;

//       const materials = await Material.find({ courseId });

//       res.status(200).json({ success: true, materials });
//   } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//   }
// };

// exports.deleteMaterial = async (req, res) => {
//   const { materialId } = req.params;

//   try {
//     const material = await Material.findById(materialId);

//     if (!material) {
//       return res.status(404).json({ message: "Material not found" });
//     }

//     // Optional: Check if the user is the owner or an instructor
//     if (req.user.role !== "instructor" && req.user._id.toString() !== material.teacherId.toString()) {
//       return res.status(403).json({ message: "Not authorized to delete this material" });
//     }

//     await material.remove();
//     res.status(200).json({ message: "Material deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting material:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };



// exports.deleteMaterial = async (req, res) => {
//   const { materialId } = req.params;

//   try {
//     console.log("Delete request received for material ID:", materialId); // Debugging

//     const material = await Material.findById(materialId);

//     if (!material) {
//       console.log("Material not found"); // Debugging
//       return res.status(404).json({ message: "Material not found" });
//     }

//     // Optional: Check if the user is the owner or an instructor
//     if (req.user.role !== "instructor" && req.user._id.toString() !== material.teacherId.toString()) {
//       console.log("Not authorized to delete this material"); // Debugging
//       return res.status(403).json({ message: "Not authorized to delete this material" });
//     }

//     // Remove the material from the database
//     await material.remove();

//     // Optionally, delete the file from the filesystem
//     if (fs.existsSync(material.filePath)) {
//       fs.unlinkSync(material.filePath);
//     }

//     res.status(200).json({ message: "Material deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting material:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
