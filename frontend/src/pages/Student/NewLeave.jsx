import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const facultyList = [
  { name: "Dr. Rao", email: "faculty1@example.com" },
  { name: "Dr. Smith", email: "faculty2@example.com" },
  { name: "Dr. Johnson", email: "faculty3@example.com" },
  { name: "Dr. Brown", email: "faculty4@example.com" },
];

const NewLeave = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const studentName = user.name || "";
  const studentEmail = user.email || "";
  const [faculty, setFaculty] = useState(facultyList[0]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [fileBase64, setFileBase64] = useState(null);

  // Convert file to base64
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      setFileBase64(null);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFileBase64(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Date validation
    if (new Date(fromDate) > new Date(toDate)) {
      alert("From Date cannot be after To Date");
      return;
    }
    if (!faculty || !faculty.email || !faculty.name) {
      alert("Please select a faculty.");
      return;
    }
    if (!fromDate || !toDate || !reason) {
      alert("Please fill all required fields.");
      return;
    }
    try {
      await axios.post("/api/leave", {
        studentName,
        studentEmail,
        facultyName: faculty.name,   // <-- Make sure this is present!
        facultyEmail: faculty.email, // <-- And this!
        fromDate,
        toDate,
        reason,
        document: fileBase64,
      });
      console.log({
        studentName,
        studentEmail,
        facultyName: faculty.name,
        facultyEmail: faculty.email,
        fromDate,
        toDate,
        reason,
        document: fileBase64,
      });
      alert("Leave request submitted successfully!");
      navigate("/student/leave-list");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to submit leave request. Please check your input and try again."
      );
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">New Leave Request</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-500">Faculty</label>
          <select
            value={faculty.email}
            onChange={e => {
              const selected = facultyList.find(f => f.email === e.target.value);
              setFaculty(selected);
            }}
            className="w-full border p-2 rounded"
            required
          >
            {facultyList.map((f, idx) => (
              <option key={idx} value={f.email}>{f.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-500">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="text-sm text-gray-500">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="text-sm text-gray-500">Reason</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border p-2 rounded"
            rows={3}
            required
          />
        </div>
        <div>
          <label className="text-sm text-gray-500">Supporting Document (optional)</label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default NewLeave;