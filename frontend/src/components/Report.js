import React, { useEffect, useState } from "react";
import axios from "axios";

function Report() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/students")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h2>Attendance Report</h2>

      {data.map((item, index) => (
        <div key={index}>
          {item.name} - {item.present ? "Present" : "Absent"}
        </div>
      ))}
    </div>
  );
}

export default Report;