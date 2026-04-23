import React, { useState, useEffect } from 'react';
import API from "../../services/api";   // adjust path

const Students = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ username: '', email: '', password: '', name: '', rollNumber: '', parentEmail: '', branch: '' });

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await api.get('/admin/students');
            setStudents(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/students', form);
            setForm({ username: '', email: '', password: '', name: '', rollNumber: '', parentEmail: '', branch: '' });
            fetchStudents();
            alert('Student added successfully');
        } catch (err) {
            alert(err.response?.data?.message || 'Error adding student');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 transition-colors">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 lg:col-span-1 transition-colors">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Add New Student</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                    <input className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Roll Number" required value={form.rollNumber} onChange={e => setForm({...form, rollNumber: e.target.value})} />
                    <input className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Branch (e.g. CSE, ECE)" required value={form.branch} onChange={e => setForm({...form, branch: e.target.value})} />
                    <input className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Username" required value={form.username} onChange={e => setForm({...form, username: e.target.value})} />
                    <input type="email" className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Student Email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                    <input type="email" className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Parent Email (Optional)" value={form.parentEmail} onChange={e => setForm({...form, parentEmail: e.target.value})} />
                    <input type="password" className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                    <button type="submit" className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition-colors">Add Student</button>
                </form>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 lg:col-span-2 transition-colors">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Students List</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                        <thead className="bg-gray-50 dark:bg-slate-900/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Roll No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Branch</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">User/Email</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                            {students.map(student => (
                                <tr key={student._id}>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="font-medium text-gray-900 dark:text-white">{student.name}</div></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">{student.rollNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-slate-300">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">{student.branch || 'General'}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">{student.user?.username}<br/><span className="text-xs text-gray-400 dark:text-slate-500">{student.user?.email}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Students;
