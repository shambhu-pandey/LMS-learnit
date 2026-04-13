
const Course = require("../models/Course");
const User = require("../models/User");
const Quiz = require('../models/Quiz');
const Meeting = require("../models/Meeting");
const mongoose = require('mongoose');

const hasInstructorAccess = (role) => ["instructor", "teacher"].includes(role);
const withEnrollmentFlag = (course, userId) => {
  const plainCourse = course.toObject ? course.toObject() : course;
  const students = plainCourse.studentsEnrolled || [];
  const isEnrolled = students.some(
    (student) => student?.toString?.() === userId.toString()
  );

  return {
    ...plainCourse,
    isEnrolled,
  };
};

exports.updateGoogleMeetLink = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { googleMeetLink } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Verify instructor ownership
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    course.googleMeetLink = googleMeetLink;
    await course.save();

    res.json({ message: 'Google Meet link updated successfully', course });
  } catch (error) {
    console.error('Error updating Google Meet link:', error);
    res.status(500).json({ message: 'Failed to update Google Meet link' });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        message: 'Please provide all required fields'
      });
    }

    const course = new Course({
      title,
      description,
      category,
      instructor: req.user._id,
      instructorName: req.user.name,
      lectures: [],
      studentsEnrolled: []
    });

    await course.save();
    res.status(201).json(course);
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    let courses;
    if (hasInstructorAccess(req.user.role)) {
      courses = await Course.find({ instructor: req.user._id })
        .populate("instructor", "name email")
        .populate("studentsEnrolled", "name email")
        .populate("lectures");
    } else {
      const fetchedCourses = await Course.find({})
        .populate("instructor", "name email")
        .populate("lectures");
      courses = fetchedCourses.map((course) => withEnrollmentFlag(course, req.user._id));
    }
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can enroll in courses" });
    }

    if (course.studentsEnrolled.includes(req.user._id)) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    course.studentsEnrolled.push(req.user._id);
    course.enrollmentCount += 1;
    await course.save();

    const user = await User.findById(req.user._id);
    if (!user.enrolledCourses) {
      user.enrolledCourses = [];
    }
    user.enrolledCourses.push(course._id);
    await user.save();

    res.json({ 
      message: "Successfully enrolled in course",
      course: course
    });
  } catch (err) {
    console.error("Error enrolling in course:", err);
    res.status(500).json({ message: "Error enrolling in course", error: err.message });
  }
};

exports.getInstructorCourses = async (req, res) => {
  try {
    if (!hasInstructorAccess(req.user.role)) {
      return res.status(403).json({ message: "Access denied. Instructors or teachers only." });
    }

    const courses = await Course.find({ instructor: req.user._id })
      .populate('quizzes')
      .populate('instructor', 'name email')
      .populate('lectures')
      .sort('-createdAt');
    res.json(courses);
  } catch (error) {
    console.error("Error fetching instructor courses:", error);
    res.status(500).json({ message: "Error fetching courses", error: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { title, description, category, content } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this course" });
    }

    course.title = title;
    course.description = description;
    course.category = category;
    course.content = content;

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Error updating course", error: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this course" });
    }

    await course.remove();
    
    await User.updateMany(
      { enrolledCourses: course._id },
      { $pull: { enrolledCourses: course._id } }
    );

    res.json({ message: "Course removed successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Lecture Management
exports.addLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, videoUrl } = req.body;

    if (!title || !description || !videoUrl) {
      return res.status(400).json({
        message: 'Please provide title, description and video URL'
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to add lectures to this course"
      });
    }

    course.lectures.push({
      title,
      description,
      videoUrl
    });

    await course.save();
    res.status(201).json({ 
      message: "Lecture added successfully", 
      course 
    });
  } catch (error) {
    console.error("Error adding lecture:", error);
    res.status(500).json({
      message: "Error adding lecture",
      error: error.message
    });
  }
};

exports.getCourseLectures = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate('lectures');

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const isInstructor = course.instructor.toString() === req.user._id.toString();
    const isEnrolled = course.studentsEnrolled.includes(req.user._id);

    if (!isInstructor && !isEnrolled) {
      return res.status(403).json({
        message: "Access denied. Please enroll in the course first."
      });
    }

    res.json(course.lectures);
  } catch (error) {
    console.error("Error fetching lectures:", error);
    res.status(500).json({
      message: "Error fetching lectures",
      error: error.message
    });
  }
};

