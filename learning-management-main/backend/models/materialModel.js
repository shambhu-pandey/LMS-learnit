// filepath: c:\Users\shamb\Downloads\final\capstone-project-main\backend\models\materialModel.js
const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Material", materialSchema);
