const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Lecture title is required"],
    },
    description: {
      type: String,
      required: [true, "Lecture description is required"],
    },
    videoUrl: {
      type: String,
      required: [true, "Video URL is required"],
      validate: {
        validator: function (v) {
          // Enhanced YouTube URL validation
          const youtubeRegex =
            /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
          return youtubeRegex.test(v);
        },
        message: (props) => `${props.value} is not a valid YouTube URL!`,
      },
    },
    duration: {
      type: Number,
      default: 0,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const materialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const courseSchema = new mongoose.Schema(
  {
    googleMeetLink: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      maxLength: [100, "Course title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Programming", "Design", "Business", "Marketing", "Other"],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    instructorName: {
      type: String,
      required: true,
    },
    lectures: [lectureSchema],
    studentsEnrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isLocked: {
      type: Boolean,
      default: false,
    },

    studentsEnrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    googleMeetLink: { type: String, default: '' }, 

    enrollmentCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    quizzes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for total lectures
// courseSchema.virtual("totalLectures").get(function () {
//   return this.lectures.length;
// });

// Virtual for total duration
// courseSchema.virtual("totalDuration").get(function () {
//   return this.lectures.reduce(
//     (total, lecture) => total + (lecture.duration || 0),
//     0
//   );
// });

// Pre-save middleware to update enrollment count
courseSchema.pre("save", function (next) {
  if (this.isModified("studentsEnrolled")) {
    this.enrollmentCount = this.studentsEnrolled.length;
  }
  next();
});

// Method to check if a student is enrolled
courseSchema.methods.isStudentEnrolled = function (studentId) {
  return this.studentsEnrolled.includes(studentId);
};

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;

// const mongoose = require('mongoose');

// const courseSchema = new mongoose.Schema({
//     title: {
//         type: String,
//         required: [true, 'Title is required']
//     },
//     description: {
//         type: String,
//         required: [true, 'Description is required']
//     },
//     category: {
//         type: String,
//         enum: ['Programming', 'Design', 'Business', 'Marketing'],
//         required: [true, 'Category is required']
//     },
//     instructor: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     instructorName: {
//         type: String,
//         required: true
//     },
//     quizzes: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Quiz'
//     }]
// }, {
//     timestamps: true
// });

// module.exports = mongoose.model('Course', courseSchema);

// const mongoose = require("mongoose");

// const courseSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true
//   },
//   description: {
//     type: String,
//     required: true
//   },
//   category: {
//     type: String,
//     required: true
//   },
//   instructor: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   instructorName: {
//     type: String,
//     required: true,
//   },
//   content: {
//     type: Object,
//     default: {}
//   },
//   lectures: [{
//     title: {
//       type: String,
//       required: true
//     },
//     url: {
//       type: String,
//       required: true
//     }
//   }],
//   studentsEnrolled: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User"
//   }],
//   enrollmentCount: {
//     type: Number,
//     default: 0
//   },
//   status: {
//     type: String,
//     enum: ['draft', 'published'],
//     default: 'published'
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },

//   isLocked: {
//     type: Boolean,
//     default: true  // Courses are locked by default
//   },
//   price: {
//     type: Number,
//     default: 0
//   },
//   enrollmentStatus: {
//     type: String,
//     enum: ['Open', 'Closed', 'In Progress'],
//     default: 'Open'
//   },
//   quizzes: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Quiz'
//   }]
// }, {
//   timestamps: true
// });

// module.exports = mongoose.model("Course", courseSchema);
