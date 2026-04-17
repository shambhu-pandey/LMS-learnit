import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import "../styles/Auth.css";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      setMessage({ text: "Login successful. Redirecting to your dashboard...", type: "success" });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Login failed",
        type: "danger",
      });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <section className="auth-card">
          <div className="auth-card__header">
            <span className="auth-card__eyebrow">Welcome back</span>
            <h2>Login to your workspace</h2>
            <p>Use your registered email and password to continue.</p>
          </div>

          {message.text ? (
            <div className={`auth-alert auth-alert--${message.type}`}>{message.text}</div>
          ) : null}

          <form onSubmit={handleLogin} className="auth-form">
            <div className="auth-field">
              <label htmlFor="signin-email">Email</label>
              <input
                id="signin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="signin-password">Password</label>
              <input
                id="signin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="primary-btn auth-submit">
              <span>Login</span>
              <FaArrowRight />
            </button>
          </form>

          <p className="auth-footer">
            Don&apos;t have an account? <Link to="/signup">Create one</Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default SignIn;
