// Mock Data Store
const mockData = {
  // Auth Data
  auth: {
    users: [
      {
        id: "AUTH001",
        email: "teacher@school.com",
        password: "hashed_password_1",
        role: "teacher",
        status: "active",
        lastLogin: new Date(),
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date(),
      },
      {
        id: "AUTH002",
        email: "student@school.com",
        password: "hashed_password_2",
        role: "student",
        status: "active",
        lastLogin: new Date(),
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date(),
      },
    ],
    sessions: [],
    passwordResets: [],
    loginHistory: [],
  },

  // Teacher Data
  teachers: [
    {
      profile: {
        id: "TCH001",
        authId: "AUTH001",
        name: "Dr. Sarah Johnson",
        email: "teacher@school.com",
        phone: "1234567890",
        department: "Science",
        subjects: ["Physics", "Chemistry"],
        photoUrl: "https://example.com/teacher1.jpg",
        joiningDate: new Date("2020-06-01"),
        qualification: "Ph.D. in Physics",
        experience: 10,
        status: "active",
        lastLogin: new Date(),
      },
      schedule: [
        {
          id: "SCH001",
          teacherId: "TCH001",
          class: "Class XI-A",
          subject: "Physics",
          day: "Monday",
          startTime: "09:00",
          endTime: "10:00",
          room: "101",
          academicYear: "2024-2025",
        },
      ],
      assignments: [],
      attendance: [],
      announcements: [],
      results: [],
    },
  ],

  // Student Data
  students: [
    {
      profile: {
        id: "STD001",
        authId: "AUTH002",
        name: "John Smith",
        email: "student@school.com",
        phone: "9876543210",
        class: "Class XI-A",
        rollNo: "XI-A-001",
        section: "A",
        photoUrl: "https://example.com/student1.jpg",
        dateOfBirth: new Date("2006-05-15"),
        gender: "Male",
        status: "active",
        lastLogin: new Date(),
        address: {
          street: "123 School Street",
          city: "Education City",
          state: "State",
          pincode: "123456",
        },
        parentInfo: {
          name: "Mr. Smith",
          relation: "Father",
          phone: "9876543211",
          email: "parent@email.com",
        },
      },
      academic: {
        currentClass: "Class XI-A",
        section: "A",
        rollNo: "XI-A-001",
        admissionDate: new Date("2023-06-01"),
        previousSchool: "Previous School",
        subjects: ["Physics", "Chemistry", "Mathematics"],
        classTeacher: "TCH001",
      },
      attendance: [],
      assignments: [],
      results: [],
      fees: [],
    },
  ],

  // Class Data
  classes: [
    {
      info: {
        id: "CLS001",
        name: "Class XI-A",
        section: "A",
        academicYear: "2024-2025",
        classTeacher: "TCH001",
        roomNo: "101",
        capacity: 40,
        currentStrength: 35,
      },
      schedule: [
        {
          id: "CLSSCH001",
          classId: "CLS001",
          day: "Monday",
          periods: [
            {
              periodNo: 1,
              startTime: "09:00",
              endTime: "10:00",
              subject: "Physics",
              teacherId: "TCH001",
              roomNo: "101",
            },
          ],
        },
      ],
      subjects: [],
      students: [],
      events: [],
      announcements: [],
      performance: [],
    },
  ],
};

// Helper functions to simulate database operations
const mockDB = {
  // Auth operations
  auth: {
    findUserByEmail: (email) =>
      mockData.auth.users.find((user) => user.email === email),
    findUserById: (id) => mockData.auth.users.find((user) => user.id === id),
    createUser: (userData) => {
      const newUser = {
        ...userData,
        id: `AUTH${mockData.auth.users.length + 1}`,
      };
      mockData.auth.users.push(newUser);
      return newUser;
    },
  },

  // Teacher operations
  teachers: {
    findById: (id) =>
      mockData.teachers.find((teacher) => teacher.profile.id === id),
    findByAuthId: (authId) =>
      mockData.teachers.find((teacher) => teacher.profile.authId === authId),
    create: (teacherData) => {
      const newTeacher = {
        ...teacherData,
        profile: {
          ...teacherData.profile,
          id: `TCH${mockData.teachers.length + 1}`,
        },
      };
      mockData.teachers.push(newTeacher);
      return newTeacher;
    },
  },

  // Student operations
  students: {
    findById: (id) =>
      mockData.students.find((student) => student.profile.id === id),
    findByAuthId: (authId) =>
      mockData.students.find((student) => student.profile.authId === authId),
    create: (studentData) => {
      const newStudent = {
        ...studentData,
        profile: {
          ...studentData.profile,
          id: `STD${mockData.students.length + 1}`,
        },
      };
      mockData.students.push(newStudent);
      return newStudent;
    },
  },

  // Class operations
  classes: {
    findById: (id) => mockData.classes.find((cls) => cls.info.id === id),
    create: (classData) => {
      const newClass = {
        ...classData,
        info: { ...classData.info, id: `CLS${mockData.classes.length + 1}` },
      };
      mockData.classes.push(newClass);
      return newClass;
    },
  },
};

export default mockDB;
