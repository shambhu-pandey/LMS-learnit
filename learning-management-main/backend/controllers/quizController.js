const Quiz = require("../models/Quiz");
const Course = require("../models/Course");


// Create a new quiz
exports.createQuiz = async (req, res) => {
  try {
    const { courseId } = req.params; // Get courseId from URL parameters
    const { title, description, questions, timeLimit, passingScore } =
      req.body;

    const course = await Course.findById(courseId);
    console.log(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to create quiz for this course" });
    }

    // Create new quiz
    const quiz = new Quiz({
      title,
      description,
      course: courseId,
      questions,
      timeLimit: timeLimit || 30,
      passingScore: passingScore || 60,
      creator: req.user._id,
    });

    await quiz.save();

    course.quizzes.push(quiz._id);
    await course.save();

    res.status(201).json(quiz);
  } catch (error) {
    console.error("Quiz creation error:", error);
    res.status(500).json({
      message: "Failed to create quiz",
      error: error.message,
    });
  }
};








exports.getQuizzesByCourse = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId })
      .populate("creator", "name")
      .sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ message: "Failed to fetch quizzes" });
  }
};



// exports.getQuizzesByCourse = async (req, res) => {
//   try {
//     const { courseId } = req.params;

//     // Validate courseId
//     if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
//       return res.status(400).json({ message: "Invalid or missing courseId" });
//     }

//     const quizzes = await Quiz.find({ course: courseId })
//       .populate("creator", "name")
//       .sort({ createdAt: -1 });

//     res.json(quizzes);
//   } catch (error) {
//     console.error("Error fetching quizzes:", error);
//     res.status(500).json({ message: "Failed to fetch quizzes" });
//   }
// };

// Get a specific quiz
exports.getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId)
      .populate("creator", "name")
      .populate("course", "title");

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ message: "Failed to fetch quiz" });
  }
};

// Update a quiz
exports.updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Check ownership
    if (quiz.creator.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this quiz" });
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.quizId,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json(updatedQuiz);
  } catch (error) {
    console.error("Error updating quiz:", error);
    res.status(500).json({ message: "Failed to update quiz" });
  }
};

// Delete a quiz
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Check ownership
    if (quiz.creator.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this quiz" });
    }

    // Remove quiz reference from course
    await Course.findByIdAndUpdate(quiz.course, {
      $pull: { quizzes: quiz._id },
    });

    await Quiz.findByIdAndDelete(req.params.quizId);
    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    res.status(500).json({ message: "Failed to delete quiz" });
  }
};

// Submit a quiz attempt



exports.submitQuiz = async (req, res) => {
    try {
        const { answers } = req.body; // `answers` is an array of { questionId, selectedOption }
        const quiz = await Quiz.findById(req.params.quizId);

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        // Check if student has already attempted the quiz
        const existingAttempt = quiz.attempts.find(
            (attempt) => attempt.student.toString() === req.user._id.toString()
        );

        if (existingAttempt && !quiz.allowMultipleAttempts) {
            return res.status(400).json({
                success: false,
                message: "You have already attempted this quiz. Multiple attempts are not allowed.",
                previousAttempt: {
                    score: existingAttempt.score,
                    percentageScore: (existingAttempt.score / quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0)) * 100,
                    passed: existingAttempt.passed,
                },
                locked: true,
            });
        }

        let score = 0;
        const results = quiz.questions.map((question) => {
            const userAnswer = answers.find(
                (answer) => answer.questionId === question._id.toString()
            );

            if (!userAnswer) {
                return { questionId: question._id, isCorrect: false };
            }

            const correctOption = question.options.find((opt) => opt.isCorrect);
            const isCorrect = correctOption._id.toString() === userAnswer.selectedOption;

            if (isCorrect) {
                score += question.points || 1; // Add points for correct answers
            }

            return {
                questionId: question._id,
                isCorrect,
                correctOption: correctOption._id,
                selectedOption: userAnswer.selectedOption,
            };
        });

        const totalPoints = quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0);
        const percentageScore = (score / totalPoints) * 100;
        const passed = percentageScore >= quiz.passingScore;

        // Save the attempt
        const attempt = {
            student: req.user._id,
            score,
            answers,
            passed,
            submittedAt: new Date(),
        };

        quiz.attempts.push(attempt);
        await quiz.save();

        res.json({
            success: true,
            score,
            percentageScore,
            passed,
            results,
            message: passed
                ? "Congratulations! You passed the quiz."
                : "Sorry, you did not pass the quiz.",
        });
    } catch (error) {
        console.error("Error submitting quiz:", error);
        res.status(500).json({ message: "Failed to submit quiz" });
    }
};

