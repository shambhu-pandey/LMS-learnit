# LMS Project - Viva Questions & Answers

## 📚 Complete Guide for Project Review

---

## 🏗️ ARCHITECTURE & DESIGN QUESTIONS

### **Q1: Explain the overall architecture of your LMS project.**

**Answer:**
The project follows a **client-server architecture** with **MVC pattern**:

```
Frontend (React)          Backend (Express)         Database (MongoDB)
├─ Pages                  ├─ Routes                 ├─ Users
├─ Components             ├─ Controllers            ├─ Courses
├─ State Management       ├─ Models                 ├─ Quizzes
└─ API Calls (Axios)      ├─ Middleware             ├─ Enrollments
                          └─ Config                 └─ Materials
```

**Three-tier architecture:**
1. **Presentation Layer (React)** - UI components, user interactions
2. **Application Layer (Express)** - Business logic, API endpoints
3. **Data Layer (MongoDB)** - Data persistence

**Communication:** Frontend sends HTTP requests via Axios → Backend processes → Database stores/retrieves → Response sent back

---

### **Q2: Why did you choose Node.js + Express for backend instead of other frameworks?**

**Answer:**
- **JavaScript throughout** - Same language in frontend & backend (code reuse concepts)
- **Lightweight** - Minimal overhead, fast startup
- **Event-driven** - Perfect for I/O operations (database queries, file uploads)
- **Large ecosystem** - npm packages (mongoose, jwt, bcryptjs, multer)
- **Scalability** - Can handle multiple concurrent requests
- **Perfect for REST APIs** - Express makes API development simple
- **Real-time capabilities** - Can easily add Socket.IO for live features

---

### **Q3: Explain the data flow when a student enrolls in a course.**

**Answer:**

```
1. FRONTEND
   └─> Student clicks "Enroll Now" button (Courses.jsx)
   └─> Triggers: axios.post('/api/courses/:id/enroll')
   
2. NETWORK
   └─> Browser sends POST request with JWT token in header
   
3. BACKEND - Route
   └─> Express routes request to courseRoutes.js
   └─> Matches POST /api/courses/:id/enroll
   
4. BACKEND - Middleware
   └─> authMiddleware.protect()
       ├─> Extracts token from header
       ├─> Verifies JWT
       ├─> Queries User from MongoDB
       └─> Attaches user to req.user
   └─> Next middleware proceeds
   
5. BACKEND - Controller
   └─> enrollCourse() controller executes
       ├─> Extract courseId from req.params
       ├─> Create Enrollment document:
       │   {
       │     student: req.user._id,
       │     course: courseId,
       │     enrolledAt: Date.now(),
       │     status: 'active'
       │   }
       ├─> Save to MongoDB
       ├─> Add student to course.enrolledStudents array
       └─> Return success response
   
6. FRONTEND
   └─> Axios interceptor receives response
   └─> If 401: clear token, redirect to signin
   └─> If 200: Show success toast
   └─> Update courses state
   └─> Re-render component
   
7. UI UPDATE
   └─> "Enroll Now" button changes to "Drop Course"
   └─> Course appears in enrolled courses list
```

---

### **Q4: Why do you use MongoDB instead of SQL databases?**

**Answer:**
- **Flexible Schema** - Store different data types without migration
- **Document-based** - JSON-like structure matches JavaScript objects
- **No complex joins** - Mongoose handles relationships with `ref`
- **Scalability** - Horizontal scaling easier with NoSQL
- **Fast development** - No need to create tables/schemas upfront
- **Mongoose ODM** - Provides schema validation & data modeling layer
- **Perfect for LMS** - Courses, quizzes, materials have varying structures

**Example flexibility:**
```javascript
// SQL: Fixed schema
// MongoDB: Can add fields as needed
const QuizSchema = {
  title: String,
  course: ObjectId,
  questions: [
    { text, options: [Boolean], points? }  // points is optional
  ],
  metadata: any  // Can store any data!
}
```

---

## 🔐 AUTHENTICATION & AUTHORIZATION QUESTIONS

### **Q5: Explain JWT authentication. How does it work in your project?**

**Answer:**

**What is JWT?**
JWT = JSON Web Token. A stateless authentication mechanism.

**Structure:**
```
JWT = Header . Payload . Signature

Header (Algorithm & Type):
{ "alg": "HS256", "typ": "JWT" }

Payload (Data):
{ 
  "userId": "mongo_id",
  "role": "student",
  "iat": 1234567890    // issued at
  "exp": 1234654290    // expiration
}

Signature:
HMAC(Header + Payload + SECRET_KEY)
```

**Process in your project:**

**1. Registration/Login:**
```javascript
// authController.js
const token = jwt.sign(
  { userId: user._id, role: user.role },  // What to encode
  process.env.JWT_SECRET,                  // Secret key
  { expiresIn: '24h' }                      // Expiration
);
// Returns token to frontend
```

**2. Frontend stores token:**
```javascript
localStorage.setItem('token', res.data.token);
```

**3. Subsequent requests:**
```javascript
// axios.js - Request interceptor
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;  // Add to header
  }
  return config;
});
```

