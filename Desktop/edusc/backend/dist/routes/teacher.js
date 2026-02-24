"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Protected routes - only accessible by teachers
router.use(auth_1.auth);
router.use((0, auth_1.checkRole)(["teacher"]));
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
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching dashboard data" });
    }
});
exports.default = router;
