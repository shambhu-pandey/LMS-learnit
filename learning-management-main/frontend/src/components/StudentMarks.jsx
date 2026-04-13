import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaDownload } from "react-icons/fa";
import "../styles/StudentMarks.css";
import { toast } from "react-toastify";

const StudentMarks = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [marks, setMarks] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/signin");
          return;
        }

        const response = await axios.get(`/api/quizzes/${quizId}/marks`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMarks(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching marks:", error);
        if (error.response?.status === 403) {
          toast.error("You are not authorized to view these marks");
          navigate(-1);
        } else {
          toast.error("Failed to load student marks");
        }
        setLoading(false);
      }
    };

    fetchMarks();
  }, [quizId, navigate]);

  const downloadAsCSV = () => {
    if (!marks) return;

    const csvContent = [
      ["Student Name", "Email", "Score", "Total Points", "Percentage", "Status", "Submitted At"],
      ...marks.marks.map((mark) => [
        mark.studentName,
        mark.studentEmail,
        mark.score,
        mark.totalPoints,
        mark.percentageScore + "%",
        mark.passed ? "Passed" : "Failed",
        new Date(mark.submittedAt).toLocaleString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent)
    );
    element.setAttribute("download", `${marks.quizTitle}_marks.csv`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading student marks...</p>
      </div>
    );
  }

  if (!marks) {
    return (
      <div className="marks-container">
        <p>No marks data found</p>
      </div>
    );
  }

  return (
    <div className="marks-container">
      <div className="marks-header">
        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft /> Back
        </button>
        <div className="header-content">
          <h1>📊 Quiz Marks</h1>
          <h2>{marks.quizTitle}</h2>
          <p>Total Attempts: {marks.totalAttempts}</p>
        </div>
        <button className="download-btn" onClick={downloadAsCSV}>
          <FaDownload /> Download CSV
        </button>
      </div>

      {marks.marks.length > 0 ? (
        <div className="marks-table-wrapper">
          <table className="marks-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Email</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Status</th>
                <th>Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {marks.marks.map((mark, index) => (
                <tr key={index} className={mark.passed ? "passed-row" : "failed-row"}>
                  <td className="student-name">{mark.studentName}</td>
                  <td className="student-email">{mark.studentEmail}</td>
                  <td className="score">
                    {mark.score} / {mark.totalPoints}
                  </td>
                  <td className="percentage">
                    <span className={`badge ${mark.passed ? "passed" : "failed"}`}>
                      {mark.percentageScore}%
                    </span>
                  </td>
                  <td className="status">
                    <span className={`status-badge ${mark.passed ? "passed" : "failed"}`}>
                      {mark.passed ? "✓ Passed" : "✗ Failed"}
                    </span>
                  </td>
                  <td className="submitted-at">
                    {new Date(mark.submittedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-marks">
          <p>No student attempts yet</p>
        </div>
      )}
    </div>
  );
};

export default StudentMarks;
