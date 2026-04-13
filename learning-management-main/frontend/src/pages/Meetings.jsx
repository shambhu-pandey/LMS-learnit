import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaEdit,
  FaExternalLinkAlt,
  FaGoogle,
  FaPlus,
  FaSpinner,
  FaTrash,
  FaVideo,
} from "react-icons/fa";
import "../styles/Meetings.css";

const emptyForm = {
  courseId: "",
  title: "",
  description: "",
  meetLink: "",
  date: "",
  startTime: "",
  endTime: "",
  slot: "",
};

const normalizeCourseInstructorId = (course) => {
  if (!course?.instructor) {
    return "";
  }

  if (typeof course.instructor === "string") {
    return course.instructor;
  }

  return course.instructor._id || "";
};

const Meetings = () => {
  const { user } = useOutletContext();
  const [courses, setCourses] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const isInstructor =
    user?.role?.toLowerCase() === "instructor" || user?.role?.toLowerCase() === "teacher";

  useEffect(() => {
    if (!user?.role) {
      return;
    }

    const fetchData = async () => {
      let hasShownLoadError = false;

      const showLoadError = (message) => {
        if (!hasShownLoadError) {
          toast.error(message);
          hasShownLoadError = true;
        }
      };

      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        if (isInstructor) {
          let instructorCourses = [];
          try {
            const coursesResponse = await axios.get("/api/courses/instructor", { headers });
            instructorCourses = coursesResponse.data || [];
          } catch (error) {
            console.error("Error loading instructor courses:", error);

            try {
              const fallbackCoursesResponse = await axios.get("/api/courses", { headers });
              const fallbackCourses = fallbackCoursesResponse.data || [];
              instructorCourses = fallbackCourses.filter((course) => {
                const instructorId = normalizeCourseInstructorId(course);
                return (
                  instructorId === user?._id ||
                  course.instructorName === user?.name
                );
              });
            } catch (fallbackError) {
              console.error("Error loading fallback courses:", fallbackError);
              showLoadError("Failed to load courses for meetings");
            }
          }

          setCourses(instructorCourses);

          try {
            const meetingsResponse = await axios.get("/api/meetings/instructor", { headers });
            setMeetings(meetingsResponse.data || []);
          } catch (error) {
            console.error("Error fetching instructor meetings:", error);
            setMeetings([]);
            showLoadError("Failed to load meetings");
          }
        } else {
          try {
            const response = await axios.get("/api/meetings/student", { headers });
            setMeetings(response.data || []);
          } catch (error) {
            console.error("Error fetching student meetings:", error);
            setMeetings([]);
            showLoadError("Failed to load meetings");
          }
        }
      } catch (error) {
        console.error("Error fetching meetings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isInstructor, user]);

  const sortedMeetings = useMemo(() => {
    return [...meetings].sort((a, b) => {
      const aKey = `${a.date}T${a.startTime || "00:00"}`;
      const bKey = `${b.date}T${b.startTime || "00:00"}`;
      return new Date(aKey) - new Date(bKey);
    });
  }, [meetings]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const selectedCourseTitle =
    courses.find((course) => course._id === form.courseId)?.title || "";

  const handleEdit = (meeting) => {
    setEditingId(meeting._id);
    setForm({
      courseId: meeting.course?._id || "",
      title: meeting.title || "",
      description: meeting.description || "",
      meetLink: meeting.meetLink || "",
      date: meeting.date || "",
      startTime: meeting.startTime || "",
      endTime: meeting.endTime || "",
      slot: meeting.slot || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (meetingId) => {
    if (!window.confirm("Delete this meeting?")) {
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
      await axios.delete(`/api/meetings/${meetingId}`, { headers });
      setMeetings((current) => current.filter((meeting) => meeting._id !== meetingId));
      toast.success("Meeting deleted successfully");
      if (editingId === meetingId) {
        resetForm();
      }
    } catch (error) {
      console.error("Error deleting meeting:", error);
      toast.error(error.response?.data?.message || "Failed to delete meeting");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
      const payload = {
        courseId: form.courseId,
        title: form.title,
        description: form.description,
        meetLink: form.meetLink,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        slot: form.slot,
      };

      if (editingId) {
        const response = await axios.put(`/api/meetings/${editingId}`, payload, { headers });
        setMeetings((current) =>
          current.map((meeting) => (meeting._id === editingId ? response.data : meeting))
        );
        toast.success("Meeting updated successfully");
      } else {
        const response = await axios.post("/api/meetings", payload, { headers });
        setMeetings((current) => [...current, response.data]);
        toast.success("Meeting scheduled successfully");
      }

      resetForm();
    } catch (error) {
      console.error("Error saving meeting:", error);
      toast.error(error.response?.data?.message || "Failed to save meeting");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date) =>
    new Date(`${date}T00:00`).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  if (loading) {
    return (
      <div className="meetings-loading">
        <FaSpinner className="spinner" />
        <p>Loading meetings...</p>
      </div>
    );
  }

  return (
    <div className="meetings-page">
      <div className="meetings-hero">
        <h1>{isInstructor ? "Course Meetings" : "My Live Classes"}</h1>
        <p>
          {isInstructor
            ? "Schedule Google Meet sessions course-wise with date, time, slot, and title."
            : "See all scheduled course meetings and join them directly from your LMS."}
        </p>
        {isInstructor && (
          <div className="meetings-hero-actions">
            <a
              href="https://meet.google.com/new"
              target="_blank"
              rel="noopener noreferrer"
              className="meeting-open-google-btn"
            >
              <FaGoogle />
              Open Google Meet
            </a>
            <span className="meeting-open-google-note">
              Create the meeting in Google Meet, then paste the generated link below.
            </span>
          </div>
        )}
      </div>

      {isInstructor && (
        <section className="meeting-form-panel">
          <div className="panel-title">
            <h2>{editingId ? "Edit Meeting" : "Schedule New Meeting"}</h2>
            <p>Create the meeting here, and the join link will automatically appear on the dashboard and student Meetings section.</p>
          </div>

          <form className="meeting-form-grid" onSubmit={handleSubmit}>
            <label className="meeting-field">
              <span>Course</span>
              <select name="courseId" value={form.courseId} onChange={handleChange} required>
                <option value="">Select course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="meeting-field">
              <span>Meeting Title</span>
              <input
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                placeholder="Weekly live class"
                required
              />
            </label>

            <label className="meeting-field">
              <span>Date</span>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </label>

            <label className="meeting-field">
              <span>Start Time</span>
              <input
                name="startTime"
                type="time"
                value={form.startTime}
                onChange={handleChange}
                required
              />
            </label>

            <label className="meeting-field">
              <span>End Time</span>
              <input
                name="endTime"
                type="time"
                value={form.endTime}
                onChange={handleChange}
              />
            </label>

            <label className="meeting-field">
              <span>Slot or Batch</span>
              <input
                name="slot"
                type="text"
                value={form.slot}
                onChange={handleChange}
                placeholder="Morning Batch"
              />
            </label>

            <label className="meeting-field meeting-form-full">
              <span>Google Meet Link</span>
              <input
                name="meetLink"
                type="url"
                value={form.meetLink}
                onChange={handleChange}
                placeholder="https://meet.google.com/..."
                required
              />
            </label>

            <label className="meeting-field meeting-form-full">
              <span>Description</span>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Short description or agenda"
                rows="3"
              />
            </label>

            <div className="meeting-form-actions meeting-form-full">
              <button type="submit" className="meeting-primary-btn" disabled={submitting}>
                {submitting ? <FaSpinner className="spinner" /> : <FaPlus />}
                {editingId ? "Update Meeting" : "Create Meeting"}
              </button>
              {editingId && (
                <button type="button" className="meeting-secondary-btn" onClick={resetForm}>
                  Cancel Edit
                </button>
              )}
            </div>
          </form>

          {courses.length === 0 && (
            <div className="meeting-helper-note">
              No courses found for this account yet. Create a course first, then it will appear in the dropdown.
            </div>
          )}

          {selectedCourseTitle && (
            <div className="meeting-helper-note accent">
              This meeting will be shown for the course: <strong>{selectedCourseTitle}</strong>
            </div>
          )}
        </section>
      )}

      <section className="meeting-list-panel">
        <div className="panel-title">
          <h2>{isInstructor ? "Scheduled Meetings" : "Available Meetings"}</h2>
          <p>
            {sortedMeetings.length > 0
              ? `${sortedMeetings.length} meeting${sortedMeetings.length > 1 ? "s" : ""} found`
              : "No meetings scheduled yet"}
          </p>
        </div>

        <div className="meeting-cards">
          {sortedMeetings.length > 0 ? (
            sortedMeetings.map((meeting) => (
              <article key={meeting._id} className="meeting-card">
                <div className="meeting-card-top">
                  <div>
                    <span className="meeting-course-chip">
                      <FaChalkboardTeacher />
                      {meeting.course?.title || "Course"}
                    </span>
                    <h3>{meeting.title}</h3>
                  </div>
                  <a
                    href={meeting.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="meeting-join-btn"
                  >
                    <FaVideo />
                    Join
                  </a>
                </div>

                <div className="meeting-meta">
                  <span>
                    <FaCalendarAlt />
                    {formatDate(meeting.date)}
                  </span>
                  <span>
                    <FaVideo />
                    {meeting.startTime}
                    {meeting.endTime ? ` - ${meeting.endTime}` : ""}
                  </span>
                  {meeting.slot && (
                    <span>
                      <FaExternalLinkAlt />
                      {meeting.slot}
                    </span>
                  )}
                </div>

                {meeting.description && <p className="meeting-description">{meeting.description}</p>}

                <p className="meeting-instructor-line">
                  Instructor: {meeting.course?.instructorName || meeting.instructor?.name || "Unknown"}
                </p>

                {isInstructor && (
                  <div className="meeting-card-actions">
                    <button type="button" onClick={() => handleEdit(meeting)}>
                      <FaEdit />
                      Edit
                    </button>
                    <button type="button" className="danger" onClick={() => handleDelete(meeting._id)}>
                      <FaTrash />
                      Delete
                    </button>
                  </div>
                )}
              </article>
            ))
          ) : (
            <div className="meeting-empty-state">
              <FaCalendarAlt />
              <h3>{isInstructor ? "No meetings yet" : "No meetings available yet"}</h3>
              <p>
                {isInstructor
                  ? "Schedule your first Google Meet session for a course."
                  : "Your instructor has not scheduled a meeting for your enrolled courses yet."}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Meetings;
