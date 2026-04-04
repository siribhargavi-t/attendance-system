import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Report = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAttendanceReport = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found, please login.');
          return;
        }

        // Assuming your report endpoint is /api/attendance/report
        const response = await axios.get('http://localhost:5000/api/attendance/report', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Ensure the response data is an array before setting the state
        if (Array.isArray(response.data)) {
          setAttendanceData(response.data);
        } else {
          // If the data is nested in the response object, access it directly.
          // For example, if the API returns { records: [...] }, use response.data.records
          console.error("API response is not an array:", response.data);
          setError('Received invalid data format from server.');
          setAttendanceData([]); // Reset to an empty array
        }
      } catch (err) {
        console.error("Error fetching attendance report:", err);
        setError(err.response?.data?.message || 'Failed to fetch attendance report.');
      }
    };

    fetchAttendanceReport();
  }, []);

  return (
    <div>
      <h2>Attendance Report</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.length > 0 ? (
            attendanceData.map((record) => (
              <tr key={record._id}>
                <td>{record.studentId?.name || record.studentId?._id || 'N/A'}</td>
                <td>{new Date(record.date).toLocaleDateString()}</td>
                <td>{record.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No attendance data available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Report;