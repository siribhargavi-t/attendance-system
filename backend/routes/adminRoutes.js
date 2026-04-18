const express = require('express');
const router = express.Router();
const { getAdminAllAttendance, getAdminStats, getAttendanceBySession, correctAttendance } = require('../controllers/attendanceController');
const { addStudent, getStudents, updateStudent, deleteStudent, addSubject, getSubjects, getSettings, updateSettings, getAdmins, updateAdmin, deleteAdmin, getAttendanceReport, getLowAttendanceStudents, getStudentAttendanceById } = require('../controllers/adminController');
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
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);

// Subjects
router.post('/subjects', addSubject);
router.get('/subjects', getSubjects);

// Settings
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

// Attendance
router.get('/attendance', getAdminAllAttendance);
router.get('/attendance/session', getAttendanceBySession);
router.patch('/attendance/:id/correct', correctAttendance);
router.get('/stats', getAdminStats);

// Reports
router.get('/report', getAttendanceReport);
router.get('/low-attendance', getLowAttendanceStudents);
router.get('/students/:id/attendance', getStudentAttendanceById);

module.exports = router;