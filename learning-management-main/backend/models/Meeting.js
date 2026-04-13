const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Meeting title is required"],
      trim: true,
      maxlength: [120, "Meeting title cannot exceed 120 characters"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    meetLink: {
      type: String,
      required: [true, "Google Meet link is required"],
      trim: true,
    },
    date: {
      type: String,
      required: [true, "Meeting date is required"],
    },
    startTime: {
      type: String,
      required: [true, "Meeting start time is required"],
    },
    endTime: {
      type: String,
      default: "",
    },
    slot: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Meeting", meetingSchema);
