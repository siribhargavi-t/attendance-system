import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const statusColors = {
  Approved: "bg-green-500",
  Rejected: "bg-red-500",
  Pending: "bg-yellow-400",
};

const LeaveList = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const studentEmail = user.email || "";

  useEffect(() => {
    if (!studentEmail) return;
    axios
      .get(`/api/leave/student/${encodeURIComponent(studentEmail)}`)
      .then((res) => setLeaveRequests(res.data))
      .catch(() => setLeaveRequests([]));
  }, [studentEmail]);

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow relative">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Leave Requests
      </h2>
      {/* + Button */}
      <button
        onClick={() => navigate("/student/new-leave")}
        className="absolute top-6 right-6 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl shadow hover:bg-blue-700"
        title="New Leave Request"
      >
        +
      </button>
      {leaveRequests.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No leave requests found.</p>
      ) : (
        <div className="space-y-4">
          {leaveRequests.map((req, idx) => (
            <div
              key={req._id || req.id || idx}
              className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div>
                <div>
                  <span className="font-semibold">From:</span> {
                    req.fromDate ? new Date(req.fromDate).toLocaleDateString() : "-"
                  }
                </div>
                <div>
                  <span className="font-semibold">To:</span> {
                    req.toDate ? new Date(req.toDate).toLocaleDateString() : "-"
                  }
                </div>
                <div>
                  <span className="font-semibold">Reason:</span> {req.reason}
                </div>
              </div>
              <div className="mt-2 md:mt-0 md:ml-4 flex items-center">
                <span
                  className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
                    statusColors[req.status || "Pending"]
                  }`}
                >
                  {req.status || "Pending"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeaveList;