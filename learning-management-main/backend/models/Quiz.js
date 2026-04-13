const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "Option text is required"],
  },
  isCorrect: {
    type: Boolean,
    required: [true, "Option correctness must be specified"],
  },
});

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: [true, "Question text is required"],
  },
  options: {
    type: [optionSchema],
    validate: {
      validator: function (options) {
        return options.length > 0 && options.some((opt) => opt.isCorrect);
      },
      message: "Question must have at least one option and one correct answer",
    },
  },
  points: {
    type: Number,
    default: 1,
    min: [1, "Points must be at least 1"],
  },
});

const attemptSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  score: Number,
  answers: [
    {
      questionId: mongoose.Schema.Types.ObjectId,
      selectedOption: mongoose.Schema.Types.ObjectId,
      isCorrect: Boolean,
    },
  ],
  passed: Boolean,
  submittedAt: { type: Date, default: Date.now },
});

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Quiz title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator ID is required"],
    },
    questions: {
      type: [questionSchema],
      validate: {
        validator: function (questions) {
          return questions.length > 0;
        },
        message: "Quiz must have at least one question",
      },
    },
    timeLimit: {
      type: Number,
      default: 30,
      min: [1, "Time limit must be at least 1 minute"],
    },
    passingScore: {
      type: Number,
      default: 60,
      min: [0, "Passing score cannot be negative"],
      max: [100, "Passing score cannot exceed 100"],
    },
    attempts: [attemptSchema],
    active: {
      type: Boolean,
      default: true,
    },
    allowMultipleAttempts: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for better query performance
quizSchema.index({ course: 1, creator: 1 });

module.exports = mongoose.model("Quiz", quizSchema);
