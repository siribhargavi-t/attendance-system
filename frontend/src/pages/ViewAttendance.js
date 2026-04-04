import { useEffect, useState } from "react";
import API from "../api";
import Navbar from "../components/Navbar";

function ViewAttendance() {
  const [data, setData] = useState({ total: 0, present: 0, percentage: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await API.get(`/attendance/${user._id}`);
      setData(res.data);
    };
    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="card">
          <h2>Attendance Report</h2>

          <p>Total Classes: {data.total}</p>
          <p>Present: {data.present}</p>

          <h1 className={data.percentage >= 75 ? "green" : "red"}>
            {data.percentage}%
          </h1>

          <p>
            {data.percentage >= 75
              ? "On Track"
              : "Needs Improvement"}
          </p>
        </div>
      </div>
    </>
  );
}

export default ViewAttendance;