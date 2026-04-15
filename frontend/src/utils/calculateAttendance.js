/**
 * Calculates attendance summary from data array.
 * @param {Array} data - Array of attendance records with a 'status' field ("Present"/"Absent")
 * @returns {Object} { total, present, absent, percentage }
 */
function calculateAttendance(data) {
  const total = data.length;
  const present = data.filter((item) => item.status === "Present").length;
  const absent = total - present;
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
  return { total, present, absent, percentage };
}

export default calculateAttendance;