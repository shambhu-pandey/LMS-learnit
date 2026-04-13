// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FaGraduationCap, FaBook, FaCheckCircle } from 'react-icons/fa';
// import '../styles/Courses.css';

// const StudentCourses = () => {
//   const [availableCourses, setAvailableCourses] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchAvailableCourses();
//   }, []);

//   const fetchAvailableCourses = async () => {
//     try {
//       const res = await axios.get('/api/courses/available', {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       setAvailableCourses(res.data);
//     } catch (err) {
//       console.error('Error fetching courses:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEnroll = async (courseId) => {
//     try {
//       await axios.post(`/api/courses/${courseId}/enroll`, {}, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       alert('Successfully enrolled in course!');
//       fetchAvailableCourses(); // Refresh the course list
//     } catch (err) {
//       alert(err.response?.data?.message || 'Error enrolling in course');
//     }
//   };

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="courses-container">
//       <h1>Available Courses</h1>
//       <div className="courses-grid">
//         {availableCourses.map(course => (
//           <div key={course._id} className="course-card">
//             <div className="course-header">
//               <h2>{course.title}</h2>
//               <FaBook className="course-icon" />
//             </div>
//             <p className="course-description">{course.description}</p>
//             <div className="course-details">
//               <p><strong>Instructor:</strong> {course.instructorName}</p>
//               <p><strong>Category:</strong> {course.category}</p>
//               <p><strong>Enrolled:</strong> {course.enrollmentCount} students</p>
//             </div>
//             <button 
//               className="enroll-button"
//               onClick={() => handleEnroll(course._id)}
//             >
//               <FaGraduationCap /> Enroll Now
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default StudentCourses;


















// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { FaGraduationCap, FaBook } from 'react-icons/fa';
// import '../styles/Courses.css';

// const StudentCourses = () => {
//   const [availableCourses, setAvailableCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchAvailableCourses();
//   }, []);

//   const fetchAvailableCourses = async () => {
//     try {
//       const res = await axios.get('/api/courses', {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       setAvailableCourses(res.data);
//     } catch (err) {
//       console.error('Error fetching courses:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEnroll = async (courseId) => {
//     try {
//       await axios.post(`/api/courses/${courseId}/enroll`, {}, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       alert('Successfully enrolled in course!');
//       navigate('/enrolled-courses');
//     } catch (err) {
//       alert(err.response?.data?.message || 'Error enrolling in course');
//     }
//   };

//   if (loading) {
//     return <div className="loading">Loading courses...</div>;
//   }

//   return (
//     <div className="courses-container">
//       <h1>Available Courses</h1>
//       <div className="courses-grid">
//         {availableCourses.length > 0 ? (
//           availableCourses.map(course => (
//             <div key={course._id} className="course-card">
//               <div className="course-header">
//                 <h2>{course.title}</h2>
//                 <FaBook className="course-icon" />
//               </div>
//               <p className="course-description">{course.description}</p>
//               <div className="course-details">
//                 <p><strong>Instructor:</strong> {course.instructorName}</p>
//                 <p><strong>Category:</strong> {course.category}</p>
//               </div>
//               <button 
//                 className="enroll-button"
//                 onClick={() => handleEnroll(course._id)}
//               >
//                 <FaGraduationCap /> Enroll Now
//               </button>
//               <div className="course-details">
//   <h3>{course.title}</h3>
//   <p>{course.description}</p>
//   {course.googleMeetLink && (
//     <a href={course.googleMeetLink} target="_blank" rel="noopener noreferrer">
//       Join Google Meet
//     </a>
//   )}
// </div>
//               {course.lectures && course.lectures.length > 0 && (
//                 <div className="preview-section">
//                   <h3>Course Preview</h3>
//                   <div className="lecture-preview">
//                     <h4>{course.lectures[0].title}</h4>
//                     <div className="video-container">
//                       <iframe
//                         width="100%"
//                         height="215"
//                         src={course.lectures[0].url}
//                         frameBorder="0"
//                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                         allowFullScreen
//                         title={course.lectures[0].title}
//                       ></iframe>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))
//         ) : (
//           <div className="no-courses">
//             No courses available at the moment. Please check back later.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StudentCourses;












// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { FaGraduationCap, FaBook } from 'react-icons/fa';
// import '../styles/Courses.css';

// const StudentCourses = () => {
//   const [availableCourses, setAvailableCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchAvailableCourses();
//   }, []);

//   const fetchAvailableCourses = async () => {
//     try {
//       const res = await axios.get('/api/courses/available', {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       });
//       setAvailableCourses(res.data);
//     } catch (err) {
//       console.error('Error fetching courses:', err);
//     } finally {
//       setLoading(false);
//     }
//   };


