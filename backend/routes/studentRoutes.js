const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getDashboardStats, getMyAttendance, submitAttendanceRequest } = require("../controllers/studentController");

router.use(authMiddleware);

router.get("/dashboard", getDashboardStats);
router.get("/attendance", getMyAttendance);
router.post("/request", submitAttendanceRequest);

module.exports = router;