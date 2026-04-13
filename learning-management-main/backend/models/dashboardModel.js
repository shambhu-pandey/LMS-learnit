const mongoose = require("mongoose");

const dashboardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courses: [{ title: String, progress: Number }],
  assignments: [{ title: String, status: String }],
  discussions: [{ message: String, date: Date }],
});

const Dashboard = mongoose.model("Dashboard", dashboardSchema);

module.exports = Dashboard;
