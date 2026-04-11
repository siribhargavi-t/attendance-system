import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Check, X, Book, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';

const MarkAttendance = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]); // Assuming subjects are also fetched
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendance, setAttendance] = useState({});
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        // 1. Fetch the list of all students from the backend
        const studentsRes = await axios.get('/api/admin/students', config);
        setStudents(studentsRes.data);

        // You should also fetch subjects from a dedicated endpoint
        // For now, using dummy data for subjects
        const dummySubjects = [
          { _id: 'subj1', name: 'Computer Networks' },
          { _id: 'subj2', name: 'Database Systems' },
        ];
        setSubjects(dummySubjects);
        if (dummySubjects.length > 0) {
          setSelectedSubject(dummySubjects[0]._id);
        }

      } catch (error) {
        console.error("Failed to fetch data", error);
        setErrors({ form: 'Could not load student or subject data.' });
      }
    };
    fetchData();
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

    const attendancePromises = Object.entries(attendance).map(([studentId, status]) => {
      // 2. The payload correctly uses studentId which is the student's _id
      const payload = {
        studentId, // This is the ObjectId from the student object
        subjectId: selectedSubject,
        date: selectedDate.toISOString(),
        status,
      };
      const token = localStorage.getItem('token'); 
      return axios.post('/api/attendance/mark', payload, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(err => ({
          error: true,
          studentId,
          message: err.response?.data?.message || 'An error occurred.',
          status: err.response?.status
      }));
    });

    const results = await Promise.allSettled(attendancePromises);
    
    const newErrors = {};
    let successCount = 0;
    results.forEach(result => {
      if (result.status === 'fulfilled' && result.value && result.value.error) {
        const studentName = students.find(s => s._id === result.value.studentId)?.name || 'A student';
        if (result.value.status === 409) {
          newErrors[result.value.studentId] = `${studentName}'s attendance is already marked for this date.`;
        } else {
          newErrors[result.value.studentId] = `${studentName}: ${result.value.message}`;
        }
      } else if (result.status === 'fulfilled') {
        successCount++;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    }
    if (successCount > 0) {
      setSuccessMessage(`Successfully marked attendance for ${successCount} student(s).`);
    }
    
    setIsLoading(false);
    setAttendance({}); // Reset for next marking
  };

  return (
    <div className="p-6 md:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Mark Attendance</h1>

      {/* --- Controls: Subject and Date --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-3">
          <Book className="text-gray-500" />
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            {subjects.map(subject => (
              <option key={subject._id} value={subject._id}>{subject.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-3">
          <CalendarIcon className="text-gray-500" />
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MMMM d, yyyy"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
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
            {/* 3. The student._id is passed to the button handler */}
            {students.map(student => (
              <tr key={student._id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-4 font-medium text-gray-800">{student.name}</td>
                <td className="py-4 px-4">
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      onClick={() => handleStatusChange(student._id, 'present')}
                      className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center transition ${
                        attendance[student._id] === 'present' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-green-200'
                      }`}
                    >
                      <Check size={16} className="mr-1" /> Present
                    </button>
                    <button
                      onClick={() => handleStatusChange(student._id, 'absent')}
                      className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center transition ${
                        attendance[student._id] === 'absent' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-red-200'
                      }`}
                    >
                      <X size={16} className="mr-1" /> Absent
                    </button>
                  </div>
                  {errors[student._id] && (
                    <p className="text-red-500 text-xs mt-1 text-center flex items-center justify-center">
                      <AlertCircle size={14} className="mr-1" /> {errors[student._id]}
                    </p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Submit Button and Messages --- */}
      <div className="mt-6 text-center">
        {errors.form && <p className="text-red-500 mb-2">{errors.form}</p>}
        {successMessage && <p className="text-green-600 mb-2">{successMessage}</p>}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {isLoading ? 'Submitting...' : 'Submit Attendance'}
        </button>
      </div>
    </div>
  );
};

export default MarkAttendance;