// Get student quiz attempts
exports.getStudentAttempts = async (req, res) => {
    try {
        const { quizId } = req.params;
        const studentId = req.user._id;

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        // Filter attempts for the current student
        const studentAttempts = quiz.attempts.filter(
            (attempt) => attempt.student.toString() === studentId.toString()
        );

        // Sort by most recent first
        studentAttempts.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

        res.json(studentAttempts);
    } catch (error) {
        console.error("Error fetching student attempts:", error);
        res.status(500).json({ message: "Failed to fetch attempts" });
    }
};

// Get all student marks for a quiz (for instructor)
exports.getQuizMarks = async (req, res) => {
    try {
        const { quizId } = req.params;

        const quiz = await Quiz.findById(quizId)
            .populate("attempts.student", "name email")
            .lean();

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        // Check if requester is the quiz creator (instructor)
        if (quiz.creator.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to view quiz marks" });
        }

        // Calculate total points for percentage calculation
        const totalPoints = quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0);

        // Format attempts data
        const marks = quiz.attempts.map((attempt) => {
            const percentageScore = (attempt.score / totalPoints) * 100;
            return {
                attemptId: attempt._id,
                studentId: attempt.student._id,
                studentName: attempt.student.name,
                studentEmail: attempt.student.email,
                score: attempt.score,
                totalPoints,
                percentageScore: percentageScore.toFixed(2),
                passed: attempt.passed,
                submittedAt: attempt.submittedAt,
            };
        });

        // Sort by most recent first
        marks.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

        res.json({
            quizId: quiz._id,
            quizTitle: quiz.title,
            totalAttempts: marks.length,
            marks,
        });
    } catch (error) {
        console.error("Error fetching quiz marks:", error);
        res.status(500).json({ message: "Failed to fetch quiz marks" });
    }
};


// Get student quiz attempts
exports.getStudentAttempts = async (req, res) => {
    try {
        const { quizId } = req.params;
        const studentId = req.user._id;

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        // Filter attempts for the current student
        const studentAttempts = quiz.attempts.filter(
            (attempt) => attempt.student.toString() === studentId.toString()
        );

        // Sort by most recent first
        studentAttempts.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

        res.json(studentAttempts);
    } catch (error) {
        console.error("Error fetching student attempts:", error);
        res.status(500).json({ message: "Failed to fetch attempts" });
    }
};


// exports.submitQuiz = async (req, res) => {
//   try {
//       const { answers } = req.body; // `answers` is an array of { questionId, selectedOption }
//       const quiz = await Quiz.findById(req.params.quizId);

//       if (!quiz) {
//           return res.status(404).json({ message: "Quiz not found" });
//       }

//       // Check if the user has already attempted the quiz
//       const existingAttempt = quiz.attempts.find(
//           (attempt) => attempt.student.toString() === req.user._id.toString()
//       );

//       if (existingAttempt) {
//           return res.status(400).json({
//               message: "You have already attempted this quiz.",
//               result: existingAttempt,
//           });
//       }

//       let score = 0;
//       const results = quiz.questions.map((question) => {
//           const userAnswer = answers.find(
//               (answer) => answer.questionId === question._id.toString()
//           );

//           if (!userAnswer) {
//               return { questionId: question._id, isCorrect: false };
//           }

//           const correctOption = question.options.find((opt) => opt.isCorrect);
//           const isCorrect = correctOption._id.toString() === userAnswer.selectedOption;

//           if (isCorrect) {
//               score += question.points || 1; // Add points for correct answers
//           }

//           return {
//               questionId: question._id,
//               questionText: question.questionText,
//               isCorrect,
//               correctOption: correctOption._id,
//               selectedOption: userAnswer.selectedOption,
//           };
//       });

//       const totalPoints = quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0);
//       const percentageScore = (score / totalPoints) * 100;
//       const passed = percentageScore >= quiz.passingScore;

//       // Save the attempt
//       const attempt = {
//           student: req.user._id,
//           score: percentageScore,
//           answers: results,
//           passed,
//           submittedAt: new Date(),
//       };
//       quiz.attempts.push(attempt);
//       await quiz.save();

//       res.json({
//           success: true,
//           score,
//           percentageScore,
//           passed,
//           results,
//           message: passed
//               ? "Congratulations! You passed the quiz."
//               : "Sorry, you did not pass the quiz.",
//       });
//   } catch (error) {
//       console.error("Error submitting quiz:", error);
//       res.status(500).json({ message: "Failed to submit quiz" });
//   }
// };


// exports.getQuizResult = async (req, res) => {
//   try {
//       const quiz = await Quiz.findById(req.params.quizId).populate("questions.options");

//       if (!quiz) {
//           return res.status(404).json({ message: "Quiz not found" });
//       }

//       const attempt = quiz.attempts.find(
//           (attempt) => attempt.student.toString() === req.user._id.toString()
//       );

//       if (!attempt) {
//           return res.status(404).json({ message: "No attempt found for this quiz" });
//       }

