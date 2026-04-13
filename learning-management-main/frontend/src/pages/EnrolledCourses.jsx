





// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { FaSpinner, FaPlay, FaChevronDown, FaChevronUp } from 'react-icons/fa';
// import EnhancedVideoPlayer from '../components/EnhancedVideoPlayer';

// const EnrolledCourses = () => {
//   const [enrolledCourses, setEnrolledCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedCourseId, setExpandedCourseId] = useState(null);
//   const [activeVideoId, setActiveVideoId] = useState(null);

//   useEffect(() => {
//     fetchEnrolledCourses();
//   }, []);

//   const fetchEnrolledCourses = async () => {
//     try {
//       const response = await axios.get('/api/courses/enrolled', {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       setEnrolledCourses(response.data);
//     } catch (error) {
//       console.error('Error fetching enrolled courses:', error);
//       toast.error('Failed to load enrolled courses');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleCourse = (courseId) => {
//     setExpandedCourseId(expandedCourseId === courseId ? null : courseId);
//   };

//   const toggleVideo = (lectureId) => {
//     setActiveVideoId(activeVideoId === lectureId ? null : lectureId);
//   };

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <FaSpinner className="spinner" />
//         <p>Loading your courses...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="enrolled-courses-container">
//       <div className="enrolled-header">
//         <h1>My Learning</h1>
//       </div>

//       <div className="enrolled-courses-list">
//         {enrolledCourses.length > 0 ? (
//           enrolledCourses.map(course => (
//             <div 
//               key={course._id} 
//               className={`enrolled-course-card ${expandedCourseId === course._id ? 'active' : ''}`}
//             >
//               <div 
//                 className="course-header" 
//                 onClick={() => toggleCourse(course._id)}
//               >
//                 <div className="course-main-info">
//                   <h2>{course.title}</h2>
//                   <p className="instructor">by {course.instructorName}</p>
//                 </div>
//                 {expandedCourseId === course._id ? (
//                   <FaChevronUp className="course-collapse" />
//                 ) : (
//                   <FaChevronDown className="course-collapse" />
//                 )}
//               </div>

//               {expandedCourseId === course._id && (
//                 <div className="course-content">
//                   {course.lectures?.length > 0 ? (
//                     course.lectures.map((lecture, index) => (
//                       <div key={lecture._id} className="lecture-item">
//                         <div 
//                           className="lecture-header"
//                           onClick={() => toggleVideo(lecture._id)}
//                         >
//                           <div className="lecture-info">
//                             <span className="lecture-number">{index + 1}</span>
//                             <h4>{lecture.title}</h4>
//                           </div>
//                           <FaPlay className="play-icon" />
//                         </div>
                        
//                         {activeVideoId === lecture._id && lecture.videoUrl && (
//                           <div className="video-container">
//                             <EnhancedVideoPlayer
//                               videoUrl={lecture.videoUrl}
//                               title={lecture.title}
//                             />
//                           </div>
//                         )}
//                       </div>
//                     ))
//                   ) : (
//                     <p className="no-lectures">No lectures available in this course</p>
//                   )}
//                 </div>
//               )}
//             </div>
//           ))
//         ) : (
//           <div className="no-courses">
//             <h2>No Enrolled Courses</h2>
//             <p>You haven't enrolled in any courses yet.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EnrolledCourses;






import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSpinner, FaPlay, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import EnhancedVideoPlayer from '../components/EnhancedVideoPlayer';

const EnrolledCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [activeVideoId, setActiveVideoId] = useState(null);

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      const response = await axios.get('/api/courses/enrolled', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setEnrolledCourses(response.data);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      toast.error('Failed to load enrolled courses');
    } finally {
      setLoading(false);
    }
  };

  const toggleCourse = (courseId) => {
    setExpandedCourseId(expandedCourseId === courseId ? null : courseId);
  };

  const toggleVideo = (lectureId) => {
    setActiveVideoId(activeVideoId === lectureId ? null : lectureId);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner" />
        <p>Loading your courses...</p>
      </div>
    );
  }

  return (
    <div className="enrolled-courses-container">
      <div className="enrolled-header">
        <h1>My Learning</h1>
      </div>

      <div className="enrolled-courses-list">
        {enrolledCourses.length > 0 ? (
          enrolledCourses.map((course) => (
            <div
              key={course._id}
              className={`enrolled-course-card ${
                expandedCourseId === course._id ? 'active' : ''
              }`}
            >
              <div
                className="course-header"
                onClick={() => toggleCourse(course._id)}
              >
                <div className="course-main-info">
                  <h2>{course.title}</h2>
                  <p className="instructor">by {course.instructorName}</p>
                </div>
                {expandedCourseId === course._id ? (
                  <FaChevronUp className="course-collapse" />
                ) : (
                  <FaChevronDown className="course-collapse" />
                )}
              </div>

              {expandedCourseId === course._id && (
                <div className="course-content">
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

                  {course.lectures?.length > 0 ? (
                    course.lectures.map((lecture, index) => (
                      <div key={lecture._id} className="lecture-item">
                        <div
                          className="lecture-header"
                          onClick={() => toggleVideo(lecture._id)}
                        >
                          <div className="lecture-info">
                            <span className="lecture-number">{index + 1}</span>
                            <h4>{lecture.title}</h4>
                          </div>
                          <FaPlay className="play-icon" />
                        </div>

                        {activeVideoId === lecture._id && lecture.videoUrl && (
                          <div className="video-container">
                            <EnhancedVideoPlayer
                              videoUrl={lecture.videoUrl}
                              title={lecture.title}
                            />
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="no-lectures">
                      No lectures available in this course
                    </p>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-courses">
            <h2>No Enrolled Courses</h2>
            <p>You haven't enrolled in any courses yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrolledCourses;