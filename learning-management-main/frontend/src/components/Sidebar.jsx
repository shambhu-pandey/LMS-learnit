

// import { NavLink } from "react-router-dom";
// import { FaTerminal, FaFileAlt } from "react-icons/fa"; // Import FaFileAlt for the new icon
// import "../styles/Dashboard.css";
// import {
//   FaUser,
//   FaHome,
//   FaBook,
//   FaChartBar,
//   FaClipboardList,
//   FaChalkboardTeacher,
//   FaComments,
//   FaCog,
//   FaSignOutAlt,
//   FaGraduationCap,
//   FaSearch,
//   FaUserGraduate,
//   FaQuestionCircle,
//   FaUserCircle,
//   FaRegCalendarCheck,
//   FaUpload,
// } from "react-icons/fa";

// export default function Sidebar({ user, handleLogout }) {
//   return (
//     <aside className="sidebar">
//       <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//         <img src="/icon.png" alt="Learnit Logo" style={{ width: "40px" }} />
//         <h2 style={{ marginTop: "15px" }}> LMS Dashboard</h2>
//       </div>

//       <div className="user-info">
//         <FaUser className="user-icon" />
//         <div>
//           <p>{user?.name}</p>
//           <span>{user?.role === "instructor" ? "Instructor" : "Student"}</span>
//         </div>
//       </div>

//       <nav>
//         <ul>
//           <li>
//             <NavLink
//               to="/dashboard"
//               className={({ isActive }) => (isActive ? "active" : "")}
//             >
//               <FaHome /> Dashboard
//             </NavLink>
//           </li>

//           {/* Student Navigation */}
//           {user?.role === "student" && (
//             <>
//               <li>
//                 <NavLink
//                   to="/courses"
//                   className={({ isActive }) => (isActive ? "active" : "")}
//                 >
//                   <FaSearch /> Browse Courses
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/enrolled-courses"
//                   className={({ isActive }) => (isActive ? "active" : "")}
//                 >
//                   <FaGraduationCap /> My Learning
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/terminal"
//                   className={({ isActive }) => (isActive ? "active" : "")}
//                 >
//                   <FaTerminal /> Code Terminal
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/materials"
//                   className={({ isActive }) => (isActive ? "active" : "")}
//                 >
//                   <FaFileAlt /> Course Materials
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/assignments"
//                   className={({ isActive }) => (isActive ? "active" : "")}
//                 >
//                   <FaClipboardList /> Assignments
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="http://localhost:3000"
//                   target="_blank"
//                   className={({ isActive }) => (isActive ? "active" : "")}
//                 >
//                   <FaChalkboardTeacher /> Meetings
//                 </NavLink>
//               </li>
//             </>
//           )}

//           {/* Instructor Navigation */}
//           {user?.role === "instructor" && (
//             <>
//               <li>
//                 <NavLink
//                   to="/courses"
//                   className={({ isActive }) => (isActive ? "active" : "")}
//                 >
//                   <FaBook /> Create Course
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/manage-courses"
//                   className={({ isActive }) => (isActive ? "active" : "")}
//                 >
//                   <FaChalkboardTeacher /> Manage Courses
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/quiz-management"
//                   className={({ isActive }) => (isActive ? "active" : "")}
//                 >
//                   <FaQuestionCircle /> Quiz Management
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/upload-materials"
//                   className={({ isActive }) => (isActive ? "active" : "")}
//                 >
//                   <FaUpload /> Upload Materials
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="http://localhost:3000"
//                   target="_blank"
//                   className={({ isActive }) => (isActive ? "active" : "")}
//                 >
//                   <FaChalkboardTeacher /> Meetings
//                 </NavLink>
//               </li>
//             </>
//           )}

//           {/* Common Navigation */}
//           <li className="divider"></li>
//           <li>
//             <NavLink
//               to="/dashboard/profile"
//               className={({ isActive }) => (isActive ? "active" : "")}
//             >
//               <FaUserCircle /> My Profile
//             </NavLink>
//           </li>
//           <li>
//             <NavLink
//               to="/dashboard/settings"
//               className={({ isActive }) => (isActive ? "active" : "")}
//             >
//               <FaCog /> Settings
//             </NavLink>
//           </li>
//           <li className="logout" onClick={handleLogout}>
//             <FaSignOutAlt /> Logout
//           </li>
//         </ul>
//       </nav>
//     </aside>
//   );
// }



import { NavLink } from "react-router-dom";
import { FaTerminal, FaFileAlt } from "react-icons/fa"; // Import FaFileAlt for the new icon
import "../styles/Dashboard.css";
import {
  FaUser,
  FaHome,
  FaBook,
  FaClipboardList,
  FaChalkboardTeacher,
  FaSignOutAlt,
  FaGraduationCap,
  FaSearch,
  FaQuestionCircle,
  FaUserCircle,
  FaUpload,
  FaVideo,
} from "react-icons/fa";

export default function Sidebar({ user, handleLogout }) {
  return (
    <aside className="sidebar">
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img src="/icon.png" alt="Learnit Logo" style={{ width: "40px" }} />
        <h2 style={{ marginTop: "15px" }}> LMS Dashboard</h2>
      </div>

      <div className="user-info">
        <FaUser className="user-icon" />
        <div>
          <p>{user?.name}</p>
          <span>{user?.role === "instructor" ? "Instructor" : "Student"}</span>
        </div>
      </div>

      <nav>
        <ul>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaHome /> Dashboard
            </NavLink>
          </li>

          {/* Student Navigation */}
          {user?.role === "student" && (
            <>
              <li>
                <NavLink
                  to="/courses"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <FaSearch /> Browse Courses
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/enrolled-courses"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <FaGraduationCap /> My Learning
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/terminal"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <FaTerminal /> Code Terminal
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/materials"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <FaFileAlt /> Course Materials
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/assignments"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <FaClipboardList /> Assignments
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/meetings"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <FaVideo /> Meetings
                </NavLink>
              </li>
            </>
          )}

          {/* Instructor Navigation */}
          {user?.role === "instructor" && (
            <>
              <li>
                <NavLink
                  to="/courses"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <FaBook /> Create Course
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/manage-courses"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <FaChalkboardTeacher /> Manage Courses
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/quiz-management"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <FaQuestionCircle /> Quiz Management
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/upload-materials"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <FaUpload /> Upload Materials
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/view-materials"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <FaFileAlt /> View Materials
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/meetings"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <FaVideo /> Meetings
                </NavLink>
              </li>
            </>
          )}

          {/* Common Navigation */}
          <li className="divider"></li>
          <li>
            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaUserCircle /> My Profile
            </NavLink>
          </li>
          {/* <li>
            <NavLink
              to="/dashboard/settings"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaCog /> Settings
            </NavLink>
          </li> */}
          <li className="logout" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </li>
        </ul>
      </nav>
    </aside>
  );
}
