// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import {
//   FaEdit,
//   FaTrash,
//   FaPlus,
//   FaEye,
//   FaLock,
//   FaUnlock,
//   FaGraduationCap,
//   FaSpinner,
//   FaQuestionCircle,
//   FaChevronDown,
//   FaChevronUp
// } from 'react-icons/fa';
// import { toast } from 'react-toastify';
// import QuizCreator from './QuizCreator';
// import '../styles/CourseCard.css';

// const CourseCard = ({
//   course,
//   user,
//   onToggleLock,
//   onEnroll,
//   onEdit,
//   onDelete,
//   onAddLecture,
//   onQuizCreated
// }) => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [showQuizCreator, setShowQuizCreator] = useState(false);
//   const [expandedContent, setExpandedContent] = useState(false);

//   const handleLockToggle = async () => {
//     try {
//       setLoading(true);
//       await onToggleLock(course._id);
//     } catch (error) {
//       toast.error('Error toggling course lock');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEnroll = async () => {
//     try {
//       setLoading(true);
//       await onEnroll(course._id);
//       toast.success('Successfully enrolled in course!');
//       setTimeout(() => {
//         navigate('/enrolled-courses');
//       }, 1500);
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Error enrolling in course');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleQuizCreated = (quiz) => {
//     setShowQuizCreator(false);
//     onQuizCreated?.(quiz);
//     toast.success('Quiz created successfully!');
//   };

//   const getYouTubeEmbedUrl = (url) => {
//     const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
//     const match = url.match(regExp);
//     return match && match[2].length === 11 
//       ? `https://www.youtube.com/embed/${match[2]}?rel=0&modestbranding=1`
//       : url;
//   };

//   const toggleContent = () => {
//     setExpandedContent(!expandedContent);
//   };

// // In CourseCard.jsx, add this before the return statement
// console.log('User role:', user?.role);
// console.log('Is instructor:', user?.role === 'instructor');
//   return (
//     <div className={`course-card ${course.isLocked ? "locked" : ""}`}>
//       <div className="course-header" onClick={toggleContent}>
//         <div className="course-header-main">
//           <h2>{course.title}</h2>
//           <div className="course-expand-icon">
//             {expandedContent ? <FaChevronUp /> : <FaChevronDown />}
//           </div>
//         </div>
//         {user && user.role === "instructor" ? (
//           <button
//             className={`lock-button ${loading ? 'loading' : ''}`}
//             onClick={(e) => {
//               e.stopPropagation();
//               handleLockToggle();
//             }}
//             disabled={loading}
//             title={course.isLocked ? "Unlock Course" : "Lock Course"}
//           >
//             {loading ? (
//               <FaSpinner className="spinner" />
//             ) : (
//               course.isLocked ? <FaLock /> : <FaUnlock />
//             )}
//           </button>
//         ) : (
//           course.isLocked && (
//             <div className="lock-status">
//               <FaLock className="lock-icon" />
//               <span>Locked</span>
//             </div>
//           )
//         )}
//       </div>

//       <div className={`course-details ${expandedContent ? 'expanded' : ''}`}>
//         <p className="course-description">{course.description}</p>
//         <p className="category">Category: {course.category}</p>
//         <p className="instructor">Instructor: {course.instructorName}</p>

//         <div className="course-actions">
//           {user && user.role === "instructor" ? (
//             <div className="instructor-actions">
//               <FaEdit
//                 className="icon edit"
//                 title="Edit Course"
//                 onClick={() => onEdit(course)}
//               />
//               <FaTrash
//                 className="icon delete"
//                 title="Delete Course"
//                 onClick={() => onDelete(course._id)}
//               />
//               <FaPlus
//                 className="icon add-lecture"
//                 title="Add Lecture"
//                 onClick={() => onAddLecture(course)}
//               />
//               <FaQuestionCircle
//                 className="icon quiz"
//                 title="Create Quiz"
//                 onClick={() => setShowQuizCreator(true)}
//               />
//             </div>
//           ) : (
//             <div className="student-actions">
//               {course.isLocked ? (
//                 <button
//                   className={`enroll-button ${loading ? 'loading' : ''}`}
//                   onClick={handleEnroll}
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <FaSpinner className="spinner" />
//                   ) : (
//                     <>
//                       <FaGraduationCap /> Enroll to Unlock
//                     </>
//                   )}
//                 </button>
//               ) : (
//                 <FaEye
//                   className="icon preview"
//                   title="View Course"
//                   onClick={() => navigate(`/course/${course._id}`)}
//                 />
//               )}
//             </div>
//           )}
//         </div>

//         {/* {(!course.isLocked || user?.role === "instructor") && expandedContent && (
//           <div className="course-content">
//             <div className="lectures-list">
//               <h3>Lectures</h3>
//               {course.lectures.map((lecture) => (
//                 <div key={lecture._id} className="lecture-item">
//                   <h4>{lecture.title}</h4>
//                   <div className="video-container">
//                     <iframe
//                       src={getYouTubeEmbedUrl(lecture.url)}
//                       frameBorder="0"
//                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                       allowFullScreen
//                       title={lecture.title}
//                     ></iframe>
//                   </div>
//                 </div>
//               ))}
//             </div> */}


// {(!course.isLocked || user?.role === "instructor") && expandedContent && (
//   <div className="course-content">
//     <div className="lectures-list">
//       <h3>Lectures</h3>
//       {course.lectures && course.lectures.length > 0 ? (
//         course.lectures.map((lecture) => (
//           <div key={lecture._id} className="lecture-item">
//             <h4>{lecture.title}</h4>
//             <div className="video-container">
//               <iframe
//                 src={lecture.videoUrl} // Using videoUrl directly from the lecture
//                 frameBorder="0"
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                 allowFullScreen
//                 title={lecture.title}
//               ></iframe>
//             </div>
//           </div>
//         ))
//       ) : (
//         <p>No lectures available</p>
//       )}
//     </div>
//   </div>
// )}

