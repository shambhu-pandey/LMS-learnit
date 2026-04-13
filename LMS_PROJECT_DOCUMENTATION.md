# Learning Management System (LMS) - Complete Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Database Schema & Models](#database-schema--models)
5. [Backend Architecture](#backend-architecture)
6. [Frontend Architecture](#frontend-architecture)
7. [API Endpoints](#api-endpoints)
8. [Authentication & Authorization](#authentication--authorization)
9. [Key Features & Workflows](#key-features--workflows)
10. [Data Flow](#data-flow)
11. [File Dependencies](#file-dependencies)

---

## 🎯 Project Overview

This is a **full-stack Learning Management System (LMS)** that allows instructors to create and manage courses, upload materials, conduct quizzes, and interact with students. Students can enroll in courses, watch video lectures, download materials, take quizzes, and attend live meetings.

**Key Use Cases:**
- Instructors create courses with video lectures and materials
- Students browse and enroll in available courses
- Real-time quiz submission with automatic grading
- Online meeting integration with Google Meet
- Material upload and download functionality
- Student progress tracking and performance analytics

---

## 💻 Technology Stack

### **Backend:**
| Technology | Purpose | Version |
|-----------|---------|---------|
| Node.js + Express | Web server framework | Latest |
| MongoDB | NoSQL database | 8.12.1 |
| Mongoose | MongoDB ODM | 8.12.1 |
| JWT (jsonwebtoken) | Authentication tokens | 9.0.2 |
| bcryptjs | Password hashing | 3.0.2 |
| Multer | File upload handling | 1.4.5 |
| Nodemon | Development auto-reload | 3.1.9 |
| CORS | Cross-origin requests | 2.8.5 |

### **Frontend:**
| Technology | Purpose | Version |
|-----------|---------|---------|
| React | UI library | 19.0.0 |
| React Router DOM | Client-side routing | 7.2.0 |
| Vite | Build tool & dev server | 6.1.0 |
| Axios | HTTP client | 1.8.3 |
| Bootstrap | UI framework | 5.3.3 |
| React Toastify | Notifications | 11.0.5 |
| React Icons | Icon library | 5.5.0 |

---

## 📁 Project Structure

```
learning-management-main/
├── backend/                          # Node.js/Express server
│   ├── config/
│   │   └── db.js                    # MongoDB connection setup
│   ├── controllers/                 # Business logic
│   │   ├── authController.js        # Login/Register logic
│   │   ├── courseController.js      # Course CRUD operations
│   │   ├── quizController.js        # Quiz management
│   │   ├── materialController.js    # Material upload/download
│   │   ├── enrollController.js      # Enrollment logic
│   │   ├── userController.js        # User management
│   │   ├── meetingController.js     # Meeting management
│   │   ├── updateController.js      # User profile updates
│   │   └── terminalController.js    # Online terminal/code execution
│   ├── models/                      # MongoDB schemas
│   │   ├── User.js                  # User schema (students/instructors/admins)
│   │   ├── Course.js                # Course schema
│   │   ├── Quiz.js                  # Quiz questions & structure
│   │   ├── QuizSubmission.js        # Quiz attempts
│   │   ├── Enrollment.js            # Student-Course relationships
│   │   ├── Materials.js             # Course materials
│   │   ├── Meeting.js               # Meeting records
│   │   ├── materialModel.js         # Material model
│   │   └── dashboardModel.js        # Dashboard data model
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verification
│   │   ├── roles.js                 # Role-based access control
│   │   └── uploadMiddleware.js      # Multer file upload config
│   ├── routes/                      # API endpoints
│   │   ├── authRoutes.js            # /api/auth routes
│   │   ├── courseRoutes.js          # /api/courses routes
│   │   ├── quizRoutes.js            # /api/quizzes routes
│   │   ├── materialRoutes.js        # /api/materials routes
│   │   ├── userRoutes.js            # /api/users routes
│   │   ├── enrollmentRoutes.js      # /api/enrollments routes
│   │   ├── meetingRoutes.js         # /api/meetings routes
│   │   ├── terminalRoutes.js        # /api/terminal routes
│   │   ├── dashboardRoutes.js       # /api/dashboard routes
│   │   ├── updateRoutes.js          # /api/users/update routes
│   │   └── protectedRoutes.js       # Protected route templates
│   ├── scripts/                     # Setup & utility scripts
│   │   ├── setup.js                 # Initial data seeding
│   │   ├── addInitialData.js        # Sample data insertion
│   │   └── addInstructor.js         # Instructor creation script
│   ├── uploads/                     # Stored file uploads
│   │   ├── course-materials/        # Course material files
│   │   └── materials/               # Additional materials
│   ├── temp/                        # Temporary file storage
│   ├── package.json                 # Backend dependencies
│   ├── index.js                     # Main entry point
│   ├── server.js                    # Express app initialization
│   └── .env                         # Environment variables (not shown)
│
└── frontend/                         # React application
    ├── src/
    │   ├── api/
    │   │   └── axios.js             # Axios instance with interceptors
    │   ├── components/              # Reusable React components
    │   │   ├── Navbar.jsx           # Top navigation bar
    │   │   ├── Sidebar.jsx          # Left sidebar navigation
    │   │   ├── Layout.jsx           # Main layout wrapper
    │   │   ├── ProtectedRoute.jsx   # Route protection wrapper
    │   │   ├── CourseCard.jsx       # Course display card
    │   │   ├── CourseMaterials.jsx  # Material listing
    │   │   ├── CourseView.jsx       # Full course view
    │   │   ├── TakeQuiz.jsx         # Quiz interface
    │   │   ├── QuizCreator.jsx      # Quiz creation form
    │   │   ├── QuizEditor.jsx       # Edit existing quiz
    │   │   ├── QuizResult.jsx       # Display quiz results
    │   │   ├── Terminal.jsx         # Online code editor/terminal
    │   │   ├── UploadMaterial.jsx   # Material upload form
    │   │   ├── ViewMaterials.jsx    # View materials list
    │   │   ├── MaterialSidebar.jsx  # Material sidebar
    │   │   ├── Profile.jsx          # User profile page
    │   │   ├── Settings.jsx         # Settings page
    │   │   ├── Assignments.jsx      # Assignment viewing
    │   │   ├── AllAssignments.jsx   # All assignments page
    │   │   ├── StudentMarks.jsx     # Grade/marks display
    │   │   ├── ErrorBoundary.jsx    # Error handling wrapper
    │   │   ├── EnhancedVideoPlayer.jsx # Custom video player
    │   │   └── Spinner.jsx          # Loading spinner
    │   ├── pages/                   # Page components
    │   │   ├── SignIn.jsx           # Login page
    │   │   ├── SignUp.jsx           # Registration page
    │   │   ├── Dashboard.jsx        # Main dashboard
    │   │   ├── StudentDashboard.jsx # Student-specific dashboard
    │   │   ├── TeacherDashboard.jsx # Teacher-specific dashboard
    │   │   ├── Courses.jsx          # All courses page
    │   │   ├── EnrolledCourses.jsx  # Enrolled courses list
    │   │   ├── StudentCourses.jsx   # Student's courses
    │   │   ├── ManageCourses.jsx    # Instructor course management
    │   │   ├── MaterialUpload.jsx   # Material upload page
    │   │   ├── Meetings.jsx         # Meetings page
    │   │   ├── QuizManagement.jsx   # Quiz management page
    │   │   ├── PageNotFound.jsx     # 404 page
    │   │   └── StudentDashboard.jsx # Student dashboard
    │   ├── styles/                  # CSS files
    │   │   ├── App.css
    │   │   └── index.css
    │   ├── assets/                  # Images, fonts, etc.
    │   ├── App.jsx                  # Main App component with routing
    │   ├── main.jsx                 # React DOM mount point
    │   └── index.css                # Global styles
    ├── public/                      # Static assets
    ├── package.json                 # Frontend dependencies
    ├── vite.config.js               # Vite configuration
    ├── eslint.config.js             # Linting configuration
    └── index.html                   # HTML entry point
```

---

## 🗄️ Database Schema & Models

### **1. User Model** (`backend/models/User.js`)
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (hashed with bcrypt),
  role: Enum["student", "instructor", "teacher", "admin"] (required)
}
```
**Purpose:** Store user account information
**Details:**
- Password is hashed using bcryptjs before saving
- Email must be unique
- Role determines permissions (student/instructor/admin)

---

### **2. Course Model** (`backend/models/Course.js`)
```javascript
{
  _id: ObjectId,
  title: String (required, max 100 chars),
  description: String (required),
  instructor: ObjectId (ref: User),
  category: String,
  googleMeetLink: String (optional),
  lectures: [
    {
      title: String,
      description: String,
      videoUrl: String (YouTube URL only),
      duration: Number,
      order: Number
    }
  ],
  materials: [ObjectId] (ref: Materials),
  enrolledStudents: [ObjectId] (ref: User),
  isLocked: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```
**Purpose:** Store course information
**Details:**
- Only instructors can create courses
- Supports YouTube video URLs
- Can be locked by instructor
- Tracks all enrolled students

---

### **3. Enrollment Model** (`backend/models/Enrollment.js`)
```javascript
{
  _id: ObjectId,
  student: ObjectId (ref: User, required),
  course: ObjectId (ref: Course, required),
  enrolledAt: Date (default: now),
  status: Enum["active", "completed", "dropped"],
  enrolledCourses: [ObjectId] (ref: Course)
}
```
**Purpose:** Track student-course relationships
**Details:**
- Links students to courses (many-to-many)
- Status tracks enrollment lifecycle

---

### **4. Quiz Model** (`backend/models/Quiz.js`)
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  course: ObjectId (ref: Course, required),
  questions: [
    {
      questionText: String (required),
      options: [
        {
          text: String,
          isCorrect: Boolean
        }
      ],
      points: Number (default: 1)
    }
  ],
  attempts: [
    {
      student: ObjectId (ref: User),
      score: Number,
      answers: [
        {
          questionId: ObjectId,
          selectedOption: ObjectId,
          isCorrect: Boolean
        }
      ],
      passed: Boolean,
      submittedAt: Date
    }
  ],
  passingScore: Number,
  createdAt: Date
}
```
**Purpose:** Store quiz structure and responses
**Details:**
- Each quiz contains multiple questions
- Each question has multiple choice options
- Tracks all student attempts with scores

---

### **5. QuizSubmission Model** (`backend/models/QuizSubmission.js`)
```javascript
{
  _id: ObjectId,
  quiz: ObjectId (ref: Quiz),
  student: ObjectId (ref: User),
  answers: Object (student's answers),
  score: Number,
  percentage: Number,
  passed: Boolean,
  submittedAt: Date
}
```
**Purpose:** Record individual quiz attempts
**Details:**
- Separate model for detailed submission tracking

---

### **6. Materials Model** (`backend/models/Materials.js`)
```javascript
{
  title: String,
  fileUrl: String,
  fileType: String (pdf, doc, ppt, etc.),
  uploadedBy: ObjectId (ref: User),
  uploadedAt: Date,
  course: ObjectId (ref: Course)
}
```
**Purpose:** Store course material metadata
**Details:**
- Tracks who uploaded the material
- Stores file references

---

### **7. Meeting Model** (`backend/models/Meeting.js`)
```javascript
{
  _id: ObjectId,
  course: ObjectId (ref: Course),
  title: String,
  googleMeetLink: String,
  scheduledAt: Date,
  conductor: ObjectId (ref: User),
  participants: [ObjectId] (ref: User),
  createdAt: Date
}
```
**Purpose:** Store Google Meet sessions
**Details:**
- Links to Google Meet
- Tracks meeting participants

---

## 🏗️ Backend Architecture

### **Directory Breakdown:**

#### **1. Config (`backend/config/`)**
- **db.js**: MongoDB connection function
  - Removes old connection logic
  - Implements connection pooling with timeouts
  - Adds event handlers for connection status

#### **2. Controllers (`backend/controllers/`)**
Controllers contain the business logic for each feature:

**authController.js** - Authentication
- `register()`: Create new user account
- `login()`: Authenticate user and return JWT token
- `getProfile()`: Fetch current user details

**courseController.js** - Course Management
- `createCourse()`: Instructor creates new course
- `getCourses()`: Get all courses with pagination
- `getCourseById()`: Get specific course details
- `getInstructorCourses()`: Get courses taught by instructor
- `getAvailableCourses()`: Get courses for enrollment
- `getEnrolledCourses()`: Get student's enrolled courses
- `updateCourse()`: Update course details (instructor only)
- `deleteCourse()`: Delete course (instructor only)
- `addLecture()`: Add video lecture to course
- `getCourseLectures()`: Get all lectures in course
- `deleteLecture()`: Remove lecture from course
- `toggleCourseLock()`: Lock/unlock course
- `unenrollCourse()`: Student drops course
- `updateGoogleMeetLink()`: Set Google Meet link

**quizController.js** - Quiz Management
- `createQuiz()`: Create new quiz
- `getQuizzes()`: Get course quizzes
- `submitQuiz()`: Submit quiz answers
- `getQuizAttempts()`: Get student's quiz attempts
- `getQuizResult()`: Get specific quiz result

**materialController.js** - Material Upload
- `uploadMaterial()`: Upload course material file
- `getMaterials()`: Get course materials
- `deleteMaterial()`: Remove material

**enrollController.js** - Enrollment
- `enrollCourse()`: Student enrolls in course
- `getEnrollments()`: Get enrollment records
- `unenrollCourse()`: Student drops enrollment

**userController.js** - User Management
- `getAllUsers()`: Get list of users
- `getUserById()`: Get user details
- `updateUser()`: Update user profile
- `deleteUser()`: Delete user account

**meetingController.js** - Meeting Management
- `createMeeting()`: Create new meeting
- `getMeetings()`: Get all meetings
- `joinMeeting()`: Record participant

**terminalController.js** - Code Execution
- `executeCode()`: Run code in sandbox environment

**updateController.js** - Profile Updates
- `updateProfile()`: Update user details
- `changePassword()`: Update password

#### **3. Middleware (`backend/middleware/`)**

**authMiddleware.js** - Authentication
```javascript
protect(req, res, next) {
  // Extract JWT from Authorization header
  // Verify token with JWT_SECRET
  // Attach user info to req.user
  // Next request handler can access req.user
}

instructor(req, res, next) {
  // Check if user role is "instructor" or "teacher"
  // Allow only instructors to proceed
}

admin(req, res, next) {
  // Check if user role is "admin"
  // Allow only admins to proceed
}
```

**uploadMiddleware.js** - File Upload
- Configures Multer for file uploads
- Sets file size limits
- Specifies upload directory
- Filters file types

**roles.js** - Role-based access control (currently empty)

#### **4. Routes (`backend/routes/`)**

**authRoutes.js**
```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Login user
GET    /api/auth/me           - Get current user (protected)
```

**courseRoutes.js**
```
POST   /api/courses                      - Create course (instructor)
GET    /api/courses                      - Get all courses
GET    /api/courses/instructor           - Get instructor's courses
GET    /api/courses/available            - Get available courses
GET    /api/courses/enrolled             - Get enrolled courses
GET    /api/courses/:id                  - Get course details
PUT    /api/courses/:id                  - Update course
DELETE /api/courses/:id                  - Delete course
PUT    /api/courses/:id/toggle-lock      - Lock/unlock course

POST   /api/courses/:id/enroll           - Enroll in course
DELETE /api/courses/:id/unenroll         - Drop course

POST   /api/courses/:courseId/lectures   - Add lecture
GET    /api/courses/:courseId/lectures   - Get lectures
DELETE /api/courses/:courseId/lectures/:lectureId - Delete lecture

PUT    /api/courses/:courseId/google-meet-link - Update Meet link
```

**quizRoutes.js**
```
POST   /api/quizzes                      - Create quiz
GET    /api/quizzes                      - Get quizzes
GET    /api/quizzes/:id                  - Get quiz details
POST   /api/quizzes/:id/submit           - Submit quiz
GET    /api/quizzes/:id/attempts         - Get attempts
GET    /api/quizzes/:id/results          - Get results
```

**materialRoutes.js**
```
POST   /api/materials                    - Upload material
GET    /api/materials/:courseId          - Get course materials
DELETE /api/materials/:id                - Delete material
```

**userRoutes.js**
```
GET    /api/users                        - Get all users
GET    /api/users/:id                    - Get user details
PUT    /api/users/:id                    - Update user
DELETE /api/users/:id                    - Delete user
```

**meetingRoutes.js**
```
POST   /api/meetings                     - Create meeting
GET    /api/meetings                     - Get meetings
POST   /api/meetings/:id/join            - Join meeting
```

**terminalRoutes.js**
```
POST   /api/terminal/execute             - Execute code
```

**dashboardRoutes.js**
```
GET    /api/dashboard                    - Get dashboard stats
```

**updateRoutes.js**
```
PUT    /api/users/profile                - Update profile
PUT    /api/users/password               - Change password
```

---

## 🎨 Frontend Architecture

### **Routing Structure**

The frontend uses React Router DOM with protected routes:

```
/
├── /signin                    (Public)     - Login page
├── /signup                    (Public)     - Registration page
└── / (Protected Layout)       
    ├── /dashboard             (Protected)  - Main dashboard
    ├── /courses               (Protected)  - All courses
    ├── /enrolled-courses      (Protected)  - My enrolled courses
    ├── /manage-courses        (Protected)  - Manage courses (Instructor)
    ├── /course/:id            (Protected)  - Course detail view
    ├── /materials/:courseId   (Protected)  - Course materials
    ├── /quiz/:id              (Protected)  - Take quiz
    ├── /quiz-management       (Protected)  - Manage quizzes
    ├── /material-upload       (Protected)  - Upload materials
    ├── /meetings              (Protected)  - View meetings
    ├── /profile               (Protected)  - User profile
    ├── /settings              (Protected)  - Settings
    ├── /terminal              (Protected)  - Online terminal
    └── * (Catch-all)          (Public)     - 404 page
```

### **Component Architecture**

**Layout Components:**
- `Layout.jsx`: Main wrapper with sidebar
- `Navbar.jsx`: Top navigation bar
- `Sidebar.jsx`: Left navigation menu
- `ProtectedRoute.jsx`: Route protection wrapper
- `ErrorBoundary.jsx`: Error handling

**Page Components:**
- `SignIn.jsx`: Login form
- `SignUp.jsx`: Registration form
- `Dashboard.jsx`: Main dashboard
- `Courses.jsx`: Browse courses
- `EnrolledCourses.jsx`: My courses
- `ManageCourses.jsx`: Create/edit courses

**Feature Components:**
- `CourseCard.jsx`: Displays course preview
- `CourseView.jsx`: Full course details
- `CourseMaterials.jsx`: Materials list
- `TakeQuiz.jsx`: Quiz interface
- `QuizCreator.jsx`: Create quiz form
- `QuizEditor.jsx`: Edit quiz
- `QuizResult.jsx`: Quiz results display
- `UploadMaterial.jsx`: File upload form
- `ViewMaterials.jsx`: Material listing
- `Terminal.jsx`: Online code editor
- `Profile.jsx`: User profile
- `Settings.jsx`: User settings

**Utility Components:**
- `Spinner.jsx`: Loading indicator
- `Toast.jsx`: Notification system
- `EnhancedVideoPlayer.jsx`: Custom video player

---

## 🔌 API Endpoints

### **Complete API Reference**

**BASE URL:** `http://localhost:5000`

#### **Authentication Endpoints**
| Method | Endpoint | Auth | Body | Response |
|--------|----------|------|------|----------|
| POST | `/api/auth/register` | ❌ No | `{name, email, password, role}` | `{success, token, user}` |
| POST | `/api/auth/login` | ❌ No | `{email, password}` | `{success, token, user}` |
| GET | `/api/auth/me` | ✅ Yes | - | `{user}` |

#### **Course Endpoints**
| Method | Endpoint | Auth | Role | Purpose |
|--------|----------|------|------|---------|
| POST | `/api/courses` | ✅ | Instructor | Create course |
| GET | `/api/courses` | ✅ | All | List all courses |
| GET | `/api/courses/:id` | ✅ | All | Get course details |
| GET | `/api/courses/instructor` | ✅ | Instructor | Get my courses |
| GET | `/api/courses/available` | ✅ | Student | Get available courses |
| GET | `/api/courses/enrolled` | ✅ | Student | Get enrolled courses |
| PUT | `/api/courses/:id` | ✅ | Instructor | Update course |
| DELETE | `/api/courses/:id` | ✅ | Instructor | Delete course |
| POST | `/api/courses/:id/enroll` | ✅ | Student | Enroll in course |
| DELETE | `/api/courses/:id/unenroll` | ✅ | Student | Drop course |
| POST | `/api/courses/:courseId/lectures` | ✅ | Instructor | Add lecture |
| GET | `/api/courses/:courseId/lectures` | ✅ | All | Get lectures |
| DELETE | `/api/courses/:courseId/lectures/:lectureId` | ✅ | Instructor | Delete lecture |
| PUT | `/api/courses/:id/toggle-lock` | ✅ | Instructor | Lock/unlock course |
| PUT | `/api/courses/:courseId/google-meet-link` | ✅ | Instructor | Update Meet link |

#### **Quiz Endpoints**
| Method | Endpoint | Auth | Role | Purpose |
|--------|----------|------|------|---------|
| POST | `/api/quizzes` | ✅ | Instructor | Create quiz |
| GET | `/api/quizzes` | ✅ | All | Get quizzes |
| GET | `/api/quizzes/:id` | ✅ | All | Get quiz details |
| POST | `/api/quizzes/:id/submit` | ✅ | Student | Submit quiz |
| GET | `/api/quizzes/:id/attempts` | ✅ | Student | Get my attempts |
| GET | `/api/quizzes/:id/results` | ✅ | Instructor | See all results |

#### **Material Endpoints**
| Method | Endpoint | Auth | Role | Purpose |
|--------|----------|------|------|---------|
| POST | `/api/materials` | ✅ | Instructor | Upload material |
| GET | `/api/materials/:courseId` | ✅ | All | Get materials |
| DELETE | `/api/materials/:id` | ✅ | Instructor | Delete material |

#### **User Endpoints**
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/users` | ✅ | Get all users (Admin) |
| GET | `/api/users/:id` | ✅ | Get user details |
| PUT | `/api/users/:id` | ✅ | Update user |
| DELETE | `/api/users/:id` | ✅ | Delete user (Admin) |
| PUT | `/api/users/profile` | ✅ | Update my profile |
| PUT | `/api/users/password` | ✅ | Change password |

#### **Meeting Endpoints**
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/meetings` | ✅ | Create meeting |
| GET | `/api/meetings` | ✅ | Get meetings |
| POST | `/api/meetings/:id/join` | ✅ | Join meeting |

#### **Terminal Endpoints**
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/terminal/execute` | ✅ | Execute code |

#### **Dashboard Endpoints**
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/dashboard` | ✅ | Get dashboard stats |

---

## 🔐 Authentication & Authorization

### **Authentication Flow**

```
1. User Registration
   └─> POST /api/auth/register
       ├─> Check if email exists
       ├─> Hash password with bcryptjs
       ├─> Create User in MongoDB
       └─> Return JWT token + user data

2. User Login
   └─> POST /api/auth/login
       ├─> Find user by email
       ├─> Compare password with hash
       ├─> Generate JWT token (24h expiry)
       └─> Return token + user data

3. Protected API Calls
   └─> Any protected endpoint
       ├─> Extract token from Authorization header
       ├─> Verify token with JWT_SECRET
       ├─> Attach user data to req.user
       └─> Proceed with request
```

### **JWT Structure**
```javascript
{
  header: {
    alg: "HS256",
    typ: "JWT"
  },
  payload: {
    userId: "user_mongo_id",
    role: "student|instructor|admin",
    iat: 1234567890,
    exp: 1234654290
  },
  signature: "hash(header.payload.secret)"
}
```

### **Authorization Levels**

| Role | Permissions |
|------|-------------|
| **Student** | - Enroll/drop courses<br>- View course materials<br>- Take quizzes<br>- View own grades<br>- Update own profile |
| **Instructor** | - Create/edit/delete courses<br>- Add lectures & materials<br>- Create & manage quizzes<br>- View student submissions<br>- Lock/unlock courses<br>- Conduct meetings |
| **Admin** | - All instructor permissions<br>- Manage all users<br>- Delete any course<br>- View system statistics |

### **Middleware Flow**
```javascript
Request
  ↓
authMiddleware.protect()
  ├─> Check Authorization header
  ├─> Extract token
  ├─> Verify JWT
  ├─> Query user from MongoDB
  ├─> Attach to req.user
  └─> next()
  ↓
roleMiddleware (if required)
  ├─> Check req.user.role
  ├─> Allow if role matches
  └─> next() or 403 error
  ↓
Controller
  ├─> Execute business logic
  └─> Send response
```

---

## ✨ Key Features & Workflows

### **1. Course Management Workflow**

**Instructor Creates Course:**
```
1. Instructor logs in
2. Navigate to "Manage Courses"
3. Click "Create Course"
4. Fill form (title, description, category)
5. POST /api/courses
6. Course saved in MongoDB with:
   - instructor_id = current user
   - isLocked = false
   - enrolledStudents = []
7. Instructor redirected to course dashboard
```

**Add Lecture to Course:**
```
1. Go to course dashboard
2. Click "Add Lecture"
3. Fill form (title, description, YouTube URL)
4. POST /api/courses/:id/lectures
5. Lecture added to course.lectures array
6. Video embedded in course page
```

---

### **2. Student Enrollment Workflow**

**Student Enrolls in Course:**
```
1. Student browses available courses
2. Click "Enroll Now" on course card
3. POST /api/courses/:id/enroll
4. Backend:
   ├─> Create Enrollment record
   ├─> Add student to course.enrolledStudents
   └─> Return success
5. Student added to course
6. Course appears in "My Courses"
```

---

### **3. Quiz Management Workflow**

**Instructor Creates Quiz:**
```
1. Go to course → Quizzes
2. Click "Create Quiz"
3. Add questions with:
   - Question text
   - Multiple options
   - Mark correct answer
   - Points per question
4. POST /api/quizzes
5. Quiz saved with:
   - course_id
   - questions array
   - passingScore
```

**Student Takes Quiz:**
```
1. Navigate to course
2. Click "Take Quiz"
3. Answer questions (radio buttons)
4. Click "Submit"
5. POST /api/quizzes/:id/submit
   ├─> Check each answer
   ├─> Calculate score
   ├─> Compare with passingScore
   └─> Mark as passed/failed
6. Show results page with:
   - Score/percentage
   - Correct answers
   - Explanation (if provided)
```

---

### **4. Material Upload & Download Workflow**

**Instructor Uploads Material:**
```
1. Go to course → Materials
2. Click "Upload Material"
3. Select file (PDF, DOC, PPT, etc.)
4. Upload via Multer (POST /api/materials)
5. File saved in /uploads/course-materials/
6. Material metadata saved in MongoDB
```

**Student Downloads Material:**
```
1. View course materials
2. Click "Download" on material
3. File served from /uploads/ directory
4. Browser downloads file
```

---

### **5. Google Meet Integration**

**Instructor Sets Up Meeting:**
```
1. Go to course
2. Click "Set Google Meet Link"
3. Paste Google Meet URL
4. PUT /api/courses/:id/google-meet-link
5. Link stored in course.googleMeetLink
6. Link visible to all enrolled students
```

**Student Joins Meeting:**
```
1. Click meeting link in course
2. Opens Google Meet in new tab
3. Backend tracks participation
4. Meeting metadata saved
```

---

### **6. Online Terminal Workflow**

**Student Uses Terminal:**
```
1. Navigate to Terminal page
2. Write code in editor
3. Select programming language
4. Click "Run Code"
5. POST /api/terminal/execute
   ├─> Code sent to sandbox
   ├─> Executed in isolated environment
   └─> Output returned
6. Results displayed in terminal
```

---

## 🔄 Data Flow

### **Backend Request Processing Flow**

```
HTTP Request
    ↓
Express receives request
    ↓
CORS middleware checks origin
    ↓
Body parsing (JSON/urlencoded)
    ↓
Match with route
    ↓
authMiddleware.protect() (if required)
    ├─> Extract JWT from header
    ├─> Verify token
    └─> Attach user to req
    ↓
Role middleware (if required)
    ├─> Check user role
    └─> Allow/deny
    ↓
Controller function executes
    ├─> Extract data from req
    ├─> Validate input
    ├─> MongoDB query/update
    └─> Return response
    ↓
Error handler (if error)
    ├─> Log error
    └─> Send error response
    ↓
HTTP Response
```

### **Frontend API Call Flow**

```
React Component
    ↓
User triggers action (click, submit)
    ↓
Event handler calls API function
    ↓
axios.js Interceptor
    ├─> Add token from localStorage
    ├─> Set headers
    └─> Send request
    ↓
Backend processes request
    ↓
Response returns
    ↓
Response Interceptor
    ├─> Check status
    ├─> If 401: clear token & redirect
    └─> Return response
    ↓
Component receives data
    ↓
useState updates
    ↓
Component re-renders with new data
```

### **Authentication Token Flow**

```
1. Registration/Login
   └─> Backend generates JWT
       ├─> payload: {userId, role}
       ├─> secret: process.env.JWT_SECRET
       └─> expiry: 24 hours

2. Frontend stores token
   └─> localStorage.setItem('token', token)

3. Subsequent requests
   └─> axios interceptor
       ├─> Retrieves token from localStorage
       ├─> Adds to header: "Authorization: Bearer <token>"
       └─> Sends request

4. Backend verifies token
   └─> authMiddleware.protect()
       ├─> Extracts token from header
       ├─> jwt.verify(token, JWT_SECRET)
       ├─> Query user from DB
       └─> Attach to req.user

5. Token expiry
   └─> If token expired in response:
       ├─> Response interceptor catches 401
       ├─> Clears localStorage
       ├─> Redirects to /signin
       └─> User logs in again
```

---

## 📊 File Dependencies & Relationships

### **Backend File Dependencies**

```
server.js (Main Entry)
├── /config/db.js
│   └── mongoose (MongoDB connection)
├── /routes/*.js (All route files)
│   ├── /controllers/*.js
│   │   ├── /models/*.js (MongoDB schemas)
│   │   │   └── mongoose
│   │   └── /middleware/authMiddleware.js
│   │       └── jsonwebtoken
│   └── /middleware/*.js
│       └── jsonwebtoken, bcryptjs
├── express
├── cors
├── dotenv
└── multer (for file uploads)
```

### **Frontend File Dependencies**

```
main.jsx (Entry Point)
├── App.jsx (Root component)
│   └── React Router
│       ├── pages/*.jsx
│       ├── components/*.jsx
│       │   ├── Layout.jsx
│       │   ├── ProtectedRoute.jsx
│       │   └── Others
│       └── /api/axios.js
│           └── axios + interceptors
├── index.css (Global styles)
└── Bootstrap + React Icons
```

### **Component Hierarchy**

```
App.jsx
├── BrowserRouter
    └── Routes
        ├── SignIn
        ├── SignUp
        └── ProtectedRoute (React.Context)
            └── Layout
                ├── Navbar
                ├── Sidebar
                └── Outlet (Page content)
                    ├── Dashboard
                    ├── Courses
                    ├── CourseView
                    │   ├── CourseMaterials
                    │   ├── TakeQuiz
                    │   ├── Assignments
                    │   └── EnhancedVideoPlayer
                    ├── ManageCourses
                    ├── QuizCreator
                    ├── Terminal
                    ├── Profile
                    ├── Settings
                    └── Others
```

---

## 🚀 How the System Works - Complete Flow Example

### **Complete User Journey: Student Takes a Quiz**

```
1. STUDENT LOGIN
   ├─> Navigate to /signin
   ├─> Enter email & password
   ├─> Click "Login"
   └─> Frontend: POST /api/auth/login
       ├─> Backend checks credentials
       ├─> Generates JWT token
       ├─> Returns {token, user}
       └─> Frontend stores token in localStorage

2. BROWSE COURSES
   ├─> Navigate to /courses
   ├─> Frontend: GET /api/courses (with token header)
   ├─> Backend queries all courses from DB
   ├─> Returns course list
   └─> Frontend displays courses

3. ENROLL IN COURSE
   ├─> Click "Enroll" on course card
   └─> Frontend: POST /api/courses/:id/enroll
       ├─> Backend: authMiddleware verifies JWT
       ├─> Backend: Creates Enrollment record
       ├─> Backend: Adds student to course.enrolledStudents
       └─> Returns success

4. VIEW COURSE MATERIALS
   ├─> Navigate to /course/:id
   ├─> Frontend: GET /api/courses/:id
       ├─> Returns course details + lectures
       ├─> Displays video lectures
       └─> Displays material list
   └─> Frontend: GET /api/materials/:courseId
       ├─> Returns all materials
       └─> Displays download links

5. TAKE QUIZ
   ├─> Click "Take Quiz"
   ├─> Frontend: GET /api/quizzes/:id
   ├─> Backend: Returns questions with options
   ├─> Frontend displays quiz form
   ├─> Student answers questions
   ├─> Clicks "Submit"
   └─> Frontend: POST /api/quizzes/:id/submit
       ├─> Sends answers array
       ├─> Backend: Compares with correct answers
       ├─> Backend: Calculates score
       ├─> Backend: Checks passingScore
       ├─> Backend: Saves QuizSubmission record
       ├─> Backend: Returns {score, passed, results}
       └─> Frontend: Displays results page
           ├─> Shows score/percentage
           ├─> Shows correct answers
           └─> Shows passed/failed status

6. LOGOUT
   ├─> Click "Logout"
   ├─> Frontend: Removes token from localStorage
   ├─> Frontend: Redirects to /signin
   └─> Session ends
```

---

## 📝 Key Technologies & Why Used

| Technology | Why Used |
|-----------|----------|
| **Express.js** | Lightweight web framework for Node.js, perfect for REST API |
| **MongoDB** | NoSQL database, flexible schema for storing diverse data |
| **Mongoose** | Schema validation for MongoDB, easier data modeling |
| **JWT** | Stateless authentication, secure token-based auth |
| **bcryptjs** | Secure password hashing, prevents plain-text storage |
| **Multer** | Handle file uploads (course materials) |
| **React** | Dynamic UI, component-based architecture |
| **React Router** | Client-side routing for SPA navigation |
| **Axios** | HTTP client with interceptors for API calls |
| **Bootstrap** | Responsive CSS framework for styling |
| **Vite** | Fast build tool for React |

---

## 🎓 Summary

This LMS system is built on a **client-server architecture**:

- **Backend (Node + Express + MongoDB)**: Manages data, authentication, business logic
- **Frontend (React + Vite)**: Provides user interface, handles client-side routing
- **Database (MongoDB)**: Stores users, courses, quizzes, materials, enrollments
- **Authentication (JWT)**: Secures API endpoints with token-based auth
- **File Storage**: Multer handles course material uploads

The system follows **REST API principles**, with clear separation of concerns:
- **Routes** define endpoints
- **Controllers** contain business logic
- **Models** define data structure
- **Middleware** handles cross-cutting concerns (auth, validation)
- **Components** provide UI for features

---

## 🔧 Environment Variables Required

Create a `.env` file in the backend directory:

```env
# Database
MONGO_URI=mongodb://localhost:27017/lms

# JWT
JWT_SECRET=your_strong_secret_key_here

# Port
PORT=5000

# Node Environment
NODE_ENV=development
```

---

## 📌 Project Review Checklist

✅ **Architecture**: Clean separation of concerns (MVC pattern)  
✅ **Authentication**: JWT-based token auth with role verification  
✅ **Database**: Properly structured MongoDB schemas with relationships  
✅ **API Design**: RESTful endpoints with proper HTTP methods  
✅ **Frontend State**: React hooks for state management  
✅ **Error Handling**: Try-catch blocks and error middleware  
✅ **File Uploads**: Multer for secure file handling  
✅ **CORS**: Properly configured for development  
✅ **Code Organization**: Modular structure with clear responsibilities  
✅ **Security**: Password hashing, JWT verification, role-based access  

---

**Document Created:** April 2025  
**Project Status:** Complete LMS system with core features  
**Ready for:** Project review and deployment
