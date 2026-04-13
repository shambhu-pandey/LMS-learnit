import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaQuestionCircle } from "react-icons/fa";
import "../styles/AllAssignments.css";
import { toast } from "react-toastify";

const AllAssignments = () => {
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allQuizzes, setAllQuizzes] = useState([]);

  useEffect(() => {
    const fetchEnrolledCoursesAndQuizzes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/signin");
          return;
        }

        // Fetch enrolled courses
        const coursesResponse = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Get user enrollments or fetch from database
        const userResponse = await axios.get("/api/courses/enrolled", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const courses = userResponse.data || [];
        setEnrolledCourses(courses);

        // Fetch quizzes for each course
        const quizzesData = [];
        for (const course of courses) {
          try {
            const quizzesResponse = await axios.get(
              `/api/courses/${course._id}/quizzes`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            
            // Add course info to each quiz
            const quizzesWithCourse = quizzesResponse.data.map((quiz) => ({
              ...quiz,
              course: {
                _id: course._id,
                title: course.title,
              },
            }));
            quizzesData.push(...quizzesWithCourse);
          } catch (error) {
            console.log(`Failed to fetch quizzes for course ${course._id}`);
          }
        }

        setAllQuizzes(quizzesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response?.status === 404) {
          // Endpoint not found, try alternative approach
          fetchEnrolledCoursesAlternative();
        }
      }
    };

    const fetchEnrolledCoursesAlternative = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Get all courses and filter by enrollment
        const coursesResponse = await axios.get("/api/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const courses = coursesResponse.data || [];
        setEnrolledCourses(courses);

        // Fetch quizzes for each course
        const quizzesData = [];
        for (const course of courses) {
          try {
            const quizzesResponse = await axios.get(
              `/api/courses/${course._id}/quizzes`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            
            const quizzesWithCourse = quizzesResponse.data.map((quiz) => ({
              ...quiz,
              course: {
                _id: course._id,
                title: course.title,
              },
            }));
            quizzesData.push(...quizzesWithCourse);
          } catch (error) {
            console.log(`Failed to fetch quizzes for course ${course._id}`);
          }
        }

        setAllQuizzes(quizzesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
        toast.error("Failed to load assignments");
        setLoading(false);
      }
    };

    fetchEnrolledCoursesAndQuizzes();
  }, [navigate]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your assignments...</p>
      </div>
    );
  }

  return (
    <div className="all-assignments-container">
      <div className="assignments-header">
        <h1>📋 My Assignments</h1>
        <p>All quizzes from your enrolled courses</p>
      </div>

      {allQuizzes.length > 0 ? (
        <div className="assignments-content">
          {enrolledCourses.length > 0 && (
            <div className="course-sections">
              {enrolledCourses.map((course) => {
                const courseQuizzes = allQuizzes.filter(
                  (quiz) => quiz.course._id === course._id
                );

                if (courseQuizzes.length === 0) return null;

                return (
                  <div key={course._id} className="course-section">
                    <h2 className="course-title">{course.title}</h2>
                    <div className="quizzes-grid">
                      {courseQuizzes.map((quiz) => (
                        <div key={quiz._id} className="quiz-card">
                          <div className="quiz-info">
                            <FaQuestionCircle className="quiz-icon" />
                            <h3>{quiz.title}</h3>
                            <p className="quiz-detail">
                              ⏱️ {quiz.timeLimit} minutes
                            </p>
                            <p className="quiz-detail">
                              ❓ {quiz.questions?.length || 0} questions
                            </p>
                            <p className="quiz-detail">
                              ✓ Pass: {quiz.passingScore}%
                            </p>
                          </div>
                          <button
                            className="take-quiz-btn"
                            onClick={() =>
                              navigate(`/course/${course._id}/quiz/${quiz._id}`)
                            }
                          >
                            Take Quiz
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="no-assignments">
          <FaQuestionCircle className="empty-icon" />
          <h2>No Assignments Available</h2>
          <p>You haven't enrolled in any courses yet.</p>
          <button
            className="enroll-btn"
            onClick={() => navigate("/courses")}
          >
            Browse Courses
          </button>
        </div>
      )}
    </div>
  );
};

export default AllAssignments;
