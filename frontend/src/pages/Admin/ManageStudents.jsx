import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, Trash2, AlertTriangle } from 'lucide-react';

const ManageStudents = () => {
    const [students, setStudents] = useState([]);
    const [newStudent, setNewStudent] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/admin/students', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudents(res.data);
        } catch (err) {
            setError('Failed to fetch students.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleInputChange = (e) => {
        setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        setError('');
        if (!newStudent.name || !newStudent.email || !newStudent.password) {
            setError('Please fill all fields.');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/admin/students', newStudent, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewStudent({ name: '', email: '', password: '' }); // Reset form
            fetchStudents(); // Refresh list
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add student.');
        }
    };

    const handleDeleteStudent = async (studentId) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`/api/admin/students/${studentId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchStudents(); // Refresh list
            } catch (err) {
                setError('Failed to delete student.');
            }
        }
    };

    return (
        <div className="p-6 md:p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Students</h1>

            {/* Add Student Form */}
            <div className="mb-8 bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center"><UserPlus className="mr-2" />Add New Student</h2>
                <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <input type="text" name="name" value={newStudent.name} onChange={handleInputChange} placeholder="Full Name" className="md:col-span-1 p-2 border rounded" />
                    <input type="email" name="email" value={newStudent.email} onChange={handleInputChange} placeholder="Email Address" className="md:col-span-1 p-2 border rounded" />
                    <input type="password" name="password" value={newStudent.password} onChange={handleInputChange} placeholder="Password" className="md:col-span-1 p-2 border rounded" />
                    <button type="submit" className="md:col-span-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Add Student</button>
                </form>
                {error && <p className="text-red-500 mt-2 flex items-center"><AlertTriangle size={16} className="mr-1" />{error}</p>}
            </div>

            {/* Student List */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase">Name</th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase">Email</th>
                            <th className="py-3 px-4 text-center text-sm font-medium text-gray-600 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="3" className="text-center p-4">Loading...</td></tr>
                        ) : (
                            students.map(student => (
                                <tr key={student._id} className="border-b hover:bg-gray-50">
                                    <td className="py-4 px-4 font-medium text-gray-800">{student.name}</td>
                                    <td className="py-4 px-4 text-gray-600">{student.email}</td>
                                    <td className="py-4 px-4 text-center">
                                        <button onClick={() => handleDeleteStudent(student._id)} className="text-red-500 hover:text-red-700">
                                            <Trash2 size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageStudents;