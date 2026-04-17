import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaLock, FaPlus, FaSpinner, FaTrash, FaUnlock } from "react-icons/fa";
import EnhancedVideoPlayer from "../components/EnhancedVideoPlayer";
import "../styles/Courses.css";

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [showLectureModal, setShowLectureModal] = useState(false);
  const [lectureTitle, setLectureTitle] = useState("");
  const [lectureUrl, setLectureUrl] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    try {
      setLoading(true);
      const coursesResponse = await axios.get("/api/courses/instructor", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCourses(coursesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/signin");
      }
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(
    () => [
      { label: "Active courses", value: courses.length },
      {
        label: "Open access",
        value: courses.filter((course) => !course.isLocked).length,
      },
      {
        label: "Meet-ready",
        value: courses.filter((course) => Boolean(course.googleMeetLink)).length,
      },
    ],
    [courses]
  );

  const handleUpdateGoogleMeetLink = async (courseId, googleMeetLink) => {
    try {
      await axios.put(
        `/api/courses/${courseId}/google-meet-link`,
        { googleMeetLink },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course._id === courseId ? { ...course, googleMeetLink } : course
        )
      );
    } catch (error) {
      console.error("Error updating Google Meet link:", error);
      toast.error("Failed to update Google Meet link");
    }
  };

  const handleCreateLecture = async (e) => {
    e.preventDefault();

    try {
      if (!lectureTitle.trim() || !lectureUrl.trim()) {
        toast.error("Please fill in all fields");
        return;
      }

      setLoading(true);
      const videoId = lectureUrl.match(
        /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/
      );
      if (!videoId) {
        toast.error("Please enter a valid YouTube URL");
        return;
      }

      const videoUrl = `https://www.youtube.com/embed/${videoId[1]}`;
      const response = await axios.post(
        `/api/courses/${selectedCourse._id}/lectures`,
        {
          title: lectureTitle,
          description: lectureTitle,
          videoUrl,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setCourses(
        courses.map((course) =>
          course._id === selectedCourse._id ? response.data.course : course
        )
      );

      toast.success("Lecture added successfully!");
      setShowLectureModal(false);
      setLectureTitle("");
      setLectureUrl("");
      setSelectedCourse(null);
    } catch (error) {
      console.error("Error adding lecture:", error);
      toast.error(error.response?.data?.message || "Failed to add lecture");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      if (
        !window.confirm(
          "Are you sure you want to delete this course? This action cannot be undone."
        )
      ) {
        return;
      }

      setLoading(true);
      await axios.delete(`/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setCourses((prevCourses) =>
        prevCourses.filter((course) => course._id !== courseId)
      );
      toast.success("Course deleted successfully!");
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error(error.response?.data?.message || "Failed to delete course");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLock = async (courseId, e) => {
    try {
      e?.stopPropagation();

      const currentCourse = courses.find((course) => course._id === courseId);
      if (!currentCourse) {
        toast.error("Course not found");
        return;
      }

      setLoading(true);

      const response = await axios.put(
        `/api/courses/${courseId}/toggle-lock`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course._id === courseId
            ? { ...course, isLocked: !course.isLocked }
            : course
        )
      );

      toast.success(
        `Course ${response.data.isLocked ? "locked" : "unlocked"} successfully!`
      );
    } catch (error) {
      console.error("Error toggling course lock:", error);
      toast.error(error.response?.data?.message || "Failed to toggle course lock");
    } finally {
      setLoading(false);
    }
  };

  const handleAddLecture = (course) => {
    setSelectedCourse(course);
    setShowLectureModal(true);
  };

  if (loading && courses.length === 0) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner" />
        <p>Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="courses-container page-shell">
      <div className="page-header">
        <div className="header-group">
          <span className="section-kicker">Course control</span>
          <h1 className="heading-main">Manage your live course system</h1>
          <p>
            Adjust access, add lectures, maintain Meet links, and keep your course
            delivery polished without changing how your features work.
          </p>
        </div>
      </div>

      <div className="courses-stats">
        {stats.map((item) => (
          <div key={item.label} className="course-stat-card surface-card">
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <div className="courses-list">
        {courses.length > 0 ? (
          courses.map((course) => (
            <article key={course._id} className="course-card surface-card">
              <div className="course-card-top">
                <div className="course-card-meta">
                  <span className="course-pill">{course.category || "General"}</span>
                  <span
                    className={`course-access ${
                      course.isLocked ? "locked" : "open"
                    }`}
                  >
                    {course.isLocked ? "Locked" : "Open"}
                  </span>
                </div>

                <button
                  type="button"
                  className={`lock-button ${loading ? "loading" : ""}`}
                  onClick={(e) => handleToggleLock(course._id, e)}
                  disabled={loading}
                  title={course.isLocked ? "Unlock Course" : "Lock Course"}
                >
                  {loading ? (
                    <FaSpinner className="spinner" />
                  ) : course.isLocked ? (
                    <FaLock className="lock-icon" />
                  ) : (
                    <FaUnlock className="unlock-icon" />
                  )}
                </button>
              </div>

              <div className="course-header">
                <h2>{course.title}</h2>
                <p className="description">{course.description}</p>
              </div>

              <div className="course-facts">
                <span>{course.lectures?.length || 0} lectures</span>
                <span>{course.googleMeetLink ? "Meet linked" : "Meet not linked"}</span>
              </div>

              <div className="form-group">
                <label className="modal-form-label">Google Meet link</label>
                <input
                  type="text"
                  placeholder="Enter Google Meet link"
                  value={course.googleMeetLink || ""}
                  onChange={(e) =>
                    handleUpdateGoogleMeetLink(course._id, e.target.value)
                  }
                  className="form-control"
                />
              </div>

              <div className="course-actions">
                <div className="instructor-actions">
                  <button
                    type="button"
                    className="course-tool-btn course-tool-btn--danger"
                    title="Delete Course"
                    onClick={() => handleDeleteCourse(course._id)}
                  >
                    <FaTrash />
                    <span>Delete</span>
                  </button>
                  <button
                    type="button"
                    className="course-tool-btn"
                    title="Add Lecture"
                    onClick={() => handleAddLecture(course)}
                  >
                    <FaPlus />
                    <span>Add lecture</span>
                  </button>
                </div>
              </div>

              <div className="lectures-list">
                <div className="lectures-list__header">
                  <h3>Lecture preview</h3>
                  <span>{course.lectures?.length || 0} lessons</span>
                </div>

                {course.lectures?.length ? (
                  course.lectures.map((lecture) => (
                    <div key={lecture._id} className="lecture-item">
                      <div className="lecture-item__head">
                        <h4>{lecture.title}</h4>
                      </div>
                      {lecture.videoUrl ? (
                        <EnhancedVideoPlayer
                          videoUrl={lecture.videoUrl}
                          title={lecture.title}
                        />
                      ) : null}
                    </div>
                  ))
                ) : (
                  <p className="empty-lectures">
                    No lectures have been added to this course yet.
                  </p>
                )}
              </div>
            </article>
          ))
        ) : (
          <div className="no-courses surface-card">
            <p>No courses available. Create your first course from the dashboard.</p>
          </div>
        )}
      </div>

      {showLectureModal ? (
        <div className="modal-overlay">
          <div className="modalx">
            <h2>Add new lecture</h2>
            <form onSubmit={handleCreateLecture}>
              <div className="form-group">
                <label className="modal-form-label">
                  Topic title <span className="required">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter lecture topic"
                  value={lectureTitle}
                  onChange={(e) => setLectureTitle(e.target.value)}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="modal-form-label">
                  YouTube video URL <span className="required">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter YouTube video URL"
                  value={lectureUrl}
                  onChange={(e) => setLectureUrl(e.target.value)}
                  required
                  className="form-control"
                />
                <small className="help-text">
                  Please enter a valid YouTube URL such as
                  https://www.youtube.com/watch?v=xxxxx
                </small>
              </div>

              <div className="modal-actions">
                <button
                  type="submit"
                  className="primary-btn"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add lecture"}
                </button>
                <button
                  type="button"
                  className="ghost-btn"
                  onClick={() => {
                    setShowLectureModal(false);
                    setLectureTitle("");
                    setLectureUrl("");
                    setSelectedCourse(null);
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ManageCourses;
