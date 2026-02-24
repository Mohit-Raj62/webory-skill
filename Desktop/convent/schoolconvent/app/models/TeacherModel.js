// Teacher Data Model
const TeacherModel = {
  // Teacher Profile Information
  profile: {
    id: String, // Teacher ID (e.g., TCH20240423)
    authId: String, // Reference to AuthModel user.id
    name: String, // Full name
    email: String, // Email address
    phone: String, // Contact number
    department: String, // Department name
    subjects: [String], // Array of subjects taught
    photoUrl: String, // Profile photo URL
    joiningDate: Date, // Date of joining
    qualification: String, // Educational qualification
    experience: Number, // Years of experience
    status: String, // Account status (active/inactive)
    lastLogin: Date, // Last login timestamp
  },

  // Class Schedule
  schedule: {
    id: String, // Unique schedule ID
    teacherId: String, // Reference to teacher
    class: String, // Class name (e.g., Class XI-A)
    subject: String, // Subject name
    day: String, // Day of the week
    startTime: String, // Class start time
    endTime: String, // Class end time
    room: String, // Room/Lab number
    academicYear: String, // Current academic year
  },

  // Assignments
  assignments: {
    id: String, // Unique assignment ID
    teacherId: String, // Reference to teacher
    subject: String, // Subject name
    title: String, // Assignment title
    description: String, // Detailed description
    dueDate: Date, // Submission deadline
    totalStudents: Number, // Total students in class
    submissions: Number, // Number of submissions received
    status: String, // Status (active/completed)
    createdAt: Date, // Creation date
  },

  // Attendance Records
  attendance: {
    id: String, // Unique attendance record ID
    teacherId: String, // Reference to teacher
    class: String, // Class name
    subject: String, // Subject name
    date: Date, // Date of attendance
    students: [
      {
        // Array of student attendance
        studentId: String,
        name: String,
        rollNo: String,
        status: Boolean, // true for present, false for absent
      },
    ],
    totalPresent: Number,
    totalAbsent: Number,
  },

  // Announcements
  announcements: {
    id: String, // Unique announcement ID
    teacherId: String, // Reference to teacher
    title: String, // Announcement title
    message: String, // Detailed message
    date: Date, // Announcement date
    priority: String, // Priority level (high/medium/low)
    targetClass: String, // Target class (if specific)
    status: String, // Status (active/archived)
  },

  // Student Results
  results: {
    id: String, // Unique result ID
    teacherId: String, // Reference to teacher
    class: String, // Class name
    subject: String, // Subject name
    examType: String, // Type of exam (unit test/midterm/final)
    examDate: Date, // Date of exam
    students: [
      {
        // Array of student results
        studentId: String,
        name: String,
        rollNo: String,
        marks: Number,
        grade: String,
        remarks: String,
      },
    ],
    totalMarks: Number,
    passingMarks: Number,
  },
};

export default TeacherModel;
