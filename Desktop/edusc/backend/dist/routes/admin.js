"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Protected routes - only accessible by admins
router.use(auth_1.auth);
router.use((0, auth_1.checkRole)(["admin"]));
// Get admin dashboard data
router.get("/dashboard", async (req, res) => {
    try {
        // Mock data for now
        const dashboardData = {
            totalStudents: 150,
            totalTeachers: 15,
            totalClasses: 20,
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
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching dashboard data" });
    }
});
exports.default = router;
