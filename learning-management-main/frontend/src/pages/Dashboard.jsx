import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  FaBookOpen,
  FaChalkboardTeacher,
  FaClipboardList,
  FaCompass,
  FaGraduationCap,
  FaInfoCircle,
  FaLayerGroup,
  FaLightbulb,
  FaTasks,
  FaUpload,
  FaVideo,
} from "react-icons/fa";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { user } = useOutletContext();
  const [meetings, setMeetings] = useState([]);
  const [allStudentMeetings, setAllStudentMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role) {
      fetchMeetings();
    }
  }, [user]);

  const fetchMeetings = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };
      const isStudent = user?.role?.toLowerCase() === "student";

      if (isStudent) {
        const response = await axios.get("/api/meetings/student", { headers });
        const studentMeetings = response.data || [];
        const now = new Date();

        const sortedMeetings = [...studentMeetings].sort((a, b) => {
          const aKey = new Date(`${a.date}T${a.startTime || "00:00"}`);
          const bKey = new Date(`${b.date}T${b.startTime || "00:00"}`);
          return aKey - bKey;
        });

        const upcomingMeetings = sortedMeetings.filter((meeting) => {
          const scheduledAt = new Date(
            `${meeting.date}T${meeting.startTime || "00:00"}`
          );
          return !Number.isNaN(scheduledAt.getTime()) && scheduledAt >= now;
        });

        setAllStudentMeetings(sortedMeetings);
        setMeetings(
          upcomingMeetings.length > 0
            ? upcomingMeetings.slice(0, 5)
            : sortedMeetings.slice(0, 5)
        );
      } else {
        const response = await axios.get("/api/meetings/upcoming", { headers });
        setMeetings(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching meetings:", error);
    } finally {
      setLoading(false);
    }
  };

  const role = user?.role?.toLowerCase();
  const isInstructor = role === "teacher" || role === "instructor";
  const firstName = user?.name?.split(" ")[0] || user?.name || "there";

  const quickActions = useMemo(
    () =>
      isInstructor
        ? [
            {
              icon: FaChalkboardTeacher,
              title: "Manage courses",
              description: "Update lessons, review structure, and keep content in shape.",
              action: "Open manager",
              onClick: () => navigate("/manage-courses"),
            },
            {
              icon: FaBookOpen,
              title: "Create course",
              description: "Launch a new learning space with lectures and assignments.",
              action: "Create course",
              onClick: () => navigate("/courses"),
            },
            {
              icon: FaUpload,
              title: "Upload materials",
              description: "Attach documents and resources to the right course flow.",
              action: "Upload now",
              onClick: () => navigate("/upload-materials"),
            },
            {
              icon: FaVideo,
              title: "Meetings",
              description: "Schedule and manage your live sessions course-wise.",
              action: "Open meetings",
              onClick: () => navigate("/meetings"),
            },
          ]
        : [
            {
              icon: FaCompass,
              title: "Browse courses",
              description: "Discover locked and open courses ready for enrollment.",
              action: "Explore",
              onClick: () => navigate("/courses"),
            },
            {
              icon: FaGraduationCap,
              title: "Continue learning",
              description: "Jump back into your enrolled courses and lectures.",
              action: "Open courses",
              onClick: () => navigate("/enrolled-courses"),
            },
            {
              icon: FaClipboardList,
              title: "Assignments",
              description: "Attempt quizzes and keep your course progress moving.",
              action: "View assignments",
              onClick: () => navigate("/assignments"),
            },
            {
              icon: FaVideo,
              title: "Meetings",
              description: "Open your upcoming sessions and join when it's time.",
              action: "View meetings",
              onClick: () => navigate("/meetings"),
            },
          ],
    [isInstructor, navigate]
  );

  const guideItems = useMemo(
    () =>
      isInstructor
        ? [
            "Create a course, then add lectures to shape a complete learning path.",
            "Upload supporting material so students can revisit the lesson outside video.",
            "Use quiz management to keep practice and evaluation close to the course flow.",
            "Schedule Google Meet sessions to connect your live teaching with course content.",
          ]
        : [
            "Browse available courses and enroll to unlock lectures and assignments.",
            "Use My Learning to revisit lectures, materials, and meetings for each course.",
            "Attempt quizzes from assignments to track your understanding as you go.",
            "Check Meetings regularly for upcoming live sessions and class updates.",
          ],
    [isInstructor]
  );

  const glanceStats = useMemo(
    () =>
      isInstructor
        ? [
            {
              label: "Upcoming meetings",
              value: loading ? "..." : meetings.length,
            },
            {
              label: "Action lane",
              value: "Courses + content",
            },
            {
              label: "Focus",
              value: "Teaching flow",
            },
          ]
        : [
            {
              label: "Upcoming meetings",
              value: loading ? "..." : meetings.length,
            },
            {
              label: "Study mode",
              value: "Learning active",
            },
            {
              label: "Next step",
              value: "Continue course",
            },
          ],
    [isInstructor, loading, meetings.length]
  );

  const formatMeetingDate = (meeting) =>
    new Date(`${meeting.date}T00:00`).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  if (!user || !user.role) {
    return (
      <div className="loading-container">
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <main className="dashboard-content">
        <section className="dashboard-hero">
          <div className="dashboard-hero__copy surface-card">
            <span className="section-kicker">
              {isInstructor ? "Instructor Studio" : "Student Hub"}
            </span>
            <h1 className="welcome-message">Welcome back, {firstName}</h1>
            <p className="dashboard-intro">
              {isInstructor
                ? "Keep your teaching workflow focused with fast access to courses, materials, quizzes, and live sessions."
                : "Everything you need to learn is gathered in one place so you can move from lectures to assignments without friction."}
            </p>

            <div className="dashboard-hero__chips">
              <span>
                <FaLayerGroup /> Unified workspace
              </span>
              <span>
                <FaLightbulb /> Better study flow
              </span>
              <span>
                <FaVideo /> Live session ready
              </span>
            </div>
          </div>

          <div className="dashboard-hero__panel surface-card">
            <p className="dashboard-panel__label">Today at a glance</p>
            <div className="dashboard-panel__stats">
              {glanceStats.map((item) => (
                <div key={item.label} className="dashboard-stat">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="dashboard-section surface-card">
            <div className="dashboard-section__title">
              <FaInfoCircle />
              <h2>How to use the platform</h2>
            </div>
            <ul className="dashboard-guide-list">
              {guideItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="dashboard-section dashboard-section--actions surface-card">
            <div className="dashboard-section__title">
              <FaTasks />
              <h2>Quick actions</h2>
            </div>

            <div className="dashboard-actions-grid">
              {quickActions.map(({ icon: Icon, title, description, action, onClick }) => (
                <button
                  key={title}
                  type="button"
                  className="dashboard-action-card"
                  onClick={onClick}
                >
                  <span className="dashboard-action-card__icon">
                    <Icon />
                  </span>
                  <div className="dashboard-action-card__content">
                    <strong>{title}</strong>
                    <p>{description}</p>
                    <span>{action}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="dashboard-section dashboard-section--meetings surface-card">
          <div className="dashboard-section__header">
            <div className="dashboard-section__title">
              <FaVideo />
              <h2>{isInstructor ? "Scheduled meetings" : "Upcoming meetings"}</h2>
            </div>
            <button
              type="button"
              className="secondary-btn dashboard-button"
              onClick={() => navigate("/meetings")}
            >
              {isInstructor ? "Manage meetings" : "Open meetings"}
            </button>
          </div>

          {loading ? (
            <p className="dashboard-empty-state">Loading meetings...</p>
          ) : meetings.length > 0 ? (
            <div className="dashboard-meeting-list">
              {meetings.map((meeting) => (
                <article key={meeting._id} className="dashboard-meeting-card">
                  <div>
                    <p className="dashboard-meeting-card__meta">
                      {meeting.course?.title || "Course session"}
                    </p>
                    <h3>{meeting.title}</h3>
                    <p>
                      {formatMeetingDate(meeting)} at {meeting.startTime}
                    </p>
                  </div>
                  {meeting.meetLink ? (
                    <a
                      href={meeting.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="primary-btn dashboard-meeting-card__link"
                    >
                      {isInstructor ? "Open meet" : "Join now"}
                    </a>
                  ) : (
                    <span className="dashboard-meeting-card__pending">
                      Link pending
                    </span>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="dashboard-empty-state">
              <p>
                {isInstructor
                  ? "No meetings are scheduled yet. Open Meetings to create your first session."
                  : "No meetings are available yet. Check back later or open the Meetings page for updates."}
              </p>
              {!loading && !isInstructor && allStudentMeetings.length > 0 ? (
                <p>You still have past or unsorted meetings inside the Meetings page.</p>
              ) : null}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