**4. Backend verifies token:**
```javascript
// authMiddleware.js - protect middleware
exports.protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];  // Extract
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify
  
  const user = await User.findById(decoded.userId);  // Get user
  req.user = user;  // Attach to request
  next();  // Proceed
};
```

**5. Response interceptor handles expiry:**
```javascript
instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/signin';  // Redirect to login
    }
    return Promise.reject(error);
  }
);
```

**Advantages:**
- ✅ Stateless - No session storage needed
- ✅ Secure - Signature prevents tampering
- ✅ Scalable - Works across multiple servers
- ✅ Mobile-friendly - Works with any client

---

### **Q6: How do you implement role-based access control (RBAC)?**

**Answer:**

**Your system has 3 roles:**
1. **Student** - Can take courses/quizzes
2. **Instructor/Teacher** - Can create courses/quizzes
3. **Admin** - Full access

**Implementation:**

**1. Store role in User model:**
```javascript
// User.js
role: {
  type: String,
  enum: ["student", "instructor", "teacher", "admin"],
  required: true
}
```

**2. Include role in JWT:**
```javascript
// authController.js
const token = jwt.sign(
  { userId: user._id, role: user.role },  // Include role
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);
```

**3. Middleware for role checking:**
```javascript
// authMiddleware.js
exports.instructor = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  if (!["instructor", "teacher"].includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied' });
  }

  next();  // Allow to proceed
};
```

**4. Use in routes:**
```javascript
// courseRoutes.js
// Protect: Only authenticated users
router.post("/", protect, instructor, createCourse);
//                ↑         ↑
//            Authentication  Only instructors
```

**5. Frontend checks role:**
```javascript
// Conditional rendering
if (user.role === 'instructor') {
  return <TeacherDashboard />;
} else if (user.role === 'student') {
  return <StudentDashboard />;
}
```

**Role permissions:**
| Action | Student | Instructor | Admin |
|--------|---------|-----------|-------|
| Enroll courses | ✅ | ✅ | ✅ |
| Take quizzes | ✅ | ❌ | ✅ |
| Create courses | ❌ | ✅ | ✅ |
| Create quizzes | ❌ | ✅ | ✅ |
| View all users | ❌ | ❌ | ✅ |
| Delete users | ❌ | ❌ | ✅ |

---

### **Q7: How do you handle password security?**

**Answer:**

**Problem:** Never store plain-text passwords!

**Solution:** Use **bcryptjs**

**Process:**

**1. Hashing during registration:**
```javascript
// authController.js - register function
const salt = await bcrypt.genSalt(10);  // Generate salt
const hashedPassword = await bcrypt.hash(password, salt);  // Hash with salt

const user = await User.create({
  name,
  email,
  password: hashedPassword,  // Store hashed, not plain
  role
});
```

**2. Verifying during login:**
```javascript
// authController.js - login function
const user = await User.findOne({ email });

const isMatch = await bcrypt.compare(password, user.password);
//               ↑                            ↑
//         Compares plain             Stored hashed
//         password with hashed

if (!isMatch) {
  return res.status(400).json({ message: 'Invalid credentials' });
}

// Generate JWT token if match
const token = jwt.sign(...);
```

**Why bcryptjs?**
- **Secure hashing** - Uses bcrypt algorithm (cryptographically secure)
- **Salting** - Adds random data, prevents rainbow table attacks
- **Slow** - Intentionally slow to resist brute force attacks
- **Industry standard** - Used by major companies

**Security best practices:**
- ✅ Never log passwords
- ✅ Always hash before storing
- ✅ Use salt (10+ rounds recommended)
- ✅ Compare with bcrypt.compare(), not `===`
- ✅ Use HTTPS in production (protects in transit)
- ✅ Validate password strength (min 8 chars, mix of types)

---

## 💾 DATABASE & MODELS QUESTIONS

### **Q8: Explain the database schema for courses and enrollments.**

**Answer:**

**Course Schema:**
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  instructor: { type: ObjectId, ref: 'User' },  // Who created it
  category: String,
  googleMeetLink: String,
  lectures: [
    {
      title: String,
      description: String,
      videoUrl: String (YouTube URL),
      duration: Number,
      order: Number
    }
  ],
  materials: [{ type: ObjectId, ref: 'Materials' }],  // Course files
  enrolledStudents: [{ type: ObjectId, ref: 'User' }],  // Students in course
  isLocked: Boolean (default: false),  // Instructor can lock course
  createdAt: Date,
  updatedAt: Date
}
```

**Enrollment Schema:**
```javascript
{
  _id: ObjectId,
  student: { type: ObjectId, ref: 'User', required: true },
  course: { type: ObjectId, ref: 'Course', required: true },
  enrolledAt: Date (default: now),
  status: String (enum: ['active', 'completed', 'dropped']),
  enrolledCourses: [{ type: ObjectId, ref: 'Course' }]
}
```

**Relationship:**
```
User (Instructor)
  └─> Many Courses (taught)

User (Student)
  └─> Many Enrollments
      └─> One Course (each)

