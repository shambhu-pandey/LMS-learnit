import { NavLink } from "react-router-dom";
import {
  FaBook,
  FaChalkboardTeacher,
  FaClipboardList,
  FaFileAlt,
  FaGraduationCap,
  FaHome,
  FaQuestionCircle,
  FaSearch,
  FaSignOutAlt,
  FaTerminal,
  FaUpload,
  FaUser,
  FaUserCircle,
  FaVideo,
} from "react-icons/fa";

const studentLinks = [
  { to: "/dashboard", label: "Dashboard", icon: FaHome },
  { to: "/courses", label: "Browse Courses", icon: FaSearch },
  { to: "/enrolled-courses", label: "My Learning", icon: FaGraduationCap },
  { to: "/assignments", label: "Assignments", icon: FaClipboardList },
  { to: "/materials", label: "Course Materials", icon: FaFileAlt },
  { to: "/terminal", label: "Code Terminal", icon: FaTerminal },
  { to: "/meetings", label: "Meetings", icon: FaVideo },
];

const instructorLinks = [
  { to: "/dashboard", label: "Dashboard", icon: FaHome },
  { to: "/courses", label: "Create Course", icon: FaBook },
  { to: "/manage-courses", label: "Manage Courses", icon: FaChalkboardTeacher },
  { to: "/quiz-management", label: "Quiz Management", icon: FaQuestionCircle },
  { to: "/upload-materials", label: "Upload Materials", icon: FaUpload },
  { to: "/view-materials", label: "View Materials", icon: FaFileAlt },
  { to: "/meetings", label: "Meetings", icon: FaVideo },
];

const commonLinks = [
  { to: "/dashboard/profile", label: "My Profile", icon: FaUserCircle },
];

const roleLabels = {
  instructor: "Instructor",
  teacher: "Instructor",
  student: "Student",
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "L";

export default function Sidebar({ user, handleLogout }) {
  const role = user?.role?.toLowerCase();
  const isInstructor = role === "instructor" || role === "teacher";
  const navLinks = isInstructor ? instructorLinks : studentLinks;

  const renderLinks = (links) =>
    links.map(({ to, label, icon: Icon }) => (
      <NavLink
        key={to}
        to={to}
        className={({ isActive }) =>
          `sidebar-link${isActive ? " active" : ""}`
        }
      >
        <span className="sidebar-link__icon">
          <Icon />
        </span>
        <span>{label}</span>
      </NavLink>
    ));

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand__mark">
          <img src="/icon.png" alt="Learnit Logo" />
        </div>
        <div className="sidebar-brand__copy">
          <p>Learning Workspace</p>
          <h1>Learnit LMS</h1>
        </div>
      </div>

      <div className="sidebar-user-card">
        <div className="sidebar-user-card__avatar">
          {user?.name ? getInitials(user.name) : <FaUser />}
        </div>
        <div className="sidebar-user-card__info">
          <strong>{user?.name || "Welcome"}</strong>
          <span>{roleLabels[role] || "Learner"}</span>
        </div>
      </div>

      <div className="sidebar-nav-group">
        <p className="sidebar-nav-label">Workspace</p>
        <nav className="sidebar-nav">{renderLinks(navLinks)}</nav>
      </div>

      <div className="sidebar-nav-group sidebar-nav-group--secondary">
        <p className="sidebar-nav-label">Account</p>
        <nav className="sidebar-nav">{renderLinks(commonLinks)}</nav>
      </div>

      <div className="sidebar-footer">
        <div>
          <p className="sidebar-footer__label">Current mode</p>
          <strong>{isInstructor ? "Instructor studio" : "Student learning"}</strong>
        </div>
        <button
          type="button"
          className="sidebar-logout"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
