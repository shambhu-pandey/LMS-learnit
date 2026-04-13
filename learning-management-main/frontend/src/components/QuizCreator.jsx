import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaPlus, FaTrash, FaSpinner } from "react-icons/fa";
import "../styles/QuizCreator.css";

const QuizCreator = ({ courseId, onClose, onQuizCreated }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState({
    title: "",
    questions: [
      {
        questionText: "",
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
        points: 1,
      },
    ],
    timeLimit: 30,
    passingScore: 60,
  });

  // ...existing code...
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const formattedQuiz = {
        title: quiz.title,
        courseId: courseId,
        questions: quiz.questions,
        timeLimit: quiz.timeLimit,
        passingScore: quiz.passingScore,
      };

      // Update the endpoint to match your backend route
      const response = await axios.post(
        `/api/courses/${courseId}/quizzes`, // Changed endpoint
        formattedQuiz,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        toast.success("Quiz created successfully!");
        setQuiz({
          title: "",
          questions: [
            {
              questionText: "",
              options: [
                { text: "", isCorrect: false },
                { text: "", isCorrect: false },
                { text: "", isCorrect: false },
                { text: "", isCorrect: false },
              ],
              points: 1,
            },
          ],
          timeLimit: 30,
          passingScore: 60,
        });
        onQuizCreated();
      }
    } catch (error) {
      console.log(error);
      console.error("Error creating quiz:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to create quiz";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  // ...existing code...
  const addQuestion = () => {
    setQuiz((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          questionText: "",
          options: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ],
          points: 1,
        },
      ],
    }));
  };

  const removeQuestion = (index) => {
    if (quiz.questions.length > 1) {
      setQuiz((prev) => ({
        ...prev,
        questions: prev.questions.filter((_, i) => i !== index),
      }));
    } else {
      toast.warning("Quiz must have at least one question");
    }
  };

  return (
    <div className="quiz-creator">
      <h2>Create Quiz</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Quiz Title</label>
          <input
            type="text"
            value={quiz.title}
            onChange={(e) =>
              setQuiz((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Enter quiz title"
            required
          />
        </div>

        {quiz.questions.map((question, qIndex) => (
          <div key={qIndex} className="question-box">
            <div className="question-header">
              <label>Question {qIndex + 1}</label>
              {quiz.questions.length > 1 && (
                <FaTrash
                  className="delete-question"
                  onClick={() => removeQuestion(qIndex)}
                />
              )}
            </div>

            <div className="form-group">
              <input
                type="text"
                value={question.questionText}
                onChange={(e) => {
                  const newQuestions = [...quiz.questions];
                  newQuestions[qIndex].questionText = e.target.value;
                  setQuiz((prev) => ({ ...prev, questions: newQuestions }));
                }}
                placeholder="Enter your question"
                required
              />
            </div>

            <div className="options-container">
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="option-group">
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => {
                      const newQuestions = [...quiz.questions];
                      newQuestions[qIndex].options[oIndex].text =
                        e.target.value;
                      setQuiz((prev) => ({ ...prev, questions: newQuestions }));
                    }}
                    placeholder={`Option ${oIndex + 1}`}
                    required
                  />
                  <label className="radio-label">
                    <input
                      type="radio"
                      name={`correct-${qIndex}`}
                      checked={option.isCorrect}
                      onChange={() => {
                        const newQuestions = [...quiz.questions];
                        newQuestions[qIndex].options = newQuestions[
                          qIndex
                        ].options.map((opt, i) => ({
                          ...opt,
                          isCorrect: i === oIndex,
                        }));
                        setQuiz((prev) => ({
                          ...prev,
                          questions: newQuestions,
                        }));
                      }}
                    />
                    Correct Answer
                  </label>
                </div>
              ))}
            </div>

            <div className="form-group">
              <label>Points</label>
              <input
                type="number"
                value={question.points}
                onChange={(e) => {
                  const newQuestions = [...quiz.questions];
                  newQuestions[qIndex].points = Math.max(
                    1,
                    parseInt(e.target.value) || 1
                  );
                  setQuiz((prev) => ({ ...prev, questions: newQuestions }));
                }}
                min="1"
                required
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          className="add-question-btn"
        >
          <FaPlus /> Add Question
        </button>

        <div className="quiz-settings">
          <div className="form-group">
            <label>Time Limit (minutes)</label>
            <input
              type="number"
              value={quiz.timeLimit}
              onChange={(e) =>
                setQuiz((prev) => ({
                  ...prev,
                  timeLimit: Math.max(1, parseInt(e.target.value) || 30),
                }))
              }
              min="1"
              required
            />
          </div>
          <div className="form-group">
            <label>Passing Score (%)</label>
            <input
              type="number"
              value={quiz.passingScore}
              onChange={(e) =>
                setQuiz((prev) => ({
                  ...prev,
                  passingScore: Math.min(
                    100,
                    Math.max(0, parseInt(e.target.value) || 60)
                  ),
                }))
              }
              min="0"
              max="100"
              required
            />
          </div>
        </div>

        <button type="submit" className="create-quiz-btn" disabled={loading}>
          {loading ? (
            <>
              <FaSpinner className="spinner" />
              Creating Quiz...
            </>
          ) : (
            "Create Quiz"
          )}
        </button>
      </form>
    </div>
  );
};

export default QuizCreator;
