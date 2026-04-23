import React, { useState, useEffect } from 'react';
import API from "../../services/api";   // adjust path

const Settings = () => {
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

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-2xl bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">System Configuration</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        Low Attendance Warning Threshold (%)
                    </label>
                    <input 
                       type="number" 
                       className="w-full lg:w-1/2 px-4 py-2 border dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors" 
                       min="0" max="100"
                       required 
                       value={threshold} 
                       onChange={e => setThreshold(e.target.value)} 
                    />
                    <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">Students falling below this percentage will receive automated warning emails.</p>
                </div>
                <button type="submit" className="bg-indigo-600 px-6 py-2 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                    Save Settings
                </button>
            </form>
        </div>
    );
};

export default Settings;
