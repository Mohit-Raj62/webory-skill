import express from "express";
import { auth, checkRole } from "../middleware/auth";

const router = express.Router();

// Protected routes - only accessible by teachers
router.use(auth);
router.use(checkRole(["teacher"]));

// Get teacher dashboard data
router.get("/dashboard", async (req, res) => {
  try {
    // Mock data for now
    const dashboardData = {
      totalStudents: 45,
      activeClasses: 4,
      pendingAssignments: 12,
      upcomingClasses: [
        {
          subject: "Mathematics",
          time: "10:00 AM",
          room: "Room 101",
          students: 25,
        },
        {
          subject: "Physics",
          time: "11:30 AM",
          room: "Room 203",
          students: 20,
        },
      ],
    };
    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
});

export default router;
