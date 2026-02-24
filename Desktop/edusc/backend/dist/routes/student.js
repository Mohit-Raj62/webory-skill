"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Protected routes - only accessible by students
router.use(auth_1.auth);
router.use((0, auth_1.checkRole)(["student"]));
// Get student dashboard data
router.get("/dashboard", async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        // Mock data for now - replace with actual database queries
        const dashboardData = {
            overallGrade: 85,
            pendingAssignments: 3,
            attendanceRate: 92,
            upcomingClasses: [
                { subject: "Mathematics", time: "10:00 AM", room: "Room 101" },
                { subject: "Physics", time: "11:30 AM", room: "Room 203" },
            ],
        };
        res.json(dashboardData);
    }
    catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ message: "Error fetching dashboard data" });
    }
});
// Get student grades
router.get("/grades", async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        // Mock data for now - replace with actual database queries
        const grades = [
            {
                _id: "1",
                subject: "Mathematics",
                assignment: "Algebra Test",
                score: 85,
                maxScore: 100,
                feedback: "Good work!",
                date: new Date().toISOString(),
            },
        ];
        res.json(grades);
    }
    catch (error) {
        console.error("Error fetching grades:", error);
        res.status(500).json({ message: "Error fetching grades" });
    }
});
// Get student assignments
router.get("/assignments", async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        // Mock data for now - replace with actual database queries
        const assignments = [
            {
                _id: "1",
                title: "Algebra Homework",
                description: "Complete exercises 1-10",
                dueDate: new Date().toISOString(),
                status: "pending",
            },
        ];
        res.json(assignments);
    }
    catch (error) {
        console.error("Error fetching assignments:", error);
        res.status(500).json({ message: "Error fetching assignments" });
    }
});
// Get student attendance
router.get("/attendance", async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        // Mock data for now - replace with actual database queries
        const attendance = {
            present: 15,
            absent: 2,
            late: 1,
            excused: 1,
        };
        res.json(attendance);
    }
    catch (error) {
        console.error("Error fetching attendance:", error);
        res.status(500).json({ message: "Error fetching attendance" });
    }
});
exports.default = router;
