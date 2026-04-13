const express = require("express");
const Dashboard = require("../models/dashboardModel");
const router = express.Router();

// ✅ Create Dashboard for a User (Only if not exists)
router.post("/create", async (req, res) => {
  const { userId } = req.body;

  try {
    const existingDashboard = await Dashboard.findOne({ userId });
    if (existingDashboard) return res.status(400).json({ message: "Dashboard already exists" });

    const newDashboard = new Dashboard({ userId, courses: [], assignments: [], discussions: [] });
    await newDashboard.save();

    res.status(201).json({ message: "Dashboard created successfully", dashboard: newDashboard });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Fetch Dashboard Data for a User
router.get("/:userId", async (req, res) => {
  try {
    const dashboard = await Dashboard.findOne({ userId: req.params.userId });
    if (!dashboard) return res.status(404).json({ message: "Dashboard not found" });

    res.json(dashboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update Dashboard (Courses, Assignments, Discussions)
router.put("/:userId", async (req, res) => {
  const { userId } = req.params;
  const { courses, assignments, discussions } = req.body;

  try {
    const dashboard = await Dashboard.findOne({ userId });
    if (!dashboard) return res.status(404).json({ message: "Dashboard not found" });

    dashboard.courses = courses || dashboard.courses;
    dashboard.assignments = assignments || dashboard.assignments;
    dashboard.discussions = discussions || dashboard.discussions;

    await dashboard.save();
    res.json({ message: "Dashboard updated successfully", dashboard });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