//   // const fetchAvailableCourses = async () => {
//   //   try {
//   //     const res = await axios.get('/api/courses/available', {
//   //       headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//   //     });
//   //     console.log(res.data); // Log the response to verify googleMeetLink
//   //     setAvailableCourses(res.data);
//   //   } catch (err) {
//   //     console.error('Error fetching courses:', err);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const handleEnroll = async (courseId) => {
//     try {
//       await axios.post(
//         `/api/courses/${courseId}/enroll`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         }
//       );
//       alert('Successfully enrolled in course!');
//       navigate('/enrolled-courses');
//     } catch (err) {
//       alert(err.response?.data?.message || 'Error enrolling in course');
//     }
//   };

//   if (loading) {
//     return <div className="loading">Loading courses...</div>;
//   }

//   return (
//     <div className="courses-container">
//       <h1>Available Courses</h1>
//       <div className="courses-grid">
//         {availableCourses.length > 0 ? (
//           availableCourses.map((course) => (
//             <div key={course._id} className="course-card">
//               <div className="course-header">
//                 <h2>{course.title}</h2>
//                 <FaBook className="course-icon" />
//               </div>
//               <p className="course-description">{course.description}</p>
//               <div className="course-details">
//                 <p>
//                   <strong>Instructor:</strong> {course.instructorName}
//                 </p>
//                 <p>
//                   <strong>Category:</strong> {course.category}
//                 </p>
//               </div>
//               <button
//                 className="enroll-button"
//                 onClick={() => handleEnroll(course._id)}
//               >
//                 <FaGraduationCap /> Enroll Now
//               </button>
//               {course.googleMeetLink && (
//                 <div className="google-meet-section">
//                   <a
//                     href={course.googleMeetLink}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="google-meet-link"
//                   >
//                     Join Google Meet
//                   </a>
//                 </div>
//               )}
//               {course.lectures && course.lectures.length > 0 && (
//                 <div className="preview-section">
//                   <h3>Course Preview</h3>
//                   <div className="lecture-preview">
//                     <h4>{course.lectures[0].title}</h4>
//                     <div className="video-container">
//                       <iframe
//                         width="100%"
//                         height="215"
//                         src={course.lectures[0].videoUrl}
//                         frameBorder="0"
//                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                         allowFullScreen
//                         title={course.lectures[0].title}
//                       ></iframe>
//                     </div>
//                   </div>
//                 </div>
//               )}


//             </div>
//           ))
//         ) : (
//           <div className="no-courses">
//             No courses available at the moment. Please check back later.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StudentCourses;












import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaBook } from 'react-icons/fa';
import '../styles/Courses.css';

const StudentCourses = () => {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAvailableCourses();
  }, []);

  const fetchAvailableCourses = async () => {
    try {
      const res = await axios.get('/api/courses/available', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setAvailableCourses(res.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await axios.post(
        `/api/courses/${courseId}/enroll`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      alert('Successfully enrolled in course!');
      navigate('/enrolled-courses');
    } catch (err) {
      alert(err.response?.data?.message || 'Error enrolling in course');
    }
  };

  if (loading) {
    return <div className="loading">Loading courses...</div>;
  }

  return (
    <div className="courses-container">
      <h1>Available Courses</h1>
      <div className="courses-grid">
        {availableCourses.length > 0 ? (
          availableCourses.map((course) => (
            <div key={course._id} className="course-card">
              <div className="course-header">
                <h2>{course.title}</h2>
                <FaBook className="course-icon" />
              </div>
              <p className="course-description">{course.description}</p>
              <div className="course-details">
                <p>
                  <strong>Instructor:</strong> {course.instructorName}
                </p>
                <p>
                  <strong>Category:</strong> {course.category}
                </p>
              </div>
              <button
                className="enroll-button"
                onClick={() => handleEnroll(course._id)}
              >
                <FaGraduationCap /> Enroll Now
              </button>
              {course.lectures && course.lectures.length > 0 && (
                <div className="preview-section">
                  <h3>Course Preview</h3>
                  <div className="lecture-preview">
                    <h4>{course.lectures[0].title}</h4>
                    <div className="video-container">
                      <iframe
                        width="100%"
                        height="215"
                        src={course.lectures[0].videoUrl}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={course.lectures[0].title}
                      ></iframe>
                    </div>
                  </div>
                </div>
              )}
              {course.googleMeetLink && (
                <div className="google-meet-section">
                  <a
                    href={course.googleMeetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="google-meet-link"
                  >
                    Join Google Meet
                  </a>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-courses">
            No courses available at the moment. Please check back later.
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCourses;












