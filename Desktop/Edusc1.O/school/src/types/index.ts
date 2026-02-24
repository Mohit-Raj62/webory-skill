export type UserRole = "admin" | "teacher" | "student" | "parent";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  profileImage?: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  date: string;
  status: "present" | "absent" | "late";
  markedBy: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  classId: string;
  teacherId: string;
  attachments?: string[];
}

export interface Timetable {
  id: string;
  classId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  subject: string;
  teacherId: string;
}

export interface Grade {
  id: string;
  studentId: string;
  subject: string;
  marks: number;
  totalMarks: number;
  term: string;
  academicYear: string;
}

export interface Fee {
  id: string;
  studentId: string;
  amount: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
  paymentDate?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}
