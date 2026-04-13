import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaTrash,
  FaEdit,
  FaStar,
  FaPlus,
  FaCheckCircle,
  FaEye,
  FaLock,
  FaUnlock,
  FaGraduationCap,
  FaSpinner,
  FaChevronUp,
} from "react-icons/fa";
import "../styles/Courses.css";
// Update this import
import EnhancedVideoPlayer from "../components/EnhancedVideoPlayer";
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
      const response = await axios.post(
        `/api/courses/${courseId}/enroll`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // Update the courses state to reflect enrollment
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course._id === courseId ? { ...course, isEnrolled: true } : course
        )
      );

      toast.success("Successfully enrolled in course!");

      // Optional: Redirect to enrolled courses page
      setTimeout(() => {
        navigate("/enrolled-courses");
      }, 1500);
    } catch (error) {
      console.error("Error enrolling in course:", error);
      toast.error(
        error.response?.data?.message || "Failed to enroll in course"
      );
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
          videoUrl: videoUrl,
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

  // const handleCreateLecture = async (e) => {
  //   e.preventDefault();

  //   try {
  //     setLoading(true);

  //     // Enhanced YouTube URL validation and formatting
  //     let formattedUrl = lectureUrl;
  //     const youtubeRegex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  //     const match = lectureUrl.match(youtubeRegex);

  //     if (!match || match[2].length !== 11) {
  //       toast.error('Please enter a valid YouTube URL');
  //       return;
  //     }

  //     // Convert to embed URL
  //     formattedUrl = `https://www.youtube.com/embed/${match[2]}`;

  //     const response = await axios.post(
  //       `/api/courses/${selectedCourse._id}/lectures`,
  //       {
  //         title: lectureTitle,
  //         videoUrl: formattedUrl
  //       },
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${localStorage.getItem('token')}`
  //         }
  //       }
  //     );

  //     setCourses(courses.map(course =>
  //       course._id === selectedCourse._id ? response.data : course
  //     ));

  //     setShowLectureModal(false);
  //     setLectureTitle('');
  //     setLectureUrl('');
  //     setSelectedCourse(null);
  //     toast.success('Lecture added successfully!');
  //   } catch (error) {
  //     console.error('Error adding lecture:', error);
  //     toast.error(error.response?.data?.message || 'Failed to add lecture');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Add this function in your Courses component
  const handleDeleteCourse = async (courseId) => {
    try {
      // Show confirmation dialog
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

      // Remove the deleted course from state
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
  // const handleToggleLock = async (courseId) => {
  //   try {
  //     setLoading(true);
  //     const res = await axios.put(
  //       `/api/courses/${courseId}/toggle-lock`,
  //       {},
  //       {
  //         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  //       }
  //     );
  //     setCourses(
  //       courses.map((course) =>
  //         course._id === courseId ? res.data : course
  //       )
  //     );
  //     toast.success(`Course ${res.data.isLocked ? 'locked' : 'unlocked'} successfully!`);
  //   } catch (error) {
  //     console.error("Error toggling course lock:", error);
  //     toast.error(error.response?.data?.message || "Failed to toggle course lock");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleToggleLock = async (courseId, e) => {
    try {
      e?.stopPropagation(); // Prevent event bubbling if event exists

      // Find the current course
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

      // Update the courses state with the new lock status
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course._id === courseId
            ? { ...course, isLocked: !course.isLocked }
            : course
        )
      );

      // Show success message
      toast.success(
        `Course ${response.data.isLocked ? "locked" : "unlocked"} successfully!`
      );
    } catch (error) {
      console.error("Error toggling course lock:", error);
      toast.error(
        error.response?.data?.message || "Failed to toggle course lock"
      );
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
    <div className="courses-container">
      <div className="header-group">
        <h1 className="heading-main">Courses</h1>
        <p>You Can Enroll And Study</p>
      </div>
      {user && user.role === "instructor" && (
        <button
          className="create-course-btn"
          onClick={() => setShowModal(true)}
          disabled={loading}
        >
          <FaPlus /> Create Course
        </button>
      )}

      <div className="courses-list">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div
              key={course._id}
              className={`course-card ${course.isLocked ? "locked" : ""}`}
            >
              {/* <div className="course-header">
                <h2>{course.title}</h2>
                {user && user.role === "instructor" && (
                  <button
                    className={`lock-button ${loading ? 'loading' : ''}`}
                    onClick={() => handleToggleLock(course._id)}
                    disabled={loading}
                    title={course.isLocked ? "Unlock Course" : "Lock Course"}
                  >
                    {loading ? <FaSpinner className="spinner" /> : 
                      course.isLocked ? <FaLock /> : <FaUnlock />
                    }
                  </button>
                )}
              </div> */}

              <div className="course-header">
                <h2>{course.title}</h2>
                {user && user.role === "instructor" && (
                  <button
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
                )}
              </div>

              <p className="description">{course.description}</p>
              <p className="category">Category: {course.category}</p>
              <p className="instructor">Instructor: {course.instructorName}</p>

              <div className="course-actions">
                {user && user.role === "instructor" ? (
                  <div className="instructor-actions">
                    <FaEdit
                      className="icon edit"
                      title="Edit Course"
                      onClick={() => handleEditCourse(course)}
                    />
                    <FaTrash
                      className="icon delete"
                      title="Delete Course"
                      onClick={() => handleDeleteCourse(course._id)}
                    />
                    <FaPlus
                      className="icon add-lecture"
                      title="Add Lecture"
                      onClick={() => handleAddLecture(course)}
                    />
                  </div>
                ) : (
                  <div className="student-actions">
                    {!course.isEnrolled && course.isLocked ? (
                      <button
                        className={`enroll-button ${loading ? "loading" : ""}`}
                        onClick={() => handleEnrollCourse(course._id)}
                        disabled={loading}
                      >
                        {loading ? (
                          <FaSpinner className="spinner" />
                        ) : (
                          <>
                            <FaGraduationCap /> Enroll to Unlock
                          </>
                        )}
                      </button>
                    ) : (
                      <FaEye
                        className="icon preview"
                        title="View Course"
                        onClick={() => navigate(`/course/${course._id}`)}
                      />
                    )}
                  </div>
                )}
              </div>

              {(!course.isLocked || course.isEnrolled || user?.role === "instructor") && (
                <div className="lectures-list">
                  {/* {course.lectures?.map((lecture) => (
                    <div key={lecture._id} className="lecture-item">
                      <h3>{lecture.title}</h3>
                      {lecture.videoUrl && (
                        <div className="video-container">
                          <iframe
                            width="100%"
                            height="315"
                            src={lecture.videoUrl}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={lecture.title}
                          ></iframe>
                        </div>
                      )}
                    </div>
                  ))} */}

                  {/* // In the lectures mapping section, update the video rendering: */}
                  {course.lectures?.map((lecture) => (
                    <div key={lecture._id} className="lecture-item">
                      <h3>{lecture.title}</h3>
                      {lecture.videoUrl && (
                        <EnhancedVideoPlayer
                          videoUrl={lecture.videoUrl}
                          title={lecture.title}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-courses">
            <p>No courses available. Please check back later.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modalx">
            <h2>{editingCourse ? "Edit Course" : "Create a New Course"}</h2>
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
                <label className="modal-form-label">Course Access</label>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={isLocked}
                    onChange={(e) => setIsLocked(e.target.checked)}
                    id="lock-toggle"
                  />
                  <label htmlFor="lock-toggle">
                    {isLocked ? "Locked" : "Unlocked"}
                  </label>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="submit"
                  className="modal-btn create"
                  disabled={loading}
                >
                  {loading
                    ? "Processing..."
                    : editingCourse
                    ? "Update"
                    : "Create"}
                </button>
                <button
                  type="button"
                  className="modal-btn cancel"
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
      )}

      {showLectureModal && (
        <div className="modal-overlay">
          <div className="modalx">
            <h2>Add New Lecture</h2>
            <form onSubmit={handleCreateLecture}>
              <div className="form-group">
                <label className="modal-form-label">
                  Topic Title <span className="required">*</span>
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
                  YouTube Video URL <span className="required">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter YouTube video URL (e.g., https://www.youtube.com/watch?v=xxxxx)"
                  value={lectureUrl}
                  onChange={(e) => setLectureUrl(e.target.value)}
                  required
                  className="form-control"
                />
                <small className="help-text">
                  Please enter a valid YouTube URL (e.g.,
                  https://www.youtube.com/watch?v=xxxxx)
                </small>
              </div>

              <div className="modal-actions">
                <button
                  type="submit"
                  className="modal-btn create"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Lecture"}
                </button>
                <button
                  type="button"
                  className="modal-btn cancel"
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
      )}
    </div>
  );
};

export default Courses;