Course
  └─> One Instructor
  └─> Many Enrollments
  └─> Many Students
  └─> Many Lectures
  └─> Many Materials
```

**Data retrieval example:**
```javascript
// Get course with all students who enrolled
const course = await Course.findById(id)
  .populate('instructor', 'name email')  // Get instructor details
  .populate('enrolledStudents', 'name email role')  // Get student details
  .populate('materials');  // Get material details

// Result:
{
  _id: "...",
  title: "React Basics",
  instructor: { _id: "...", name: "John", email: "john@..." },
  enrolledStudents: [
    { _id: "...", name: "Alice", email: "alice@..." },
    { _id: "...", name: "Bob", email: "bob@..." }
  ],
  materials: [ { _id: "...", title: "Slides.pdf" } ]
}
```

---

### **Q9: Design a quiz submission system. How do you store and validate answers?**

**Answer:**

**Quiz Storage:**
```javascript
const quizSchema = {
  _id: ObjectId,
  title: String,
  course: { type: ObjectId, ref: 'Course' },
  questions: [
    {
      _id: ObjectId,
      questionText: String,
      options: [
        { text: String, isCorrect: Boolean }
      ],
      points: Number (default: 1)
    }
  ],
  passingScore: Number,
  attempts: [
    {
      student: ObjectId,
      score: Number,
      answers: [ {...} ],
      passed: Boolean,
      submittedAt: Date
    }
  ]
}
```

**Submission Process:**

**1. Frontend sends answers:**
```javascript
// TakeQuiz.jsx
const submitQuiz = async () => {
  const answers = [
    {
      questionId: "q1_id",
      selectedOptionId: "opt_b_id",
      selectedText: "React"
    },
    {
      questionId: "q2_id",
      selectedOptionId: "opt_a_id",
      selectedText: "Express"
    }
  ];

  const response = await axios.post(`/api/quizzes/${quizId}/submit`, {
    answers
  });
};
```

**2. Backend validates & grades:**
```javascript
// quizController.js
exports.submitQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    const { answers } = req.body;
    
    let score = 0;
    const gradedAnswers = [];

    // Grade each answer
    answers.forEach(studentAnswer => {
      const question = quiz.questions.find(
        q => q._id.toString() === studentAnswer.questionId
      );

      const correctOption = question.options.find(opt => opt.isCorrect);
      const isCorrect = studentAnswer.selectedOptionId === correctOption._id.toString();

      if (isCorrect) {
        score += question.points;
      }

      gradedAnswers.push({
        questionId: studentAnswer.questionId,
        selectedOption: studentAnswer.selectedOptionId,
        isCorrect: isCorrect,
        correctAnswer: correctOption._id
      });
    });

    // Check if passed
    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = (score / totalPoints) * 100;
    const passed = percentage >= quiz.passingScore;

    // Save attempt
    const submission = {
      student: req.user._id,
      score: score,
      percentage: percentage,
      answers: gradedAnswers,
      passed: passed,
      submittedAt: Date.now()
    };

    quiz.attempts.push(submission);
    await quiz.save();

    res.json({
      score,
      totalPoints,
      percentage,
      passed,
      results: gradedAnswers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**3. Frontend displays results:**
```javascript
// QuizResult.jsx
const QuizResult = ({ result }) => {
  return (
    <div>
      <h2>Quiz Results</h2>
      <p>Score: {result.score}/{result.totalPoints}</p>
      <p>Percentage: {result.percentage.toFixed(2)}%</p>
      <p>{result.passed ? "✅ Passed" : "❌ Failed"}</p>
      
      {result.results.map(answer => (
        <div key={answer.questionId}>
          <p style={answer.isCorrect ? "green" : "red"}>
            {answer.isCorrect ? "✓" : "✗"} Your answer
          </p>
        </div>
      ))}
    </div>
  );
};
```

---

## 🔌 API & ENDPOINTS QUESTIONS

### **Q10: Explain the API endpoint for creating a course. What validation is needed?**

**Answer:**

**Endpoint:**
```
POST /api/courses
Headers: Authorization: Bearer <jwt_token>
Body: {
  title: String (required),
  description: String (required),
  category: String (optional),
  googleMeetLink: String (optional)
}
```

**Backend Implementation:**
```javascript
// courseRoutes.js
router.post("/", protect, instructor, createCourse);
//           ↑         ↑        ↑
//        Route    Auth Check   Role Check

// courseController.js
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    // Validation 1: Check required fields
    if (!title || !description) {
      return res.status(400).json({
        message: 'Title and description are required'
      });
    }

    // Validation 2: Check field formats
    if (title.length > 100) {
      return res.status(400).json({
        message: 'Title cannot exceed 100 characters'
      });
    }

    if (title.length < 3) {
      return res.status(400).json({
        message: 'Title must be at least 3 characters'
      });
    }

    // Validation 3: Check if user is instructor
    if (!["instructor", "teacher"].includes(req.user.role)) {
      return res.status(403).json({
        message: 'Only instructors can create courses'
      });
    }

    // Create course
    const course = await Course.create({
      title: title.trim(),
      description: description.trim(),
      category,
      instructor: req.user._id,
      enrolledStudents: [],
      isLocked: false
    });

    // Populate instructor data
    await course.populate('instructor', 'name email');

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error creating course',
      error: error.message
    });
  }
};
```

**Validation checklist:**
- ✅ Required fields present
- ✅ Field length/format validation
- ✅ User authentication (JWT token valid)
- ✅ User authorization (role is instructor)
- ✅ Input sanitization (trim whitespace)
- ✅ No duplicate titles (optional)
- ✅ Database save success

**Error responses:**
```javascript
400 - Bad Request (validation failed)
401 - Unauthorized (no token or invalid)
403 - Forbidden (not instructor)
500 - Server Error (database error)
```

---

### **Q11: How do you handle file uploads in your project?**

**Answer:**

**Technology:** **Multer** (npm package for file uploads)

**Setup in middleware:**
```javascript
// uploadMiddleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/course-materials');
    
    // Create directory if not exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);  // Where to save file
  },
  filename: function (req, file, cb) {
    // Create unique filename: timestamp-originalname
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allow only certain types
  const allowedTypes = ['application/pdf', 'application/msword', 'text/plain'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);  // Accept
  } else {
    cb(new Error('Invalid file type'), false);  // Reject
  }
};

// Create multer instance
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },  // 10MB limit
  fileFilter: fileFilter
});

module.exports = upload;
```

**Use in routes:**
```javascript
// materialRoutes.js
const upload = require('../middleware/uploadMiddleware');

router.post(
  '/upload',
  protect,
  instructor,
  upload.single('file'),  // Single file upload
  uploadMaterial
);
```

**Controller:**
```javascript
// materialController.js
exports.uploadMaterial = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { courseId } = req.body;

    // Save metadata to database
    const material = await Material.create({
      title: req.file.originalname,
      fileUrl: `/uploads/course-materials/${req.file.filename}`,
      fileType: req.file.mimetype,
      course: courseId,
      uploadedBy: req.user._id,
      uploadedAt: Date.now()
    });

    res.json({
      success: true,
      material,
      downloadUrl: `/uploads/course-materials/${req.file.filename}`
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**Frontend upload:**
```javascript
// UploadMaterial.jsx
const handleUpload = async (e) => {
  const file = e.target.files[0];
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('courseId', courseId);

  try {
    const response = await axios.post('/api/materials/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
    
    toast.success('File uploaded successfully');
  } catch (error) {
    toast.error('Upload failed');
  }
};
```

---

## ⚛️ FRONTEND & REACT QUESTIONS

### **Q12: How do you handle state management in React? Explain with an example from your project.**

**Answer:**

**What is State Management?**
Managing data that changes over time (user input, API responses, UI toggles).

**Your approach:** **React Hooks** (useState, useEffect, useContext)

**Example 1: useState in Courses.jsx**
```javascript
const Courses = () => {
  // Local state for courses
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');

  // Fetch data on mount
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);  // Start loading
      try {
        const response = await axios.get('/api/courses');
        setCourses(response.data);  // Update state
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);  // Stop loading
      }
    };

    fetchCourses();
  }, []);  // Run once on mount

  // Create course function
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/courses', {
        title,
        description: content
      });
      
      setCourses([...courses, response.data]);  // Add to state
      setShowModal(false);  // Close modal
      setTitle('');  // Reset form
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {loading ? <Spinner /> : null}
      <button onClick={() => setShowModal(true)}>Create Course</button>
      
      {showModal && (
        <form onSubmit={handleCreateCourse}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Course Title"
          />
          <button type="submit">Create</button>
        </form>
      )}

      {courses.map(course => (
        <CourseCard key={course._id} course={course} />
      ))}
    </div>
  );
};
```

**Example 2: useState in TakeQuiz.jsx**
```javascript
const TakeQuiz = ({ quiz }) => {
  const [answers, setAnswers] = useState({});  // Store answers
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const handleSelectOption = (questionId, optionId) => {
    setAnswers({
      ...answers,
      [questionId]: optionId  // Store selected option per question
    });
  };

  const handleSubmitQuiz = async () => {
    try {
      const response = await axios.post(`/api/quizzes/${quiz._id}/submit`, {
        answers: Object.entries(answers).map(([qId, oId]) => ({
          questionId: qId,
          selectedOptionId: oId
        }))
      });

      setScore(response.data.score);
      setSubmitted(true);  // Show results
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {!submitted ? (
        <div>
          {quiz.questions.map(question => (
            <div key={question._id}>
              <p>{question.questionText}</p>
              {question.options.map(option => (
                <label key={option._id}>
                  <input
                    type="radio"
                    checked={answers[question._id] === option._id}
                    onChange={() => handleSelectOption(question._id, option._id)}
                  />
                  {option.text}
                </label>
              ))}
            </div>
          ))}
          <button onClick={handleSubmitQuiz}>Submit Quiz</button>
        </div>
      ) : (
        <div>
          <h2>Results: {score} points</h2>
        </div>
      )}
    </div>
  );
};
```

**State management best practices:**
- ✅ Use useState for individual component state
- ✅ Use useEffect for side effects (API calls, subscriptions)
- ✅ Lift state up when multiple components need it
- ✅ Use Context for global state (theme, auth user)
- ✅ Use custom hooks to reuse state logic

---

### **Q13: Explain React Router. How do you implement protected routes?**

**Answer:**

**What is React Router?**
Library for client-side navigation (SPA routing).

**Your implementation:**

**Setup in App.jsx:**
```javascript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

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
              <Layout />  {/* Sidebar, Navbar wrapper */}
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="courses" element={<Courses />} />
          <Route path="enrolled-courses" element={<EnrolledCourses />} />
          <Route path="quiz/:id" element={<TakeQuiz />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Not Found */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}
```

**ProtectedRoute Component:**
```javascript
// ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if token exists in localStorage
  const token = localStorage.getItem('token');

  if (!token) {
    // No token? Redirect to signin
    return <Navigate to="/signin" />;
  }

  // Token exists? Show the page
  return children;
};

