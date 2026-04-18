import React, { useState, useEffect, useContext } from 'react';
import api from '../../api/axios';
import { ThemeContext } from '../../contexts/ThemeContext';

const Subjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ name: '', code: '' });
    const { theme } = useContext(ThemeContext);
    const isDark = theme === 'dark';

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

    if (loading) return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 rounded-2xl skeleton" />)}</div>;

    const cardCls = isDark ? 'liquid-glass-card' : 'liquid-glass-card-light';
    const inputCls = isDark ? 'glass-input text-white' : 'glass-input-light text-slate-800';

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 transition-all animate-fade-in-up">
            <div className={`p-6 rounded-2xl transition-all lg:col-span-1 ${cardCls}`}>
                <h3 className={`text-lg font-bold mb-5 ${isDark ? 'text-white' : 'text-slate-800'}`}>Add New Subject</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input className={`w-full px-4 py-3 rounded-xl outline-none transition-all ${inputCls}`} placeholder="Subject Name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                    <input className={`w-full px-4 py-3 rounded-xl outline-none transition-all ${inputCls}`} placeholder="Subject Code" required value={form.code} onChange={e => setForm({...form, code: e.target.value})} />
                    <button type="submit" className="btn-liquid btn-shine w-full font-bold text-white py-3 rounded-xl transition-all" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>Add Subject</button>
                </form>
            </div>
            
            <div className={`p-6 rounded-2xl transition-all lg:col-span-2 ${cardCls}`}>
                <h3 className={`text-lg font-bold mb-5 ${isDark ? 'text-white' : 'text-slate-800'}`}>Subjects List</h3>
                <div className="overflow-x-auto rounded-xl">
                    <table className="w-full">
                        <thead className={isDark ? 'border-b border-white/10' : 'border-b border-slate-200/50'}>
                            <tr>
                                <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400 bg-white/5 backdrop-blur-md' : 'text-slate-500 bg-slate-50/50 backdrop-blur-md'}`}>Name</th>
                                <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400 bg-white/5 backdrop-blur-md' : 'text-slate-500 bg-slate-50/50 backdrop-blur-md'}`}>Code</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y" style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                            {subjects.map(subject => (
                                <tr key={subject._id} className="table-row-hover">
                                    <td className="px-6 py-4 whitespace-nowrap"><div className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{subject.name}</div></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className={`text-sm font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{subject.code}</div></td>
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
