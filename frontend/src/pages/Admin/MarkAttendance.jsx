import React, { useState, useEffect } from 'react';
// FIX: Corrected relative paths to go up two directories
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { getStudentsByBranchAndYear } from '../../services/userService'; 
// FIX: Changed from named to default import
import markAttendanceUseCase from '../../useCases/markAttendance';

function MarkAttendance() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    getStudentsByBranchAndYear().then(students => {
      setStudents(students);
    });
  }, []);

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

        <button className="primary" onClick={()=>markAttendanceUseCase(students)}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default MarkAttendance;