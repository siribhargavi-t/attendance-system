import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useState } from "react";
import markAttendance from "../UseCase/markAttendance";

function MarkAttendance() {
  const [students, setStudents] = useState([
    { id: 1, name: "Student1", status: "Present" },
    { id: 2, name: "Student2", status: "Absent" }
  ]);

  const update = (id, status) => {
    setStudents(students.map(s => s.id === id ? { ...s, status } : s));
  };

  return (
    <div className="container">
      <Sidebar />
      <div className="main">
        <Header />
        <h2>Mark Attendance</h2>

        {students.map(s => (
  <div key={s.id} className="card">
    <h4>{s.name}</h4>
    <select onChange={(e)=>update(s.id, e.target.value)}>
      <option>Present</option>
      <option>Absent</option>
    </select>
  </div>
))}

        <button className="primary" onClick={()=>markAttendance(students)}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default MarkAttendance;