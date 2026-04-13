const Course = require("../models/Course");
const Meeting = require("../models/Meeting");

const hasInstructorAccess = (role) => ["instructor", "teacher"].includes(role);

const isValidGoogleMeetLink = (value) => {
  try {
    const url = new URL(value);
    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      url.hostname.includes("meet.google.com")
    );
  } catch (error) {
    return false;
  }
};

const buildSortKey = (meeting) => `${meeting.date}T${meeting.startTime || "00:00"}`;

exports.createMeeting = async (req, res) => {
  try {
    const { courseId, title, description, meetLink, date, startTime, endTime, slot } = req.body;

    if (!courseId || !title || !meetLink || !date || !startTime) {
      return res.status(400).json({
        message: "Course, title, Google Meet link, date, and start time are required",
      });
    }

    if (!isValidGoogleMeetLink(meetLink)) {
      return res.status(400).json({
        message: "Please enter a valid Google Meet link",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to schedule meetings for this course" });
    }

    const meeting = await Meeting.create({
      course: course._id,
      instructor: req.user._id,
      title,
      description,
      meetLink,
      date,
      startTime,
      endTime,
      slot,
    });

    const populatedMeeting = await Meeting.findById(meeting._id)
      .populate("course", "title instructorName")
      .populate("instructor", "name email");

    res.status(201).json(populatedMeeting);
  } catch (error) {
    console.error("Error creating meeting:", error);
    res.status(500).json({ message: "Failed to create meeting", error: error.message });
  }
};

exports.getInstructorMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({ instructor: req.user._id })
      .populate("course", "title instructorName")
      .sort({ date: 1, startTime: 1, createdAt: -1 });

    res.json(meetings);
  } catch (error) {
    console.error("Error fetching instructor meetings:", error);
    res.status(500).json({ message: "Failed to fetch meetings", error: error.message });
  }
};

exports.getStudentMeetings = async (req, res) => {
  try {
    const enrolledCourses = await Course.find({
      studentsEnrolled: req.user._id,
    }).select("_id title instructorName");

    const enrolledCourseIds = enrolledCourses.map((course) => course._id);

    const meetings = await Meeting.find({
      course: { $in: enrolledCourseIds },
    })
      .populate("course", "title instructorName")
      .populate("instructor", "name email")
      .sort({ date: 1, startTime: 1, createdAt: -1 });

    res.json(meetings);
  } catch (error) {
    console.error("Error fetching student meetings:", error);
    res.status(500).json({ message: "Failed to fetch meetings", error: error.message });
  }
};

exports.updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id).populate("course", "instructor");

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    if (meeting.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this meeting" });
    }

    const nextValues = {
      title: req.body.title ?? meeting.title,
      description: req.body.description ?? meeting.description,
      meetLink: req.body.meetLink ?? meeting.meetLink,
      date: req.body.date ?? meeting.date,
      startTime: req.body.startTime ?? meeting.startTime,
      endTime: req.body.endTime ?? meeting.endTime,
      slot: req.body.slot ?? meeting.slot,
    };

    if (!isValidGoogleMeetLink(nextValues.meetLink)) {
      return res.status(400).json({
        message: "Please enter a valid Google Meet link",
      });
    }

    Object.assign(meeting, nextValues);
    await meeting.save();

    const populatedMeeting = await Meeting.findById(meeting._id)
      .populate("course", "title instructorName")
      .populate("instructor", "name email");

    res.json(populatedMeeting);
  } catch (error) {
    console.error("Error updating meeting:", error);
    res.status(500).json({ message: "Failed to update meeting", error: error.message });
  }
};

exports.deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    if (meeting.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this meeting" });
    }

    await Meeting.findByIdAndDelete(req.params.id);
    res.json({ message: "Meeting deleted successfully" });
  } catch (error) {
    console.error("Error deleting meeting:", error);
    res.status(500).json({ message: "Failed to delete meeting", error: error.message });
  }
};

exports.getUpcomingMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find(
      hasInstructorAccess(req.user.role)
        ? { instructor: req.user._id }
        : { course: { $in: (await Course.find({ studentsEnrolled: req.user._id }).select("_id")).map((course) => course._id) } }
    )
      .populate("course", "title instructorName")
      .sort({ date: 1, startTime: 1, createdAt: -1 });

    const now = new Date();
    const upcomingMeetings = meetings
      .filter((meeting) => {
        const scheduledAt = new Date(buildSortKey(meeting));
        return !Number.isNaN(scheduledAt.getTime()) && scheduledAt >= now;
      })
      .slice(0, 5);

    res.json(upcomingMeetings);
  } catch (error) {
    console.error("Error fetching upcoming meetings:", error);
    res.status(500).json({ message: "Failed to fetch upcoming meetings", error: error.message });
  }
};
