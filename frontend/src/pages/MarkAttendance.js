import { useState } from "react";
import API from "../api";
import Navbar from "../components/Navbar";

function MarkAttendance() {
  const [students, setStudents] = useState([
    { id: 1, name: "Student 1", status: "Present" },
    { id: 2, name: "Student 2", status: "Present" }
  ]);

  const handleChange = (id, status) => {
    setStudents(students.map(s =>
      s.id === id ? { ...s, status } : s
    ));
  };

  const handleSubmit = async () => {
    await API.post("/attendance", { students });
    alert("Saved");
  };

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="card">
          <h2>Mark Attendance</h2>

          {students.map((s) => (
            <div key={s.id} className="student-row">
              <span>{s.name}</span>

              <select
                value={s.status}
                onChange={(e) => handleChange(s.id, e.target.value)}
              >
                <option>Present</option>
                <option>Absent</option>
              </select>
            </div>
          ))}

          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </>
  );
}

export default MarkAttendance;