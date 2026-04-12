import React, { useState, useEffect } from 'react';
import axios from 'axios';
// We don't need jwt-decode here anymore as the backend handles it
import { CheckCircle, XCircle, Percent, Calendar, AlertTriangle } from 'lucide-react';

const StudentDashBoard = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [percentage, setPercentage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError("Authentication token not found. Please log in.");
                setLoading(false);
                return;
            }

            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                // Call the new single endpoint
                console.log("Frontend: Calling /api/attendance/student/me"); // DEBUG LOG
                const { data } = await axios.get('/api/attendance/student/me', config);

                console.log("Frontend: Received data:", data); // DEBUG LOG

                // Set state from the single response object
                setAttendanceData(Array.isArray(data.attendanceData) ? data.attendanceData : []);
                setPercentage(data.percentage);

            } catch (err) {
                console.error("Failed to fetch student data:", err);
                setError(err.response?.data?.message || "Could not load your attendance data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // --- Loading State UI ---
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    // --- Error State UI ---
    if (error) {
        return (
            <div className="p-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative flex items-center" role="alert">
                    <AlertTriangle className="mr-4" size={24} />
                    <div>
                        <strong className="font-bold">An error occurred: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 bg-gray-100 min-h-[calc(100vh-64px)]">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">My Dashboard</h1>

            {/* --- Attendance Percentage Card --- */}
            <div className="mb-8">
                <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4 max-w-sm mx-auto">
                    <div className="bg-blue-500 rounded-full p-4">
                        <Percent className="text-white" size={32} />
                    </div>
                    <div>
                        <p className="text-lg text-gray-500 font-medium">Overall Attendance</p>
                        <p className="text-4xl font-bold text-gray-800">
                            {typeof percentage === "number" && !isNaN(percentage) ? percentage.toFixed(1) : "N/A"}%
                        </p>
                    </div>
                </div>
            </div>

            {/* --- Attendance History Table --- */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <h2 className="text-xl font-bold text-gray-700 p-6 flex items-center border-b"><Calendar className="mr-3" />Attendance History</h2>
                <div className="overflow-y-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="py-3 px-6">Date</th>
                                <th scope="col" className="py-3 px-6">Subject</th>
                                <th scope="col" className="py-3 px-6">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(attendanceData) && attendanceData.length > 0 ? attendanceData.map((record) => (
                                <tr key={record._id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="py-4 px-6 font-medium text-gray-900">
                                        {new Date(record.date).toLocaleDateString()}
                                    </td>
                                    <td className="py-4 px-6">{record.subjectId?.name || 'N/A'}</td>
                                    <td className="py-4 px-6">
                                        <span className={`flex items-center text-sm font-semibold ${
                                            record.status === 'present' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {record.status === 'present' ? <CheckCircle size={16} className="mr-2" /> : <XCircle size={16} className="mr-2" />}
                                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="3" className="text-center p-6 text-gray-500">No attendance records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentDashBoard;