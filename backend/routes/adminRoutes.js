const express = require('express');
const router = express.Router();
const { getAdminAllAttendance, getAdminStats } = require('../controllers/attendanceController');
const { addStudent, getStudents, addSubject, getSubjects, getSettings, updateSettings, getAdmins, updateAdmin, deleteAdmin } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.use(authMiddleware, adminMiddleware);

// Admins (SuperAdmin only inside controller check)
router.get('/admins', getAdmins);
router.put('/admins/:id', updateAdmin);
router.delete('/admins/:id', deleteAdmin);

// Students
router.post('/students', addStudent);
router.get('/students', getStudents);

// Subjects
router.post('/subjects', addSubject);
router.get('/subjects', getSubjects);

// Settings
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

// Attendance
router.get('/attendance', getAdminAllAttendance);
router.get('/stats', getAdminStats);

module.exports = router;