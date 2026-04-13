



// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import SignIn from "./pages/SignIn";
// import SignUp from "./pages/SignUp";
// import Dashboard from "./pages/Dashboard";
// import Courses from "./pages/Courses";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Layout from "./components/Layout";
// import Profile from "./components/Profile";
// import Settings from "./components/Settings";
// import EnrolledCourses from "./pages/EnrolledCourses";
// import StudentCourses from "./pages/StudentCourses";
// import QuizCreator from "./components/QuizCreator";
// import QuizManagement from "./pages/QuizManagement";
// import CourseView from "./components/CourseView";
// import PageNotFound from "./pages/PageNotFound";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import CourseMaterials from "./components/CourseMaterials";
// import ManageCourses from "./pages/ManageCourses";
// import TakeQuiz from "./components/TakeQuiz";
// import Terminal from "./components/Terminal";
// import MaterialUpload from "./pages/MaterialUpload";
// import Assignments from "./components/Assignments";
// import QuizResult from "./components/QuizResult";
// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/signin" element={<SignIn />} />
//         <Route path="/signup" element={<SignUp />} />

//         {/* Protected Routes */}
//         <Route
//           path="/"
//           element={
//             <ProtectedRoute>
//               <Layout />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<Dashboard />} />
//           <Route path="dashboard" element={<Dashboard />} />
//           <Route path="dashboard/profile" element={<Profile />} />
//           <Route path="dashboard/settings" element={<Settings />} />
//           <Route path="courses" element={<Courses />} />
//           <Route path="student/courses" element={<StudentCourses />} />
//           <Route path="enrolled-courses" element={<EnrolledCourses />} />
//           <Route path="course/:courseId/quiz/:quizId" element={<TakeQuiz />} />
//           <Route path="course/:courseId" element={<CourseView />} />
//           <Route path="quiz-management" element={<QuizManagement />} />
//           <Route path="/quiz-result/:quizId" element={<QuizResult />} />
//           <Route path="/courses/:courseId/materials" element={<CourseMaterials />} />
//           <Route path="/upload-materials" element={<MaterialUpload />} />
          
//           <Route path="assignments" element={<Assignments/>} />
//           <Route path="exams" element={<div>Exams</div>} />
//           <Route path="terminal" element={<Terminal />} />
//           <Route path="grade-assignments" element={<div>Grade Assignments</div>} />
//           <Route path="student-progress" element={<div>Student Progress</div>} />
//           <Route path="create-course" element={<div>Create Course</div>} />
//           <Route path="manage-courses" element={<ManageCourses />} />
//           <Route path="course/:courseId/materials" element={<CourseMaterials />} />
//           {/* Catch all route for 404 */}
//           <Route path="*" element={<PageNotFound />} />
//         </Route>
//       </Routes>

//       <ToastContainer position="top-right" autoClose={3000} />
//     </Router>
//   );
// }

// export default App;


import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import EnrolledCourses from "./pages/EnrolledCourses";
import StudentCourses from "./pages/StudentCourses";
import QuizCreator from "./components/QuizCreator";
import QuizManagement from "./pages/QuizManagement";
import CourseView from "./components/CourseView";
import PageNotFound from "./pages/PageNotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CourseMaterials from "./components/CourseMaterials";
import ManageCourses from "./pages/ManageCourses";
import TakeQuiz from "./components/TakeQuiz";
import Terminal from "./components/Terminal";
import MaterialUpload from "./pages/MaterialUpload";
import Assignments from "./components/Assignments";
import AllAssignments from "./components/AllAssignments";
import StudentMarks from "./components/StudentMarks";
import QuizResult from "./components/QuizResult";
import ViewMaterials from "./components/ViewMaterials";
import QuizEditor from "./components/QuizEditor";
import Meetings from "./pages/Meetings";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dashboard/profile" element={<Profile />} />
          <Route path="dashboard/settings" element={<Settings />} />
          <Route path="courses" element={<Courses />} />
          <Route path="student/courses" element={<StudentCourses />} />
          <Route path="enrolled-courses" element={<EnrolledCourses />} />
          <Route path="course/:courseId/quiz/:quizId" element={<TakeQuiz />} />
          <Route path="course/:courseId/quiz/create" element={<QuizCreator />} />
          <Route path="courses/:courseId/quiz/:quizId/edit" element={<QuizEditor />} />
          <Route path="course/:courseId" element={<CourseView />} />
          <Route path="quiz-management" element={<QuizManagement />} />
          <Route path="/quiz-result/:quizId" element={<QuizResult />} />
          <Route path="/quizzes/:quizId/marks" element={<StudentMarks />} />
          <Route path="/courses/:courseId/materials" element={<CourseMaterials />} />
          <Route path="/upload-materials" element={<MaterialUpload />} />
          <Route path="/materials" element={<ViewMaterials />} /> {/* Add this route */}
          <Route path="/view-materials" element={<ViewMaterials />} /> {/* Add this route */}
          <Route path="/meetings" element={<Meetings />} />
          <Route path="assignments" element={<AllAssignments />} />
          <Route path="exams" element={<div>Exams</div>} />
          <Route path="terminal" element={<Terminal />} />
          <Route path="grade-assignments" element={<div>Grade Assignments</div>} />
          <Route path="student-progress" element={<div>Student Progress</div>} />
          <Route path="create-course" element={<div>Create Course</div>} />
          <Route path="manage-courses" element={<ManageCourses />} />
          <Route path="course/:courseId/materials" element={<CourseMaterials />} />
          {/* Catch all route for 404 */}
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
