// const express = require("express");
// const { authMiddleware, roleMiddleware } = require("../middleware/authMiddleware");

// // const router = express.Router();

// // router.get("/instructor", authMiddleware, roleMiddleware(["instructor"]), (req, res) => {
// //   res.json({ message: "Welcome, Instructor" });
// // });

// // router.get("/student", authMiddleware, roleMiddleware(["student"]), (req, res) => {
// //   res.json({ message: "Welcome, Student" });
// // });

// // router.get("/admin", authMiddleware, roleMiddleware(["admin"]), (req, res) => {
// //   res.json({ message: "Welcome, Admin" });
// // });

// // module.exports = router;


const express = require('express');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get("/instructor", authMiddleware, roleMiddleware(["instructor"]), (req, res) => {
  res.send("Instructor route");
});

module.exports = router;