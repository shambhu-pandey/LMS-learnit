import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "../styles/QuizResult.css";

const QuizResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { quizId } = useParams();
    const { score, percentageScore, passed, results } = location.state || {};

    if (!location.state) {
        navigate("/dashboard");
        return null;
    }

    return (
        <div className="quiz-result-container">
            <div className="result-card">
                <div className={`result-header ${passed ? 'passed' : 'failed'}`}>
                    {passed ? (
                        <FaCheckCircle className="result-icon passed" />
                    ) : (
                        <FaTimesCircle className="result-icon failed" />
                    )}
                    <h2>{passed ? '🎉 Congratulations!' : 'Try Again'}</h2>
                    <p className="result-message">
                        {passed 
                            ? 'You have successfully passed the quiz!' 
                            : 'You did not pass this quiz. Please review and try again.'}
                    </p>
                </div>

                <div className="result-stats">
                    <div className="stat-item">
                        <span className="stat-label">Your Score</span>
                        <span className="stat-value">{percentageScore?.toFixed(0) || 0}%</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Status</span>
                        <span className={`stat-status ${passed ? 'passed' : 'failed'}`}>
                            {passed ? '✓ Passed' : '✗ Failed'}
                        </span>
                    </div>
                </div>

                {results && results.length > 0 && (
                    <div className="result-details">
                        <h3>Answer Review</h3>
                        <div className="answers-list">
                            {results.map((result, index) => (
                                <div key={index} className={`answer-item ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                                    <div className="answer-header">
                                        <span className="question-number">Question {index + 1}</span>
                                        <span className={`answer-status ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                                            {result.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="result-actions">
                    <button 
                        className="btn btn-secondary"
                        onClick={() => navigate("/dashboard")}
                    >
                        Go to Dashboard
                    </button>
                    <button 
                        className="btn btn-primary"
                        onClick={() => navigate(`/course/${location.state.courseId || ''}/quiz/${quizId}`)}
                    >
                        Retake Quiz
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizResult;



// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// const QuizResult = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const { attempt, questions } = location.state || {};

//     if (!attempt || !questions) {
//         return (
//             <div className="error-container">
//                 <h2>Error</h2>
//                 <p>Quiz results could not be loaded. Please try again.</p>
//                 <button onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
//             </div>
//         );
//     }

//     return (
//         <div className="quiz-result-container">
//             <h2>Quiz Results</h2>
//             <p>Score: {attempt.score}</p>
//             <p>Percentage: {attempt.percentageScore.toFixed(2)}%</p>
//             <p>Status: {attempt.passed ? "Passed" : "Failed"}</p>

//             <h3>Solutions</h3>
//             {questions.map((question, index) => (
//                 <div key={question._id} className="question-card">
//                     <h4>{index + 1}. {question.questionText}</h4>
//                     <ul>
//                         {question.options.map((option) => (
//                             <li key={option._id} style={{ color: option.isCorrect ? "green" : "red" }}>
//                                 {option.text} {option.isCorrect && "(Correct)"}
//                             </li>
//                         ))}
//                     </ul>
//                     <p>Your Answer: {attempt.answers.find(a => a.questionId === question._id)?.selectedOption}</p>
//                 </div>
//             ))}

//             <button onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
//         </div>
//     );
// };

// export default QuizResult;