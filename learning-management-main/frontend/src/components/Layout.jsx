// import { Outlet, useNavigate } from "react-router-dom";
// import Sidebar from "./Sidebar";
// import axios from "axios"; // ✅ Import Axios
// import { useEffect, useState } from "react";
// import "./../styles/Layout.css";

// export default function Layout() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true); // ✅ Track loading state
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUser = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/signin");
//         return;
//       }

//       try {
//         const res = await axios.get("http://localhost:5000/api/auth/me", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUser(res.data);
//       } catch (err) {
//         alert("Session expired, please log in again.");
//         localStorage.removeItem("token");
//         navigate("/signin");
//       } finally {
//         setLoading(false); // ✅ Set loading to false
//       }
//     };

//     fetchUser();
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/signin");
//   };

//   // ✅ Show loading state before rendering layout
//   if (loading) {
//     return <div className="loading-spinner">Loading...</div>;
//   }

//   return (
//     <div className="layout-container">
//       <Sidebar user={user} handleLogout={handleLogout} />
//       <div className="content-container">
//         <Outlet context={{ user }} />
//       </div>
//     </div>
//   );
// }









import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import axios from "axios"; // ✅ Import Axios
import { useEffect, useState } from "react";
import "./../styles/Layout.css";

export default function Layout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Track loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        alert("Session expired, please log in again.");
        localStorage.removeItem("token");
        navigate("/signin");
      } finally {
        setLoading(false); // ✅ Set loading to false
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/signin");
  };

  // ✅ Show loading state before rendering layout
  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="layout-container">
      <Sidebar user={user} handleLogout={handleLogout} />
      <div className="content-container">
      
        <Outlet context={{ user }} />
      </div>
    </div>

  
  );
}



