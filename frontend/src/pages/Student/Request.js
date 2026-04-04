import React, { useState, useEffect, useContext } from 'react';
import api from '../../api/axios';
import { Send, FileText, MessageSquare, Link as LinkIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';

const Request = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [form, setForm] = useState({ attendanceId: '', changeReason: '', documentUrl: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { type: 'success'|'error', message }
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await api.get('/student/attendance');
        const absences = res.data.attendance.filter(r => r.status === 'absent' && !r.changeRequest);
        setAttendanceRecords(absences);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    try {
      await api.post('/student/request', form);
      setResult({ type: 'success', message: 'Request submitted successfully! Admin will review it shortly.' });
      setForm({ attendanceId: '', changeReason: '', documentUrl: '' });
      // Remove submitted record from list
      setAttendanceRecords(prev => prev.filter(r => r._id !== form.attendanceId));
    } catch (err) {
      setResult({ type: 'error', message: err.response?.data?.message || 'Failed to submit request. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = `w-full px-4 py-3 text-sm rounded-xl outline-none transition-all border
    ${isDark
      ? 'bg-slate-900/80 text-white placeholder-slate-500 border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30'
      : 'bg-slate-50 text-slate-800 placeholder-slate-400 border-slate-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/20'}`;

  if (loading) return <div className="h-80 rounded-2xl skeleton" />;

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in-up">
      {/* Header card */}
      <div className={`rounded-2xl p-5 flex items-center gap-4 border transition-all
        ${isDark ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}>
        <div className="p-3 rounded-xl" style={{ background: isDark ? 'rgba(99,102,241,0.15)' : '#e0e7ff' }}>
          <MessageSquare className="w-5 h-5 text-indigo-500" />
        </div>
        <div>
          <h3 className={`font-bold text-sm ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>
            Submit Attendance Request
          </h3>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-indigo-400/70' : 'text-indigo-500'}`}>
            Request a correction for an absence with supporting documentation
          </p>
        </div>
      </div>

      {/* Result banner */}
      {result && (
        <div className={`rounded-xl p-4 flex items-start gap-3 animate-fade-in-up border
          ${result.type === 'success'
            ? isDark ? 'bg-green-900/20 border-green-700/30 text-green-400' : 'bg-green-50 border-green-200 text-green-700'
            : isDark ? 'bg-red-900/20 border-red-700/30 text-red-400' : 'bg-red-50 border-red-200 text-red-700'
          }`}>
          {result.type === 'success'
            ? <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            : <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          }
          <p className="text-sm font-medium">{result.message}</p>
        </div>
      )}

      {/* Form */}
      <div className={`rounded-2xl p-6 border transition-all
        ${isDark ? 'bg-slate-800/70 border-slate-700/50' : 'bg-white border-slate-100 shadow-sm'}`}>
        {attendanceRecords.length === 0 ? (
          <div className="py-12 text-center">
            <CheckCircle className={`w-10 h-10 mx-auto mb-3 ${isDark ? 'text-green-500/50' : 'text-green-300'}`} />
            <p className={`text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              No eligible absences
            </p>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
              You have no absence records eligible for a request (or all have been submitted).
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Absence selector */}
            <div>
              <label className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2
                ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <FileText className="w-3.5 h-3.5" />
                Select Absence Record
              </label>
              <select
                required
                value={form.attendanceId}
                onChange={e => setForm({ ...form, attendanceId: e.target.value })}
                className={inputCls}
              >
                <option value="">— Choose an absence date —</option>
                {attendanceRecords.map(record => (
                  <option key={record._id} value={record._id}>
                    {new Date(record.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })} · {record.subjectId?.name || 'Unknown Subject'}
                  </option>
                ))}
              </select>
            </div>

            {/* Reason */}
            <div>
              <label className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2
                ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <MessageSquare className="w-3.5 h-3.5" />
                Reason for Request
              </label>
              <textarea
                required
                rows={4}
                value={form.changeReason}
                onChange={e => setForm({ ...form, changeReason: e.target.value })}
                placeholder="Describe the reason for your absence (e.g., medical emergency, family event)..."
                className={`${inputCls} resize-none`}
              />
            </div>

            {/* Document URL */}
            <div>
              <label className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2
                ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <LinkIcon className="w-3.5 h-3.5" />
                Supporting Document URL <span className={isDark ? 'text-slate-600' : 'text-slate-300'}>· Optional</span>
              </label>
              <input
                type="url"
                value={form.documentUrl}
                onChange={e => setForm({ ...form, documentUrl: e.target.value })}
                placeholder="https://drive.google.com/... (link to medical slip or letter)"
                className={inputCls}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-shine w-full py-3 text-sm font-bold text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Request
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Request;
