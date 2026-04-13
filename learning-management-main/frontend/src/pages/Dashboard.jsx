



// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate, useOutletContext } from "react-router-dom";
// import "../styles/Dashboard.css";
// import {
//   FaSun,
//   FaMoon,
//   FaBook,
//   FaClipboardList,
//   FaChartBar,
//   FaUser,
//   FaCog,
//   FaComments,
//   FaSignOutAlt,
//   FaChalkboardTeacher,
//   FaHome,
//   FaInfoCircle,
//   FaGraduationCap,
//   FaTasks,
//   FaVideo,
// } from "react-icons/fa";

// const Dashboard = () => {
//   const { user } = useOutletContext();
//   const [enrolledCourses, setEnrolledCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // Debugging - Check if user is correctly received
//   useEffect(() => {
//     console.log("User data received:", user);

//     if (user?.role === "student") {
//       fetchEnrolledCourses();
//     }
//   }, [user]);

//   const fetchEnrolledCourses = async () => {
//     try {
//       const response = await axios.get("/api/courses/enrolled", {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       console.log("Enrolled Courses:", response.data); // Debugging API Response
//       setEnrolledCourses(response.data || []);
//     } catch (error) {
//       console.error("Error fetching enrolled courses:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Ensure user data is loaded before rendering
//   if (!user || !user.role) {
//     return <p>Loading user data...</p>;
//   }

//   return (
//     <div className="dashboard-container">
//       <main className="dashboard-content">
//         <h1>Welcome, {user.name}!</h1>

//         {/* Student Dashboard Sections */}
//         {user.role === "student" && (
//           <>
//             <section className="dashboard-section">
//               <h2>📚 Course Progress</h2>
//               <p>You can enroll in any courses through browse courses </p>
//               <p>Simply click on Enroll button</p>
//             </section>
//             <section className="dashboard-section">
//               <h2>📌 Assignments</h2>
//               <p>You can attempt quiz from assignments sections</p>
            
//             </section>
//             <section className="dashboard-section">
//               <h2>🎥 Google Meet Links</h2>
//               {loading ? (
//                 <p>Loading your courses...</p>
//               ) : enrolledCourses.length > 0 ? (
//                 enrolledCourses.map((course) => (
//                   <div key={course._id} className="course-meet-link">
//                     <p>
//                       <strong>{course.title}:</strong>{" "}
//                       {course.googleMeetLink ? (
//                         <a
//                           href={course.googleMeetLink}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="google-meet-link"
//                         >
//                           Join Meetings
//                         </a>
//                       ) : (
//                         "No Google Meet link available"
//                       )}
//                     </p>
//                   </div>
//                 ))
//               ) : (
//                 <p></p>
//               )}
//             </section>
//           </>
//         )}
// {(user.role?.toLowerCase() === "teacher" || user.role?.toLowerCase() === "instructor") && (
//   <>
//     <section className="dashboard-section">
//       <h2>📖 Manage Courses</h2>
//       <p>You have 3 courses currently active.</p>
//       <button onClick={() => navigate("/manage-courses")}>
//         Go to Course Management
//       </button>
//     </section>
//     <section className="dashboard-section">
//       <h2>✅Create Courses </h2>
//       <p>Create a new Course </p>
//       <button onClick={() => navigate("/create-course")}>
//        Create courses 
//       </button>
//     </section>
//     <section className="dashboard-section">
//       <h2>✅Upload materials </h2>
//       <p></p>
//       <button onClick={() => navigate("/upload-materials")}>
//         Go to Materials
//       </button>
//     </section>
    
//   </>
// )}
//         {/* Debugging: Show user role to confirm it's detected correctly */}
//         <p style={{ marginTop: "20px", color: "gray" }}>
//           <strong>Debug:</strong> Role Detected - {user.role}
//         </p>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;












import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";
import "../styles/Dashboard.css";
import {
  FaClipboardList,
  FaVideo,
  FaChalkboardTeacher,
  FaTasks,
  FaUpload,
  FaGraduationCap,
  FaInfoCircle,
  FaLightbulb,
} from "react-icons/fa";

