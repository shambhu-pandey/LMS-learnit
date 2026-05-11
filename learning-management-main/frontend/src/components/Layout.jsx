import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import Sidebar from "./Sidebar";
import "./../styles/Layout.css";

export default function Layout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        const res = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        alert("Session expired, please log in again.");
        localStorage.removeItem("token");
        navigate("/signin");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/signin");
  };

  if (loading) {
    return (
      <div className="shell-loading">
        <div className="shell-loading__card surface-card">
          <div className="shell-loading__pulse" />
          <h2>Preparing your workspace</h2>
          <p>Loading your dashboard, navigation, and course data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="layout-container">
      <Sidebar user={user} handleLogout={handleLogout} />
      <main className="content-container">
        <div className="content-frame">
          <Outlet context={{ user }} />
        </div>
      </main>
    </div>
  );
}
