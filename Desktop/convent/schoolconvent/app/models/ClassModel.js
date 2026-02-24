// Class Data Model
const ClassModel = {
  // Class Information
  info: {
    id: String, // Class ID (e.g., CLS2024XI-A)
    name: String, // Class name (e.g., Class XI-A)
    section: String, // Section
    academicYear: String, // Academic year
    classTeacher: String, // Class teacher ID
    roomNo: String, // Room number
    capacity: Number, // Maximum capacity
    currentStrength: Number, // Current number of students
  },

  // Class Schedule
  schedule: {
    id: String, // Unique schedule ID
    classId: String, // Reference to class
    day: String, // Day of the week
    periods: [
      {
        // Array of periods
        periodNo: Number,
        startTime: String,
        endTime: String,
        subject: String,
        teacherId: String,
        roomNo: String,
      },
    ],
  },

  // Subject Information
  subjects: {
    id: String, // Unique subject ID
    classId: String, // Reference to class
    name: String, // Subject name
    code: String, // Subject code
    teacherId: String, // Teacher ID
    credits: Number, // Credit hours
    description: String, // Subject description
    syllabus: String, // Syllabus URL or content
  },

  // Student List
  students: {
    id: String, // Unique record ID
    classId: String, // Reference to class
    studentId: String, // Student ID
    rollNo: String, // Roll number
    name: String, // Student name
    admissionDate: Date, // Date of admission to class
    status: String, // Status (active/transferred)
  },

  // Class Events
  events: {
    id: String, // Unique event ID
    classId: String, // Reference to class
    title: String, // Event title
    description: String, // Event description
    date: Date, // Event date
    type: String, // Event type (exam/activity/meeting)
    status: String, // Status (upcoming/completed)
  },

  // Class Announcements
  announcements: {
    id: String, // Unique announcement ID
    classId: String, // Reference to class
    title: String, // Announcement title
    message: String, // Announcement message
    date: Date, // Announcement date
    priority: String, // Priority level
    status: String, // Status (active/archived)
  },

  // Class Performance
  performance: {
    id: String, // Unique performance record ID
    classId: String, // Reference to class
    examType: String, // Type of exam
    examDate: Date, // Date of exam
    subject: String, // Subject name
    averageMarks: Number, // Class average
    highestMarks: Number, // Highest marks
    lowestMarks: Number, // Lowest marks
    passPercentage: Number, // Pass percentage
  },
};

export default ClassModel;