const Dashboard = () => {
  const { user } = useOutletContext();
  const [meetings, setMeetings] = useState([]);
  const [allStudentMeetings, setAllStudentMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role) {
      fetchMeetings();
    }
  }, [user]);

  const fetchMeetings = async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
      const isStudent = user?.role?.toLowerCase() === "student";

      if (isStudent) {
        const response = await axios.get("/api/meetings/student", { headers });
        const studentMeetings = response.data || [];
        const now = new Date();

        const sortedMeetings = [...studentMeetings].sort((a, b) => {
          const aKey = new Date(`${a.date}T${a.startTime || "00:00"}`);
          const bKey = new Date(`${b.date}T${b.startTime || "00:00"}`);
          return aKey - bKey;
        });

        const upcomingMeetings = sortedMeetings.filter((meeting) => {
          const scheduledAt = new Date(`${meeting.date}T${meeting.startTime || "00:00"}`);
          return !Number.isNaN(scheduledAt.getTime()) && scheduledAt >= now;
        });

        setAllStudentMeetings(sortedMeetings);
        setMeetings(upcomingMeetings.length > 0 ? upcomingMeetings.slice(0, 5) : sortedMeetings.slice(0, 5));
      } else {
        const response = await axios.get("/api/meetings/upcoming", { headers });
        setMeetings(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching meetings:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !user.role) {
    return <p>Loading user data...</p>;
  }

  return (
    <div className="dashboard-container">
      <main
        className={`dashboard-content ${
          user.role?.toLowerCase() === "teacher" || user.role?.toLowerCase() === "instructor"
            ? "teacher"
            : ""
        }`}
      >
        <h1 className="welcome-message">Welcome, {user.name}!</h1>

        {/* How to Use the Platform */}
        <section className="dashboard-section how-to-use">
          <h2>
            <FaInfoCircle style={{ color: "#007bff" }} /> How to Use the Platform
          </h2>
          {user.role === "student" ? (
            <ul>
              <li>
                <FaGraduationCap style={{ color: "#28a745" }} /> Enroll in
                courses from the "Browse Courses" section.
              </li>
              <li>
                <FaClipboardList style={{ color: "#ffc107" }} /> Complete
                quizzes to track your progress.
              </li>
              <li>
                <FaVideo style={{ color: "#17a2b8" }} /> Join live sessions
                from the Meetings section or directly from your dashboard.
              </li>
            </ul>
          ) : (
            <ul>
              <li>
                <FaChalkboardTeacher style={{ color: "#28a745" }} /> Manage your
                courses and upload materials.
              </li>
              <li>
                <FaTasks style={{ color: "#ffc107" }} /> Create quizzes and
                assignments for your students.
              </li>
              <li>
                <FaUpload style={{ color: "#17a2b8" }} /> Upload course
                materials and resources.
              </li>
              <li>
                <FaVideo style={{ color: "#e76f51" }} /> Schedule Google Meet
                classes course-wise for your students.
              </li>
            </ul>
          )}
        </section>

        {/* Student Dashboard Sections */}
        {user.role === "student" && (
          <>
            <section className="dashboard-section">
              <h2>
                <FaGraduationCap style={{ color: "#28a745" }} /> Course Progress
              </h2>
              <p>You can enroll in any courses through the "Browse Courses" section.</p>
              <p>Simply click on the "Enroll" button to get started.</p>
            </section>
            <section className="dashboard-section">
              <h2>
                <FaClipboardList style={{ color: "#ffc107" }} /> Assignments
              </h2>
              <p>You can attempt quizzes and submit assignments from the "Assignments" section.</p>
            </section>
            <section className="dashboard-section">
              <h2>
                <FaVideo style={{ color: "#17a2b8" }} /> Upcoming Meetings
              </h2>
              {loading ? (
                <p>Loading meetings...</p>
              ) : meetings.length > 0 ? (
                meetings.map((meeting) => (
                  <div key={meeting._id} className="course-meet-link">
                    <p>
                      <strong>{meeting.course?.title}:</strong> {meeting.title} on{" "}
                      {new Date(`${meeting.date}T00:00`).toLocaleDateString("en-IN")} at{" "}
                      {meeting.startTime}
                    </p>
                    {meeting.meetLink ? (
                      <a
                        href={meeting.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="google-meet-link"
                      >
                        Join Now
                      </a>
                    ) : null}
                  </div>
                ))
              ) : (
                <p>No meetings available yet.</p>
              )}
              {!loading && meetings.length === 0 && allStudentMeetings.length > 0 ? (
                <p>You have meetings in the Meetings section. Open it to view all sessions.</p>
              ) : null}
              <button className="dashboard-button" onClick={() => navigate("/meetings")}>
                Open Meetings
              </button>
            </section>
          </>
        )}

        {(user.role?.toLowerCase() === "teacher" ||
          user.role?.toLowerCase() === "instructor") && (
          <>
            <section className="dashboard-section">
              <h2>
                <FaChalkboardTeacher style={{ color: "#28a745" }} /> Manage Courses
              </h2>
              <p>You can add lectures and delete courses</p>
              <button
                className="dashboard-button"
                onClick={() => navigate("/manage-courses")}
              >
                Go to Course Management
              </button>
            </section>
            <section className="dashboard-section">
              <h2>
                <FaTasks style={{ color: "#ffc107" }} /> Create Courses
              </h2>
              <p>Create a new course to share your knowledge with students.</p>
              <button
                className="dashboard-button"
                onClick={() => navigate("/courses")}
              >
                Create Courses
              </button>
            </section>
            <section className="dashboard-section">
              <h2>
                <FaUpload style={{ color: "#17a2b8" }} /> Upload Materials
              </h2>
              <p>Upload course materials and resources for your students.</p>
              <button
                className="dashboard-button"
                onClick={() => navigate("/upload-materials")}
              >
                Go to Materials
              </button>
            </section>
            <section className="dashboard-section">
              <h2>
                <FaVideo style={{ color: "#e76f51" }} /> Scheduled Meetings
              </h2>
              {loading ? (
                <p>Loading meetings...</p>
              ) : meetings.length > 0 ? (
                meetings.map((meeting) => (
                  <div key={meeting._id} className="course-meet-link">
                    <p>
                      <strong>{meeting.course?.title}:</strong> {meeting.title} on{" "}
                      {new Date(`${meeting.date}T00:00`).toLocaleDateString("en-IN")} at{" "}
                      {meeting.startTime}
                    </p>
                    {meeting.meetLink ? (
                        <a
                          href={meeting.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="google-meet-link"
                        >
                          Open Meet
                        </a>
                    ) : null}
                  </div>
                ))
              ) : (
                <p>No meetings scheduled yet.</p>
              )}
              <button className="dashboard-button" onClick={() => navigate("/meetings")}>
                Manage Meetings
              </button>
            </section>
          </>
        )}

        {/* Debugging: Show user role to confirm it's detected correctly */}
        <p className="debug-info">
          <strong>Debug:</strong> Role Detected - {user.role}
        </p>
      </main>
    </div>
  );
};

export default Dashboard;

















