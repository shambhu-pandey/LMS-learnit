import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaSpinner, FaUpload } from "react-icons/fa";
import "../styles/Courses.css";

const MaterialUpload = () => {
  const [courses, setCourses] = useState([]);
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
      { label: "Courses ready", value: courses.length },
      {
        label: "Locked courses",
        value: courses.filter((course) => course.isLocked).length,
      },
      {
        label: "Open courses",
        value: courses.filter((course) => !course.isLocked).length,
      },
    ],
    [courses]
  );

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
      await axios.post(`/api/courses/${selectedCourse._id}/materials`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Material uploaded successfully!");
      setMaterialTitle("");
      setMaterialFile(null);
      setSelectedCourse(null);
      fetchCourses();
    } catch (error) {
      console.error("Error uploading material:", error);
      toast.error(error.response?.data?.message || "Failed to upload material");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="courses-container page-shell">
      <div className="page-header">
        <div className="header-group">
          <span className="section-kicker">Material delivery</span>
          <h1 className="heading-main">Upload course-wise learning resources</h1>
          <p>
            Keep PDF notes, documents, and classroom resources organized inside the
            correct course without changing how your upload flow works.
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
              </div>

              <div className="course-header">
                <h2>{course.title}</h2>
                <p className="description">{course.description}</p>
              </div>

              <div className="course-facts">
                <span>{course.lectures?.length || 0} lectures</span>
                <span>Ready for resources</span>
              </div>

              <div className="course-actions">
                <button
                  type="button"
                  className="primary-btn upload-material-btn"
                  onClick={() => setSelectedCourse(course)}
                >
                  <FaUpload />
                  <span>Upload Material</span>
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="no-courses surface-card">
            <p>No courses available. Create your first course from the dashboard.</p>
          </div>
        )}
      </div>

      {selectedCourse ? (
        <div className="modal-overlay">
          <div className="modalx">
            <h2>Upload material for {selectedCourse.title}</h2>
            <form onSubmit={handleUploadMaterial}>
              <div className="form-group">
                <label className="modal-form-label">
                  Material title <span className="required">*</span>
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
                  Upload file <span className="required">*</span>
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
                  className="primary-btn"
                  disabled={loading}
                >
                  {loading ? "Uploading..." : "Upload Material"}
                </button>
                <button
                  type="button"
                  className="ghost-btn"
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
      ) : null}
    </div>
  );
};

export default MaterialUpload;
