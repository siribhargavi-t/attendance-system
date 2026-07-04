import React, { useState, useEffect } from 'react';
import API from "../../services/api";   // adjust path
import MainLayout from '../../components/Layout/MainLayout';
import { motion } from "framer-motion";
import { FiDownload, FiFileText, FiChevronLeft } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Report = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const isDark = document.documentElement.classList.contains("dark");
  const textColor = isDark ? "#f1f5f9" : "#1e293b";
  const mutedColor = isDark ? "#94a3b8" : "#64748b";
  const cardBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.78)";
  const cardBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";

  useEffect(() => {
    const fetchAttendanceReport = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Please login first');
          setLoading(false);
          return;
        }

        const response = await API.get('/api/attendance/all', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = response.data;

        if (Array.isArray(data)) {
          // Sort by date descending
          setAttendanceData(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
        } else {
          console.error("Invalid API response:", data);
          setError('Invalid data format from server');
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to fetch report');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceReport();
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(99, 102, 241); // Indigo color (#6366f1)
    doc.text("AttendPro - Institutional Attendance Report", 14, 22);
    
    // Subtitle
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 29);
    doc.text(`Total Records: ${attendanceData.length}`, 14, 34);
    
    // Table Columns
    const tableColumn = ["#", "Student Name", "Email Address", "Subject", "Date", "Status"];
    
    // Table Rows
    const tableRows = attendanceData.map((record, index) => [
      index + 1,
      record.studentName || 'N/A',
      record.studentEmail || 'N/A',
      record.subject || 'N/A',
      new Date(record.date).toLocaleDateString(),
      record.status
    ]);
    
    // Add Table
    doc.autoTable({
      startY: 40,
      head: [tableColumn],
      body: tableRows,
      theme: 'striped',
      headStyles: { fillColor: [99, 102, 241] }, // Styled header
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 10 },
        4: { cellWidth: 30 },
        5: { cellWidth: 20 }
      }
    });
    
    // Save file
    doc.save(`AttendPro_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const downloadCSV = () => {
    const headers = ["#", "Student Name", "Email Address", "Subject", "Date", "Status"];
    const csvRows = [
      headers.join(","), // header row
      ...attendanceData.map((record, index) => [
        index + 1,
        `"${(record.studentName || '').replace(/"/g, '""')}"`,
        `"${(record.studentEmail || '').replace(/"/g, '""')}"`,
        `"${(record.subject || '').replace(/"/g, '""')}"`,
        `"${new Date(record.date).toLocaleDateString()}"`,
        `"${record.status}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `AttendPro_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <MainLayout>
      <motion.div
        className="max-w-5xl mx-auto space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:scale-105 transition"
              style={{ color: textColor }}
            >
              <FiChevronLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-black gradient-text flex items-center gap-2">
                <FiFileText className="text-indigo-500" /> Attendance Reports
              </h1>
              <p style={{ color: mutedColor, fontSize: 14 }}>Export and analyze campus-wide attendance stats</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={downloadCSV}
              disabled={attendanceData.length === 0}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold bg-emerald-600 text-white shadow-lg transition hover:bg-emerald-700 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiFileText /> Export CSV
            </button>
            <button
              onClick={downloadPDF}
              disabled={attendanceData.length === 0}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-white shadow-lg transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
              }}
            >
              <FiDownload /> Download PDF
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl text-red-500 bg-red-500/10 border border-red-500/20 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Report List */}
        <div
          className="glass-card overflow-hidden rounded-2xl border"
          style={{ background: cardBg, borderColor: cardBorder }}
        >
          <div className="p-5 border-b flex justify-between items-center" style={{ borderColor: cardBorder }}>
            <h2 className="font-bold text-lg" style={{ color: textColor }}>
              Attendance Records ({attendanceData.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-black/5 dark:bg-white/5 border-b" style={{ borderColor: cardBorder }}>
                  <th className="py-4 px-6 font-bold uppercase tracking-wider text-xs" style={{ color: mutedColor }}>#</th>
                  <th className="py-4 px-6 font-bold uppercase tracking-wider text-xs" style={{ color: mutedColor }}>Student</th>
                  <th className="py-4 px-6 font-bold uppercase tracking-wider text-xs" style={{ color: mutedColor }}>Email</th>
                  <th className="py-4 px-6 font-bold uppercase tracking-wider text-xs" style={{ color: mutedColor }}>Subject</th>
                  <th className="py-4 px-6 font-bold uppercase tracking-wider text-xs" style={{ color: mutedColor }}>Date</th>
                  <th className="py-4 px-6 font-bold uppercase tracking-wider text-xs text-center" style={{ color: mutedColor }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center p-12" style={{ color: mutedColor }}>
                      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                      Loading attendance data...
                    </td>
                  </tr>
                ) : attendanceData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center p-12" style={{ color: mutedColor }}>
                      No records found.
                    </td>
                  </tr>
                ) : (
                  attendanceData.map((record, idx) => (
                    <tr
                      key={record._id}
                      className="border-b hover:bg-indigo-500/5 transition"
                      style={{ borderColor: cardBorder }}
                    >
                      <td className="py-4 px-6" style={{ color: mutedColor }}>{idx + 1}</td>
                      <td className="py-4 px-6 font-semibold" style={{ color: textColor }}>{record.studentName}</td>
                      <td className="py-4 px-6" style={{ color: mutedColor }}>{record.studentEmail}</td>
                      <td className="py-4 px-6 font-medium" style={{ color: textColor }}>{record.subject}</td>
                      <td className="py-4 px-6" style={{ color: mutedColor }}>{new Date(record.date).toLocaleDateString()}</td>
                      <td className="py-4 px-6 text-center">
                        <span 
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            record.status === "Present" 
                              ? "bg-green-500 text-white" 
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Report;