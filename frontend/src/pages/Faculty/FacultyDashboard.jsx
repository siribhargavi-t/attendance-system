import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Check, X, Book, Calendar as CalendarIcon, AlertCircle, Users, UserCheck, UserX } from 'lucide-react';
import { ProtectedRoute } from '../../components/Layout/ProtectedRoute';
import jwtDecode from 'jwt-decode';

const FacultyDashboard = () => {
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [attendance, setAttendance] = useState({});
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const studentsRes = await axios.get('/api/admin/students', config);
            setStudents(studentsRes.data);
        } catch (error) {
            console.error("Failed to fetch students", error);
            setErrors(prev => ({ ...prev, form: 'Could not load student data.' }));
        }
    };

    useEffect(() => {
        fetchStudents();
        // In a real app, you would fetch subjects from an API
        const dummySubjects = [
            { _id: 'subj1', name: 'Computer Networks' },
            { _id: 'subj2', name: 'Database Systems' },
            { _id: 'subj3', name: 'Operating Systems' },
        ];
        setSubjects(dummySubjects);
        if (dummySubjects.length > 0) {
            setSelectedSubject(dummySubjects[0]._id);
        }
    }, []);

    const handleStatusChange = (studentId, status) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };

    const handleSubmit = async () => {
        if (Object.keys(attendance).length === 0) {
            setErrors({ form: 'Please mark attendance for at least one student.' });
            return;
        }
        setIsLoading(true);
        setErrors({});
        setSuccessMessage('');

        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const attendancePromises = Object.entries(attendance).map(([studentId, status]) => {
            const payload = {
                studentId, // This is the student's ObjectId
                subjectId: selectedSubject,
                date: selectedDate.toISOString(),
                status,
            };
            return axios.post('/api/attendance/mark', payload, config)
                .catch(err => ({
                    error: true, studentId,
                    message: err.response?.data?.message || 'Server Error',
                    status: err.response?.status
                }));
        });

        const results = await Promise.all(attendancePromises);
        
        const newErrors = {};
        let successCount = 0;
        results.forEach(result => {
            if (result.error) {
                const studentName = students.find(s => s._id === result.studentId)?.name || 'A student';
                if (result.status === 409) { // Conflict error for duplicate marking
                    newErrors[result.studentId] = `Attendance already marked for ${studentName}.`;
                } else {
                    newErrors[result.studentId] = `${studentName}: ${result.message}`;
                }
            } else {
                successCount++;
            }
        });

        if (Object.keys(newErrors).length > 0) setErrors(newErrors);
        if (successCount > 0) {
            setSuccessMessage(`Successfully marked attendance for ${successCount} student(s).`);
            fetchStudents(); // Refresh student list and data
        }
        
        setIsLoading(false);
        setAttendance({}); // Clear selections after submission
    };

    const attendanceSummary = useMemo(() => {
        const presentCount = Object.values(attendance).filter(s => s === 'present').length;
        const absentCount = Object.values(attendance).filter(s => s === 'absent').length;
        return {
            total: students.length,
            present: presentCount,
            absent: absentCount,
            marked: presentCount + absentCount
        };
    }, [attendance, students]);

    return (
        <div className="p-6 md:p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Faculty Dashboard</h1>

            {/* --- Summary Cards --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow flex items-center"><Users className="mr-3 text-blue-500" size={24}/><div><div className="text-2xl font-bold">{attendanceSummary.total}</div><div className="text-sm text-gray-500">Total Students</div></div></div>
                <div className="bg-white p-4 rounded-lg shadow flex items-center"><UserCheck className="mr-3 text-green-500" size={24}/><div><div className="text-2xl font-bold">{attendanceSummary.present}</div><div className="text-sm text-gray-500">Marked Present</div></div></div>
                <div className="bg-white p-4 rounded-lg shadow flex items-center"><UserX className="mr-3 text-red-500" size={24}/><div><div className="text-2xl font-bold">{attendanceSummary.absent}</div><div className="text-sm text-gray-500">Marked Absent</div></div></div>
            </div>

            {/* --- Controls: Subject and Date --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-white p-4 rounded-lg shadow">
                <div className="flex items-center">
                    <Book className="mr-3 text-gray-500" />
                    <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="w-full p-2 border rounded-md bg-white">
                        {subjects.map(sub => <option key={sub._id} value={sub._id}>{sub.name}</option>)}
                    </select>
                </div>
                <div className="flex items-center">
                    <CalendarIcon className="mr-3 text-gray-500" />
                    <DatePicker selected={selectedDate} onChange={date => setSelectedDate(date)} className="w-full p-2 border rounded-md" />
                </div>
            </div>

            {/* --- Student List --- */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase">Student Name</th>
                            <th className="py-3 px-4 text-center text-sm font-medium text-gray-600 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student._id} className="border-b hover:bg-gray-50">
                                <td className="py-4 px-4 font-medium text-gray-800">{student.name}</td>
                                <td className="py-4 px-4">
                                    <div className="flex justify-center items-center space-x-2">
                                        <button onClick={() => handleStatusChange(student._id, 'present')} className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center transition ${attendance[student._id] === 'present' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-green-200'}`}>
                                            <Check size={16} className="mr-1" /> Present
                                        </button>
                                        <button onClick={() => handleStatusChange(student._id, 'absent')} className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center transition ${attendance[student._id] === 'absent' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-red-200'}`}>
                                            <X size={16} className="mr-1" /> Absent
                                        </button>
                                    </div>
                                    {errors[student._id] && <p className="text-red-500 text-xs mt-1 text-center flex items-center justify-center"><AlertCircle size={14} className="mr-1" /> {errors[student._id]}</p>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- Submit Button and Messages --- */}
            <div className="mt-6 text-center">
                {successMessage && <div className="p-3 mb-4 bg-green-100 text-green-800 rounded-md">{successMessage}</div>}
                {errors.form && <div className="p-3 mb-4 bg-red-100 text-red-800 rounded-md">{errors.form}</div>}
                <button onClick={handleSubmit} disabled={isLoading} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors">
                    {isLoading ? 'Submitting...' : 'Submit Attendance'}
                </button>
            </div>
        </div>
    );
};

export default FacultyDashboard;


