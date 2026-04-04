import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { AuthContext } from '../../contexts/AuthContext';
import { UserPlus, Edit, Trash2, Shield, ShieldAlert, X } from 'lucide-react';

const ManageAdmins = () => {
    const { user } = useContext(AuthContext);
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

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6 transition-colors font-sans relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
                <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center space-x-2">
                        <Shield className="w-6 h-6 text-indigo-500" />
                        <span>Manage Administrators</span>
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">View, modify, and delete Super Admins and Faculty members.</p>
                </div>
                <Link to="/admin/add-admin" className="mt-4 sm:mt-0 flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
                    <UserPlus className="w-5 h-5" />
                    <span>Add New Admin</span>
                </Link>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                        <thead className="bg-gray-50 dark:bg-slate-900/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">User Details</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Role & Access</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-700 bg-white dark:bg-slate-800">
                            {admins.map(admin => {
                                const isSelf = admin.username === user?.username;
                                return (
                                    <tr key={admin._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 flex items-center justify-center font-bold">
                                                    {admin.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white">{admin.username}</p>
                                                    <p className="text-xs text-gray-500 dark:text-slate-400">{admin.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {admin.isSuperAdmin ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                                                    <ShieldAlert className="w-3 h-3 mr-1" /> Super Admin (Global Access)
                                                </span>
                                            ) : (
                                                <div className="space-y-1">
                                                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                                        Faculty (Restricted)
                                                    </span>
                                                    <div className="text-xs text-gray-500 dark:text-slate-400">
                                                        Branches: {admin.assignedBranches?.length ? admin.assignedBranches.join(', ') : 'None'}
                                                        <br />
                                                        Subjects: {admin.assignedSubjects?.length || 0} assigned
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-3">
                                                <button onClick={() => openEditModal(admin)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center">
                                                    <Edit className="w-4 h-4 mr-1" /> Edit
                                                </button>
                                                {!isSelf && (
                                                    <button onClick={() => handleDelete(admin._id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 flex items-center ml-2">
                                                        <Trash2 className="w-4 h-4 mr-1" /> Delete
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg border dark:border-slate-700 overflow-hidden">
                        <div className="px-6 py-4 border-b dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-900/50">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Edit {editingAdmin?.username}</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleEditSubmit} className="space-y-4">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm mb-4">
                                    <strong>Super Admin Trigger:</strong> Emptying both branches and subjects automatically promotes this user to Super Admin status!
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                                        Assigned Branches (comma separated)
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={editForm.assignedBranches}
                                        onChange={e => setEditForm({...editForm, assignedBranches: e.target.value})}
                                        placeholder="e.g. CSE, ECE, General"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                                        Assigned Subjects
                                    </label>
                                    <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto p-3 border dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700">
                                        {allSubjects.map(sub => (
                                            <label key={sub._id} className="flex items-center space-x-2 text-sm text-gray-800 dark:text-slate-200 cursor-pointer">
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
                                <div className="border-t dark:border-slate-700 pt-4 mt-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                                        New Password (Optional)
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={editForm.password}
                                        onChange={e => setEditForm({...editForm, password: e.target.value})}
                                        placeholder="Leave blank to keep unchanged"
                                    />
                                </div>
                                <div className="pt-4 flex justify-end space-x-3">
                                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                        Cancel
                                    </button>
                                    <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors">
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