//       res.json({
//           success: true,
//           attempt,
//           questions: quiz.questions,
//       });
//   } catch (error) {
//       console.error("Error fetching quiz result:", error);
//       res.status(500).json({ message: "Failed to fetch quiz result" });
//   }
// };















// // filepath: c:\Users\shamb\Downloads\capstone-project-main (2)\nayka\capstone-project-main\backend\controllers\quizController.js
// const Quiz = require('../models/Quiz');
// const Course = require('../models/Course');

// // Create quiz
// exports.createQuiz = async (req, res) => {
//     try {
//         const { title, description, questions, timeLimit, passingScore } = req.body;
//         const courseId = req.params.courseId;

//         const course = await Course.findById(courseId);
//         if (!course) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Course not found'
//             });
//         }

//         const quiz = new Quiz({
//             title,
//             description,
//             course: courseId,
//             creator: req.user._id,
//             questions,
//             timeLimit: timeLimit || 30,
//             passingScore: passingScore || 60
//         });

//         await quiz.save();

//         // Add quiz to course
//         course.quizzes.push(quiz._id);
//         await course.save();

//         res.status(201).json({
//             success: true,
//             data: quiz,
//             message: 'Quiz created successfully'
//         });
//     } catch (error) {
//         console.error('Quiz creation error:', error);
//         res.status(500).json({
//             success: false,
//             message: error.message || 'Failed to create quiz'
//         });
//     }
// };

// // Get all quizzes for a course
// exports.getQuizzesByCourse = async (req, res) => {
//     try {
//         const quizzes = await Quiz.find({ course: req.params.courseId })
//             .populate('creator', 'name')
//             .select('-questions.options.isCorrect');

//         res.json({
//             success: true,
//             data: quizzes
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Error fetching quizzes'
//         });
//     }
// };

// // Get single quiz
// exports.getQuiz = async (req, res) => {
//     try {
//         const quiz = await Quiz.findById(req.params.quizId)
//             .populate('creator', 'name');

//         if (!quiz) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Quiz not found'
//             });
//         }

//         res.json({
//             success: true,
//             data: quiz
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Error fetching quiz'
//         });
//     }
// };

// // Update quiz
// exports.updateQuiz = async (req, res) => {
//     try {
//         const quiz = await Quiz.findOneAndUpdate(
//             { _id: req.params.quizId, creator: req.user._id },
//             req.body,
//             { new: true, runValidators: true }
//         );

//         if (!quiz) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Quiz not found or unauthorized'
//             });
//         }

//         res.json({
//             success: true,
//             data: quiz,
//             message: 'Quiz updated successfully'
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Error updating quiz'
//         });
//     }
// };

// // Delete quiz
// exports.deleteQuiz = async (req, res) => {
//     try {
//         const quiz = await Quiz.findOneAndDelete({
//             _id: req.params.quizId,
//             creator: req.user._id
//         });

//         if (!quiz) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Quiz not found or unauthorized'
//             });
//         }

//         // Remove quiz from course
//         await Course.findByIdAndUpdate(quiz.course, {
//             $pull: { quizzes: quiz._id }
//         });

//         res.json({
//             success: true,
//             message: 'Quiz deleted successfully'
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Error deleting quiz'
//         });
//     }
// };

// // Submit quiz attempt
// exports.submitQuiz = async (req, res) => {
//     try {
//         const { answers } = req.body;
//         const quiz = await Quiz.findById(req.params.quizId);

//         if (!quiz) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Quiz not found'
//             });
//         }

//         let score = 0;
//         const maxScore = quiz.questions.reduce((acc, q) => acc + (q.points || 1), 0);

//         const results = answers.map(answer => {
//             const question = quiz.questions.id(answer.questionId);
//             if (!question) return null;

//             const correctOption = question.options.find(opt => opt.isCorrect);
//             const isCorrect = correctOption && correctOption._id.toString() === answer.selectedOption;

//             if (isCorrect) {
//                 score += question.points || 1;
//             }

//             return {
//                 questionId: answer.questionId,
//                 isCorrect,
//                 points: isCorrect ? (question.points || 1) : 0
//             };
//         }).filter(result => result !== null);

//         const percentageScore = (score / maxScore) * 100;
//         const passed = percentageScore >= quiz.passingScore;

//         quiz.attempts.push({
//             student: req.user._id,
//             score: percentageScore,
//             answers: results,
//             passed,
//             submittedAt: new Date()
//         });

//         await quiz.save();

//         res.json({
//             success: true,
//             data: {
//                 score: percentageScore,
//                 passed,
//                 totalQuestions: quiz.questions.length,
//                 correctAnswers: score,
//                 results
//             },
//             message: `Quiz submitted successfully. Your score: ${percentageScore.toFixed(2)}%`
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Error submitting quiz'
//         });
//     }
// };