export default ProtectedRoute;
```

**How it works:**

```
1. User visits /courses
   └─> React Router matches route
   └─> Found: ProtectedRoute component
   
2. ProtectedRoute checks token
   ├─> Token exists?
   │   ├─> Yes: Render children (<Layout><Courses /></Layout>)
   │   └─> No: <Navigate to="/signin" />
   
3. If redirected to /signin
   └─> SignIn form renders
   └─> User enters credentials
   └─> POST /api/auth/login
   └─> Token received
   └─> localStorage.setItem('token', token)
   └─> navigate('/dashboard')
   
4. Now /dashboard route is protected
   ├─> Check token
   └─> Token exists!
   └─> Render Dashboard
```

**Advanced routing:**
```javascript
// Dynamic routes
<Route path="/course/:id" element={<CourseView />} />

// Access route params
const CourseView = () => {
  const { id } = useParams();  // Get :id
  // Fetch course by id
};

// Nested routes (Outlet)
<Route path="/" element={<Layout />}>
  <Route path="dashboard" element={<Dashboard />} />
  <Route path="profile" element={<Profile />} />
  {/* These render inside Layout's <Outlet /> */}
</Route>

// Layout.jsx
<div className="layout">
  <Sidebar />
  <Outlet />  {/* Shows Dashboard or Profile based on route */}
