import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { AuthContext } from '../../contexts/AuthContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import { UserPlus, Edit, Trash2, Shield, ShieldAlert, X } from 'lucide-react';

const ManageAdmins = () => {
    const { user } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);
    const isDark = theme === 'dark';
    const [admins, setAdmins] = useState([]);
    const [allSubjects, setAllSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [editForm, setEditForm] = useState({ assignedBranches: '', assignedSubjects: [], password: '' });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [adminRes, subRes] = await Promise.all([
                api.get('/admin/admins'),
                api.get('/admin/subjects')
            ]);
            setAdmins(adminRes.data.data);
            setAllSubjects(subRes.data.data);
        } catch (err) {
            console.error('Error fetching admins/subjects', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (adminId) => {
        if (!window.confirm("Are you sure you want to permanently delete this administrator? This action will remove them from all subjects.")) {
            return;
        }
        
        try {
            await api.delete(`/admin/admins/${adminId}`);
            setAdmins(admins.filter(a => a._id !== adminId));
        } catch (err) {
            alert(err.response?.data?.message || 'Error deleting admin');
        }
    };

    const openEditModal = (adminObj) => {
        setEditingAdmin(adminObj);
        setEditForm({
            assignedBranches: adminObj.assignedBranches?.join(', ') || '',
            assignedSubjects: adminObj.assignedSubjects || [],
            password: ''
        });
        setIsEditModalOpen(true);
    };

    const handleSubjectToggle = (subjectId) => {
        setEditForm(prev => ({
            ...prev,
            assignedSubjects: prev.assignedSubjects.includes(subjectId)
                ? prev.assignedSubjects.filter(id => id !== subjectId)
                : [...prev.assignedSubjects, subjectId]
        }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                 assignedBranches: editForm.assignedBranches.split(',').map(b => b.trim()).filter(b => b),
                 assignedSubjects: editForm.assignedSubjects
            };
            if (editForm.password) {
                 payload.password = editForm.password;
            }

            await api.put(`/admin/admins/${editingAdmin._id}`, payload);
            setIsEditModalOpen(false);
            fetchInitialData();
            alert("Admin updated successfully. Top level permissions may have changed based on their new restrictions.");
        } catch (err) {
            alert(err.response?.data?.message || 'Error updating admin');
        }
    };

    if (loading) return (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-16 rounded-2xl skeleton" />)}</div>
    );

    return (
        <div className="space-y-6 transition-all animate-fade-in-up font-sans relative">
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl transition-all ${isDark ? 'liquid-glass-card' : 'liquid-glass-card-light'}`}>
                <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center space-x-2">
                        <Shield className="w-6 h-6 text-indigo-500" />
                        <span>Manage Administrators</span>
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">View, modify, and delete Super Admins and Faculty members.</p>
                </div>
                <Link to="/admin/add-admin" className="btn-liquid btn-shine mt-4 sm:mt-0 flex items-center justify-center space-x-2 text-white font-bold py-2.5 px-6 rounded-xl transition-all" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                    <UserPlus className="w-5 h-5" />
                    <span>Add New Admin</span>
                </Link>
            </div>

            <div className={`rounded-2xl overflow-hidden transition-all ${isDark ? 'liquid-glass-card' : 'liquid-glass-card-light'}`}>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                        <thead className={isDark ? 'border-b border-white/10' : 'border-b border-slate-200/50'}>
                            <tr>
                                <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400 bg-white/5 backdrop-blur-md' : 'text-slate-500 bg-slate-50/50 backdrop-blur-md'}`}>User Details</th>
                                <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400 bg-white/5 backdrop-blur-md' : 'text-slate-500 bg-slate-50/50 backdrop-blur-md'}`}>Role & Access</th>
                                <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400 bg-white/5 backdrop-blur-md' : 'text-slate-500 bg-slate-50/50 backdrop-blur-md'}`}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y" style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                            {admins.map(admin => {
                                const isSelf = admin.username === user?.username;
                                return (
                                    <tr key={admin._id} className="table-row-hover transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                                                    style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                                                    {admin.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{admin.username}</p>
                                                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{admin.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {admin.isSuperAdmin ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
                                                    style={{ background: 'rgba(139,92,246,0.12)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.25)' }}>
                                                    <ShieldAlert className="w-3 h-3" /> Super Admin (Global)
                                                </span>
                                            ) : (
                                                <div className="space-y-1">
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
                                                        style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}>
                                                        <Shield className="w-3 h-3" /> Faculty (Restricted)
                                                    </span>
                                                    <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                                        Branches: {admin.assignedBranches?.length ? admin.assignedBranches.join(', ') : 'None'}<br />
                                                        Subjects: {admin.assignedSubjects?.length || 0} assigned
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => openEditModal(admin)}
                                                    className={`p-2 rounded-lg transition-all hover:scale-110 ${isDark ? 'text-indigo-400 hover:bg-indigo-500/10' : 'text-indigo-500 hover:bg-indigo-50'}`}>
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                {!isSelf && (
                                                    <button onClick={() => handleDelete(admin._id)}
                                                        className={`p-2 rounded-lg transition-all hover:scale-110 ${isDark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-500 hover:bg-red-50'}`}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal popup */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[6px]">
                    <div className={`w-full max-w-lg rounded-[28px] overflow-hidden shadow-2xl ${isDark ? 'liquid-glass-modal' : 'liquid-glass-modal-light'}`}>
                        <div className={`px-6 py-5 border-b flex justify-between items-center ${isDark ? 'border-white/10' : 'border-slate-200/50'}`}>
                            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Edit {editingAdmin?.username}</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className={`p-2 rounded-xl transition-all hover:scale-110 ${isDark ? 'text-white hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100'}`}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleEditSubmit} className="space-y-4">
                                <div className={`p-3 rounded-lg text-sm mb-4 ${isDark ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
                                    <strong>Super Admin Trigger:</strong> Emptying both branches and subjects automatically promotes this user to Super Admin status!
                                </div>
                                <div>
                                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        Assigned Branches (comma separated)
                                    </label>
                                    <input
                                        type="text"
                                        className={`w-full px-4 py-3 rounded-xl outline-none transition-all ${isDark ? 'glass-input text-white' : 'glass-input-light text-slate-800'}`}
                                        value={editForm.assignedBranches}
                                        onChange={e => setEditForm({...editForm, assignedBranches: e.target.value})}
                                        placeholder="e.g. CSE, ECE, General"
                                    />
                                </div>
                                <div>
                                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        Assigned Subjects
                                    </label>
                                    <div className={`grid grid-cols-1 gap-2 max-h-40 overflow-y-auto p-3 rounded-xl ${isDark ? 'bg-slate-900/30' : 'bg-slate-50/50 border border-slate-200/50'}`}>
                                        {allSubjects.map(sub => (
                                            <label key={sub._id} className={`flex items-center space-x-2 text-sm cursor-pointer ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                                                <input 
                                                    type="checkbox" 
                                                    checked={editForm.assignedSubjects.includes(sub._id)}
                                                    onChange={() => handleSubjectToggle(sub._id)}
                                                    className="rounded text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <span className="truncate">{sub.name} ({sub.code})</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className={`border-t pt-4 mt-4 ${isDark ? 'border-white/10' : 'border-slate-200/50'}`}>
                                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        New Password (Optional)
                                    </label>
                                    <input
                                        type="password"
                                        className={`w-full px-4 py-3 rounded-xl outline-none transition-all ${isDark ? 'glass-input text-white' : 'glass-input-light text-slate-800'}`}
                                        value={editForm.password}
                                        onChange={e => setEditForm({...editForm, password: e.target.value})}
                                        placeholder="Leave blank to keep unchanged"
                                    />
                                </div>
                                <div className="pt-4 flex justify-end space-x-3">
                                    <button type="button" onClick={() => setIsEditModalOpen(false)} className={`px-5 py-2.5 font-semibold rounded-xl transition-all ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-liquid btn-shine px-5 py-2.5 font-bold text-white rounded-xl transition-all" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageAdmins;
