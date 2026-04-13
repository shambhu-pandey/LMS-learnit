


// const Course = require('../models/Course');
// const Quiz = require('../models/Quiz');

// // Create course
// exports.createCourse = async (req, res) => {
//   try {
//     const course = await Course.create({
//       ...req.body,
//       instructor: req.user._id,
//       instructorName: req.user.name
//     });
//     res.status(201).json(course);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Get all courses
// exports.getAllCourses = async (req, res) => {
//   try {
//     const courses = await Course.find().populate('instructor', 'name');
//     res.json(courses);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get instructor courses
// exports.getInstructorCourses = async (req, res) => {
//   try {
//     const courses = await Course.find({ instructor: req.user._id })
//       .populate('quizzes');
//     res.json(courses);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get course by ID
// exports.getCourseById = async (req, res) => {
//   try {
//     const course = await Course.findById(req.params.id)
//       .populate('instructor', 'name')
//       .populate('quizzes');
//     if (!course) {
//       return res.status(404).json({ message: 'Course not found' });
//     }
//     res.json(course);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Update course
// exports.updateCourse = async (req, res) => {
//   try {
//     const course = await Course.findOneAndUpdate(
//       { _id: req.params.id, instructor: req.user._id },
//       req.body,
//       { new: true }
//     );
//     if (!course) {
//       return res.status(404).json({ message: 'Course not found or unauthorized' });
//     }
//     res.json(course);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Delete course
// exports.deleteCourse = async (req, res) => {
//   try {
//     const course = await Course.findOneAndDelete({
//       _id: req.params.id,
//       instructor: req.user._id
//     });
//     if (!course) {
//       return res.status(404).json({ message: 'Course not found or unauthorized' });
//     }
//     res.json({ message: 'Course deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Add lecture
// exports.addLecture = async (req, res) => {
//   try {
//     const course = await Course.findOneAndUpdate(
//       { _id: req.params.courseId, instructor: req.user._id },
//       { $push: { lectures: req.body } },
//       { new: true }
//     );
//     if (!course) {
//       return res.status(404).json({ message: 'Course not found or unauthorized' });
//     }
//     res.json(course);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Delete lecture
// exports.deleteLecture = async (req, res) => {
//   try {
//     const course = await Course.findOneAndUpdate(
//       { _id: req.params.courseId, instructor: req.user._id },
//       { $pull: { lectures: { _id: req.params.lectureId } } },
//       { new: true }
//     );
//     if (!course) {
//       return res.status(404).json({ message: 'Course not found or unauthorized' });
//     }
//     res.json(course);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Enroll in course
// exports.enrollCourse = async (req, res) => {
//   try {
//     const course = await Course.findByIdAndUpdate(
//       req.params.id,
//       {
//         $addToSet: { studentsEnrolled: req.user._id },
//         $inc: { enrollmentCount: 1 }
//       },
//       { new: true }
//     );
//     if (!course) {
//       return res.status(404).json({ message: 'Course not found' });
//     }
//     res.json(course);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Toggle course lock
// exports.toggleCourseLock = async (req, res) => {
//   try {
//     const course = await Course.findOneAndUpdate(
//       { _id: req.params.id, instructor: req.user._id },
//       [{ $set: { isLocked: { $not: '$isLocked' } } }],
//       { new: true }
//     );
//     if (!course) {
//       return res.status(404).json({ message: 'Course not found or unauthorized' });
//     }
//     res.json(course);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Create quiz
// exports.createQuiz = async (req, res) => {
//   try {
//     const course = await Course.findOne({
//       _id: req.params.courseId,
//       instructor: req.user._id
//     });
    
//     if (!course) {
//       return res.status(404).json({ message: 'Course not found or unauthorized' });
//     }

//     const quiz = new Quiz({
//       ...req.body,
//       course: req.params.courseId,
//       createdBy: req.user._id
//     });

//     const savedQuiz = await quiz.save();
//     course.quizzes.push(savedQuiz._id);
//     await course.save();