exports.deleteLecture = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to delete lectures from this course"
      });
    }

    course.lectures = course.lectures.filter(
      lecture => lecture._id.toString() !== lectureId
    );

    await course.save();
    res.json({
      message: "Lecture deleted successfully",
      course
    });
  } catch (error) {
    console.error("Error deleting lecture:", error);
    res.status(500).json({
      message: "Error deleting lecture",
      error: error.message
    });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name email")
      .populate("studentsEnrolled", "name email")
      .populate("lectures");
    
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const isInstructor = course.instructor?._id?.toString?.() === req.user._id.toString();
    const isEnrolled = course.studentsEnrolled.some(
      (student) => student?._id?.toString?.() === req.user._id.toString()
    );

    if (req.user.role === "student" && course.isLocked && !isEnrolled && !isInstructor) {
      return res.status(403).json({
        message: "Enroll in this course first to access its content.",
      });
    }

    res.json({
      ...course.toObject(),
      isEnrolled,
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Error fetching course", error: error.message });
  }
};

exports.unenrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.studentsEnrolled = course.studentsEnrolled.filter(
      studentId => studentId.toString() !== req.user._id.toString()
    );
    await course.save();

    const user = await User.findById(req.user._id);
    if (user.enrolledCourses) {
      user.enrolledCourses = user.enrolledCourses.filter(
        courseId => courseId.toString() !== course._id.toString()
      );
      await user.save();
    }

    res.json({ message: "Successfully unenrolled from course" });
  } catch (err) {
    console.error("Error unenrolling from course:", err);
    res.status(500).json({ message: "Error unenrolling from course", error: err.message });
  }
};

exports.getAvailableCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: 'published' })
      .populate('instructor', 'name email')
      .populate('lectures')
    res.json(courses.map((course) => withEnrollmentFlag(course, req.user._id)));
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses", error: error.message });
  }
};
// exports.getAvailableCourses = async (req, res) => {
//   try {
//     // Fetch courses and include googleMeetLink
//     const courses = await Course.find({}, 'title description instructorName category googleMeetLink lectures');
//     res.json(courses);
//   } catch (error) {
//     console.error('Error fetching available courses:', error);
//     res.status(500).json({ message: 'Failed to fetch courses' });
//   }
// };

// exports.getEnrolledCourses = async (req, res) => {
//   try {
//     if (!req.user || !req.user._id) {
//       return res.status(401).json({ 
//         message: 'Authentication required' 
//       });
//     }

//     const courses = await Course.find({
//       studentsEnrolled: req.user._id
//     })
//     .populate('lectures')
//     .select('-studentsEnrolled');

//     return res.status(200).json(courses);
//   } catch (error) {
//     console.error('getEnrolledCourses error:', error);
//     return res.status(500).json({
//       message: 'Error fetching enrolled courses',
//       error: error.message
//     });
//   }
// };


exports.getEnrolledCourses = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        message: 'Authentication required' 
      });
    }

    const courses = await Course.find({
      studentsEnrolled: req.user._id
    })
    .populate('lectures')
    .select('title description instructorName category googleMeetLink lectures isLocked'); // Include googleMeetLink

    return res.status(200).json(
      courses.map((course) => ({
        ...(course.toObject ? course.toObject() : course),
        isEnrolled: true,
      }))
    );
  } catch (error) {
    console.error('getEnrolledCourses error:', error);
    return res.status(500).json({
      message: 'Error fetching enrolled courses',
      error: error.message
    });
  }
};
exports.toggleCourseLock = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to modify this course" });
    }

    course.isLocked = !course.isLocked;
    await course.save();

    res.json({ 
      message: `Course ${course.isLocked ? 'locked' : 'unlocked'} successfully`,
      course
    });
  } catch (error) {
    res.status(500).json({ message: "Error toggling course lock", error: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Verify instructor ownership
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this course" });
    }

    // Delete all associated lectures
    course.lectures = [];

    // Delete the course
    await Course.findByIdAndDelete(req.params.id);
    await Meeting.deleteMany({ course: req.params.id });
    
    // Remove course reference from enrolled students
    await User.updateMany(
      { enrolledCourses: req.params.id },
      { $pull: { enrolledCourses: req.params.id } }
    );

    res.json({ message: "Course and associated content deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ 
      message: "Error deleting course", 
      error: error.message 
    });
  }
};
module.exports = {
  createCourse: exports.createCourse,
  getCourses: exports.getCourses,
  enrollCourse: exports.enrollCourse,
  getInstructorCourses: exports.getInstructorCourses,
  updateCourse: exports.updateCourse,
  deleteCourse: exports.deleteCourse,
  addLecture: exports.addLecture,
  getCourseLectures: exports.getCourseLectures,
  deleteLecture: exports.deleteLecture,
  getCourseById: exports.getCourseById,
  unenrollCourse: exports.unenrollCourse,
  getAvailableCourses: exports.getAvailableCourses,
  getEnrolledCourses: exports.getEnrolledCourses,
  toggleCourseLock: exports.toggleCourseLock,
  updateGoogleMeetLink: exports.updateGoogleMeetLink
};















