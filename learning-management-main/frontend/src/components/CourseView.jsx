import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaLayerGroup, FaPlay, FaQuestionCircle } from "react-icons/fa";
import EnhancedVideoPlayer from "./EnhancedVideoPlayer";
import "../styles/CourseView.css";

const CourseView = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("lectures");
  const [activeVideo, setActiveVideo] = useState(null);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/signin");
          return;
        }

        const [courseResponse, quizzesResponse, userResponse] = await Promise.all([
          axios.get(`/api/courses/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`/api/courses/${courseId}/quizzes`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setCourse(courseResponse.data);
        setQuizzes(quizzesResponse.data);
        setUser(userResponse.data);

        if (courseResponse.data.lectures?.length > 0) {
          setActiveVideo(courseResponse.data.lectures[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(error.response?.data?.message || "Failed to load course");
        navigate("/courses");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, navigate]);

  const facts = useMemo(
    () => [
      { label: "Instructor", value: course?.instructorName || "Learnit" },
      { label: "Lectures", value: course?.lectures?.length || 0 },
      { label: "Assignments", value: quizzes.length },
    ],
    [course, quizzes.length]
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Loading course content...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-error surface-card">
        <p>Course not found or access denied.</p>
      </div>
    );
  }

  return (
    <div className="course-view page-shell">
      <section className="course-hero surface-card">
        <span className="section-kicker">Course space</span>
        <div className="course-hero__content">
          <div>
            <h1>{course.title}</h1>
            <p className="course-summary">
              {course.description ||
                "Work through lectures, review assignments, and keep learning in a cleaner focused view."}
            </p>
          </div>

          <div className="course-fact-grid">
            {facts.map((fact) => (
              <div key={fact.label} className="course-fact-card">
                <span>{fact.label}</span>
                <strong>{fact.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="course-tabs">
        <button
          type="button"
          className={`tab ${activeTab === "lectures" ? "active" : ""}`}
          onClick={() => setActiveTab("lectures")}
        >
          <FaPlay />
          <span>Lectures</span>
        </button>
        <button
          type="button"
          className={`tab ${activeTab === "assignments" ? "active" : ""}`}
          onClick={() => setActiveTab("assignments")}
        >
          <FaQuestionCircle />
          <span>Assignments</span>
        </button>
      </div>

      <div className="course-content">
        {activeTab === "lectures" ? (
          <>
            <div className="video-section surface-card">
              {activeVideo ? (
                <EnhancedVideoPlayer
                  videoUrl={activeVideo.videoUrl}
                  title={activeVideo.title}
                />
              ) : (
                <div className="course-empty-panel">
                  <FaLayerGroup />
                  <h3>No lectures available yet</h3>
                  <p>This course does not have lecture content yet.</p>
                </div>
              )}
            </div>

            <div className="lectures-panel surface-card">
              <div className="lectures-panel__header">
                <h2>Course lectures</h2>
                <span>{course.lectures?.length || 0} lessons</span>
              </div>

              {course.lectures?.length ? (
                course.lectures.map((lecture, index) => (
                  <button
                    key={lecture._id}
                    type="button"
                    className={`lecture-item ${
                      activeVideo?._id === lecture._id ? "active" : ""
                    }`}
                    onClick={() => setActiveVideo(lecture)}
                  >
                    <span className="lecture-number">{index + 1}</span>
                    <span className="lecture-copy">
                      <strong>{lecture.title}</strong>
                      <small>Play lecture</small>
                    </span>
                    <FaPlay className="play-icon" />
                  </button>
                ))
              ) : (
                <p className="course-empty-note">No lectures available for this course yet.</p>
              )}
            </div>
          </>
        ) : (
          <div className="assignments-section surface-card">
            <div className="assignments-header">
              <div>
                <h2>Course assignments</h2>
                <p>
                  Practice and evaluation stay connected to the course so progress feels continuous.
                </p>
              </div>
              {user?.role === "instructor" ? (
                <button
                  type="button"
                  onClick={() => navigate(`/course/${courseId}/quiz/create`)}
                  className="primary-btn create-quiz-btn"
                >
                  Create Quiz
                </button>
              ) : null}
            </div>

            {quizzes.length > 0 ? (
              <div className="quizzes-grid">
                {quizzes.map((quiz) => (
                  <div key={quiz._id} className="quiz-card">
                    <div className="quiz-info">
                      <span className="quiz-icon">
                        <FaQuestionCircle />
                      </span>
                      <h3>{quiz.title}</h3>
                      <p>Time limit: {quiz.timeLimit} minutes</p>
                      <p>Questions: {quiz.questions?.length || 0}</p>
                      <p>Passing score: {quiz.passingScore}%</p>
                    </div>
                    <button
                      type="button"
                      className="secondary-btn take-quiz-btn"
                      onClick={() => navigate(`/course/${courseId}/quiz/${quiz._id}`)}
                    >
                      Take Quiz
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="course-empty-panel">
                <FaQuestionCircle />
                <h3>No assignments yet</h3>
                <p>No quiz has been published for this course right now.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseView;
