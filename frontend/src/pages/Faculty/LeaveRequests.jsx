import React, { useState, useEffect } from "react";
import axios from "axios";

const statusColors = {
  Approved: "bg-green-500",
  Rejected: "bg-red-500",
  Pending: "bg-yellow-400",
};

const FacultyLeaveRequests = () => {
  const [requests, setRequests] = useState([]);

  // Fetch leave requests from backend
  useEffect(() => {
    axios
      .get("/api/leave")
      .then((res) => setRequests(res.data))
      .catch(() => setRequests([]));
  }, []);

  // Approve/Reject handler
  const handleDecision = async (id, status) => {
    try {
      const res = await axios.put(`/api/leave/${id}`, { status });
      setRequests(prev =>
        prev.map(req =>
          req._id === id ? { ...req, status } : req
        )
      );
      alert(`Leave ${status} and notification sent.`);
    } catch {
      alert("Failed to update leave status.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Leave Requests</h2>
      {requests.length === 0 && <p>No leave requests found.</p>}
      {requests.map((req) => (
        <div key={req._id || req.id} className="mb-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
          <div><b>Student:</b> {req.studentName || "Unknown"}</div>
          <div><b>Email:</b> {req.studentEmail}</div>
          <div><b>Faculty:</b> {req.facultyEmail}</div>
          <div><b>From:</b> {req.fromDate ? new Date(req.fromDate).toLocaleDateString() : "-"}</div>
          <div><b>To:</b> {req.toDate ? new Date(req.toDate).toLocaleDateString() : "-"}</div>
          <div><b>Reason:</b> {req.reason}</div>
          <div className="flex items-center gap-2 mt-2">
            <b>Status:</b>
            <span
              className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
                statusColors[req.status || "Pending"]
              }`}
            >
              {req.status || "Pending"}
            </span>
          </div>
          {(!req.status || req.status === "Pending") && (
            <div className="mt-2 flex gap-2">
              <button
                className="bg-green-600 text-white px-3 py-1 rounded"
                onClick={() => handleDecision(req._id || req.id, "Approved")}
              >
                Approve
              </button>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded"
                onClick={() => handleDecision(req._id || req.id, "Rejected")}
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FacultyLeaveRequests;

