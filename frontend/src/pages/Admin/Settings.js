import React, { useState, useEffect, useContext } from 'react';
import api from '../../api/axios';
import { ThemeContext } from '../../contexts/ThemeContext';

const Settings = () => {
    const { theme } = useContext(ThemeContext);
    const isDark = theme === 'dark';
    const [threshold, setThreshold] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/admin/settings');
                if (res.data.data) {
                   setThreshold(res.data.data.lowAttendanceThreshold);
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
            }
        };
        fetchSettings();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put('/admin/settings', { lowAttendanceThreshold: Number(threshold) });
            alert('Settings updated successfully');
        } catch (err) {
            alert(err.response?.data?.message || 'Error updating settings');
        }
    };

    if (loading) return <div className="space-y-4"><div className="h-40 rounded-2xl skeleton" /></div>;

    return (
        <div className={`max-w-2xl p-8 rounded-[24px] transition-all animate-fade-in-up ${isDark ? 'liquid-glass-card' : 'liquid-glass-card-light'}`}>
            <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>System Configuration</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className={`block text-sm font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Low Attendance Warning Threshold (%)
                    </label>
                    <input 
                       type="number" 
                       className={`w-full lg:w-1/2 px-4 py-3 rounded-xl outline-none transition-all ${isDark ? 'glass-input text-white' : 'glass-input-light text-slate-800'}`}
                       min="0" max="100"
                       required 
                       value={threshold} 
                       onChange={e => setThreshold(e.target.value)} 
                    />
                    <p className={`mt-2 text-xs font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Students falling below this percentage will receive automated warning emails.</p>
                </div>
                <button type="submit" className="btn-liquid btn-shine px-8 py-3 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-indigo-500/30" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                    Save Settings
                </button>
            </form>
        </div>
    );
};

export default Settings;
