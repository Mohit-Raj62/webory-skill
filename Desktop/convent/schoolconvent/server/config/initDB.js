const User = require("../models/User");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const Class = require("../models/Class");
const bcrypt = require("bcryptjs");

const initializeDB = async () => {
  try {
    console.log("Starting database initialization...");

    // Check if admin user exists
    const adminExists = await User.findOne({ role: "admin" });
    if (!adminExists) {
      console.log("Creating admin user...");
      const adminPassword = await bcrypt.hash("admin123", 10);
      const adminUser = new User({
        email: "admin@school.com",
        password: adminPassword,
        role: "admin",
        status: "active",
      });
      await adminUser.save();
      console.log("Admin user created successfully");
    }

    // Check if test teacher exists
    const teacherExists = await User.findOne({ email: "teacher@school.com" });
    if (!teacherExists) {
      console.log("Creating test teacher...");
      const teacherPassword = await bcrypt.hash("teacher123", 10);
      const teacherUser = new User({
        email: "teacher@school.com",
        password: teacherPassword,
        role: "teacher",
        status: "active",
      });
      await teacherUser.save();

      const teacher = new Teacher({
        authId: teacherUser._id,
        name: "Dr. Sarah Johnson",
        email: "teacher@school.com",
        phone: "1234567890",
        department: "Science",
        subjects: ["Physics", "Chemistry"],
        joiningDate: new Date("2020-06-01"),
        qualification: "Ph.D. in Physics",
        experience: 10,
      });
      await teacher.save();
      console.log("Test teacher created successfully");
    }

    // Check if test student exists
    const studentExists = await User.findOne({ email: "student@school.com" });
    if (!studentExists) {
      console.log("Creating test student...");
      const studentPassword = await bcrypt.hash("student123", 10);
      const studentUser = new User({
        email: "student@school.com",
        password: studentPassword,
        role: "student",
        status: "active",
      });
      await studentUser.save();

      const student = new Student({
        authId: studentUser._id,
        name: "John Smith",
        email: "student@school.com",
        phone: "9876543210",
        class: "Class XI-A",
        rollNo: "XI-A-001",
        section: "A",
        dateOfBirth: new Date("2006-05-15"),
        gender: "Male",
        academic: {
          currentClass: "Class XI-A",
          section: "A",
          rollNo: "XI-A-001",
          admissionDate: new Date("2023-06-01"),
          subjects: ["Physics", "Chemistry", "Mathematics"],
        },
      });
      await student.save();
      console.log("Test student created successfully");
    }

    // Check if test class exists
    const classExists = await Class.findOne({ name: "Class XI-A" });
    if (!classExists) {
      console.log("Creating test class...");
      const teacher = await Teacher.findOne({ email: "teacher@school.com" });
      const student = await Student.findOne({ email: "student@school.com" });

      if (!teacher || !student) {
        throw new Error(
          "Required teacher or student not found for class creation"
        );
      }

      const classData = new Class({
        name: "Class XI-A",
        section: "A",
        academicYear: "2024-2025",
        classTeacher: teacher._id,
        roomNo: "101",
        capacity: 40,
        currentStrength: 1,
        students: [
          {
            studentId: student._id,
            rollNo: student.rollNo,
            name: student.name,
            admissionDate: student.academic.admissionDate,
            status: "active",
          },
        ],
      });
      await classData.save();
      console.log("Test class created successfully");
    }

    console.log("Database initialization completed successfully");
    return true;
  } catch (error) {
    console.error("Error initializing database:", error);
    throw new Error(`Database initialization failed: ${error.message}`);
  }
};

module.exports = initializeDB;
