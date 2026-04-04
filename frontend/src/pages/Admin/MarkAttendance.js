import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { CheckCircle2, Circle } from 'lucide-react';

const MarkAttendance = () => {
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    
    // Filters
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    
    // Bulk state
    const [attendanceMap, setAttendanceMap] = useState({}); // { studentId: 'present' | 'absent' }
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [studRes, subRes] = await Promise.all([
                    api.get('/admin/students'),
                    api.get('/admin/subjects')
                ]);
                setStudents(studRes.data.data);
                setSubjects(subRes.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, []);

    // Extract unique branches from students for filter dropdown
    const uniqueBranches = Array.from(new Set(students.map(s => s.branch || 'General')));

    // Filter students
    const filteredStudents = students.filter(s => {
        if (selectedBranch && selectedBranch !== 'All') {
            return (s.branch || 'General') === selectedBranch;
        }
        return true;
    });

    // Initialize all as present when filter changes
    useEffect(() => {
        const initialMap = {};
        filteredStudents.forEach(s => {
            initialMap[s._id] = 'present';
        });
        setAttendanceMap(initialMap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedBranch, students.length]);

    const toggleAttendance = (studentId) => {
        setAttendanceMap(prev => ({
            ...prev,
            [studentId]: prev[studentId] === 'present' ? 'absent' : 'present'
        }));
    };

    const markAllAs = (status) => {
        const newMap = {};
        filteredStudents.forEach(s => {
            newMap[s._id] = status;
        });
        setAttendanceMap(newMap);
    };

    const handleSubmit = async () => {
        if (!selectedSubject) {
            alert("Please select a subject first.");
            return;
        }
        
        const records = filteredStudents.map(s => ({
            studentId: s._id,
            status: attendanceMap[s._id] || 'present'
        }));

        if (records.length === 0) {
            alert("No students in the list.");
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/attendance/mark-bulk', {
                subjectId: selectedSubject,
                date: selectedDate,
                records
            });
            alert('Bulk attendance marked successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Error marking bulk attendance');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    const presentCount = Object.values(attendanceMap).filter(v => v === 'present').length;
    const absentCount = Object.values(attendanceMap).filter(v => v === 'absent').length;

    return (
        <div className="space-y-6 transition-colors">
            {/* Control Panel */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Class Attendance Roster</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Subject</label>
                        <select className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}>
                            <option value="">Select Subject</option>
                            {subjects.map(s => <option key={s._id} value={s._id}>{s.name} ({s.code})</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Date</label>
                        <input type="date" className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Filter by Branch</label>
                        <select className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" value={selectedBranch} onChange={e => setSelectedBranch(e.target.value)}>
                            <option value="All">All Branches</option>
                            {uniqueBranches.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>
                </div>
            </div>
            
            {/* Interactive Grid */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Students ({filteredStudents.length})
                    </h3>
                    <div className="space-x-4 flex items-center">
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">{presentCount} Present</span>
                        <span className="text-sm text-red-600 dark:text-red-400 font-medium">{absentCount} Absent</span>
                        <div className="hidden sm:flex border-l border-gray-200 dark:border-slate-600 h-6 mx-2"></div>
                        <button onClick={() => markAllAs('present')} className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 font-medium transition-colors">Mark All Present</button>
                        <button onClick={() => markAllAs('absent')} className="text-sm text-gray-500 hover:text-gray-700 dark:text-slate-400 font-medium transition-colors">Mark All Absent</button>
                    </div>
                </div>

                {filteredStudents.length === 0 ? (
                    <div className="py-12 text-center text-gray-500 dark:text-slate-400">No students found matching your criteria.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredStudents.map(student => {
                            const isPresent = attendanceMap[student._id] === 'present';
                            return (
                                <div 
                                    key={student._id} 
                                    onClick={() => toggleAttendance(student._id)}
                                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none flex items-center justify-between
                                        ${isPresent 
                                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-600' 
                                            : 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-900/50'
                                    }`}
                                >
                                    <div>
                                        <p className={`font-semibold ${isPresent ? 'text-green-800 dark:text-green-400' : 'text-red-800 dark:text-red-400'}`}>
                                            {student.name}
                                        </p>
                                        <p className={`text-xs ${isPresent ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                                            {student.rollNumber} &bull; {student.branch || 'General'}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0 ml-4">
                                        {isPresent ? (
                                            <CheckCircle2 className="w-6 h-6 text-green-500 dark:text-green-400" />
                                        ) : (
                                            <Circle className="w-6 h-6 text-red-400 dark:text-red-500" />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
                    <button 
                       onClick={handleSubmit}
                       disabled={submitting || filteredStudents.length === 0}
                       className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 flex justify-center items-center"
                    >
                        {submitting ? 'Saving Records...' : 'Submit Attendance For Entire Class'}
                    </button>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-3">This action will override any existing attendance records for the selected date and subject combination.</p>
                </div>
            </div>
        </div>
    );
};

export default MarkAttendance;
