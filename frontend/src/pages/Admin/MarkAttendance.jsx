import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const MarkAttendance = () => {
  const [students, setStudents] = useState([]);

  // 🔥 Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get("/admin/students"); // create this API if not exists
        setStudents(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStudents();
  }, []);

  // 🔥 Mark attendance
  const markAttendance = async (studentId, status) => {
    try {
      await api.post("/attendance", { studentId, status });
      alert("Marked!");
    } catch (err) {
      alert("Error marking attendance");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Mark Attendance</h2>

      {students.map((student) => (
        <div key={student._id} style={styles.row}>
          <span>{student.email}</span>

          <div>
            <button
              style={styles.present}
              onClick={() => markAttendance(student._id, "present")}
            >
              Present
            </button>

            <button
              style={styles.absent}
              onClick={() => markAttendance(student._id, "absent")}
            >
              Absent
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    padding: "10px",
    border: "1px solid #ddd",
  },
  present: {
    background: "green",
    color: "#fff",
    marginRight: "10px",
    padding: "5px 10px",
  },
  absent: {
    background: "red",
    color: "#fff",
    padding: "5px 10px",
  },
};

export default MarkAttendance;