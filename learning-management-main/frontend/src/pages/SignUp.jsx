import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        role,
      });
      setMessage({
        text: "Signup Successful! Redirecting to login...",
        type: "success",
      });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Signup failed",
        type: "danger",
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-4 shadow-lg text-center"
        style={{
          width: "400px",
          background: "#fff",
          borderRadius: "12px",
          padding: "30px",
        }}
      >
        <img
          src="/icon.png" // Change this to your logo path
          alt="Learnit Logo"
          style={{ width: "60px", margin: "0 auto 15px" }}
        />
        <h3 className="text-primary mb-3">Create Your Account</h3>
        {message.text && (
          <div className={`alert alert-${message.type} mt-2`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSignup}>
          <div className="mb-3 text-start">
            <label className="fw-bold mb-1">Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3 text-start">
            <label className="fw-bold mb-1">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3 text-start">
            <label className="fw-bold mb-1">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3 text-start">
            <label className="fw-bold mb-1">Role</label>
            <select
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Sign Up
          </button>
        </form>
        <p className="mt-3">
          Already have an account? <a href="/">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
