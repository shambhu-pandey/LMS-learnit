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
} from "react-icons/fa";
import "../styles/Courses.css";
import EnhancedVideoPlayer from "../components/EnhancedVideoPlayer";

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [showLectureModal, setShowLectureModal] = useState(false);
  const [lectureTitle, setLectureTitle] = useState("");
  const [lectureUrl, setLectureUrl] = useState("");
  const [editingCourse, setEditingCourse] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);


  const handleUpdateGoogleMeetLink = async (courseId, googleMeetLink) => {
    try {
      const response = await axios.put(
        `/api/courses/${courseId}/google-meet-link`,
        { googleMeetLink },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      toast.success('Google Meet link updated successfully!');
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course._id === courseId ? { ...course, googleMeetLink } : course
        )
      );
    } catch (error) {
      console.error('Error updating Google Meet link:', error);
      toast.error('Failed to update Google Meet link');
    }
  };
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

  // const handleEditCourse = (course) => {
  //   navigate(`/instructor/edit-course/${course._id}`, { state: { course } });
  // };

  // const handleEditCourse = (course) => {
  //   setEditingCourse(course);
  //   setTitle(course.title);
  //   setDescription(course.description);
  //   setCategory(course.category);
  //   setContent(course.content || "");
  //   setIsLocked(course.isLocked);
  //   setShowModal(true);
  // };
  
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
              </div>

              <p className="description">{course.description}</p>
              <p className="category">Category: {course.category}</p>
              <div className="form-group">
  <label>Google Meet Link</label>
  <input
    type="text"
    placeholder="Enter Google Meet link"
    value={course.googleMeetLink || ''}
    onChange={(e) => handleUpdateGoogleMeetLink(course._id, e.target.value)}
    className="form-control"
  />
</div>
              <div className="course-actions">
                <div className="instructor-actions">
                  {/* <FaEdit
                    className="icon edit"
                    title="Edit Course"
                    onClick={() => handleEditCourse(course)}
                  /> */}
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
              </div>

              <div className="lectures-list">
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

export default ManageCourses;











// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import {
//   FaTrash,
//   FaEdit,
//   FaPlus,
//   FaLock,
//   FaUnlock,
//   FaSpinner,
//   FaUpload,
// } from "react-icons/fa";
// import "../styles/Courses.css";
// import EnhancedVideoPlayer from "../components/EnhancedVideoPlayer";

// const ManageCourses = () => {
//   const [courses, setCourses] = useState([]);
//   const [user, setUser] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [showLectureModal, setShowLectureModal] = useState(false);
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [lectureTitle, setLectureTitle] = useState("");
//   const [lectureUrl, setLectureUrl] = useState("");
//   const [materialTitle, setMaterialTitle] = useState("");
//   const [materialFile, setMaterialFile] = useState(null);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [category, setCategory] = useState("");
//   const [content, setContent] = useState("");
//   const [isLocked, setIsLocked] = useState(false);
//   const [editingCourse, setEditingCourse] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   const fetchCourses = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/signin");
//       return;
//     }

//     try {
//       setLoading(true);
//       const [userResponse, coursesResponse] = await Promise.all([
//         axios.get("/api/auth/me", {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         axios.get("/api/courses/instructor", {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);

//       setUser(userResponse.data);
//       setCourses(coursesResponse.data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       if (error.response?.status === 401) {
//         localStorage.removeItem("token");
//         navigate("/signin");
//       }
//       toast.error("Failed to load courses");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddLecture = (course) => {
//     setSelectedCourse(course);
//     setShowLectureModal(true);
//   };

//   const handleCreateLecture = async (e) => {
//     e.preventDefault();

//     if (!selectedCourse) {
//       toast.error("Please select a course");
//       return;
//     }

//     if (!lectureTitle.trim() || !lectureUrl.trim()) {
//       toast.error("Please fill in all fields");
//       return;
//     }

//     const videoId = lectureUrl.match(
//       /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/
//     );
//     if (!videoId) {
//       toast.error("Please enter a valid YouTube URL");
//       return;
//     }

//     const videoUrl = `https://www.youtube.com/embed/${videoId[1]}`;

