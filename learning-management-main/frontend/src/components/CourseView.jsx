// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import EnhancedVideoPlayer from '../components/EnhancedVideoPlayer';
// import '../styles/CourseView.css';

// const CourseView = () => {
//   const { courseId } = useParams();
//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeVideo, setActiveVideo] = useState(null);
//   // const [quizzes, setQuizzes] = useState([]);

//   useEffect(() => {
//     const fetchCourse = async () => {
//       try {
//         const response = await axios.get(`/api/courses/${courseId}`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         });
//         setCourse(response.data);
//         if (response.data.lectures?.length > 0) {
//           setActiveVideo(response.data.lectures[0]);
//         }
//       } catch (error) {
//         console.error('Error fetching course:', error);
//         toast.error('Failed to load course content');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourse();
//   }, [courseId]);


//   if (loading) {
//     return <div className="loading">Loading course content...</div>;
//   }

//   if (!course) {
//     return <div className="error">Course not found</div>;
//   }

//   return (
//     <div className="course-view">
//       <div className="course-header">
//         <h1>{course.title}</h1>
//         <p className="instructor">by {course.instructorName}</p>
//       </div>

//       <div className="course-content">
//         <div className="video-section">
//           {activeVideo && (
//             <EnhancedVideoPlayer
//               videoUrl={activeVideo.videoUrl}
//               title={activeVideo.title}
//             />
//           )}
//         </div>

//         <div className="lectures-list">
//           <h2>Course Lectures</h2>
//           {course.lectures?.map((lecture, index) => (
//             <div
//               key={lecture._id}
//               className={`lecture-item ${activeVideo?._id === lecture._id ? 'active' : ''}`}
//               onClick={() => setActiveVideo(lecture)}
//             >
//               <span className="lecture-number">{index + 1}</span>
//               <span className="lecture-title">{lecture.title}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CourseView;











// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { FaPlay, FaQuestionCircle, FaSpinner } from 'react-icons/fa';
// import EnhancedVideoPlayer from '../components/EnhancedVideoPlayer';
// import '../styles/CourseView.css';

