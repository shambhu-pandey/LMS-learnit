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

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  ...(process.env.CLIENT_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
];

const corsOptionsDelegate = (req, callback) => {
  const requestOrigin = req.header("Origin");
  let isSameHost = false;

  if (requestOrigin) {
    try {
      isSameHost = new URL(requestOrigin).host === req.get("host");
    } catch {
      isSameHost = false;
    }
  }

  callback(null, {
    origin: !requestOrigin || isSameHost || allowedOrigins.includes(requestOrigin),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });
};

app.use(cors(corsOptionsDelegate));

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

const getDbStatus = () => {
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  let mongoTarget = null;

  if (process.env.MONGO_URI) {
    try {
      const parsedUri = new URL(process.env.MONGO_URI);
      mongoTarget = {
        protocol: parsedUri.protocol.replace(":", ""),
        host: parsedUri.host,
        database: parsedUri.pathname.replace(/^\//, "") || "(default)",
      };
    } catch {
      mongoTarget = { parseError: true };
    }
  }

  return {
    connected: mongoose.connection.readyState === 1,
    state: states[mongoose.connection.readyState] || "unknown",
    mongoConfigured: Boolean(process.env.MONGO_URI),
    target: mongoTarget,
    connection: connectDB.getStatus ? connectDB.getStatus() : null,
  };
};

// Health check for Render and uptime monitoring
app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: Date.now(), database: getDbStatus() });
});

app.use('/api', (req, res, next) => {
  if (req.path === '/health') return next();

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database is not connected. Set MONGO_URI in Render and allow Render network access in MongoDB Atlas.',
      database: getDbStatus(),
    });
  }

  next();
});

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

// Serve frontend build (if present) from backend/client
const clientBuildPath = path.join(__dirname, 'client');
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}
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
