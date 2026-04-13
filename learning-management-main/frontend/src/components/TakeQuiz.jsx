import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaLock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "../styles/Takequiz.css";

const TakeQuiz = () => {
  const { quizId, courseId } = useParams(); // Extract quizId from URL
  const navigate = useNavigate();
  const location = useLocation();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [locked, setLocked] = useState(false);
  const [previousAttempt, setPreviousAttempt] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`/api/quizzes/${quizId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuiz(response.data);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        toast.error("Failed to load quiz");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, navigate]);

  const handleOptionSelect = (questionId, optionId) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: optionId });
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    const token = localStorage.getItem("token");
    if (!token) {
        navigate("/signin");
        return;
    }

    try {
        const response = await axios.post(
            `/api/quizzes/${quizId}/submit`,
            { answers: Object.entries(selectedAnswers).map(([questionId, selectedOption]) => ({ questionId, selectedOption })) },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
            const { score, percentageScore, passed, message } = response.data;
            toast.success(message);
            navigate(`/quiz-result/${quizId}`, { state: { score, percentageScore, passed, courseId } });
        }
    } catch (error) {
        console.error("Error submitting quiz:", error);
        
        // Handle quiz locked error
        if (error.response?.status === 400 && error.response?.data?.locked) {
            setLocked(true);
            setPreviousAttempt(error.response.data.previousAttempt);
            toast.error(error.response.data.message);
        } else {
            toast.error(error.response?.data?.message || "Failed to submit quiz");
        }
    } finally {
        setSubmitting(false);
    }
};

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading quiz...</p>
    </div>
  );

  // Show locked message
  if (locked || (location.state?.locked)) {
    return (
      <div className="quiz-container">
        <div className="quiz-locked-message">
          <FaLock className="lock-icon" />
          <h2>Quiz Locked</h2>
          <p>You have already completed this quiz once. Multiple attempts are not allowed.</p>
          
          {previousAttempt && (
            <div className="previous-attempt-info">
              <h3>Your Previous Attempt</h3>
              <div className="attempt-details">
                <div className="detail-item">
                  <span className="label">Score:</span>
                  <span className="value">{previousAttempt.percentageScore?.toFixed(0) || 0}%</span>
                </div>
                <div className="detail-item">
                  <span className="label">Status:</span>
                  <span className={`status ${previousAttempt.passed ? 'passed' : 'failed'}`}>
                    {previousAttempt.passed ? (
                      <>
                        <FaCheckCircle /> Passed
                      </>
                    ) : (
                      <>
                        <FaTimesCircle /> Failed
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="locked-actions">
            <button 
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => navigate(`/quiz-result/${quizId}`)}
            >
              View Result
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="header-group">
        <h2 className="heading-main">{quiz?.title}</h2>
        <p>{quiz?.description}</p>
      </div>

      {quiz?.questions?.map((question, index) => (
        <div key={question._id} className="question-card">
          <h4 className="question">
            {index + 1}. {question.questionText}
          </h4>
          <ul className="option-list">
            {question.options.map((option) => (
              <li key={option._id} className="options">
                <label>
                  <input
                    type="radio"
                    name={`question-${question._id}`}
                    value={option._id}
                    checked={selectedAnswers[question._id] === option._id}
                    onChange={() =>
                      handleOptionSelect(question._id, option._id)
                    }
                  />
                  {option.text}
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <button
        className="quiz-submit-btn"
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? "Submitting..." : "Submit Quiz"}
      </button>
    </div>
  );
};

export default TakeQuiz;




