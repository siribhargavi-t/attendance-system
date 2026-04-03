import React, { useEffect, useState } from "react";
import API from "../api";

function Dashboard() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const res = await API.get("/api/students");
      setStudents(res.data);
    };

    fetchStudents();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>

      {students.map((s) => (
        <p key={s._id}>{s.name}</p>
      ))}
    </div>
  );
}

export default Dashboard;