</div>
```

---

### **Q14: How do you handle API calls with Axios? Explain interceptors.**

**Answer:**

**Setup in axios.js:**
```javascript
import axios from 'axios';
import { toast } from 'react-toastify';

const instance = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// REQUEST INTERCEPTOR
instance.interceptors.request.use(
  (config) => {
    // Before request is sent
    
    // 1. Add token to every request
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Log for debugging
    console.log('Request:', config.method.toUpperCase(), config.url);

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR
instance.interceptors.response.use(
  (response) => {
    // Response received successfully (2xx status)
    console.log('Response:', response.data);
    return response;
  },
  (error) => {
    // Error response (4xx, 5xx)

    // 1. Handle 401 (Unauthorized)
    if (error.response?.status === 401) {
      console.warn('Token expired or invalid');
      
      // Clear token and session
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Redirect to login
      window.location.href = '/signin';
      
      toast.error('Session expired. Please login again.');
    }

    // 2. Handle 403 (Forbidden)
    else if (error.response?.status === 403) {
      toast.error('You do not have permission to access this resource');
    }

    // 3. Handle 500 (Server Error)
    else if (error.response?.status === 500) {
      toast.error('Server error. Please try again later.');
    }

    // 4. Handle network error
    else if (!error.response) {
      toast.error('Network error. Check your internet connection.');
    }

    return Promise.reject(error);
  }
);

export default instance;
```

**Usage in components:**
```javascript
// SignIn.jsx
import axios from '../api/axios';

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post('/api/auth/login', {
      email,
      password
    });

    // Interceptor automatically:
    // 1. Adds token to header
    // 2. Logs the request
    // 3. Receives response

    localStorage.setItem('token', res.data.token);
    navigate('/dashboard');
    toast.success('Login successful');

  } catch (error) {
    // Interceptor automatically:
    // 1. Handles 401 (redirects to signin)
    // 2. Handles errors
    // 3. Shows toast

    console.error('Login failed:', error);
  }
};
```

**Interceptor flow:**

```
1. Component makes request
   └─> axios.post('/api/courses', data)

2. REQUEST INTERCEPTOR
   ├─> Get token from localStorage
   ├─> Add to header: Authorization: Bearer <token>
   ├─> Log request
   └─> Send request to backend

3. Backend processes
   └─> authMiddleware verifies token
   └─> Controller executes logic
   └─> Response sent (200, 400, 401, etc.)

4. RESPONSE INTERCEPTOR
   ├─> Check status code
   ├─> If 401:
   │   ├─> Clear token
   │   ├─> Redirect to /signin
   │   └─> Show error toast
   ├─> If success (2xx):
   │   └─> Return response
   └─> If error (4xx, 5xx):
       └─> Show error toast

5. Component receives response/error
   └─> Update state
   └─> Re-render
