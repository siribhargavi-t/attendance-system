import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const Request = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [form, setForm] = useState({ attendanceId: '', changeReason: '', documentUrl: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const res = await api.get('/student/attendance');
                const absences = res.data.attendance.filter(r => r.status === 'absent');
                setAttendanceRecords(absences);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAttendance();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/student/request', form);
            alert('Request submitted successfully');
            setForm({ attendanceId: '', changeReason: '', documentUrl: '' });
        } catch (err) {
            alert(err.response?.data?.message || 'Error submitting request');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-2xl bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Submit Absence Reason / Correction</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Select Absence Record</label>
                    <select 
                        required 
                        className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                        value={form.attendanceId}
                        onChange={e => setForm({...form, attendanceId: e.target.value})}
                    >
                        <option value="">-- Choose a date --</option>
                        {attendanceRecords.map(record => (
                            <option key={record._id} value={record._id}>
                                {new Date(record.date).toLocaleDateString()} - {record.subjectId?.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Reason for Absence / Correction Request</label>
                    <textarea 
                        required 
                        className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg min-h-[100px] bg-gray-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                        placeholder="Please explain the reason (e.g. Medical emergency)"
                        value={form.changeReason}
                        onChange={e => setForm({...form, changeReason: e.target.value})}
                    ></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Supporting Document URL (Optional)</label>
                    <input 
                        type="url" 
                        className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                        placeholder="Link to doctor's note or evidence"
                        value={form.documentUrl}
                        onChange={e => setForm({...form, documentUrl: e.target.value})}
                    />
                </div>
                <button type="submit" className="bg-indigo-600 px-6 py-2 text-white font-semibold rounded-lg hover:bg-indigo-700 mt-4 transition-colors">
                    Submit Request
                </button>
            </form>
        </div>
    );
};

export default Request;
