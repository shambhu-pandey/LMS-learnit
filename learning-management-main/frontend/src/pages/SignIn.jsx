import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

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
      setMessage({ text: "Login Successful! Redirecting...", type: "success" });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Login failed",
        type: "danger",
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-4 shadow-lg"
        style={{ width: "400px", background: "#fff", borderRadius: "15px" }}
      >
        <div className="text-center">
          <img src="./icon.png" alt="LearnIt Logo" style={{ width: "60px" }} />
        </div>
        <h3 className="text-center text-dark mt-3">Login to Learnit.com</h3>
        {message.text && (
          <div className={`alert alert-${message.type} mt-2`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleLogin} className="mt-3">
          <div className="mb-3">
            <label className="fw-bold mb-1">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="fw-bold mb-1">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 fw-bold">
            Login
          </button>
        </form>
        <p className="mt-3 text-center">
          Don't have an account?{" "}
          <a href="/signup" className="fw-bold">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
