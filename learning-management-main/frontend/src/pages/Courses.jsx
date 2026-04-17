import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaEdit,
  FaEye,
  FaGraduationCap,
  FaLock,
  FaPlus,
  FaSpinner,
  FaTrash,
  FaUnlock,
} from "react-icons/fa";
import EnhancedVideoPlayer from "../components/EnhancedVideoPlayer";
import "../styles/Courses.css";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showLectureModal, setShowLectureModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [lectureTitle, setLectureTitle] = useState("");
  const [lectureUrl, setLectureUrl] = useState("");
  const [editingCourse, setEditingCourse] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isLocked, setIsLocked] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        setLoading(true);
        const [userResponse, coursesResponse] = await Promise.all([
          axios.get("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/courses", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUser(userResponse.data);
        setCourses(coursesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/signin");
        }
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const isInstructor =
    user?.role?.toLowerCase() === "instructor" ||
    user?.role?.toLowerCase() === "teacher";

  const stats = useMemo(
    () => [
      {
        label: isInstructor ? "Courses created" : "Courses available",
        value: courses.length,
      },
      {
        label: "Unlocked",
        value: courses.filter((course) => !course.isLocked).length,
      },
      {
        label: "With lectures",
        value: courses.filter((course) => (course.lectures?.length || 0) > 0).length,
      },
    ],
    [courses, isInstructor]
  );

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "/api/courses",
        { title, description, category, content, isLocked },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setCourses([...courses, res.data]);
      setShowModal(false);
      resetForm();
      toast.success("Course created successfully!");
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error(error.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollCourse = async (courseId) => {
    try {
      setLoading(true);
      await axios.post(
        `/api/courses/${courseId}/enroll`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course._id === courseId ? { ...course, isEnrolled: true } : course
        )
      );

      toast.success("Successfully enrolled in course!");
      setTimeout(() => {
        navigate("/enrolled-courses");
      }, 1000);
    } catch (error) {
      console.error("Error enrolling in course:", error);
      toast.error(error.response?.data?.message || "Failed to enroll in course");
    } finally {
      setLoading(false);
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setTitle(course.title);
    setDescription(course.description);
    setCategory(course.category);
    setContent(course.content || "");
    setIsLocked(course.isLocked);
    setShowModal(true);
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.put(
        `/api/courses/${editingCourse._id}`,
        { title, description, category, content, isLocked },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setCourses(
        courses.map((course) =>
          course._id === editingCourse._id ? res.data : course
        )
      );
      setShowModal(false);
      resetForm();
      toast.success("Course updated successfully!");
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error(error.response?.data?.message || "Failed to update course");
    } finally {
      setLoading(false);
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

  const resetForm = () => {
    setEditingCourse(null);
    setTitle("");
    setDescription("");
    setCategory("");
    setContent("");
    setIsLocked(true);
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
          <span className="section-kicker">
            {isInstructor ? "Instructor catalog" : "Course discovery"}
          </span>
          <h1 className="heading-main">
            {isInstructor ? "Build and shape your course library" : "Explore your next learning path"}
          </h1>
          <p>
            {isInstructor
              ? "Create courses, fine-tune access, and attach lectures without touching your existing workflow."
              : "Browse courses, unlock content, and move into study mode with a clearer, cleaner layout."}
          </p>
        </div>

        {isInstructor ? (
          <button
            type="button"
            className="primary-btn create-course-btn"
            onClick={() => setShowModal(true)}
            disabled={loading}
          >
            <FaPlus />
            <span>Create Course</span>
          </button>
        ) : null}
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
          courses.map((course) => {
            const canOpenCourse =
              !course.isLocked || course.isEnrolled || isInstructor;

            return (
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

                  {isInstructor ? (
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
                  ) : null}
                </div>

                <div className="course-header">
                  <h2>{course.title}</h2>
                  <p className="description">{course.description}</p>
                </div>

                <div className="course-facts">
                  <span>Instructor: {course.instructorName || "Learnit"}</span>
                  <span>{course.lectures?.length || 0} lectures</span>
                </div>

                <div className="course-actions">
                  {isInstructor ? (
                    <div className="instructor-actions">
                      <button
                        type="button"
                        className="course-tool-btn"
                        title="Edit Course"
                        onClick={() => handleEditCourse(course)}
                      >
                        <FaEdit />
                        <span>Edit</span>
                      </button>
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
                  ) : canOpenCourse ? (
                    <button
                      type="button"
                      className="secondary-btn course-open-btn"
                      onClick={() => navigate(`/course/${course._id}`)}
                    >
                      <FaEye />
                      <span>Open Course</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={`primary-btn enroll-button ${
                        loading ? "loading" : ""
                      }`}
                      onClick={() => handleEnrollCourse(course._id)}
                      disabled={loading}
                    >
                      {loading ? (
                        <FaSpinner className="spinner" />
                      ) : (
                        <>
                          <FaGraduationCap />
                          <span>Enroll to Unlock</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {canOpenCourse ? (
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
                ) : null}
              </article>
            );
          })
        ) : (
          <div className="no-courses surface-card">
            <p>No courses available right now. Please check back in a moment.</p>
          </div>
        )}
      </div>

      {showModal ? (
        <div className="modal-overlay">
          <div className="modalx">
            <h2>{editingCourse ? "Edit course" : "Create a new course"}</h2>
            <form
              onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse}
            >
              <div className="form-group">
                <label className="modal-form-label">
                  Title <span className="required">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter course title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="modal-form-label">
                  Description <span className="required">*</span>
                </label>
                <textarea
                  placeholder="Enter course description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="modal-form-label">
                  Category <span className="required">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="form-control"
                >
                  <option value="">Select a category</option>
                  <option value="Programming">Programming</option>
                  <option value="Design">Design</option>
                  <option value="Business">Business</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="modal-form-label">Course access</label>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={isLocked}
                    onChange={(e) => setIsLocked(e.target.checked)}
                    id="lock-toggle"
                  />
                  <label htmlFor="lock-toggle">
                    {isLocked ? "Locked until enrollment" : "Open to preview"}
                  </label>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="submit"
                  className="primary-btn"
                  disabled={loading}
                >
                  {loading ? "Processing..." : editingCourse ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  className="ghost-btn"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
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

export default Courses;
