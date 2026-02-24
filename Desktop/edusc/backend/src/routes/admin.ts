import express from "express";
import { auth, checkRole } from "../middleware/auth";
import User from "../models/User";

const router = express.Router();

// Protected routes - only accessible by admins
router.use(auth);
router.use(checkRole(["admin"]));

// Get admin dashboard data
router.get("/dashboard", async (req, res) => {
  try {
    // Get actual counts from database
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalTeachers = await User.countDocuments({ role: "teacher" });
    const totalAdmins = await User.countDocuments({ role: "admin" });

    const dashboardData = {
      totalStudents,
      totalTeachers,
      totalAdmins,
      recentActivities: [
        {
          type: "New Student Registration",
          time: "10:00 AM",
          details: "John Doe registered",
        },
        {
          type: "New Teacher Added",
          time: "11:30 AM",
          details: "Jane Smith joined",
        },
      ],
    };
    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
});

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Create new user
router.post("/users", async (req, res) => {
  try {
    const { email, password, role, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      email,
      password,
      role,
      firstName,
      lastName,
    });

    await user.save();
    res.status(201).json({
      message: "User created successfully",
      user: { ...user.toJSON(), password: undefined },
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
});

// Update user
router.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { email, role, firstName, lastName } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.email = email || user.email;
    user.role = role || user.role;
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;

    await user.save();
    res.json({
      message: "User updated successfully",
      user: { ...user.toJSON(), password: undefined },
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
});

// Delete user
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

// Get system settings
router.get("/settings", async (req, res) => {
  try {
    // Mock settings for now
    const settings = {
      schoolName: "EduSC",
      academicYear: "2024-2025",
      semester: "Spring",
      registrationEnabled: true,
      maintenanceMode: false,
    };
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching settings" });
  }
});

// Update system settings
router.put("/settings", async (req, res) => {
  try {
    const {
      schoolName,
      academicYear,
      semester,
      registrationEnabled,
      maintenanceMode,
    } = req.body;

    // Mock update for now
    const settings = {
      schoolName,
      academicYear,
      semester,
      registrationEnabled,
      maintenanceMode,
    };

    res.json({ message: "Settings updated successfully", settings });
  } catch (error) {
    res.status(500).json({ message: "Error updating settings" });
  }
});

export default router;
