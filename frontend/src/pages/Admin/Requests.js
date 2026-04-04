import React, { useState, useEffect, useContext } from 'react';
import api from '../../api/axios';
import { Check, X, Clock, User, BookOpen, Calendar, ExternalLink, RefreshCw, Inbox } from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null); // id of request being processed
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/admin/attendance');
      const pendingReqs = res.data.data.filter(att => att.changeRequest === true && att.requestStatus === 'pending');
      setRequests(pendingReqs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id, action) => {
    setProcessing(id + action);
    try {
      await api.post('/attendance/review-request', { id, action });
      setRequests(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      console.error(err.response?.data?.message || 'Error processing request');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) return (
    <div className="space-y-4">
      {[1,2,3].map(i => <div key={i} className="h-36 rounded-2xl skeleton" />)}
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-amber-500" />
            <h2 className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Pending Review
            </h2>
          </div>
          {requests.length > 0 && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400">
              {requests.length} request{requests.length !== 1 ? 's' : ''} awaiting action
            </span>
          )}
        </div>
        <button
          onClick={() => { setLoading(true); fetchRequests(); }}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105
            ${isDark ? 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700' : 'bg-white text-slate-500 hover:text-slate-700 border border-slate-200 shadow-sm'}`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {requests.length === 0 ? (
        <div className={`rounded-2xl p-16 text-center border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-100 shadow-sm'}`}>
          <Inbox className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-slate-200'}`} />
          <p className={`font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>All caught up!</p>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>No pending attendance requests to review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(req => (
            <div
              key={req._id}
              className={`rounded-2xl p-5 border transition-all animate-fade-in-up
                ${isDark ? 'bg-slate-800/70 border-slate-700/50 hover:border-amber-700/40' : 'bg-white border-slate-100 hover:border-amber-200 shadow-sm hover:shadow-md'}`}
            >
              <div className="flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
                {/* Info */}
                <div className="flex-1 min-w-0 space-y-3">
                  {/* Student & subject row */}
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg" style={{ background: isDark ? 'rgba(99,102,241,0.1)' : '#eef2ff' }}>
                        <User className="w-3.5 h-3.5 text-indigo-500" />
                      </div>
                      <div>
                        <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                          {req.studentId?.name}
                        </span>
                        <span className={`text-xs ml-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          · {req.studentId?.rollNumber}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg" style={{ background: isDark ? 'rgba(6,182,212,0.1)' : '#e0f9ff' }}>
                        <BookOpen className="w-3.5 h-3.5 text-cyan-500" />
                      </div>
                      <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{req.subjectId?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg" style={{ background: isDark ? 'rgba(245,158,11,0.1)' : '#fffbeb' }}>
                        <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      </div>
                      <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        {new Date(req.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className={`p-3 rounded-xl text-sm ${isDark ? 'bg-slate-900/50 text-slate-300 border border-slate-700/30' : 'bg-slate-50 text-slate-600 border border-slate-100'}`}>
                    <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Reason</p>
                    {req.changeReason}
                  </div>

                  {req.documentUrl && (
                    <a
                      href={req.documentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-500 hover:text-indigo-400 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      View Supporting Document
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2.5 flex-shrink-0">
                  <button
                    onClick={() => handleReview(req._id, 'approved')}
                    disabled={!!processing}
                    className="btn-shine flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white rounded-xl disabled:opacity-60 transition-all"
                    style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                  >
                    {processing === req._id + 'approved' ? (
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    Approve
                  </button>
                  <button
                    onClick={() => handleReview(req._id, 'rejected')}
                    disabled={!!processing}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-xl disabled:opacity-60 transition-all hover:scale-105"
                    style={{
                      background: isDark ? 'rgba(239,68,68,0.1)' : '#fee2e2',
                      color: '#ef4444',
                      border: `1px solid ${isDark ? 'rgba(239,68,68,0.25)' : 'rgba(254,202,202,1)'}`,
                    }}
                  >
                    {processing === req._id + 'rejected' ? (
                      <div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                    ) : (
                      <X className="w-3.5 h-3.5" />
                    )}
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Requests;
