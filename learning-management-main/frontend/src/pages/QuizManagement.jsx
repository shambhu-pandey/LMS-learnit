import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaChartBar } from "react-icons/fa";
import axios from "../api/axios";
import { toast } from "react-toastify";
import QuizCreator from "../components/QuizCreator";
import "../styles/QuizManagement.css";

const QuizManagement = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [showQuizCreator, setShowQuizCreator] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  // const fetchCourses = async () => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     if (!token) {
  //       navigate('/signin');
  //       return;
  //     }

  //     const response = await axios.get('/api/courses/instructor', {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });

  //     setCourses(response.data);
  //     setError(null);
  //   } catch (error) {
  //     console.error('Error fetching courses:', error);
  //     setError('Failed to fetch courses. Please try again.');
  //     toast.error('Error fetching courses');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }

      const response = await axios.get("/api/courses/instructor", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setCourses(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setError("Failed to fetch courses. Please try again.");
      toast.error("Error fetching courses");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;

    try {
      await axios.delete(`/api/quizzes/${quizId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Quiz deleted successfully");
      fetchCourses(); // Refresh the list
    } catch (error) {
      toast.error("Error deleting quiz");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner" />
        <p>Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={fetchCourses} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-management">
      <div className="quiz-management-header">
        <h1 className="heading-main">Quiz Management</h1>
        <p>Create and manage quizzes for your courses</p>
      </div>

      {courses.length === 0 ? (
        <div className="no-courses">
          <p>No courses found. Create a course first to add quizzes.</p>
        </div>
      ) : (
        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course._id} className="course-quiz-card">
              <div className="course-info">
                <h2>{course.title}</h2>
                <p>{course.description}</p>
              </div>

              <div className="quiz-section">
                <h3>Quizzes ({course.quizzes?.length || 0})</h3>
                <button
                  className="create-quiz-btn"
                  onClick={() => {
                    setSelectedCourse(course);
                    setShowQuizCreator(true);
                  }}
                >
                  <FaPlus /> Create New Quiz
                </button>

                <div className="quizzes-list">
                  {course.quizzes?.map((quiz) => (
                    <div key={quiz._id} className="quiz-item">
                      <div className="quiz-info">
                        <h4>{quiz.title}</h4>
                        <p>{quiz.description}</p>
                      </div>
                      <div className="quiz-actions">
                        <FaChartBar
                          className="icon marks"
                          onClick={() => navigate(`/quizzes/${quiz._id}/marks`)}
                          title="View Student Marks"
                        />
                        <FaEdit
                          className="icon edit"
                          onClick={() => navigate(`/courses/${course._id}/quiz/${quiz._id}/edit`)}
                        />
                        <FaTrash
                          className="icon delete"
                          onClick={() => handleDeleteQuiz(quiz._id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showQuizCreator && selectedCourse && (
        <div
          className="modal-overlay"
          onClick={() => setShowQuizCreator(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <QuizCreator
              courseId={selectedCourse._id}
              onClose={() => {
                setShowQuizCreator(false);
                setSelectedCourse(null);
              }}
              onQuizCreated={() => {
                setShowQuizCreator(false);
                setSelectedCourse(null);
                fetchCourses();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizManagement;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaPlus, FaEdit, FaTrash, FaSpinner } from 'react-icons/fa';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import QuizCreator from '../components/QuizCreator';
// import '../styles/QuizManagement.css';

// axios.defaults.baseURL = 'http://localhost:5000';

// const QuizManagement = () => {
//   const navigate = useNavigate();
//   const [courses, setCourses] = useState([]);
//   const [showQuizCreator, setShowQuizCreator] = useState(false);
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   // const fetchCourses = async () => {
//   //   try {
//   //     const token = localStorage.getItem('token');
//   //     if (!token) {
//   //       navigate('/signin');
//   //       return;
//   //     }

//   //     const response = await axios.get('/api/courses/instructor', {
//   //       headers: { Authorization: `Bearer ${token}` }
//   //     });

//   //     setCourses(response.data);
//   //     setError(null);
//   //   } catch (error) {
//   //     console.error('Error fetching courses:', error);
//   //     setError('Failed to fetch courses. Please try again.');
//   //     toast.error('Error fetching courses');
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const fetchCourses = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         navigate('/signin');
//         return;
//       }

//       const response = await axios.get('/api/courses/instructor', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       setCourses(response.data);
//       setError(null);
//     } catch (error) {
//       console.error('Error fetching courses:', error);
//       setError('Failed to fetch courses. Please try again.');
//       toast.error('Error fetching courses');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteQuiz = async (quizId) => {
//     if (!window.confirm('Are you sure you want to delete this quiz?')) return;

//     try {
//       await axios.delete(`/api/quizzes/${quizId}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       toast.success('Quiz deleted successfully');
//       fetchCourses(); // Refresh the list
//     } catch (error) {
//       toast.error('Error deleting quiz');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <FaSpinner className="spinner" />
//         <p>Loading courses...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="error-container">
//         <p className="error-message">{error}</p>
//         <button onClick={fetchCourses} className="retry-button">
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="quiz-management">
//       <div className="quiz-management-header">
//         <h1>Quiz Management</h1>
//         <p>Create and manage quizzes for your courses</p>
//       </div>

//       {courses.length === 0 ? (
//         <div className="no-courses">
//           <p>No courses found. Create a course first to add quizzes.</p>
//         </div>
//       ) : (
//         <div className="courses-grid">
//           {courses.map(course => (
//             <div key={course._id} className="course-quiz-card">
//               <div className="course-info">
//                 <h2>{course.title}</h2>
//                 <p>{course.description}</p>
//               </div>

//               <div className="quiz-section">
//                 <h3>Quizzes ({course.quizzes?.length || 0})</h3>
//                 <button
//                   className="create-quiz-btn"
//                   onClick={() => {
//                     setSelectedCourse(course);
//                     setShowQuizCreator(true);
//                   }}
//                 >
//                   <FaPlus /> Create New Quiz
//                 </button>

//                 <div className="quizzes-list">
//                   {course.quizzes?.map(quiz => (
//                     <div key={quiz._id} className="quiz-item">
//                       <div className="quiz-info">
//                         <h4>{quiz.title}</h4>
//                         <p>{quiz.description}</p>
//                       </div>
//                       <div className="quiz-actions">
//                         <FaEdit
//                           className="icon edit"
//                           onClick={() => navigate(`/quiz/${quiz._id}/edit`)}
//                         />
//                         <FaTrash
//                           className="icon delete"
//                           onClick={() => handleDeleteQuiz(quiz._id)}
//                         />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {showQuizCreator && selectedCourse && (
//         <div className="modal-overlay" onClick={() => setShowQuizCreator(false)}>
//           <div className="modal-content" onClick={e => e.stopPropagation()}>
//             <QuizCreator
//               courseId={selectedCourse._id}
//               onClose={() => {
//                 setShowQuizCreator(false);
//                 setSelectedCourse(null);
//               }}
//               onQuizCreated={() => {
//                 setShowQuizCreator(false);
//                 setSelectedCourse(null);
//                 fetchCourses();
//               }}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default QuizManagement;
