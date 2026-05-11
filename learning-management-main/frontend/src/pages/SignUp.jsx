import React, { useState } from "react";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import "../styles/Auth.css";

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
      await axios.post("/api/auth/register", {
        name,
        email,
        password,
        role,
      });

      setMessage({
        text: "Signup successful. Redirecting you to login...",
        type: "success",
      });

      setTimeout(() => {
        navigate("/signin");
      }, 1200);
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Signup failed",
        type: "danger",
      });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <section className="auth-card">
          <div className="auth-card__header">
            <span className="auth-card__eyebrow">Get started</span>
            <h2>Create your account</h2>
            <p>Choose your role and set up your Learnit workspace.</p>
          </div>

          {message.text ? (
            <div className={`auth-alert auth-alert--${message.type}`}>{message.text}</div>
          ) : null}

          <form onSubmit={handleSignup} className="auth-form">
            <div className="auth-field">
              <label htmlFor="signup-name">Full name</label>
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="signup-email">Email</label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a secure password"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="signup-role">Role</label>
              <select
                id="signup-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>

            <button type="submit" className="primary-btn auth-submit">
              <span>Create account</span>
              <FaArrowRight />
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/signin">Login here</Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default SignUp;