//     res.status(201).json(savedQuiz);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Get quizzes by course
// exports.getQuizzesByCourse = async (req, res) => {
//   try {
//     const quizzes = await Quiz.find({ course: req.params.courseId });
//     res.json(quizzes);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // exports.getProfile = async (req, res) => {
// //   try {
// //     const user = await User.findById(req.user.id).select('-password');
// //     res.json(user);
// //   } catch (error) {
// //     res.status(500).json({ message: 'Server Error' });
// //   }
// // };


// // Get user profile
// exports.getProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('-password');
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }
//     res.json({
//       success: true,
//       data: user
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server Error'
//     });
//   }
// };

// // Update user profile
// exports.updateProfile = async (req, res) => {
//   try {
//     const { name, email, currentPassword, newPassword } = req.body;
//     const user = await User.findById(req.user.id);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     // Update basic info
//     if (name) user.name = name;
//     if (email) user.email = email;

//     // Update password if provided
//     if (currentPassword && newPassword) {
//       const isMatch = await bcrypt.compare(currentPassword, user.password);
//       if (!isMatch) {
//         return res.status(400).json({
//           success: false,
//           message: 'Current password is incorrect'
//         });
//       }
//       user.password = await bcrypt.hash(newPassword, 12);
//     }

//     await user.save();
//      // Return user without password
//      const userResponse = {
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role
//     };

//     res.json({
//       success: true,
//       data: userResponse,
//       message: 'Profile updated successfully'
//     });
//   } catch (error) {
//     console.error('Profile update error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error updating profile'
//     });
//   }
// };



















const Course = require('../models/Course');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Auth User / Login
exports.authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update basic info
    if (name) user.name = name;
    if (email) user.email = email;

    // Update password if provided
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }
      user.password = await bcrypt.hash(newPassword, 12);
    }

    await user.save();
    
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    res.json({
      success: true,
      data: userResponse,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
};

// Create course
exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      ...req.body,
      instructor: req.user._id,
      instructorName: req.user.name
    });
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'name');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get instructor courses
exports.getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .populate('quizzes');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name')
      .populate('quizzes');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, instructor: req.user._id },
      req.body,
      { new: true }
    );
    if (!course) {
      return res.status(404).json({ message: 'Course not found or unauthorized' });
    }
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndDelete({
      _id: req.params.id,
      instructor: req.user._id
    });
    if (!course) {
      return res.status(404).json({ message: 'Course not found or unauthorized' });
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add lecture
exports.addLecture = async (req, res) => {
  try {
    const course = await Course.findOneAndUpdate(
      { _id: req.params.courseId, instructor: req.user._id },
      { $push: { lectures: req.body } },
      { new: true }
    );
    if (!course) {
      return res.status(404).json({ message: 'Course not found or unauthorized' });
    }
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete lecture
exports.deleteLecture = async (req, res) => {
  try {
    const course = await Course.findOneAndUpdate(
      { _id: req.params.courseId, instructor: req.user._id },
      { $pull: { lectures: { _id: req.params.lectureId } } },
      { new: true }
    );
    if (!course) {
      return res.status(404).json({ message: 'Course not found or unauthorized' });
    }
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Enroll in course
exports.enrollCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { studentsEnrolled: req.user._id },
        $inc: { enrollmentCount: 1 }
      },
      { new: true }
    );
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Toggle course lock
exports.toggleCourseLock = async (req, res) => {
  try {
    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, instructor: req.user._id },
      [{ $set: { isLocked: { $not: '$isLocked' } } }],
      { new: true }
    );
    if (!course) {
      return res.status(404).json({ message: 'Course not found or unauthorized' });
    }
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create quiz
exports.createQuiz = async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.courseId,
      instructor: req.user._id
    });
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found or unauthorized' });
    }

    const quiz = new Quiz({
      ...req.body,
      course: req.params.courseId,
      createdBy: req.user._id
    });

    const savedQuiz = await quiz.save();
    course.quizzes.push(savedQuiz._id);
    await course.save();

    res.status(201).json(savedQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get quizzes by course
exports.getQuizzesByCourse = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};













