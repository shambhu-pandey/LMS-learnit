const express = require("express");
const router = express.Router();
const { protect, instructor } = require("../middleware/authMiddleware");
const quizController = require("../controllers/quizController");

// Routes

router.post(
  "/courses/:courseId/quizzes",
  protect,
  instructor,
  quizController.createQuiz
);
router.get(
  "/courses/:courseId/quizzes",
  protect,
  quizController.getQuizzesByCourse
);
router.get("/quizzes/:quizId", protect, quizController.getQuiz);
router.get("/quizzes/:quizId/attempts", protect, quizController.getStudentAttempts);
router.get("/quizzes/:quizId/marks", protect, quizController.getQuizMarks);
router.put("/quizzes/:quizId", protect, instructor, quizController.updateQuiz);
router.post('/quizzes/:quizId/submit', protect, quizController.submitQuiz);


router.delete(
  "/quizzes/:quizId",
  protect,
  instructor,
  quizController.deleteQuiz
);

module.exports = router;
