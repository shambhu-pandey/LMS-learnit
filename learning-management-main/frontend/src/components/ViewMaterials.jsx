import React, { useEffect, useMemo, useState } from "react";
import { Download, Eye, Trash2 } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import axios from "../api/axios";
import "../styles/ViewMaterials.css";

const ViewMaterials = () => {
  const { user } = useOutletContext();
  const [courses, setCourses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoursesAndMaterials = async () => {
      try {
        const coursesResponse = await axios.get("/api/courses");
        setCourses(coursesResponse.data);

        const materialsResponse = await axios.get("/api/materials");
        const allMaterials = materialsResponse.data.materials || [];

        const filteredMaterials =
          user?.role === "instructor"
            ? allMaterials.filter((material) => material.teacherId === user._id)
            : allMaterials;

        setMaterials(filteredMaterials);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesAndMaterials();
  }, [user]);

  const totalMaterials = useMemo(() => materials.length, [materials.length]);

  const getMaterialsByCourse = (courseId) =>
    materials.filter((material) => material.courseId === courseId);

  const handleDelete = async (materialId) => {
    if (window.confirm("Are you sure you want to delete this material?")) {
      try {
        await axios.delete(`/api/materials/${materialId}`);
        setMaterials((prevMaterials) =>
          prevMaterials.filter((material) => material._id !== materialId)
        );
      } catch (error) {
        console.error("Error deleting material:", error);
        alert("Failed to delete material");
      }
    }
  };

  if (loading) {
    return <p className="view-materials-loading">Loading data...</p>;
  }

  return (
    <div className="view-materials-container page-shell">
      <div className="page-header">
        <div className="header-group">
          <span className="section-kicker">Resource library</span>
          <h2 className="heading-main view-materials-title">All course materials</h2>
          <p>
            Review uploaded resources by course, then open, download, or remove them
            without disturbing your existing material workflow.
          </p>
        </div>

        <div className="materials-summary surface-card">
          <strong>{totalMaterials}</strong>
          <span>Files available</span>
        </div>
      </div>

      {courses.map((course) => {
        const courseMaterials = getMaterialsByCourse(course._id);

        return (
          <section key={course._id} className="view-materials-course surface-card">
            <div className="view-materials-course__header">
              <div>
                <h3 className="course-title">{course.title}</h3>
                <p className="course-category">Category: {course.category}</p>
              </div>
              <span className="materials-count">{courseMaterials.length} files</span>
            </div>

            {courseMaterials.length === 0 ? (
              <p className="no-materials">No materials available for this course.</p>
            ) : (
              <ul className="materials-list">
                {courseMaterials.map((material) => (
                  <li key={material._id} className="material-item">
                    <div>
                      <span className="material-title">
                        {material.title || material.fileName}
                      </span>
                      <p className="material-subtitle">
                        Added for this course resource library
                      </p>
                    </div>
                    <div className="material-actions">
                      <a
                        href={`http://localhost:5000/${material.filePath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="material-icon view-icon"
                        title="View"
                      >
                        <Eye size={18} />
                      </a>
                      <a
                        href={`http://localhost:5000/${material.filePath}`}
                        download
                        className="material-icon download-icon"
                        title="Download"
                        target="_blank"
                      >
                        <Download size={18} />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDelete(material._id)}
                        className="material-icon delete-icon"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
};

export default ViewMaterials;
