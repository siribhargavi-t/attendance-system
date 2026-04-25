import React, { useState, useEffect } from 'react';
import API from "../../services/api";   // adjust path
import { Check, X } from 'lucide-react';

const Requests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await API.get('/admin/attendance');
            const pendingReqs = res.data.data.filter(att => att.changeRequest === true && att.requestStatus === 'pending');
            setRequests(pendingReqs);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (id, action) => {
        try {
            await api.post('/attendance/review-request', { id, action });
            alert(`Request ${action} successfully`);
            fetchRequests();
        } catch (err) {
            alert(err.response?.data?.message || 'Error processing request');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Pending Attendance Requests</h3>
            
            {requests.length === 0 ? (
                <div className="text-center py-10 text-gray-500 dark:text-slate-400 italic">No pending requests.</div>
            ) : (
                <div className="space-y-4">
                    {requests.map(req => (
                        <div key={req._id} className="border border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div className="mb-4 md:mb-0">
                                <h4 className="font-bold text-gray-800 dark:text-yellow-100">{req.studentId?.name} <span className="text-sm font-normal text-gray-500 dark:text-yellow-200/60">({req.studentId?.rollNumber})</span></h4>
                                <p className="text-sm text-gray-700 dark:text-yellow-200/80 mt-1"><span className="font-semibold">Subject:</span> {req.subjectId?.name}</p>
                                <p className="text-sm text-gray-700 dark:text-yellow-200/80"><span className="font-semibold">Date of Absence:</span> {new Date(req.date).toLocaleDateString()}</p>
                                <p className="text-sm text-gray-700 dark:text-yellow-200/80 mt-2"><span className="font-semibold cursor-pointer">Reason:</span> {req.changeReason}</p>
                                {req.documentUrl && (
                                    <a href={req.documentUrl} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium mt-1 inline-block">
                                        View Document / Proof
                                    </a>
                                )}
                            </div>
                            <div className="flex space-x-3">
                                <button onClick={() => handleReview(req._id, 'approved')} className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                                    <Check className="w-4 h-4" /> <span>Approve</span>
                                </button>
                                <button onClick={() => handleReview(req._id, 'rejected')} className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                                    <X className="w-4 h-4" /> <span>Reject</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Requests;
