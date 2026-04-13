const express = require("express");
const router = express.Router();
const { protect, instructor } = require("../middleware/authMiddleware");
const {
  createCourse,
  getCourses,
  enrollCourse,
  getCourseById,
  addLecture,
  getCourseLectures,
  deleteLecture,
  updateCourse,
  deleteCourse,
  getInstructorCourses,
  getAvailableCourses,
  getEnrolledCourses,
  toggleCourseLock,
  unenrollCourse,
  updateGoogleMeetLink
} = require("../controllers/courseController");

// Course routes
router.post("/", protect, instructor, createCourse);
router.get("/", protect, getCourses);
router.get("/instructor", protect, instructor, getInstructorCourses);
router.get("/available", protect, getAvailableCourses);
router.get("/enrolled", protect, getEnrolledCourses);
router.get("/:id", protect, getCourseById);
router.put("/:id", protect, instructor, updateCourse);
router.delete("/:id", protect, instructor, deleteCourse);
router.put('/:courseId/google-meet-link', protect, updateGoogleMeetLink);
// Enrollment routes
router.post("/:id/enroll", protect, enrollCourse);
router.delete("/:id/unenroll", protect, unenrollCourse);

// Lecture routes
router.post("/:courseId/lectures", protect, instructor, addLecture);
router.get("/:courseId/lectures", protect, getCourseLectures);
router.delete("/:courseId/lectures/:lectureId", protect, instructor, deleteLecture);

// Course lock route
router.put("/:id/toggle-lock", protect, instructor, toggleCourseLock);


module.exports = router;








// const express = require("express");
// const router = express.Router();
// const { protect, instructor } = require("../middleware/authMiddleware");

// // Import controllers
// const {
//   createCourse,
//   getCourses,
//   enrollCourse,
//   getInstructorCourses,
//   updateCourse,
//   deleteCourse,
//   addLecture,
//   getCourseLectures,
//   deleteLecture,
//   getCourseById,
//   unenrollCourse,
//   getAvailableCourses,
//   getEnrolledCourses,
//   toggleCourseLock
// } = require("../controllers/courseController");

// // Public routes (no authentication required)
// router.get("/available", getAvailableCourses);

// // Protected routes (require authentication)
// router.use(protect);

// // Course routes
// router.route("/")
//   .get(getCourses)
//   .post(instructor, createCourse);

// router.get("/instructor", instructor, getInstructorCourses);
// router.get("/enrolled", getEnrolledCourses);

// // Course specific routes
// router.route("/:id")
//   .get(getCourseById)
//   .put(instructor, updateCourse)
//   .delete(instructor, deleteCourse);

// // Enrollment routes
// router.post("/:id/enroll", enrollCourse);
// router.delete("/:id/unenroll", unenrollCourse);

// // Lecture routes
// router.route("/:courseId/lectures")
//   .get(getCourseLectures)
//   .post(instructor, addLecture);

// router.delete("/:courseId/lectures/:lectureId", instructor, deleteLecture);

// // Course lock route
// router.put("/:id/toggle-lock", instructor, toggleCourseLock);

// module.exports = router;









// const express = require("express");
// const router = express.Router();
// const { protect, instructor } = require("../middleware/authMiddleware");
// const { 
//     getInstructorCourses,
//     createCourse 
// } = require("../controllers/courseController");

// router.get("/instructor", protect, instructor, getInstructorCourses);
// router.post("/", protect, instructor, createCourse);

// module.exports = router;









