import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const Subjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ name: '', code: '' });

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const res = await api.get('/admin/subjects');
            setSubjects(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/subjects', form);
            setForm({ name: '', code: '' });
            fetchSubjects();
            alert('Subject added successfully');
        } catch (err) {
            alert(err.response?.data?.message || 'Error adding subject');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 transition-colors">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 lg:col-span-1 transition-colors">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Add New Subject</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Subject Name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                    <input className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Subject Code" required value={form.code} onChange={e => setForm({...form, code: e.target.value})} />
                    <button type="submit" className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition-colors">Add Subject</button>
                </form>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 lg:col-span-2 transition-colors">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Subjects List</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                        <thead className="bg-gray-50 dark:bg-slate-900/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Code</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                            {subjects.map(subject => (
                                <tr key={subject._id}>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="font-medium text-gray-900 dark:text-white">{subject.name}</div></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">{subject.code}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Subjects;
