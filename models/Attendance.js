<<<<<<< HEAD
import React, { useState } from "react";
import axios from "axios";

function AttendanceForm() {
  const [students, setStudents] = useState([
    { id: 1, name: "Rahul", present: false },
    { id: 2, name: "Priya", present: false },
    { id: 3, name: "Arjun", present: false }
  ]);

  const handleChange = (id) => {
    const updated = students.map((s) =>
      s.id === id ? { ...s, present: !s.present } : s
    );
    setStudents(updated);
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/students/attendance",
        { students }
      );

      alert("Attendance stored in DB ✅");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Error storing attendance ❌");
=======
// create mongoose schema for attendance with studentId, date, status
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const attendanceSchema = new Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['present', 'absent'], // As per your request for 'present' or 'absent'
        required: true
>>>>>>> e6b0874d42ba57d0ee79310642bc0ad2025bae5a
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Mark Attendance</h2>

      {students.map((s) => (
        <div key={s.id}>
          <label>
            {s.name}
            <input
              type="checkbox"
              checked={s.present}
              onChange={() => handleChange(s.id)}
            />
          </label>
        </div>
      ))}

      <br />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default AttendanceForm;