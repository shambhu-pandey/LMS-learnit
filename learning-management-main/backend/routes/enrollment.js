const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { enrollInCourse, getEnrolledCourses } = require('../controllers/courseController');

router.post('/:courseId/enroll', auth, enrollInCourse);
router.get('/enrolled', auth, getEnrolledCourses);

module.exports = router;