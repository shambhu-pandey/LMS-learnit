export default function TeacherDashboard() {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold">Teacher Dashboard</h2>
        <p className="mt-2">Manage your courses, view student progress, and assign tasks.</p>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-500 text-white rounded">Total Courses: 5</div>
          <div className="p-4 bg-green-500 text-white rounded">Students Enrolled: 150</div>
        </div>
      </div>
    );
  }
  