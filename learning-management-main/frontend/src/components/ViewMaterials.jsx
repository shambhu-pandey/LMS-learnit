import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { Eye, Download, Trash2 } from "lucide-react"; // Import Trash2 for delete icon
import "../styles/ViewMaterials.css"; // Custom CSS file

const ViewMaterials = ({ user }) => {
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

        // Filter materials by teacherId if the user is an instructor
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

  const getMaterialsByCourse = (courseId) => {
    return materials.filter((material) => material.courseId === courseId);
  };

  const handleDelete = async (materialId) => {
    if (window.confirm("Are you sure you want to delete this material?")) {
      try {
        await axios.delete(`/api/materials/${materialId}`);
        alert("Material deleted successfully");
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
    <div className="view-materials-container">
      <h2 className="view-materials-title">All Course Materials</h2>
      {courses.map((course) => {
        const courseMaterials = getMaterialsByCourse(course._id);
        return (
          <div key={course._id} className="course-card">
            <h3 className="course-title">{course.title}</h3>
            <p className="course-category">Category: {course.category}</p>

            {courseMaterials.length === 0 ? (
              <p className="no-materials">
                No materials available for this course.
              </p>
            ) : (
              <ul className="materials-list">
                {courseMaterials.map((material) => (
                  <li key={material._id} className="material-item">
                    <span className="material-title">
                      {material.title || material.fileName}
                    </span>
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
          </div>
        );
      })}
    </div>
  );
};

export default ViewMaterials;