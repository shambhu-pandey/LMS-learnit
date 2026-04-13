import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaPlus, FaTrash, FaSpinner, FaSave } from "react-icons/fa";
import "../styles/QuizManagement.css"; // Reuse QuizManagement styles

const QuizEditor = () => {
  const { courseId, quizId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
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

  // Load existing quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`/api/quizzes/${quizId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuiz({
          title: response.data.title || "",
          description: response.data.description || "",
          questions: response.data.questions || [],
          timeLimit: response.data.timeLimit || 30,
          passingScore: response.data.passingScore || 60,
        });
      } catch (error) {
        toast.error("Failed to load quiz");
        navigate(`/courses/${courseId}`);
      } finally {
        setLoading(false);
      }
    };

    if (quizId) fetchQuiz();
  }, [quizId, courseId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/quizzes/${quizId}`,
        quiz,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Quiz updated successfully!");
      navigate(`/courses/${courseId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update quiz");
    } finally {
      setSaving(false);
    }
  };

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

  const updateQuestionText = (qIndex, value) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qIndex].questionText = value;
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const updateOptionText = (qIndex, oIndex, value) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qIndex].options[oIndex].text = value;
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const updateCorrectOption = (qIndex, oIndex) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qIndex].options = newQuestions[qIndex].options.map((opt, i) => ({
      ...opt,
      isCorrect: i === oIndex,
    }));
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const updatePoints = (qIndex, value) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qIndex].points = Math.max(1, parseInt(value) || 1);
    setQuiz({ ...quiz, questions: newQuestions });
  };

  if (loading) {
    return (
      <div className="quiz-creator" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <FaSpinner className="spinner" />
      </div>
    );
  }

  return (
    <div className="quiz-creator">
      <div className="quiz-header">
        <h2>Edit Quiz</h2>
        <button onClick={() => navigate(`/courses/${courseId}`)} className="back-btn">
          ← Back
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Quiz Title</label>
          <input
            type="text"
            value={quiz.title}
            onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
            placeholder="Enter quiz title"
            required
          />
        </div>

        <div className="form-group">
          <label>Description (Optional)</label>
          <textarea
            value={quiz.description}
            onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
            placeholder="Enter quiz description"
            rows="3"
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
                onChange={(e) => updateQuestionText(qIndex, e.target.value)}
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
                    onChange={(e) => updateOptionText(qIndex, oIndex, e.target.value)}
                    placeholder={`Option ${oIndex + 1}`}
                    required
                  />
                  <label className="radio-label">
                    <input
                      type="radio"
                      name={`correct-${qIndex}`}
                      checked={option.isCorrect}
                      onChange={() => updateCorrectOption(qIndex, oIndex)}
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
                onChange={(e) => updatePoints(qIndex, e.target.value)}
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
                setQuiz({ ...quiz, timeLimit: Math.max(1, parseInt(e.target.value) || 30) })
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
                setQuiz({ ...quiz, passingScore: Math.min(100, Math.max(0, parseInt(e.target.value) || 60)) })
              }
              min="0"
              max="100"
              required
            />
          </div>
        </div>

        <button type="submit" className="create-quiz-btn" disabled={saving}>
          {saving ? (
            <>
              <FaSpinner className="spinner" />
              Saving...
            </>
          ) : (
            <>
              <FaSave /> Update Quiz
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default QuizEditor;

