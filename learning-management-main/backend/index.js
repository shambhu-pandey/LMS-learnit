const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const quizRoutes = require("./routes/quizRoutes");
const materialRoutes = require("./routes/materialRoutes");
const updateRoutes = require("./routes/updateRoutes");
const terminalRoutes = require("./routes/terminalRoutes");
const meetingRoutes = require("./routes/meetingRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api", quizRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/users", updateRoutes);
app.use("/api/terminal", terminalRoutes);
app.use("/api/meetings", meetingRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI) // ✅ Removed deprecated options
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1); // Exit process if DB connection fails
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
