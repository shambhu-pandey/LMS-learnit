// import { useNavigate } from "react-router-dom";

// export default function Navbar() {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     navigate("/");
//   };

//   return (
//     <nav className="bg-blue-600 text-white p-4 flex justify-between">
//       <h1 className="text-xl font-semibold">LMS Dashboard</h1>
//       <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">
//         Logout
//       </button>
//     </nav>
//   );
// }
















import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaCog, FaSignOutAlt, FaBell } from "react-icons/fa";

export default function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">LMS Dashboard</h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Notifications */}
        <div className="relative cursor-pointer">
          <FaBell className="text-xl hover:text-blue-200" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full w-4 h-4 flex items-center justify-center">
            2
          </span>
        </div>

        {/* User Profile Dropdown */}
        <div className="relative group">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center">
              <FaUser className="text-xl" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs opacity-75">{user?.email}</p>
            </div>
          </div>

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 invisible group-hover:visible z-50">
            <Link
              to="/dashboard/profile"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50"
            >
              <FaUser className="text-blue-600" />
              <span>My Profile</span>
            </Link>
            <Link
              to="/dashboard/settings"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50"
            >
              <FaCog className="text-blue-600" />
              <span>Settings</span>
            </Link>
            <hr className="my-2" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}






