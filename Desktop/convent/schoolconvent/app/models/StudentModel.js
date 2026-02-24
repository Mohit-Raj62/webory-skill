// Student Data Model
const StudentModel = {
  // Student Profile Information
  profile: {
    id: String, // Student ID (e.g., STD2024001)
    authId: String, // Reference to AuthModel user.id
    name: String, // Full name
    email: String, // Email address
    phone: String, // Contact number
    class: String, // Current class (e.g., Class XI-A)
    rollNo: String, // Roll number
    section: String, // Section
    photoUrl: String, // Profile photo URL
    dateOfBirth: Date, // Date of birth
    gender: String, // Gender
    status: String, // Account status (active/inactive)
    lastLogin: Date, // Last login timestamp
    address: {
      // Address information
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    parentInfo: {
      // Parent/Guardian information
      name: String,
      relation: String,
      phone: String,
      email: String,
    },
  },

  // Academic Information
  academic: {
    currentClass: String, // Current class
    section: String, // Section
    rollNo: String, // Roll number
    admissionDate: Date, // Date of admission
    previousSchool: String, // Previous school (if any)
    subjects: [String], // Enrolled subjects
    classTeacher: String, // Class teacher ID
  },

  // Attendance Records
  attendance: {
    id: String, // Unique attendance record ID
    studentId: String, // Reference to student
    date: Date, // Date of attendance
    status: Boolean, // true for present, false for absent
    subject: String, // Subject name
    teacherId: String, // Teacher ID
    remarks: String, // Any remarks
  },

  // Assignment Submissions
  assignments: {
    id: String, // Unique submission ID
    studentId: String, // Reference to student
    assignmentId: String, // Reference to assignment
    subject: String, // Subject name
    submissionDate: Date, // Date of submission
    status: String, // Status (submitted/late/not submitted)
    marks: Number, // Marks obtained (if graded)
    feedback: String, // Teacher's feedback
    attachments: [String], // URLs of submitted files
  },

  // Exam Results
  results: {
    id: String, // Unique result ID
    studentId: String, // Reference to student
    examType: String, // Type of exam (unit test/midterm/final)
    examDate: Date, // Date of exam
    subject: String, // Subject name
    marks: Number, // Marks obtained
    totalMarks: Number, // Total marks
    grade: String, // Grade
    remarks: String, // Teacher's remarks
  },

  // Fee Information
  fees: {
    id: String, // Unique fee record ID
    studentId: String, // Reference to student
    amount: Number, // Fee amount
    dueDate: Date, // Due date
    status: String, // Status (paid/pending/overdue)
    paymentDate: Date, // Date of payment
    paymentMethod: String, // Payment method
    receiptNo: String, // Receipt number
  },
};

export default StudentModel;
