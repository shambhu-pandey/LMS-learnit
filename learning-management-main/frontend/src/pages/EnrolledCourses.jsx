import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaPlay, FaSpinner } from "react-icons/fa";
import EnhancedVideoPlayer from "../components/EnhancedVideoPlayer";
import "../styles/EnrolledCourses.css";

const EnrolledCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [activeVideoId, setActiveVideoId] = useState(null);

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      const response = await axios.get("/api/courses/enrolled", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEnrolledCourses(response.data);
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
      toast.error("Failed to load enrolled courses");
    } finally {
      setLoading(false);
    }
  };

  const toggleCourse = (courseId) => {
    setExpandedCourseId(expandedCourseId === courseId ? null : courseId);
  };

  const toggleVideo = (lectureId) => {
    setActiveVideoId(activeVideoId === lectureId ? null : lectureId);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner" />
        <p>Loading your courses...</p>
      </div>
    );
  }

  return (
    <div className="enrolled-courses-container page-shell">
      <div className="page-header">
        <div className="header-group">
          <span className="section-kicker">My learning</span>
          <h1 className="heading-main">Continue your enrolled courses</h1>
          <p>
            Pick up exactly where you left off, revisit lectures, and jump into
            live course sessions without hunting through the interface.
          </p>
        </div>

        <div className="enrolled-summary-card surface-card">
          <strong>{enrolledCourses.length}</strong>
          <span>Courses in progress</span>
        </div>
      </div>

      <div className="enrolled-courses-list">
        {enrolledCourses.length > 0 ? (
          enrolledCourses.map((course) => (
            <article
              key={course._id}
              className={`enrolled-course-card surface-card ${
                expandedCourseId === course._id ? "active" : ""
              }`}
            >
              <button
                type="button"
                className="course-header"
                onClick={() => toggleCourse(course._id)}
              >
                <div className="course-main-info">
                  <h2>{course.title}</h2>
                  <p className="instructor">by {course.instructorName}</p>
                </div>
                <span className="course-toggle-indicator">
                  {expandedCourseId === course._id ? "Hide" : "Open"}
                </span>
              </button>

              {expandedCourseId === course._id ? (
                <div className="course-content">
                  {course.googleMeetLink ? (
                    <div className="google-meet-section">
                      <a
                        href={course.googleMeetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="secondary-btn google-meet-link"
                      >
                        Join Google Meet
                      </a>
                    </div>
                  ) : null}

                  {course.lectures?.length > 0 ? (
                    <div className="lectures-section">
                      {course.lectures.map((lecture, index) => (
                        <div key={lecture._id} className="lecture-item">
                          <button
                            type="button"
                            className="lecture-header"
                            onClick={() => toggleVideo(lecture._id)}
                          >
                            <div className="lecture-info">
                              <span className="lecture-number">{index + 1}</span>
                              <div>
                                <strong>{lecture.title}</strong>
                                <small>Toggle preview</small>
                              </div>
                            </div>
                            <FaPlay className="play-icon" />
                          </button>

                          {activeVideoId === lecture._id && lecture.videoUrl ? (
                            <div className="video-wrapper">
                              <EnhancedVideoPlayer
                                videoUrl={lecture.videoUrl}
                                title={lecture.title}
                              />
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-lectures">
                      No lectures available in this course yet.
                    </p>
                  )}
                </div>
              ) : null}
            </article>
          ))
        ) : (
          <div className="no-courses surface-card">
            <h2>No enrolled courses yet</h2>
            <p>You haven&apos;t enrolled in any course yet. Start with Browse Courses.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrolledCourses;
