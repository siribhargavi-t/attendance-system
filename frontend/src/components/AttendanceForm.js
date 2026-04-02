import React, { useState } from "react";

function AttendanceForm() {
  const [students, setStudents] = useState([
    { id: 1, name: "Rahul", present: false },
    { id: 2, name: "Priya", present: false },
    { id: 3, name: "Arjun", present: false }
  ]);

  const handleChange = (id) => {
    const updatedStudents = students.map((student) =>
      student.id === id
        ? { ...student, present: !student.present }
        : student
    );
    setStudents(updatedStudents);
  };

  const handleSubmit = () => {
    console.log("Attendance Data:", students);
    alert("Attendance Submitted!");
  };

  return (
    <div>
      <h2>Mark Attendance</h2>

      {students.map((student) => (
        <div key={student.id}>
          <label>
            {student.name}
            <input
              type="checkbox"
              checked={student.present}
              onChange={() => handleChange(student.id)}
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