//     try {
//       setLoading(true);
//       const response = await axios.post(
//         `/api/courses/${selectedCourse._id}/lectures`,
//         {
//           title: lectureTitle,
//           description: lectureTitle,
//           videoUrl: videoUrl,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       setCourses(
//         courses.map((course) =>
//           course._id === selectedCourse._id ? response.data.course : course
//         )
//       );

//       toast.success("Lecture added successfully!");
//       setShowLectureModal(false);
//       setLectureTitle("");
//       setLectureUrl("");
//       setSelectedCourse(null);
//     } catch (error) {
//       console.error("Error adding lecture:", error);
//       toast.error(error.response?.data?.message || "Failed to add lecture");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUploadMaterial = async (e) => {
//     e.preventDefault();

//     if (!selectedCourse) {
//       toast.error("Please select a course");
//       return;
//     }

//     if (!materialTitle.trim() || !materialFile) {
//       toast.error("Please provide a title and select a file");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("title", materialTitle);
//     formData.append("file", materialFile);

//     try {
//       setLoading(true);
//       const response = await axios.post(
//         `/api/courses/${selectedCourse._id}/materials`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       toast.success("Material uploaded successfully!");
//       setMaterialTitle("");
//       setMaterialFile(null);
//       setSelectedCourse(null);
//       fetchCourses(); // Refresh courses to show updated materials
//     } catch (error) {
//       console.error("Error uploading material:", error);
//       toast.error(error.response?.data?.message || "Failed to upload material");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="courses-container">
//       <div className="header-group">
//         <h1 className="heading-main">Manage Your Courses</h1>
//         <p>Create and manage your courses</p>
//       </div>

//       <div className="courses-list">
//         {courses.length > 0 ? (
//           courses.map((course) => (
//             <div
//               key={course._id}
//               className={`course-card ${course.isLocked ? "locked" : ""}`}
//             >
//               <div className="course-header">
//                 <h2>{course.title}</h2>
//                 <button
//                   className="add-lecture-btn"
//                   onClick={() => handleAddLecture(course)}
//                 >
//                   <FaPlus /> Add Lecture
//                 </button>
//                 <button
//                   className="upload-material-btn"
//                   onClick={() => setSelectedCourse(course)}
//                 >
//                   <FaUpload /> Upload Material
//                 </button>
//               </div>

//               <p className="description">{course.description}</p>
//               <p className="category">Category: {course.category}</p>

//               <div className="lectures-list">
//                 {course.lectures?.map((lecture) => (
//                   <div key={lecture._id} className="lecture-item">
//                     <h3>{lecture.title}</h3>
//                     {lecture.videoUrl && (
//                       <EnhancedVideoPlayer
//                         videoUrl={lecture.videoUrl}
//                         title={lecture.title}
//                       />
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="no-courses">
//             <p>No courses available. Create your first course from the dashboard.</p>
//           </div>
//         )}
//       </div>

//       {showLectureModal && (
//         <div className="modal-overlay">
//           <div className="modalx">
//             <h2>Add New Lecture</h2>
//             <form onSubmit={handleCreateLecture}>
//               <div className="form-group">
//                 <label>Lecture Title</label>
//                 <input
//                   type="text"
//                   value={lectureTitle}
//                   onChange={(e) => setLectureTitle(e.target.value)}
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label>YouTube Video URL</label>
//                 <input
//                   type="text"
//                   value={lectureUrl}
//                   onChange={(e) => setLectureUrl(e.target.value)}
//                   required
//                 />
//               </div>
//               <div className="modal-actions">
//                 <button type="submit" disabled={loading}>
//                   {loading ? "Adding..." : "Add Lecture"}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowLectureModal(false);
//                     setLectureTitle("");
//                     setLectureUrl("");
//                     setSelectedCourse(null);
//                   }}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {selectedCourse && (
//         <div className="modal-overlay">
//           <div className="modalx">
//             <h2>Upload Material for {selectedCourse.title}</h2>
//             <form onSubmit={handleUploadMaterial}>
//               <div className="form-group">
//                 <label>Material Title</label>
//                 <input
//                   type="text"
//                   value={materialTitle}
//                   onChange={(e) => setMaterialTitle(e.target.value)}
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Upload File</label>
//                 <input
//                   type="file"
//                   onChange={(e) => setMaterialFile(e.target.files[0])}
//                   required
//                 />
//               </div>
//               <div className="modal-actions">
//                 <button type="submit" disabled={loading}>
//                   {loading ? "Uploading..." : "Upload Material"}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setSelectedCourse(null);
//                     setMaterialTitle("");
//                     setMaterialFile(null);
//                   }}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ManageCourses;





// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import {
//   FaTrash,
//   FaEdit,
//   FaPlus,
//   FaEye,
//   FaLock,
//   FaUnlock,
//   FaSpinner,
//   FaGraduationCap,
//   FaUpload,
// } from "react-icons/fa";
// import "../styles/Courses.css";

// const ManageCourses = () => {
//   const [courses, setCourses] = useState([]);
//   const [user, setUser] = useState(null);
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [materialTitle, setMaterialTitle] = useState("");
//   const [materialFile, setMaterialFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   const fetchCourses = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/signin");
//       return;
//     }

//     try {
//       setLoading(true);
//       const [userResponse, coursesResponse] = await Promise.all([
//         axios.get("/api/auth/me", {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         axios.get("/api/courses/instructor", {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);

//       setUser(userResponse.data);
//       setCourses(coursesResponse.data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       if (error.response?.status === 401) {
//         localStorage.removeItem("token");
//         navigate("/signin");
//       }
//       toast.error("Failed to load courses");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUploadMaterial = async (e) => {
//     e.preventDefault();

//     if (!selectedCourse) {
//       toast.error("Please select a course");
//       return;
//     }

//     if (!materialTitle.trim() || !materialFile) {
//       toast.error("Please provide a title and select a file");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("title", materialTitle);
//     formData.append("file", materialFile);

//     try {
//       setLoading(true);
//       const response = await axios.post(
//         `/api/courses/${selectedCourse._id}/materials`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       toast.success("Material uploaded successfully!");
//       setMaterialTitle("");
//       setMaterialFile(null);
//       setSelectedCourse(null);
//       fetchCourses(); // Refresh courses to show updated materials
//     } catch (error) {
//       console.error("Error uploading material:", error);
//       toast.error(error.response?.data?.message || "Failed to upload material");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="courses-container">
//       <div className="header-group">
//         <h1 className="heading-main">Manage Your Courses</h1>
//         <p>Create and manage your courses</p>
//       </div>

//       <div className="courses-list">
//         {courses.length > 0 ? (
//           courses.map((course) => (
//             <div
//               key={course._id}
//               className={`course-card ${course.isLocked ? "locked" : ""}`}
//             >
//               <div className="course-header">
//                 <h2>{course.title}</h2>
//               </div>

//               <p className="description">{course.description}</p>
//               <p className="category">Category: {course.category}</p>

//               <div className="course-actions">
//                 <button
//                   className="upload-material-btn"
//                   onClick={() => setSelectedCourse(course)}
//                 >
//                   <FaUpload /> Upload Material
//                 </button>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="no-courses">
//             <p>
//               No courses available. Create your first course from the dashboard.
//             </p>
//           </div>
//         )}
//       </div>

//       {selectedCourse && (
//         <div className="modal-overlay">
//           <div className="modalx">
//             <h2>Upload Material for {selectedCourse.title}</h2>
//             <form onSubmit={handleUploadMaterial}>
//               <div className="form-group">
//                 <label className="modal-form-label">
//                   Material Title <span className="required">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter material title"
//                   value={materialTitle}
//                   onChange={(e) => setMaterialTitle(e.target.value)}
//                   required
//                   className="form-control"
//                 />
//               </div>

//               <div className="form-group">
//                 <label className="modal-form-label">
//                   Upload File <span className="required">*</span>
//                 </label>
//                 <input
//                   type="file"
//                   onChange={(e) => setMaterialFile(e.target.files[0])}
//                   required
//                   className="form-control"
//                 />
//               </div>

//               <div className="modal-actions">
//                 <button
//                   type="submit"
//                   className="modal-btn create"
//                   disabled={loading}
//                 >
//                   {loading ? "Uploading..." : "Upload Material"}
//                 </button>
//                 <button
//                   type="button"
//                   className="modal-btn cancel"
//                   onClick={() => {
//                     setSelectedCourse(null);
//                     setMaterialTitle("");
//                     setMaterialFile(null);
//                   }}
//                   disabled={loading}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ManageCourses;
