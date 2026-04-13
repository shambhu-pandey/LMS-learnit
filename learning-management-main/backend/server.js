// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const path = require("path");
// const fs = require("fs");

// // Load environment variables
// dotenv.config();

// const app = express();

// // Create uploads directory if it doesn't exist
// const uploadDir = path.join(__dirname, 'uploads', 'course-materials');
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Enhanced CORS configuration
// app.use(cors({
//     origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));

// // Body parsing middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Serve static files
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // MongoDB Connection
// mongoose
//     .connect(process.env.MONGO_URI, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     })
//     .then(() => console.log("✅ MongoDB Connected"))
//     .catch((err) => {
//         console.error("❌ MongoDB Connection Error:", err);
//         process.exit(1);
//     });

// // Import Routes
// const authRoutes = require("./routes/authRoutes");
// const courseRoutes = require("./routes/courseRoutes");
// const quizRoutes = require("./routes/quizRoutes");
// const userRoutes = require("./routes/userRoutes");

// const terminalRoutes = require('./routes/terminalRoutes');
// const materialRoutes = require('./routes/materialRoutes');
// // Mount Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/courses", courseRoutes);
// app.use("/api/quizzes", quizRoutes); // Fixed quiz routes path
// app.use("/api/users", userRoutes);
// app.use("/api", materialRoutes);
// // Add to existing setup
// app.use('/uploads', express.static('uploads'));
// app.use('/api', require('./routes/materialRoutes'));
// // ...existing middleware
// app.use('/api/terminal', terminalRoutes);
// // Global error handling middleware
// app.use((err, req, res, next) => {
//     console.error('Error:', err);
//     res.status(err.status || 500).json({
//         success: false,
//         message: err.message || "Internal server error",
//         error: process.env.NODE_ENV === 'development' ? err : {}
//     });
// });

// // Handle 404 routes
// app.use('*', (req, res) => {
//     res.status(404).json({
//         success: false,
//         message: `Route ${req.originalUrl} not found`
//     });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

// Load environment variables
dotenv.config();

const app = express();

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "uploads", "course-materials");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Enhanced CORS configuration
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Import connectDB and routes first
const connectDB = require('./config/db');
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const quizRoutes = require("./routes/quizRoutes");
const userRoutes = require("./routes/userRoutes");
const materialRoutes = require("./routes/materialRoutes");
const terminalRoutes = require("./routes/terminalRoutes");
const updateRoutes = require("./routes/updateRoutes");
const meetingRoutes = require("./routes/meetingRoutes");

// Connect to DB
connectDB();

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/", quizRoutes); // Quiz routes like /api/quizzes/:id and /api/courses/:id/quizzes
app.use("/api/users", userRoutes);
app.use("/api/users", updateRoutes);
app.use("/api/materials", materialRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/terminal", terminalRoutes);
app.use("/api/meetings", meetingRoutes);
// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// Handle 404 routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const path = require("path");
// const fs = require("fs");

// // Load environment variables
// dotenv.config();

// const app = express();

// // Create upload directories
// const uploadDirs = [
//     path.join(__dirname, 'uploads'),
//     path.join(__dirname, 'uploads/materials'),
//     path.join(__dirname, 'uploads/course-materials')
// ];

// uploadDirs.forEach(dir => {
//     if (!fs.existsSync(dir)) {
//         fs.mkdirSync(dir, { recursive: true });
//     }
// });

// // Enhanced CORS configuration
// app.use(cors({
//     origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));

// // Body parsing middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Serve static files
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // MongoDB Connection
// mongoose
//     .connect(process.env.MONGO_URI, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     })
//     .then(() => console.log("✅ MongoDB Connected"))
//     .catch((err) => {
//         console.error("❌ MongoDB Connection Error:", err);
//         process.exit(1);
//     });

// // Import Routes
// const authRoutes = require("./routes/authRoutes");
// const courseRoutes = require("./routes/courseRoutes");
// const quizRoutes = require("./routes/quizRoutes");
// const userRoutes = require("./routes/userRoutes");
// const materialRoutes = require('./routes/materialRoutes');
// const terminalRoutes = require('./routes/terminalRoutes');

// // Mount Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/courses", courseRoutes);
// app.use("/api/quizzes", quizRoutes); // Fixed quiz routes path
// app.use("/api/users", userRoutes);
// app.use("/api/materials", materialRoutes); // Fixed materials route path
// app.use("/api/terminal", terminalRoutes);

// // Global error handling middleware
// app.use((err, req, res, next) => {
//     console.error('Error:', err);
//     res.status(err.status || 500).json({
//         success: false,
//         message: err.message || "Internal server error",
//         error: process.env.NODE_ENV === 'development' ? err : {}
//     });
// });

// // Handle 404 routes
// app.use('*', (req, res) => {
//     res.status(404).json({
//         success: false,
//         message: `Route ${req.originalUrl} not found`
//     });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
