const express = require("express");
const router = express.Router();
const { protect, instructor } = require("../middleware/authMiddleware");
const {
  createMeeting,
  getInstructorMeetings,
  getStudentMeetings,
  updateMeeting,
  deleteMeeting,
  getUpcomingMeetings,
} = require("../controllers/meetingController");

router.get("/instructor", protect, instructor, getInstructorMeetings);
router.get("/student", protect, getStudentMeetings);
router.get("/upcoming", protect, getUpcomingMeetings);
router.post("/", protect, instructor, createMeeting);
router.put("/:id", protect, instructor, updateMeeting);
router.delete("/:id", protect, instructor, deleteMeeting);

module.exports = router;
