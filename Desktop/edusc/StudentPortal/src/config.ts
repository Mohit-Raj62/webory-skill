export const API_URL = "http://192.168.20.190:5000"; // Using your local IP address

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: "/api/auth/login",
    SIGNUP: "/api/auth/signup",
    ME: "/api/auth/me",
  },
  // Student endpoints
  STUDENT: {
    DASHBOARD: "/api/student/dashboard",
    GRADES: "/api/student/grades",
    ASSIGNMENTS: "/api/student/assignments",
    SCHEDULE: "/api/student/schedule",
    PAYMENTS: "/api/student/payments",
    ATTENDANCE: "/api/student/attendance",
  },
  // Teacher endpoints
  TEACHER: {
    DASHBOARD: "/api/teacher/dashboard",
    CLASSES: "/api/teacher/classes",
    STUDENTS: "/api/teacher/students",
    ASSIGNMENTS: "/api/teacher/assignments",
    GRADES: "/api/teacher/grades",
    ATTENDANCE: "/api/teacher/attendance",
  },
  ADMIN: {
    DASHBOARD: "/api/admin/dashboard",
    USERS: "/api/admin/users",
    CLASSES: "/api/admin/classes",
    SETTINGS: "/api/admin/settings",
  },
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string) => `${API_URL}${endpoint}`;
