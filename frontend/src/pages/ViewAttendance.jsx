import { useEffect, useState } from "react";
import API from "../api";
import Header from "../components/Header";

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
      <Header />
      <div className="page">
        <div className="card">
  <h3>Attendance Summary</h3>
  <p>Total Classes: {data.total}</p>
  <p>Present: {data.present}</p>

  <h2 style={{color: data.percentage >= 75 ? "green" : "red"}}>
    {data.percentage}%
  </h2>
</div>
      </div>
    </>
  );
}

export default ViewAttendance;