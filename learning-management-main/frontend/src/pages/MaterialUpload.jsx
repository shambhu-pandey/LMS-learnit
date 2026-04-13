import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaTrash,
  FaEdit,
  FaPlus,
  FaEye,
  FaLock,
  FaUnlock,
  FaSpinner,
  FaGraduationCap,
  FaUpload,
} from "react-icons/fa";
import "../styles/Courses.css";

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [materialTitle, setMaterialTitle] = useState("");
  const [materialFile, setMaterialFile] = useState(null);
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
      const [userResponse, coursesResponse] = await Promise.all([
        axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/api/courses/instructor", {
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
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadMaterial = async (e) => {
    e.preventDefault();

    if (!selectedCourse) {
      toast.error("Please select a course");
      return;
    }

    if (!materialTitle.trim() || !materialFile) {
      toast.error("Please provide a title and select a file");
      return;
    }

    const formData = new FormData();
    formData.append("title", materialTitle);
    formData.append("file", materialFile);

    try {
      setLoading(true);
      const response = await axios.post(
        `/api/courses/${selectedCourse._id}/materials`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Material uploaded successfully!");
      setMaterialTitle("");
      setMaterialFile(null);
      setSelectedCourse(null);
      fetchCourses(); // Refresh courses to show updated materials
    } catch (error) {
      console.error("Error uploading material:", error);
      toast.error(error.response?.data?.message || "Failed to upload material");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="courses-container">
      <div className="header-group">
        <h1 className="heading-main">Manage Your Courses</h1>
        <p>Create and manage your courses</p>
      </div>

      <div className="courses-list">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div
              key={course._id}
              className={`course-card ${course.isLocked ? "locked" : ""}`}
            >
              <div className="course-header">
                <h2>{course.title}</h2>
              </div>

              <p className="description">{course.description}</p>
              <p className="category">Category: {course.category}</p>

              <div className="course-actions">
                <button
                  className="upload-material-btn"
                  onClick={() => setSelectedCourse(course)}
                >
                  <FaUpload /> Upload Material
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-courses">
            <p>
              No courses available. Create your first course from the dashboard.
            </p>
          </div>
        )}
      </div>

      {selectedCourse && (
        <div className="modal-overlay">
          <div className="modalx">
            <h2>Upload Material for {selectedCourse.title}</h2>
            <form onSubmit={handleUploadMaterial}>
              <div className="form-group">
                <label className="modal-form-label">
                  Material Title <span className="required">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter material title"
                  value={materialTitle}
                  onChange={(e) => setMaterialTitle(e.target.value)}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="modal-form-label">
                  Upload File <span className="required">*</span>
                </label>
                <input
                  type="file"
                  onChange={(e) => setMaterialFile(e.target.files[0])}
                  required
                  className="form-control"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="submit"
                  className="modal-btn create"
                  disabled={loading}
                >
                  {loading ? "Uploading..." : "Upload Material"}
                </button>
                <button
                  type="button"
                  className="modal-btn cancel"
                  onClick={() => {
                    setSelectedCourse(null);
                    setMaterialTitle("");
                    setMaterialFile(null);
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

export default ManageCourses;
