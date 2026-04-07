const User = require('../models/User');
const Attendance = require('../models/Attendance');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    // Get total number of students
    const totalStudents = await User.countDocuments({ role: 'student' });

    // Get today's date range
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Get total attendance records for today
    const classesToday = await Attendance.countDocuments({
      date: { $gte: todayStart, $lte: todayEnd },
    });

    // Get total "present" attendance records for today
    const presentToday = await Attendance.countDocuments({
      date: { $gte: todayStart, $lte: todayEnd },
      status: 'present',
    });

    // Calculate attendance percentage, handle division by zero
    const attendancePercentage =
      classesToday > 0 ? (presentToday / classesToday) * 100 : 0;

    res.json({
      totalStudents,
      classesToday,
      attendancePercentage: attendancePercentage.toFixed(2), // Format to 2 decimal places
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get weekly attendance statistics for a chart
// @route   GET /api/admin/weekly-attendance
// @access  Private/Admin
const getWeeklyAttendance = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0); // Start of the day 7 days ago

    const weeklyData = await Attendance.aggregate([
      // 1. Filter records for the last 7 days
      {
        $match: {
          date: { $gte: sevenDaysAgo, $lte: today },
        },
      },
      // 2. Group by date and calculate total and present counts
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          totalRecords: { $sum: 1 },
          presentCount: {
            $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] },
          },
        },
      },
      // 3. Calculate percentage
      {
        $project: {
          _id: 0,
          date: '$_id',
          attendancePercentage: {
            $cond: [
              { $eq: ['$totalRecords', 0] },
              0,
              { $multiply: [{ $divide: ['$presentCount', '$totalRecords'] }, 100] },
            ],
          },
        },
      },
      // 4. Sort by date
      { $sort: { date: 1 } },
    ]);

    // Create a map of results for easy lookup
    const resultsMap = new Map(
      weeklyData.map((item) => [item.date, item.attendancePercentage])
    );

    // Ensure all 7 days are present in the final array, filling missing days with 0%
    const finalData = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(sevenDaysAgo);
      day.setDate(sevenDaysAgo.getDate() + i);
      const dayString = day.toISOString().split('T')[0];
      
      finalData.push({
        date: dayString,
        percentage: resultsMap.get(dayString) || 0,
      });
    }

    res.json(finalData);
  } catch (error) {
    console.error('Error fetching weekly attendance:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getDashboardStats, getWeeklyAttendance };