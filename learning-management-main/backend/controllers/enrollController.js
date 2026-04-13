const Course = require('../models/Course');
const User = require('../models/User');

exports.enrollCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user._id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is already enrolled
    const user = await User.findById(userId);
    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Add course to user's enrolled courses
    user.enrolledCourses.push(courseId);
    await user.save();

    // Add user to course's enrolled students
    course.studentsEnrolled.push(userId);
    // Unlock the course for this student
    const updatedCourse = await course.save();

    res.json({ 
      message: 'Successfully enrolled in course',
      course: updatedCourse
    });

  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ message: 'Error enrolling in course' });
  }
};