```

**Benefits:**
- ✅ Automatic token addition to every request
- ✅ Centralized error handling
- ✅ Automatic logout on token expiry
- ✅ Debugging via logs
- ✅ Consistent toast notifications

---

## 🎯 SCENARIO-BASED QUESTIONS

### **Q15: A student enrolls in a course, but they see "Access Denied" when trying to view materials. Debug this issue.**

**Answer:**

**Debugging steps:**

**1. Check Frontend (React):**
```javascript
// Check if material route exists
<Route path="/materials/:courseId" element={<CourseMaterials />} />

// Check ProtectedRoute
const token = localStorage.getItem('token');
console.log('Token exists:', !!token);

// Check user role
const user = JSON.parse(localStorage.getItem('user'));
console.log('User role:', user?.role);
```

**2. Check Network (Axios):**
```javascript
// Open browser DevTools → Network tab
// Check request headers
Authorization: Bearer <token>  // Should exist

// Check response status
// 401: Token invalid/expired
// 403: User not authorized
// 500: Server error
```

**3. Check Backend (Express):**
```javascript
// materialRoutes.js - Check route definition
router.get('/:courseId/materials', protect, getMaterials);
//                                  ↑
//                            middleware present?

// authMiddleware.js - Check token verification
const token = req.headers.authorization?.split(' ')[1];
console.log('Token from header:', token);

const decoded = jwt.verify(token, process.env.JWT_SECRET);
console.log('Decoded:', decoded);

const user = await User.findById(decoded.userId);
console.log('User found:', user);
```

**4. Check Database:**
```javascript
// Check if enrollment exists
db.enrollments.findOne({ 
  student: ObjectId("student_id"), 
  course: ObjectId("course_id") 
})

// If not found, student didn't enroll
// If found, enrollment is valid
```

**5. Common causes & fixes:**

| Issue | Cause | Fix |
|-------|-------|-----|
| 401 Error | Token expired | Have user login again |
| Token not in header | Axios interceptor not working | Check axios.js setup |
| 403 Forbidden | JWT_SECRET mismatch | Verify env variable |
| 404 Not Found | Wrong endpoint | Check route definition |
| Student not enrolled | Enrollment not created | Check enrollment endpoint |
| CORS error | Origin not allowed | Add frontend URL to CORS whitelist |

**Resolution checklist:**
- ✅ Verify token in localStorage
- ✅ Check network request has Authorization header
- ✅ Verify student is enrolled in course
- ✅ Check backend route exists and has `protect` middleware
- ✅ Verify JWT_SECRET is correct
- ✅ Check database for enrollment record

---

### **Q16: How would you add a feature for instructors to grade quiz submissions manually?**

**Answer:**

**Design: Manual Grading System**

**1. Database Schema updates:**
```javascript
// QuizSubmission.js
const submissionSchema = {
  _id: ObjectId,
  quiz: ObjectId,
  student: ObjectId,
  answers: [...],
  autoScore: Number,        // Auto-calculated score
  manualScore: Number,       // NEW: Manual override
  isManuallyGraded: Boolean, // NEW: Flag for manual grade
  gradedBy: ObjectId,        // NEW: Which instructor graded
  gradedAt: Date,            // NEW: When graded
  comment: String            // NEW: Feedback
}
```

**2. Backend - New Endpoint:**
```javascript
// quizRoutes.js
router.put(
  '/:submissionId/manual-grade',
  protect,
  instructor,
  manualGradeSubmission
);

