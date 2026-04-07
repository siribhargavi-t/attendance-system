import React, { useState, useEffect } from 'react';
import axios from '../../api/axios'; // use your axios config

const Report = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendanceReport = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Please login first');
          setLoading(false);
          return;
        }

        const response = await axios.get('/attendance/report', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = response.data;

        if (Array.isArray(data)) {
          setAttendanceData(data);
        } else {
          console.error("Invalid API response:", data);
          setError('Invalid data format from server');
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to fetch report');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceReport();
  }, []);

  return (
    <div>
      <h2>Attendance Report</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Student</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.length > 0 ? (
              attendanceData.map((record) => (
                <tr key={record._id}>
                  <td>{record.studentId?.name || 'N/A'}</td>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>{record.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No attendance data available</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Report;