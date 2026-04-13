const mongoose = require('mongoose');

const QuizSubmissionSchema = new mongoose.Schema({
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    answers: {
        type: Array,
        required: true,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('QuizSubmission', QuizSubmissionSchema);




// const mongoose = require("mongoose");

// const QuizSubmissionSchema = new mongoose.Schema({
//     quizId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Quiz",
//         required: true,
//     },
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true,
//     },
//     answers: [
//         {
//             questionId: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: "Question",
//                 required: true,
//             },
//             selectedOption: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: "Option",
//                 required: true,
//             },
//         },
//     ],
//     score: {
//         type: Number,
//         required: true,
//     },
//     percentageScore: {
//         type: Number,
//         required: true,
//     },
//     passed: {
//         type: Boolean,
//         required: true,
//     },
//     results: [
//         {
//             questionId: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: "Question",
//                 required: true,
//             },
//             isCorrect: {
//                 type: Boolean,
//                 required: true,
//             },
//             correctOption: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: "Option",
//                 required: true,
//             },
//             selectedOption: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: "Option",
//                 required: true,
//             },
//         },
//     ],
//     submittedAt: {
//         type: Date,
//         default: Date.now,
//     },
// });

// module.exports = mongoose.model("QuizSubmission", QuizSubmissionSchema);