// quizController.js
exports.manualGradeSubmission = async (req, res) => {
  try {
    const { score, comment } = req.body;
    const { submissionId } = req.params;

    // Validate
    if (typeof score !== 'number' || score < 0) {
      return res.status(400).json({ message: 'Invalid score' });
    }

    // Get submission
    const submission = await QuizSubmission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Verify instructor owns the course
    const quiz = await Quiz.findById(submission.quiz);
    if (quiz.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update submission
    submission.manualScore = score;
    submission.isManuallyGraded = true;
    submission.gradedBy = req.user._id;
    submission.gradedAt = Date.now();
    submission.comment = comment;

    await submission.save();

    res.json({
      success: true,
      message: 'Grade submitted',
      submission
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**3. Get submissions for grading:**
```javascript
// quizController.js
exports.getSubmissionsToGrade = async (req, res) => {
  try {
    const { quizId } = req.params;

    // Verify instructor
    const quiz = await Quiz.findById(quizId);
    if (quiz.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Get ungraded submissions
    const submissions = await QuizSubmission.find({
      quiz: quizId,
      isManuallyGraded: false
    })
      .populate('student', 'name email')
      .sort({ submittedAt: 1 });

    res.json(submissions);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// quizRoutes.js
router.get('/grade/:quizId', protect, instructor, getSubmissionsToGrade);
```

**4. Frontend - Grading Interface:**
```javascript
// QuizGrading.jsx
const QuizGrading = ({ quizId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [score, setScore] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await axios.get(`/api/quizzes/grade/${quizId}`);
      setSubmissions(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGradeSubmit = async () => {
    try {
      await axios.put(`/api/quizzes/${selectedSubmission._id}/manual-grade`, {
        score: parseInt(score),
        comment
      });

      toast.success('Grade submitted');
      fetchSubmissions();
      setSelectedSubmission(null);
      setScore('');
      setComment('');

    } catch (error) {
      toast.error('Error submitting grade');
    }
  };

  return (
    <div className="grading-interface">
      <h2>Grade Quiz Submissions</h2>

      <div className="submission-list">
        {submissions.map(sub => (
          <div
            key={sub._id}
            onClick={() => setSelectedSubmission(sub)}
            className="submission-card"
          >
            <p>{sub.student.name}</p>
            <p>Auto Score: {sub.autoScore}</p>
            <p>Status: Not Graded</p>
          </div>
        ))}
      </div>

      {selectedSubmission && (
        <div className="grading-form">
          <h3>Grade {selectedSubmission.student.name}'s submission</h3>

          <div>
            <label>Manual Score:</label>
            <input
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder="Enter score"
            />
          </div>

          <div>
            <label>Feedback/Comment:</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Provide feedback to student"
            />
          </div>

          <button onClick={handleGradeSubmit}>Submit Grade</button>
        </div>
      )}
    </div>
  );
};
```

**5. Display grades to student:**
```javascript
// QuizResult.jsx
const QuizResult = ({ submission }) => {
  return (
    <div>
      <h2>Quiz Results</h2>

      <p>Auto Score: {submission.autoScore}</p>

      {submission.isManuallyGraded && (
        <div className="manual-grade">
          <p style={{ color: 'blue' }}>
            Manual Grade: {submission.manualScore}
            (Graded by instructor)
          </p>
          <p>Feedback: {submission.comment}</p>
        </div>
      )}
    </div>
  );
};
```

---

### **Q17: Design a notification system for enrollment confirmation.**

**Answer:**

**Simple Email/Toast Notification:**

```javascript
// enrollController.js
exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user._id;

    // Check if already enrolled
    const existing = await Enrollment.findOne({
      student: studentId,
      course: courseId
    });

    if (existing) {
      return res.status(400).json({ message: 'Already enrolled' });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      enrolledAt: Date.now(),
      status: 'active'
    });

    // Add student to course
    await Course.findByIdAndUpdate(
      courseId,
      { $push: { enrolledStudents: studentId } }
    );

    // TODO: Send email notification
    // sendEmailNotification(req.user.email, courseId);

    res.json({
      success: true,
      message: 'Enrolled successfully',
      enrollment
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**Frontend Notification:**
```javascript
// Courses.jsx
const handleEnroll = async (courseId) => {
  try {
    const res = await axios.post(`/api/courses/${courseId}/enroll`);
    
    // Show toast notification
    toast.success('Enrolled successfully!', {
      position: "top-right",
      autoClose: 3000
    });

    // Update UI
    setCourses(courses.map(c => 
      c._id === courseId 
        ? { ...c, isEnrolled: true }
        : c
    ));

  } catch (error) {
    toast.error(error.response.data.message);
  }
};
```

---

## 📊 REAL-WORLD QUESTIONS

### **Q18: How would you scale this LMS to handle 10,000 concurrent users?**

**Answer:**

**Scalability improvements:**

**1. Database Optimization:**
```javascript
// Add indexes for common queries
db.users.createIndex({ email: 1 });  // Fast email lookup
db.courses.createIndex({ instructor: 1 });  // Fast instructor search
db.enrollments.createIndex({ student: 1, course: 1 });  // Unique combination
db.quizsubmissions.createIndex({ quiz: 1, student: 1 });  // Quiz performance
```

**2. Caching:**
```javascript
// Add Redis for caching
const redis = require('redis');
const client = redis.createClient();

// Cache course data
exports.getCourses = async (req, res) => {
  try {
    // Check cache first
    const cached = await client.get('courses:all');
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // If cache miss, query database
    const courses = await Course.find();

    // Store in cache for 1 hour
    await client.setEx('courses:all', 3600, JSON.stringify(courses));

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**3. Load Balancing:**
```
          Users
            ↓
    Nginx (Load Balancer)
    ↙        ↓         ↘
Server1  Server2  Server3
  ↓         ↓         ↓
  ←── MongoDB ──→
```

**4. Database Replication:**
```javascript
// MongoDB Replica Set
// Primary: Writes
// Secondary 1: Reads + Backup
// Secondary 2: Reads + Backup
```

**5. CDN for Static Files:**
```
Frontend assets (images, CSS, JS)
└─> CloudFlare/AWS CloudFront
    └─> Served from nearest location
```

**6. Async Processing:**
```javascript
// Use message queues for heavy tasks
const queue = require('bull');
const emailQueue = new queue('emails');

// Send email asynchronously
emailQueue.add({ userId,email }, { delay: 1000 });

emailQueue.process(async (job) => {
  await sendEmail(job.data.email);
});
```

**7. Database Sharding:**
```javascript
// Split users by region
Shard 1: Europe (EU MongoDB)
Shard 2: Asia (Asia MongoDB)
Shard 3: Americas (US MongoDB)

// Route based on user location
```

---

### **Q19: What security vulnerabilities exist in your project, and how would you fix them?**

**Answer:**

| Vulnerability | Current | Risk | Fix |
|---|---|---|---|
| **No HTTPS** | HTTP only | Man-in-middle attacks | Use HTTPS in production |
| **Password weak** | Min 8 chars | Brute force | Force: uppercase, numbers, special chars |
| **CORS open** | localhost:5173 | XSS attacks | Set specific origins |
| **No rate limiting** | Unlimited requests | Brute force/DDoS | Add express-rate-limit |
| **No input validation** | Some fields | SQL/NoSQL injection | Validate all inputs |
| **JWT stored plainly** | localStorage | XSS can steal it | Use HttpOnly cookies |
| **No CSRF protection** | Missing | CSRF attacks | Add CSRF tokens |
| **Env variables exposed** | Not shown | Secret leak | Use .env + .gitignore |
| **No encryption** | Plain passwords | Data breach | Encrypt sensitive fields |
| **No audit logs** | Missing | Can't track issues | Log all actions |

**Example fixes:**

**1. Rate Limiting:**
```javascript
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,  // 5 attempts per window
  message: 'Too many login attempts, try later'
});

router.post('/login', loginLimiter, login);
```

**2. Input Validation:**
```javascript
const { body, validationResult } = require('express-validator');

router.post('/register',
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('name').trim().notEmpty(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Continue...
  }
);
```

**3. Helmet.js (Security headers):**
```javascript
const helmet = require('helmet');
app.use(helmet());  // Adds security headers
```

---

### **Q20: How would you implement a discussion forum for each course?**

**Answer:**

**Database Schema:**
```javascript
// Forum Thread
const threadSchema = {
  _id: ObjectId,
  course: ObjectId,
  title: String,
  description: String,
  author: ObjectId,
  createdAt: Date,
  updatedAt: Date,
  replies: [ObjectId]  // ref: Reply
}

// Forum Reply
const replySchema = {
  _id: ObjectId,
  thread: ObjectId,
  author: ObjectId,
  content: String,
  likes: [ObjectId],  // Users who liked
  createdAt: Date
}
```

**Backend:**
```javascript
// forumRoutes.js
router.post('/:courseId/threads', protect, createThread);
router.get('/:courseId/threads', protect, getThreads);
router.post('/:threadId/reply', protect, addReply);
router.put('/:replyId/like', protect, likeReply);

// forumController.js
exports.createThread = async (req, res) => {
  const { title, description } = req.body;

  const thread = await Thread.create({
    course: req.params.courseId,
    title,
    description,
    author: req.user._id
  });

  res.json(thread);
};

exports.addReply = async (req, res) => {
  const { content } = req.body;

  const reply = await Reply.create({
    thread: req.params.threadId,
    author: req.user._id,
    content
  });

  // Add to thread
  await Thread.findByIdAndUpdate(
    req.params.threadId,
    { $push: { replies: reply._id } }
  );

  res.json(reply);
};
```

**Frontend:**
```javascript
// CourseForum.jsx
const CourseForum = ({ courseId }) => {
  const [threads, setThreads] = useState([]);
  const [newThreadTitle, setNewThreadTitle] = useState('');

  const handleCreateThread = async () => {
    const res = await axios.post(`/api/courses/${courseId}/threads`, {
      title: newThreadTitle,
      description: ''
    });

    setThreads([...threads, res.data]);
  };

  return (
    <div>
      <input
        value={newThreadTitle}
        onChange={(e) => setNewThreadTitle(e.target.value)}
        placeholder="Start a discussion..."
      />
      <button onClick={handleCreateThread}>Post</button>

      {threads.map(thread => (
        <div key={thread._id} className="thread">
          <h3>{thread.title}</h3>
          <p>by {thread.author.name}</p>
          <Replies threadId={thread._id} />
        </div>
      ))}
    </div>
  );
};
```

---

## 📝 SUMMARY & QUICK REFERENCE

| Topic | Key Points |
|-------|-----------|
| **Architecture** | MVC pattern, 3-tier (Presentation, Application, Data) |
| **Authentication** | JWT tokens, 24h expiry, stored in localStorage |
| **Authorization** | Role-based (Student, Instructor, Admin) via middleware |
| **Database** | MongoDB with Mongoose ORM, 7 models |
| **API** | RESTful, 40+ endpoints, proper HTTP methods |
| **Frontend State** | React hooks (useState, useEffect), Context for global |
| **Routing** | React Router with protected routes |
| **File Upload** | Multer middleware, stored in /uploads |
| **Security** | bcrypt password hashing, JWT verification, CORS |
| **Scalability** | Caching, load balancing, database indexing |

---

### **Final Tips for Review:**

✅ **Know your code** - Be able to explain any file  
✅ **Understand flow** - Trace request from frontend to database  
✅ **Know trade-offs** - Why you chose certain technologies  
✅ **Prepare examples** - Have concrete examples ready  
✅ **Admit limitations** - Don't BS, say "I would improve..."  
✅ **Ask clarifying questions** - Take your time understanding  
✅ **Code quality** - Mention error handling, validation, security  
✅ **Testing mindset** - Show you think about edge cases  

**All the best for your review!** 🚀
