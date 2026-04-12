// TEMP DUMMY FUNCTIONS

const markAttendance = (req, res) => res.send("Mark Attendance");
const getStudentAttendance = (req, res) => res.send("Student Attendance");
const getAttendancePercentage = (req, res) => res.send("Percentage");
const getWeeklyAttendance = (req, res) => res.send("Weekly");
const getRecentAttendance = (req, res) => res.send("Recent");
const getMyAttendance = (req, res) => res.send("My Attendance");

module.exports = {
  markAttendance,
  getStudentAttendance,
  getAttendancePercentage,
  getWeeklyAttendance,
  getRecentAttendance,
  getMyAttendance
};