//             {course.quizzes?.length > 0 && (
//               <div className="quizzes-list">
//                 <h3>Quizzes</h3>
//                 {course.quizzes.map((quiz) => (
//                   <div key={quiz._id} className="quiz-item">
//                     <h4>{quiz.title}</h4>
//                     <p>{quiz.description}</p>
//                     <button 
//                       className="take-quiz-btn"
//                       onClick={() => navigate(`/course/${course._id}/quiz/${quiz._id}`)}
//                     >
//                       Take Quiz
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {showQuizCreator && (
//         <div className="modal-overlay" onClick={() => setShowQuizCreator(false)}>
//           <div className="modal-content" onClick={e => e.stopPropagation()}>
//             <QuizCreator
//               courseId={course._id}
//               onClose={() => setShowQuizCreator(false)}
//               onQuizCreated={handleQuizCreated}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CourseCard;











import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaEye,
  FaLock,
  FaUnlock,
  FaGraduationCap,
  FaSpinner,
  FaQuestionCircle,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import QuizCreator from './QuizCreator';
import '../styles/CourseCard.css';

const CourseCard = ({
  course,
  user,
  onToggleLock,
  onEnroll,
  onEdit,
  onDelete,
  onAddLecture,
  onQuizCreated
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showQuizCreator, setShowQuizCreator] = useState(false);
  const [expandedContent, setExpandedContent] = useState(false);

  const handleLockToggle = async () => {
    try {
      setLoading(true);
      await onToggleLock(course._id);
    } catch (error) {
      toast.error('Error toggling course lock');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      setLoading(true);
      await onEnroll(course._id);
      toast.success('Successfully enrolled in course!');
      setTimeout(() => {
        navigate('/enrolled-courses');
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error enrolling in course');
    } finally {
      setLoading(false);
    }
  };

  const handleQuizCreated = (quiz) => {
    setShowQuizCreator(false);
    onQuizCreated?.(quiz);
    toast.success('Quiz created successfully!');
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    try {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return match && match[2].length === 11 
        ? `https://www.youtube.com/embed/${match[2]}?rel=0&modestbranding=1`
        : url;
    } catch (error) {
      console.error('Error processing YouTube URL:', error);
      return '';
    }
  };

  const toggleContent = () => {
    setExpandedContent(!expandedContent);
  };

  return (
    <div className={`course-card ${course.isLocked ? "locked" : ""}`}>
      <div className="course-header" onClick={toggleContent}>
        <div className="course-header-main">
          <h2>{course.title}</h2>
          <div className="course-expand-icon">
            {expandedContent ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </div>
        {user && user.role === "instructor" ? (
          <button
            className={`lock-button ${loading ? 'loading' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleLockToggle();
            }}
            disabled={loading}
            title={course.isLocked ? "Unlock Course" : "Lock Course"}
          >
            {loading ? (
              <FaSpinner className="spinner" />
            ) : (
              course.isLocked ? <FaLock /> : <FaUnlock />
            )}
          </button>
        ) : (
          course.isLocked && (
            <div className="lock-status">
              <FaLock className="lock-icon" />
              <span>Locked</span>
            </div>
          )
        )}
      </div>

      <div className={`course-details ${expandedContent ? 'expanded' : ''}`}>
        <p className="course-description">{course.description}</p>
        <p className="category">Category: {course.category}</p>
        <p className="instructor">Instructor: {course.instructorName}</p>

        <div className="course-actions">
          {user && user.role === "instructor" ? (
            <div className="instructor-actions">
              <FaEdit
                className="icon edit"
                title="Edit Course"
                onClick={() => onEdit(course)}
              />
              <FaTrash
                className="icon delete"
                title="Delete Course"
                onClick={() => onDelete(course._id)}
              />
              <FaPlus
                className="icon add-lecture"
                title="Add Lecture"
                onClick={() => onAddLecture(course)}
              />
              <FaQuestionCircle
                className="icon quiz"
                title="Create Quiz"
                onClick={() => setShowQuizCreator(true)}
              />
            </div>
          ) : (
            <div className="student-actions">
              {course.isLocked ? (
                <button
                  className={`enroll-button ${loading ? 'loading' : ''}`}
                  onClick={handleEnroll}
                  disabled={loading}
                >
                  {loading ? (
                    <FaSpinner className="spinner" />
                  ) : (
                    <>
                      <FaGraduationCap /> Enroll to Unlock
                    </>
                  )}
                </button>
              ) : (
                <FaEye
                  className="icon preview"
                  title="View Course"
                  onClick={() => navigate(`/course/${course._id}`)}
                />
              )}
            </div>
          )}
        </div>

        {(!course.isLocked || user?.role === "instructor") && expandedContent && (
          <div className="course-content">
            <div className="lectures-list">
              <h3>Lectures</h3>
              {course.lectures && course.lectures.length > 0 ? (
                course.lectures.map((lecture) => (
                  <div key={lecture._id} className="lecture-item">
                    <h4>{lecture.title}</h4>
                    {lecture.videoUrl && (
                      <div className="video-container">
                        <iframe
                          width="100%"
                          height="315"
                          src={getYouTubeEmbedUrl(lecture.videoUrl)}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={lecture.title}
                        ></iframe>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="no-lectures">No lectures available yet</p>
              )}
            </div>

            {course.quizzes?.length > 0 && (
              <div className="quizzes-list">
                <h3>Quizzes</h3>
                {course.quizzes.map((quiz) => (
                  <div key={quiz._id} className="quiz-item">
                    <h4>{quiz.title}</h4>
                    <p>{quiz.description}</p>
                    <button 
                      className="take-quiz-btn"
                      onClick={() => navigate(`/course/${course._id}/quiz/${quiz._id}`)}
                    >
                      Take Quiz
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showQuizCreator && (
        <div className="modal-overlay" onClick={() => setShowQuizCreator(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <QuizCreator
              courseId={course._id}
              onClose={() => setShowQuizCreator(false)}
              onQuizCreated={handleQuizCreated}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseCard;