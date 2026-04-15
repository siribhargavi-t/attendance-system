const express = require("express");
const router = express.Router();
const leaveController = require("../controllers/leaveController");

// POST /api/leave - Create a new leave request
router.post("/", leaveController.createLeave);

// GET /api/leave/student/:email - Get leaves by student
router.get("/student/:studentEmail", leaveController.getLeavesByStudent);

// GET /api/leave - Faculty view all leave requests
router.get("/", leaveController.getAllLeaves);

// PUT /api/leave/:id - Update leave status (approve/reject)
router.put("/:id", leaveController.updateLeaveStatus);

module.exports = router;