// const CourseView = () => {
//   const { courseId } = useParams();
//   const navigate = useNavigate();
//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeVideo, setActiveVideo] = useState(null);
//   const [quizzes, setQuizzes] = useState([]);
//   const [activeTab, setActiveTab] = useState('lectures');
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [courseResponse, quizzesResponse, userResponse] = await Promise.all([
//           axios.get(`/api/courses/${courseId}`, {
//             headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//           }),
//           axios.get(`/api/courses/${courseId}/quizzes`, {
//             headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//           }),
//           axios.get('/api/auth/me', {
//             headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//           })
//         ]);

//         setCourse(courseResponse.data);
//         setQuizzes(quizzesResponse.data);
//         setUser(userResponse.data);

//         if (courseResponse.data.lectures?.length > 0) {
//           setActiveVideo(courseResponse.data.lectures[0]);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         toast.error('Failed to load course content');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [courseId]);

//   const handleCreateQuiz = () => {
//     navigate(`/courses/${courseId}/quiz/create`);
//   };

//   const handleTakeQuiz = (quizId) => {
//     navigate(`/courses/${courseId}/quiz/${quizId}`);
//   };

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <FaSpinner className="spinner" />
//         <p>Loading course content...</p>
//       </div>
//     );
//   }

//   if (!course) {
//     return <div className="error-container">Course not found</div>;
//   }

//   return (
//     <div className="course-view">
//       <div className="course-header">
//         <h1>{course.title}</h1>
//         <p className="instructor">by {course.instructorName}</p>
//       </div>

//       <div className="course-tabs">
//         <button 
//           className={`tab ${activeTab === 'lectures' ? 'active' : ''}`}
//           onClick={() => setActiveTab('lectures')}
//         >
//           Lectures
//         </button>
//         <button 
//           className={`tab ${activeTab === 'assignments' ? 'active' : ''}`}
//           onClick={() => setActiveTab('assignments')}
//         >
//           Assignments
//         </button>
//       </div>

//       <div className="course-content">
//         {activeTab === 'lectures' ? (
//           <>
//             <div className="video-section">
//               {activeVideo && (
//                 <EnhancedVideoPlayer
//                   videoUrl={activeVideo.videoUrl}
//                   title={activeVideo.title}
//                 />
//               )}
//             </div>

//             <div className="lectures-list">
//               <h2>Course Lectures</h2>
//               {course.lectures?.map((lecture, index) => (
//                 <div
//                   key={lecture._id}
//                   className={`lecture-item ${activeVideo?._id === lecture._id ? 'active' : ''}`}
//                   onClick={() => setActiveVideo(lecture)}
//                 >
//                   <FaPlay className="play-icon" />
//                   <span className="lecture-number">{index + 1}</span>
//                   <span className="lecture-title">{lecture.title}</span>
//                 </div>
//               ))}
//             </div>
//           </>
//         ) : (
//           <div className="assignments-section">
//             <div className="assignments-header">
//               <h2>Course Assignments</h2>
//               {user?.role === 'instructor' && (
//   <button 
//     onClick={() => navigate(`/courses/${courseId}/quiz/create`)}  // Update this path
//     className="create-quiz-btn"
//   >
//     Create Quiz
//   </button>
// )}
//             </div>

//             {quizzes.length > 0 ? (
//               <div className="quizzes-grid">
//                 {quizzes.map(quiz => (
//                   <div key={quiz._id} className="quiz-card">
//                     <div className="quiz-info">
//                       <FaQuestionCircle className="quiz-icon" />
//                       <h3>{quiz.title}</h3>
//                       <p>Time Limit: {quiz.timeLimit} minutes</p>
//                       <p>Questions: {quiz.questions?.length || 0}</p>
//                       <p>Passing Score: {quiz.passingScore}%</p>
//                     </div>
//                     <button 
//                       className="take-quiz-btn"
//                       onClick={() => handleTakeQuiz(quiz._id)}
//                     >
//                       Take Quiz
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="no-quizzes">
//                 <p>No assignments available for this course yet.</p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CourseView;














// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { FaPlay, FaQuestionCircle } from 'react-icons/fa';
// import EnhancedVideoPlayer from './EnhancedVideoPlayer';

// import '../styles/CourseView.css';

// const CourseView = () => {
//   const { courseId } = useParams();
//   const navigate = useNavigate();
//   const [course, setCourse] = useState(null);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('lectures');
//   const [activeVideo, setActiveVideo] = useState(null);
//   const [quizzes, setQuizzes] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           navigate('/login');
//           return;
//         }

//         // Fetch course details
//         const courseResponse = await axios.get(`/api/courses/${courseId}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });

//         // Fetch quizzes for the course
//         const quizzesResponse = await axios.get(`/api/courses/${courseId}/quizzes`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });

//         // Fetch user details
//         const userResponse = await axios.get('/api/auth/me', {
//           headers: { Authorization: `Bearer ${token}` }
//         });

//         setCourse(courseResponse.data);
//         setQuizzes(quizzesResponse.data);
//         setUser(userResponse.data);
        
//         if (courseResponse.data.lectures?.length > 0) {
//           setActiveVideo(courseResponse.data.lectures[0]);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         toast.error(error.response?.data?.message || 'Failed to load course');
//         navigate('/courses');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [courseId, navigate]);

//   const handleTakeQuiz = async (quizId) => {
//     try {
//       navigate(`/course/${courseId}/quiz/${quizId}`);
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error('Failed to start quiz');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="spinner"></div>
//         <p>Loading course content...</p>
//       </div>
//     );
//   }

//   if (!course) {
//     return (
//       <div className="error-container">
//         <p>Course not found or access denied</p>
//       </div>
//     );
//   }

//   return (
//     <div className="course-view">
//       <div className="course-header">
//         <h1>{course.title}</h1>
//         <p className="instructor">by {course.instructorName}</p>
//       </div>

//       <div className="course-tabs">
//         <button 
//           className={`tab ${activeTab === 'lectures' ? 'active' : ''}`}
//           onClick={() => setActiveTab('lectures')}
//         >
//           Lectures
//         </button>
//         <button 
//           className={`tab ${activeTab === 'assignments' ? 'active' : ''}`}
//           onClick={() => setActiveTab('assignments')}
//         >
//           Assignments
//         </button>
//       </div>

//       <div className="course-content">
//         {activeTab === 'lectures' ? (
//           <>
//             <div className="video-section">
//               {activeVideo && (
//                 <EnhancedVideoPlayer
//                   videoUrl={activeVideo.videoUrl}
//                   title={activeVideo.title}
//                 />
//               )}
//             </div>

//             <div className="lectures-list">
//               <h2>Course Lectures</h2>
//               {course.lectures?.map((lecture, index) => (
//                 <div
//                   key={lecture._id}
//                   className={`lecture-item ${activeVideo?._id === lecture._id ? 'active' : ''}`}
//                   onClick={() => setActiveVideo(lecture)}
//                 >
//                   <FaPlay className="play-icon" />
//                   <span className="lecture-number">{index + 1}</span>
//                   <span className="lecture-title">{lecture.title}</span>
//                 </div>
//               ))}
//             </div>
//           </>
//         ) : (
//           <div className="assignments-section">
//             <div className="assignments-header">
//               <h2>Course Assignments</h2>
//               {user?.role === 'instructor' && (
//                 <button 
//                   onClick={() => navigate(`/course/${courseId}/quiz/create`)}
//                   className="create-quiz-btn"
//                 >
//                   Create Quiz
//                 </button>
//               )}
//             </div>

//             {quizzes.length > 0 ? (
//               <div className="quizzes-grid">
//                 {quizzes.map(quiz => (
//                   <div key={quiz._id} className="quiz-card">
//                     <div className="quiz-info">
//                       <FaQuestionCircle className="quiz-icon" />
//                       <h3>{quiz.title}</h3>
//                       <p>Time Limit: {quiz.timeLimit} minutes</p>
//                       <p>Questions: {quiz.questions?.length || 0}</p>
//                       <p>Passing Score: {quiz.passingScore}%</p>
//                     </div>
//                     <button 
//                       className="take-quiz-btn"
//                       onClick={() => handleTakeQuiz(quiz._id)}
//                     >
//                       Take Quiz
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="no-quizzes">
//                 <p>No assignments available for this course yet.</p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CourseView;












// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from '../api/axios';
// import { toast } from 'react-toastify';
// import { FaPlay, FaQuestionCircle } from 'react-icons/fa';
// import EnhancedVideoPlayer from './EnhancedVideoPlayer';
// import CourseMaterials from './CourseMaterials';

// import '../styles/CourseView.css';

// const CourseView = () => {
//     const { courseId } = useParams();
//     const navigate = useNavigate();
//     const [course, setCourse] = useState(null);
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [activeTab, setActiveTab] = useState('lectures');
//     const [activeVideo, setActiveVideo] = useState(null);
//     const [quizzes, setQuizzes] = useState([]);
//     const [isInstructor, setIsInstructor] = useState(false);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 if (!token) {
//                     navigate('/login');
//                     return;
//                 }

//                 // Fetch course details
//                 const courseResponse = await axios.get(`/api/courses/${courseId}`);
//                 const quizzesResponse = await axios.get(`/api/courses/${courseId}/quizzes`);
//                 const userResponse = await axios.get('/api/auth/me');

//                 setCourse(courseResponse.data.data);
//                 setQuizzes(quizzesResponse.data.data);
//                 setUser(userResponse.data.data);
//                 setIsInstructor(courseResponse.data.data.instructor._id === userResponse.data.data._id);

//                 if (courseResponse.data.data.lectures?.length > 0) {
//                     setActiveVideo(courseResponse.data.data.lectures[0]);
//                 }
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//                 toast.error(error.response?.data?.message || 'Failed to load course');
//                 navigate('/courses');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [courseId, navigate]);

//     const handleEnroll = async () => {
//         try {
//             const response = await axios.post(`/api/courses/${courseId}/enroll`);
//             if (response.data.success) {
//                 toast.success('Successfully enrolled in course');
//                 // Refresh course data
//                 const courseResponse = await axios.get(`/api/courses/${courseId}`);
//                 setCourse(courseResponse.data.data);
//             }
//         } catch (error) {
//             console.error('Enrollment error:', error);
//             toast.error(error.response?.data?.message || 'Failed to enroll');
//         }
//     };

//     const handleTakeQuiz = async (quizId) => {
//         try {
//             navigate(`/course/${courseId}/quiz/${quizId}`);
//         } catch (error) {
//             console.error('Error:', error);
//             toast.error('Failed to start quiz');
//         }
//     };

//     if (loading) {
//         return (
//             <div className="loading-container">
//                 <div className="spinner"></div>
//                 <p>Loading course content...</p>
//             </div>
//         );
//     }

//     if (!course) {
//         return (
//             <div className="error-container">
//                 <p>Course not found or access denied</p>
//             </div>
//         );
//     }

//     return (
//         <div className="course-view">
//             <div className="course-header">
//                 <div className="header-content">
//                     <h1>{course.title}</h1>
//                     <p className="instructor">by {course.instructor.name}</p>
//                     {!isInstructor && !course.studentsEnrolled?.includes(user?._id) && (
//                         <button 
//                             onClick={handleEnroll}
//                             className="enroll-button"
//                         >
//                             Enroll Now
//                         </button>
//                     )}
//                 </div>
//             </div>

//             <div className="course-tabs">
//                 <button 
//                     className={`tab ${activeTab === 'lectures' ? 'active' : ''}`}
//                     onClick={() => setActiveTab('lectures')}
//                 >
//                     Lectures
//                 </button>
//                 <button 
//                     className={`tab ${activeTab === 'assignments' ? 'active' : ''}`}
//                     onClick={() => setActiveTab('assignments')}
//                 >
//                     Assignments
//                 </button>
//                 <button 
//                     className={`tab ${activeTab === 'materials' ? 'active' : ''}`}
//                     onClick={() => setActiveTab('materials')}
//                 >
//                     Materials
//                 </button>
//             </div>

//             <div className="course-content">
//                 {activeTab === 'lectures' && (
//                     <>
//                         <div className="video-section">
//                             {activeVideo && (
//                                 <EnhancedVideoPlayer
//                                     videoUrl={activeVideo.videoUrl}
//                                     title={activeVideo.title}
//                                 />
//                             )}
//                         </div>

//                         <div className="lectures-list">
//                             <h2>Course Lectures</h2>
//                             {course.lectures?.map((lecture, index) => (
//                                 <div
//                                     key={lecture._id}
//                                     className={`lecture-item ${activeVideo?._id === lecture._id ? 'active' : ''}`}
//                                     onClick={() => setActiveVideo(lecture)}
//                                 >
//                                     <FaPlay className="play-icon" />
//                                     <span className="lecture-number">{index + 1}</span>
//                                     <span className="lecture-title">{lecture.title}</span>
//                                 </div>
//                             ))}
//                         </div>
//                     </>
//                 )}

//                 {activeTab === 'assignments' && (
//                     <div className="assignments-section">
//                         <div className="assignments-header">
//                             <h2>Course Assignments</h2>
//                             {isInstructor && (
//                                 <button 
//                                     onClick={() => navigate(`/course/${courseId}/quiz/create`)}
//                                     className="create-quiz-btn"
//                                 >
//                                     Create Quiz
//                                 </button>
//                             )}
//                         </div>

//                         {quizzes.length > 0 ? (
//                             <div className="quizzes-grid">
//                                 {quizzes.map(quiz => (
//                                     <div key={quiz._id} className="quiz-card">
//                                         <div className="quiz-info">
//                                             <FaQuestionCircle className="quiz-icon" />
//                                             <h3>{quiz.title}</h3>
//                                             <p>Time Limit: {quiz.timeLimit} minutes</p>
//                                             <p>Questions: {quiz.questions?.length || 0}</p>
//                                             <p>Passing Score: {quiz.passingScore}%</p>
//                                         </div>
//                                         <button 
//                                             className="take-quiz-btn"
//                                             onClick={() => handleTakeQuiz(quiz._id)}
//                                         >
//                                             Take Quiz
//                                         </button>
//                                     </div>
//                                 ))}
//                             </div>
//                         ) : (
//                             <div className="no-quizzes">
//                                 <p>No assignments available for this course yet.</p>
//                             </div>
//                         )}
//                     </div>
//                 )}

//                 {activeTab === 'materials' && (
//                     <div className="materials-section">
//                         <CourseMaterials 
//                             courseId={courseId} 
//                             isInstructor={isInstructor}
//                         />
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default CourseView;
















// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { FaPlay, FaQuestionCircle } from 'react-icons/fa';
// import EnhancedVideoPlayer from './EnhancedVideoPlayer';
// import '../styles/CourseView.css';
// import MaterialSidebar from './MaterialSidebar';

// const CourseView = () => {
//   const { courseId } = useParams();
//   const navigate = useNavigate();
//   const [course, setCourse] = useState(null);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('lectures');
//   const [activeVideo, setActiveVideo] = useState(null);
//   const [quizzes, setQuizzes] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           navigate('/login');
//           return;
//         }

//         // Fetch course details
//         const courseResponse = await axios.get(`/api/courses/${courseId}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });

//         // Fetch quizzes for the course
//         const quizzesResponse = await axios.get(`/api/courses/${courseId}/quizzes`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });

//         // Fetch user details
//         const userResponse = await axios.get('/api/auth/me', {
//           headers: { Authorization: `Bearer ${token}` }
//         });

//         setCourse(courseResponse.data);
//         setQuizzes(quizzesResponse.data);
//         setUser(userResponse.data);
        
//         if (courseResponse.data.lectures?.length > 0) {
//           setActiveVideo(courseResponse.data.lectures[0]);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         toast.error(error.response?.data?.message || 'Failed to load course');
//         navigate('/courses');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [courseId, navigate]);

//   const handleTakeQuiz = async (quizId) => {
//     try {
//       navigate(`/course/${courseId}/quiz/${quizId}`);
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error('Failed to start quiz');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="spinner"></div>
//         <p>Loading course content...</p>
//       </div>
//     );
//   }

//   if (!course) {
//     return (
//       <div className="error-container">
//         <p>Course not found or access denied</p>
//       </div>
//     );
//   }

//   return (
//     <div className="course-view">
//       <div className="course-header">
//         <h1>{course.title}</h1>
//         <p className="instructor">by {course.instructorName}</p>
//       </div>

//       <div className="course-tabs">
//         <button 
//           className={`tab ${activeTab === 'lectures' ? 'active' : ''}`}
//           onClick={() => setActiveTab('lectures')}
//         >
//           Lectures
//         </button>
//         <button 
//           className={`tab ${activeTab === 'assignments' ? 'active' : ''}`}
//           onClick={() => setActiveTab('assignments')}
//         >
//           Assignments
//         </button>
//       </div>

//       <div className="course-content">
//         {activeTab === 'lectures' ? (
//           <>
//             <div className="video-section">
//               {activeVideo && (
//                 <EnhancedVideoPlayer
//                   videoUrl={activeVideo.videoUrl}
//                   title={activeVideo.title}
//                 />
//               )}
//             </div>

//             <div className="lectures-list">
//               <h2>Course Lectures</h2>
//               {course.lectures?.map((lecture, index) => (
//                 <div
//                   key={lecture._id}
//                   className={`lecture-item ${activeVideo?._id === lecture._id ? 'active' : ''}`}
//                   onClick={() => setActiveVideo(lecture)}
//                 >
//                   <FaPlay className="play-icon" />
//                   <span className="lecture-number">{index + 1}</span>
//                   <span className="lecture-title">{lecture.title}</span>
//                 </div>
//               ))}
//             </div>
//           </>
//         ) : (
//           <div className="assignments-section">
//             <div className="assignments-header">
//               <h2>Course Assignments</h2>
//               {user?.role === 'instructor' && (
//                 <button 
//                   onClick={() => navigate(`/course/${courseId}/quiz/create`)}
//                   className="create-quiz-btn"
//                 >
//                   Create Quiz
//                 </button>
//               )}
//             </div>

//             {quizzes.length > 0 ? (
//               <div className="quizzes-grid">
//                 {quizzes.map(quiz => (
//                   <div key={quiz._id} className="quiz-card">
//                     <div className="quiz-info">
//                       <FaQuestionCircle className="quiz-icon" />
//                       <h3>{quiz.title}</h3>
//                       <p>Time Limit: {quiz.timeLimit} minutes</p>
//                       <p>Questions: {quiz.questions?.length || 0}</p>
//                       <p>Passing Score: {quiz.passingScore}%</p>
//                     </div>
//                     <button 
//                       className="take-quiz-btn"
//                       onClick={() => handleTakeQuiz(quiz._id)}
//                     >
//                       Take Quiz
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="no-quizzes">
//                 <p>No assignments available for this course yet.</p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CourseView;








import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaPlay, FaQuestionCircle } from "react-icons/fa";
import EnhancedVideoPlayer from "./EnhancedVideoPlayer";
import "../styles/CourseView.css";

const CourseView = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("lectures");
  const [activeVideo, setActiveVideo] = useState(null);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const [courseResponse, quizzesResponse, userResponse] = await Promise.all([
          axios.get(`/api/courses/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`/api/courses/${courseId}/quizzes`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setCourse(courseResponse.data);
        setQuizzes(quizzesResponse.data);
        setUser(userResponse.data);

        if (courseResponse.data.lectures?.length > 0) {
          setActiveVideo(courseResponse.data.lectures[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(error.response?.data?.message || "Failed to load course");
        navigate("/courses");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, navigate]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading course content...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="error-container">
        <p>Course not found or access denied</p>
      </div>
    );
  }

  return (
    <div className="course-view">
      <div className="course-header">
        <h1>{course.title}</h1>
        <p className="instructor">by {course.instructorName}</p>
      </div>

      <div className="course-tabs">
        <button
          className={`tab ${activeTab === "lectures" ? "active" : ""}`}
          onClick={() => setActiveTab("lectures")}
        >
          Lectures
        </button>
        <button
          className={`tab ${activeTab === "assignments" ? "active" : ""}`}
          onClick={() => setActiveTab("assignments")}
        >
          Assignments
        </button>
      </div>

      <div className="course-content">
        {activeTab === "lectures" ? (
          <>
            <div className="video-section">
              {activeVideo && (
                <EnhancedVideoPlayer
                  videoUrl={activeVideo.videoUrl}
                  title={activeVideo.title}
                />
              )}
            </div>

            <div className="lectures-list">
              <h2>Course Lectures</h2>
              {course.lectures?.map((lecture, index) => (
                <div
                  key={lecture._id}
                  className={`lecture-item ${
                    activeVideo?._id === lecture._id ? "active" : ""
                  }`}
                  onClick={() => setActiveVideo(lecture)}
                >
                  <FaPlay className="play-icon" />
                  <span className="lecture-number">{index + 1}</span>
                  <span className="lecture-title">{lecture.title}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="assignments-section">
            <div className="assignments-header">
              <h2>Course Assignments</h2>
              {user?.role === "instructor" && (
                <button
                  onClick={() => navigate(`/course/${courseId}/quiz/create`)}
                  className="create-quiz-btn"
                >
                  Create Quiz
                </button>
              )}
            </div>

            {quizzes.length > 0 ? (
              <div className="quizzes-grid">
                {quizzes.map((quiz) => (
                  <div key={quiz._id} className="quiz-card">
                    <div className="quiz-info">
                      <FaQuestionCircle className="quiz-icon" />
                      <h3>{quiz.title}</h3>
                      <p>Time Limit: {quiz.timeLimit} minutes</p>
                      <p>Questions: {quiz.questions?.length || 0}</p>
                      <p>Passing Score: {quiz.passingScore}%</p>
                    </div>
                    <button
                      className="take-quiz-btn"
                      onClick={() => navigate(`/course/${courseId}/quiz/${quiz._id}`)}
                    >
                      Take Quiz
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-quizzes">
                <p>No assignments available for this course yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseView;