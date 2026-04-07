import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../../api/axios'; 
import Header from '../../components/Header'; 

const ViewAttendance = () => {
  const [data, setData] = useState({ total: 0, present: 0, percentage: 0 });
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await api.get(`/attendance/${user._id}`);
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

  <h2>View Attendance</h2>
  <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} />
</div>
      </div>
    </>
  );
};

export default ViewAttendance;